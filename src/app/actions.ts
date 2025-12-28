'use server';

import { z } from 'zod';
import { generateProductImage } from '@/ai/flows/generate-product-image';
import { placeholderImages } from '@/lib/placeholder-images';

const ProductSchema = z.object({
  id: z.coerce.number(),
  title: z.string().min(1, "Title is required"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  description: z.string(),
  image: z.string().optional(),
});

export type FormState = {
  message: string;
  product?: z.infer<typeof ProductSchema>;
  success: boolean;
};

export async function saveProductAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ProductSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Missing Fields. Failed to Create Product.",
    };
  }

  const { id, title, price, category, description } = validatedFields.data;
  let image = validatedFields.data.image;

  try {
    if (!image) {
      console.log(`Generating image for: ${title}`);
      const result = await generateProductImage({ productTitle: title });
      image = result.imageUrl;
      console.log(`Image generated: ${image}`);
    } else if (image.trim() === '') {
      image = placeholderImages['generic-product'].imageUrl;
    }
  } catch (error) {
    console.error("AI image generation failed:", error);
    image = placeholderImages['generic-product'].imageUrl; // Fallback image
  }
  
  const product = {
    id: id || Date.now(),
    title,
    price,
    category,
    description,
    image,
  };

  return {
    success: true,
    message: `Product "${title}" saved successfully.`,
    product: product,
  };
}
