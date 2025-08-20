'use server';

/**
 * @fileOverview AI-powered project description enhancer.
 *
 * - enhanceProjectDescription - A function that enhances project descriptions using AI.
 * - EnhanceProjectDescriptionInput - The input type for the enhanceProjectDescription function.
 * - EnhanceProjectDescriptionOutput - The return type for the enhanceProjectDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceProjectDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the project.'),
  description: z.string().describe('The current description of the project.'),
  tags: z.array(z.string()).describe('Keywords or tags associated with the project.'),
});
export type EnhanceProjectDescriptionInput = z.infer<typeof EnhanceProjectDescriptionInputSchema>;

const EnhanceProjectDescriptionOutputSchema = z.object({
  enhancedDescription: z.string().describe('The enhanced project description.'),
});
export type EnhanceProjectDescriptionOutput = z.infer<typeof EnhanceProjectDescriptionOutputSchema>;

export async function enhanceProjectDescription(input: EnhanceProjectDescriptionInput): Promise<EnhanceProjectDescriptionOutput> {
  return enhanceProjectDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceProjectDescriptionPrompt',
  input: {schema: EnhanceProjectDescriptionInputSchema},
  output: {schema: EnhanceProjectDescriptionOutputSchema},
  prompt: `You are an AI assistant helping to improve project descriptions for a portfolio.

  Given the project title, current description, and tags, suggest an enhanced description that is more engaging and impactful.

  Project Title: {{{title}}}
Current Description: {{{description}}}
Tags: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Enhanced Description:`, //Crucially, you MUST NOT attempt to directly call functions, use await keywords, or perform any complex logic _within_ the Handlebars template string.
});

const enhanceProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'enhanceProjectDescriptionFlow',
    inputSchema: EnhanceProjectDescriptionInputSchema,
    outputSchema: EnhanceProjectDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
