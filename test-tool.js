require('dotenv').config({ path: '.env.local' });
const { generateText } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { z } = require('zod');

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

async function main() {
  try {
    const result = await generateText({
      model: google('gemini-3.8-flash'),
      prompt: 'Show me the architecture for AdaptIQ',
      maxSteps: 3,
      tools: {
        show_project_architecture: {
          description: "Display the architecture pipeline of a specific project on the screen.",
          parameters: z.object({
            project: z.enum(["project-adaptiq", "project-smartomnisentinel", "project-khabar24times", "project-ps26034"]),
          }),
          execute: async ({ project }) => {
            console.log('TOOL CALLED WITH PROJECT:', project);
            return { project: project, data: ['step 1', 'step 2'] };
          }
        }
      }
    });
    console.log('SUCCESS TEXT:', result.text);
    console.log('TOOL RESULTS:', JSON.stringify(result.steps?.map(s => s.toolResults), null, 2));
  } catch (err) {
    console.log('SDK ERROR TYPE:', err.constructor.name);
    console.log('SDK ERROR MSG:', err.message);
  }
}
main();
