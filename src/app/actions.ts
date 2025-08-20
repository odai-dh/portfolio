"use server";

import { z } from "zod";
import { enhanceProjectDescription } from "@/ai/flows/enhance-project-description";
import type { EnhanceProjectDescriptionInput } from "@/ai/flows/enhance-project-description";

const enhanceDescriptionSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
});

export async function enhanceDescriptionAction(input: EnhanceProjectDescriptionInput) {
  const parsedInput = enhanceDescriptionSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, error: "Invalid input." };
  }

  try {
    const result = await enhanceProjectDescription(parsedInput.data);
    return { success: true, enhancedDescription: result.enhancedDescription };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to enhance description." };
  }
}

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
