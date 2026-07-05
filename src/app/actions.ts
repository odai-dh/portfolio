"use server";

import { z } from "zod";
import { Resend } from 'resend';
import { headers } from 'next/headers';
import { getClientIp, incrementDailyCount } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

const RATE_LIMIT_PER_DAY = 5; // submissions per IP
const GLOBAL_LIMIT_PER_DAY = 100; // all visitors combined — circuit breaker for the Resend quota

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
  website: z.string().optional(), // honeypot — humans never see or fill this field
});

export async function submitContactFormAction(data: unknown) {
  const parsedData = contactFormSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, errors: parsedData.error.flatten().fieldErrors };
  }

  // Honeypot filled → almost certainly a bot; pretend success so it doesn't adapt
  if (parsedData.data.website) {
    return { success: true };
  }

  const limitError = {
    success: false as const,
    errors: { _form: ['Too many messages today. Please email me directly at odai@odaidh.dev.'] },
  };
  const ip = getClientIp(await headers());
  if ((await incrementDailyCount('contact', ip)) > RATE_LIMIT_PER_DAY) {
    return limitError;
  }
  if ((await incrementDailyCount('contact-global', 'all')) > GLOBAL_LIMIT_PER_DAY) {
    return limitError;
  }

  try {
    const { name, email, message } = parsedData.data;

    // Send the email using Resend
    const { data: emailData, error } = await resend.emails.send({
      from: 'Portfolio Contact <contact@odaidh.dev>',
      to: 'odai@odaidh.dev',
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        errors: { _form: ['Failed to send message. Please try again later.'] }
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in submitContactFormAction:', error);
    return {
      success: false,
      errors: { _form: ['An unexpected error occurred. Please try again later.'] }
    };
  }
}