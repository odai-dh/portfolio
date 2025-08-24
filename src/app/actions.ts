"use server";

import { z } from "zod";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function submitContactFormAction(data: unknown) {
  const parsedData = contactFormSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, errors: parsedData.error.flatten().fieldErrors };
  }

  try {
    const { name, email, message } = parsedData.data;

    // Send the email using Resend
    const { data: emailData, error } = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: 'odai.dahi@hyperisland.se',
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