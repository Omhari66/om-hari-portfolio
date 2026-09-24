// /api/speak — Proxies text to Deepgram Aura TTS and streams back audio.
// API key stays server-side. Returns raw MP3 audio.

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text?.trim()) {
      return new Response("Text is required", { status: 400 });
    }

    const apiKey = process.env.DEEPGRAM_API_KEY;
    // Deepgram Aura Voices: aura-asteria-en (female, soothing), aura-orion-en (male, soothing)
    const voiceModel = process.env.DEEPGRAM_VOICE_MODEL ?? "aura-asteria-en"; 

    if (!apiKey) {
      return new Response("Deepgram API key not configured", { status: 503 });
    }

    const response = await fetch(
      `https://api.deepgram.com/v1/speak?model=${voiceModel}`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Deepgram error:", err);
      return new Response("TTS generation failed", { status: 502 });
    }

    // Stream the audio back to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Speak route error:", error);
    return new Response("Internal error", { status: 500 });
  }
}
