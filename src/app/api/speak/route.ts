// /api/speak — Proxies text to ElevenLabs TTS and streams back audio.
// API key stays server-side. Returns raw MP3 audio.

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text?.trim()) {
      return new Response("Text is required", { status: 400 });
    }

    const apiKey  = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID ?? "pNInz6obpgDQGcFmaJgB";

    if (!apiKey || apiKey === "your_elevenlabs_api_key_here") {
      return new Response("ElevenLabs API key not configured", { status: 503 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: "eleven_turbo_v2",   // fastest + cheapest model
          voice_settings: {
            stability: 0.5,             // 0=expressive, 1=stable
            similarity_boost: 0.75,     // how close to original voice
            style: 0.0,                 // keep 0 for speed
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("ElevenLabs error:", err);
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
