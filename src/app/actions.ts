'use server';

import { getScrapedRecipe } from '@/utils/recipe/scraper';

export async function loadRecipe(_prevState: unknown, formData: FormData) {
  const url = formData.get('url') as string;
  if (!isValidUrl(url)) {
    return { message: 'Invalid URL' };
  }
  const recipe = await getScrapedRecipe(url);
  return recipe;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_err) {
    return false;
  }
}
