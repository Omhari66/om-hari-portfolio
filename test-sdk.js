require('dotenv').config({ path: '.env.local' });
const { generateText } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

async function main() {
  try {
    const result = await generateText({
      model: google('gemini-2.0-flash'),
      prompt: 'say hi',
    });
    console.log('SUCCESS:', result.text);
  } catch (err) {
    console.log('SDK ERROR TYPE:', err.constructor.name);
    console.log('SDK ERROR MSG:', err.message);
    if (err.statusCode) console.log('STATUS:', err.statusCode);
    if (err.responseBody) console.log('RESPONSE:', err.responseBody);
    
    // Let's also try to list models
    console.log('\n--- Trying to fetch models via REST ---');
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GOOGLE_GENERATIVE_AI_API_KEY);
      const data = await res.json();
      if (data.error) {
        console.log('REST API ERROR:', data.error.message);
      } else if (data.models) {
        console.log('AVAILABLE MODELS:');
        data.models.filter(m => m.supportedGenerationMethods?.includes('generateContent')).forEach(m => console.log(' - ' + m.name.replace('models/', '')));
      }
    } catch (e) {
      console.log('FETCH ERROR:', e.message);
    }
  }
}
main();
