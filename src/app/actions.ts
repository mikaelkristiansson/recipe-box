'use server';

import { getScrapedRecipe } from '@/utils/recipe/scraper';

export async function loadRecipe(prevState: any, formData: FormData) {
  const url = formData.get('url') as string;
  const recipe = await getScrapedRecipe(url);
  return recipe;
}
