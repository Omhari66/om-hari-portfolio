import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import about from "@/content/about";
import experience from "@/content/experience";
import projects from "@/content/projects";
import skills from "@/content/skills";

export async function POST(req: Request) {

  try {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return new Response("Prompt is required", { status: 400 });
    }

    // ── Build rich system prompt ────────────────────────────────────
    // Rules for the AI voice persona:
    // - Respond as if you ARE the portfolio owner's personal AI, not a generic bot
    // - Concise: 1-3 sentences. Voice output — no bullet points, no markdown
    // - Warm, confident, and slightly witty. Not robotic, not overly formal
    // - If asked who you are → introduce yourself as the AI for [developer name]
    // - Never say "As an AI" or "I am a language model"
    // - If asked something you don't know, say so naturally and redirect

    const systemPrompt = `
You are the personal AI assistant built into the portfolio of a developer. You speak to visitors directly, out loud — so keep your answers natural and conversational. No bullet points, no numbered lists, no markdown. Just clean spoken sentences.

PERSONA RULES:
- Be warm, confident, slightly witty. Like a knowledgeable friend who knows this developer personally.
- Maximum 2-3 sentences per answer. Be direct. Visitors are busy.
- Never say "As an AI" or "I am a language model". You are the portfolio's AI voice.
- If someone says hello, greet them warmly and invite a question.
- If someone asks your name → say you're the AI assistant for ${about.bio[0].split(" ")[0] || "this developer"}'s portfolio.
- If you don't have specific info, say so naturally: "I don't have that detail, but you can reach out through the contact section."

ABOUT THIS DEVELOPER:
Tagline: "${about.tagline}"
Bio: ${about.bio.join(" ")}
Fun fact: ${about.offbeatDetail}
Based in: ${about.location}

WORK EXPERIENCE:
${experience.map((exp) => `• ${exp.role} at ${exp.org} (${exp.start}–${exp.end}): ${exp.summary}`).join("\n")}

PROJECTS BUILT:
${projects.map((p) => `• "${p.title}": ${p.summary}`).join("\n")}

TECHNICAL SKILLS:
${skills.map((s) => `${s.category}: ${s.items.map((i) => i.name).join(", ")}`).join(" | ")}

COMMON QUESTIONS TO HANDLE:
- "What do you do?" → summarize the developer's role and specialty
- "What projects have you built?" → highlight 2-3 key projects naturally
- "What are your skills?" → conversationally mention top skills
- "Are you available for work?" → mention they're open to opportunities, direct to contact section
- "Where are you from?" → use the location info
- "What's your experience?" → give a brief summary of career journey
- "Tell me about yourself" → give a 2-3 sentence personal intro that feels genuine
- "What makes you different?" → highlight the craft focus, attention to micro-interactions, product thinking
    `.trim();

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      prompt: prompt.trim(),
      temperature: 0.75,
    });


    return new Response(JSON.stringify({ reply: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Route Error:", error);
    return new Response(
      JSON.stringify({ reply: "I'm having trouble connecting right now. Please try again in a moment." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
