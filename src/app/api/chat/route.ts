import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
import about from "@/content/about";
import experience from "@/content/experience";
import projects from "@/content/projects";
import skills from "@/content/skills";

// Helper to get a project from the Knowledge Layer
const getProject = (identifier?: string) => {
  if (!identifier) return undefined;
  const idStr = identifier.toLowerCase();
  return projects.find((p) => 
    p.id === identifier || 
    p.id.replace('project-', '') === idStr ||
    p.title.toLowerCase().includes(idStr) ||
    idStr.includes(p.title.toLowerCase())
  );
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Messages array is required", { status: 400 });
    }

    // ── Build rich system prompt ────────────────────────────────────
    const systemPrompt = `
You are the developer of this portfolio. You speak directly to visitors out loud — keep answers natural, conversational, first person (I, me, my). No markdown. Just clean spoken sentences.

PERSONA RULES:
- Smooth, calming, soothing tone. Gentle cadence.
- Maximum 2-3 sentences per answer. Be direct but soft.
- Never say "As an AI". You are the developer.
- If someone says hello, greet them warmly.
- If you don't have specific info, say so naturally.

TOOLS & EXPLAINING:
You have UI tools to display visual info. 
CRITICAL RULE: DO NOT use tools for general conversation, greetings, or answering questions about your skills/background. Just answer those naturally!
ONLY use tools if the user EXPLICITLY asks to see the architecture, decisions, or evidence for a SPECIFIC project.
If they ask to see a project but don't name it, DO NOT use a tool. Just say: "Which project would you like to see?"


ABOUT ME:
Tagline: "${about.tagline}"
Bio: ${about.bio.join(" ")}
Based in: ${about.location}

EXPERIENCE:
${experience.map((exp) => `• ${exp.role} at ${exp.org} (${exp.start}–${exp.end}): ${exp.summary}`).join("\n")}

PROJECTS (match these IDs even if the user mispronounces the name):
- "project-adaptiq" → AdaptIQ, Adapt IQ, adaptive IQ, adapt-iq
- "project-smartomnisentinel" → SmartOmniSentinel, Smart Omni Sentinel, smart sentinel, omni sentinel, smart home central, smart omni
- "project-khabar24times" → Khabar24Times, Khabar 24, khabar times, khabbar news
- "project-ps26034" → PS-26034, PS 26034, project sentinel, p s 26034
${projects.map((p) => `• ID: "${p.id}", Title: "${p.title}": ${p.summary}`).join("\n")}

SKILLS:
${skills.map((s) => `${s.category}: ${s.items.map((i) => i.name).join(", ")}`).join(" | ")}
    `.trim();

  const callModel = async (model: any) => {
      return await generateText({
        model,
        system: systemPrompt,
        messages,
        temperature: 0.5,
        maxRetries: 0,
        // @ts-ignore
        maxSteps: 2,
        providerOptions: {
          google: { thinkingConfig: { thinkingBudget: 0, includeThoughts: false } },
        },
        tools: {
          show_project_architecture: tool({
            description: "ONLY use this to display the architecture UI window for a SPECIFIC project. DO NOT use for general questions.",
            parameters: z.object({
              projectId: z.string().describe("The exact project ID (e.g., 'project-adaptiq', 'project-smartomnisentinel', 'project-khabar24times', 'project-ps26034')"),
            }),
            // @ts-ignore
            execute: async ({ projectId }: { projectId: string }) => {
              if (!projectId) return { error: "I'm not exactly sure which project you mean. I can show you AdaptIQ, SmartOmniSentinel, Khabar24Times, or PS-26034. Which one would you like to explore?" };
              const p = getProject(projectId);
              if (!p || !p.architecture) return { error: `I don't seem to have the architecture pipeline for that specific project.` };
              const stepSummaries = p.architecture.map((a, i) =>
                `Step ${i + 1} — ${a.name}: ${a.role} (takes ${a.input}, produces ${a.output})`
              ).join(". ");
              return { 
                projectId: p.id,
                model_context: `Here is the architecture for ${p.title}. ${p.problem} The approach: ${p.approach} It has ${p.architecture.length} pipeline steps: ${stepSummaries}. Final result: ${p.result}\n\nCRITICAL INSTRUCTION: You MUST now generate 2-3 natural spoken sentences explaining this high-level architecture out loud to the user based on the context above. Do not just say you brought it up on screen.`
              };
            }
          }),
          show_technical_decision: tool({
            description: "ONLY use this to display a UI window about a SPECIFIC technical decision. DO NOT use this to answer general questions about what tech you know or your skills.",
            parameters: z.object({
              projectId: z.string().describe("The exact project ID (e.g., 'project-adaptiq', 'project-smartomnisentinel', 'project-khabar24times', 'project-ps26034')"),
              technology: z.string().describe("Technology being asked about (e.g., 'Qdrant', 'Next.js')"),
            }),
            // @ts-ignore
            execute: async ({ projectId, technology }: { projectId: string; technology: string }) => {
              if (!projectId || !technology) return { error: "I'm not sure which project and technology you're referring to. Could you clarify?" };
              const p = getProject(projectId);
              if (!p || !p.decisions) return { error: `I don't have technical decisions logged for that project.` };
              const decision = p.decisions.find(d =>
                d.topic.toLowerCase().includes(technology.toLowerCase()) ||
                technology.toLowerCase().includes(d.topic.toLowerCase())
              );
              if (!decision) return { error: `No decision found for ${technology} in project ${projectId}.` };
              return { 
                projectId: p.id, 
                technology: decision.topic,
                model_context: `The decision for ${decision.topic} is: ${decision.decision}. Reason: ${decision.reason[0]}\n\nCRITICAL INSTRUCTION: You MUST now explain this technical decision out loud to the user in 1-2 natural sentences. Do not just say you brought it up on screen.`
              };
            }
          }),
          show_evidence: tool({
            description: "ONLY use this to display source code evidence for a SPECIFIC project. DO NOT use for general questions.",
            parameters: z.object({
              projectId: z.string().describe("The exact project ID (e.g., 'project-adaptiq', 'project-smartomnisentinel', 'project-khabar24times', 'project-ps26034')"),
            }),
            // @ts-ignore
            execute: async ({ projectId }: { projectId: string }) => {
              if (!projectId) return { error: "Could you clarify which project you want to see evidence for? I have AdaptIQ, SmartOmniSentinel, Khabar24Times, or PS-26034." };
              const p = getProject(projectId);
              if (!p || !p.evidence) return { error: `I couldn't find the source code files for that project.` };
              return { 
                projectId: p.id,
                model_context: `I have displayed the source code evidence files for ${p.title} on the screen.\n\nCRITICAL INSTRUCTION: You MUST now speak out loud to tell the user that you are showing the verified source code evidence files for ${p.title} on their screen.`
              };
            }
          })
        }
      });
    };

    let result;
    console.log("[AI Route] Calling primary model: gemini-3.6-flash");
    result = await callModel(google("gemini-3.6-flash"));

    // Collect tool results from all steps
    const toolResults: Array<{ toolName: string; result: any }> = [];
    let toolErrorText = "";

    if (result.steps) {
      console.log("[AI Route] Raw steps:", JSON.stringify(result.steps.map(s => ({ text: s.text, toolCalls: s.toolCalls, toolResults: s.toolResults })), null, 2));
      for (const step of result.steps) {
        if (step.toolResults) {
           for (const tr of step.toolResults as any[]) {
            const output = tr.result ?? tr.output;
            if (output) {
              if (output.error) {
                toolErrorText = output.error;
              } else {
                toolResults.push({ toolName: tr.toolName, result: output });
              }
            }
          }
        }
      }
    }

    let finalText = result.text.trim();
    if (!finalText) {
      if (toolErrorText) {
        finalText = toolErrorText;
      } else if (toolResults.length > 0) {
        finalText = "I've brought that information up on the screen for you.";
      }
    }

    return Response.json({
      text: finalText,
      toolResults,
    });

  } catch (error: any) {
    console.error("[AI Route] Error type:", error?.constructor?.name);
    console.error("[AI Route] Error message:", error?.message);

    // Detect quota / rate-limit errors and give a friendly, specific message
    const msg: string = error?.message ?? String(error);
    const isQuota = msg.includes("quota") || msg.includes("rate") || msg.includes("429") || (error?.statusCode === 429);
    const retryMatch = msg.match(/retry in ([\d.]+)s/);
    const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;

    const spokenError = isQuota
      ? retrySeconds
        ? `I'm being rate limited right now. Please try again in about ${retrySeconds} seconds.`
        : "I've hit my rate limit. Please wait a moment and try again."
      : "I'm sorry, my systems are currently offline.";

    return Response.json(
      { text: spokenError, toolResults: [], error: msg },
      { status: 200 }
    );
  }
}
