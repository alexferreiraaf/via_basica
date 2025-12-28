'use server';

/**
 * @fileOverview Generates a product image based on the product title using generative AI.
 *
 * - generateProductImage - A function that generates a product image.
 * - GenerateProductImageInput - The input type for the generateProductImage function.
 * - GenerateProductImageOutput - The return type for the generateProductImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductImageInputSchema = z.object({
  productTitle: z.string().describe('The title of the product.'),
});
export type GenerateProductImageInput = z.infer<
  typeof GenerateProductImageInputSchema
>;

const GenerateProductImageOutputSchema = z.object({
  imageUrl: z.string().describe('The generated image URL.'),
});
export type GenerateProductImageOutput = z.infer<
  typeof GenerateProductImageOutputSchema
>;

export async function generateProductImage(
  input: GenerateProductImageInput
): Promise<GenerateProductImageOutput> {
  return generateProductImageFlow(input);
}

const generateProductImagePrompt = ai.definePrompt({
  name: 'generateProductImagePrompt',
  input: {schema: GenerateProductImageInputSchema},
  output: {schema: GenerateProductImageOutputSchema},
  prompt: `Generate a product image based on the following product title: {{{productTitle}}}. The image should be visually appealing and relevant to the product title. Return the image as a data URI.`,
});

const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate an image of a product with the title: ${input.productTitle}`,
    });

    return {imageUrl: media.url!};
  }
);
