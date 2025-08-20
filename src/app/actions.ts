"use server";

import { z } from "zod";

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

  // Simulate sending an email
  console.log("Submitting contact form:", parsedData.data);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, you would integrate with an email service like Resend or SendGrid here.
  // For this demo, we'll just return a success message.
  
  return { success: true };
}