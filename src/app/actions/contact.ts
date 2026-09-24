"use server";

import { Resend } from "resend";

// Ensure the API key exists. We provide a dummy fallback so the app doesn't crash on startup if the key isn't set yet.
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function sendContactEmail(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
      return { error: "Please fill out all fields." };
    }

    if (!process.env.RESEND_API_KEY) {
      return { error: "Missing Resend API Key in environment variables." };
    }

    // By default, Resend limits sending emails to only your verified email
    // address via "onboarding@resend.dev" until you verify a custom domain.
    const toEmail = process.env.CONTACT_EMAIL;
    
    if (!toEmail) {
      return { error: "Missing CONTACT_EMAIL in environment variables." };
    }

    const { error: resendError } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: toEmail,
      subject: `New opportunity/message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    });

    if (resendError) {
      console.error("Resend Error:", resendError);
      return { error: resendError.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { error: error.message || "Failed to send email." };
  }
}
