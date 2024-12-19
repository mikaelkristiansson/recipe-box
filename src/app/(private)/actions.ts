'use server';
import { ScrapeRecipe } from '@/utils/recipe/scraper';
import { createClient } from '@/utils/supabase/server';
import { getScrapedRecipe } from '@/utils/recipe/scraper';
import { Recipe, RecipeList, TabKey } from '../types';
import { cache } from 'react';
import { cookies } from 'next/headers';

function fetchImage(url: string) {
  return fetch(url).then((res) => res.blob());
}

type RecipeData = {
  image: string | string[] | File;
} & Omit<ScrapeRecipe, 'id' | 'image'>;

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

export async function saveRecipe(recipe: RecipeData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not found');
  }
  const postData = {
    name: recipe.name,
    description: recipe.description,
    image:
      typeof recipe.image === 'object' && !(recipe.image instanceof File)
        ? recipe.image[0]
        : recipe.image,
    prep_time: recipe.prepTime,
    cook_time: recipe.cookTime,
    total_time: recipe.totalTime,
    yield: recipe.recipeYield,
    category: recipe.recipeCategory,
    cuisine: recipe.recipeCuisine,
    keywords: recipe.keywords,
    instructions: recipe.recipeInstructions,
    ingredients: recipe.recipeIngredient,
    nutrition: recipe.nutrition,
    created_at: recipe.datePublished,
    updated_at: recipe.dateModified,
    user_id: user?.id,
  };
  const { data, error } = await supabase
    .from('recipes')
    .insert(postData)
    .select()
    .single();

  const file =
    postData.image instanceof File
      ? postData.image
      : await fetchImage(postData.image);

  const { error: imageError } = await supabase.storage
    .from('recipe_images')
    .upload(data.id, file);

  if (error || imageError) {
    console.error(error);
    return { status: 'error' };
  }

  return { status: 'success', data: data as RecipeList };
}

export const getRecipes = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not found');
  }

  const { data, error } = await supabase
    .from('recipes')
    .select('name, image, category, id')
    .eq('user_id', user.id);

  if (error) {
    console.error(error);
    return Promise.reject({ status: 'error' });
  }
  const recipes = data as RecipeList[];
  const images = await Promise.all(
    recipes.map((recipe) =>
      supabase.storage.from('recipe_images').getPublicUrl(recipe.id)
    )
  );
  const updatedRecipes = recipes.map((recipe, index) => {
    if (images[index].data) {
      recipe.image = images[index].data.publicUrl;
    }
    return recipe;
  });

  return updatedRecipes;
});

export async function getRecipe(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id);

  if (error) {
    console.error(error);
  }
  if (!data) {
    throw new Error('Recipe not found');
  }

  const recipe = data[0] as Recipe;
  const { data: image } = supabase.storage
    .from('recipe_images')
    .getPublicUrl(recipe.id);
  recipe.image = image.publicUrl;

  const cookieStore = await cookies();
  cookieStore.set('activeRecipe', recipe.id);

  return recipe;
}

export async function closeRecipe() {
  const cookieStore = await cookies();
  cookieStore.delete('activeRecipe');
}

export async function updateActiveTab(tab: TabKey) {
  const cookieStore = await cookies();
  cookieStore.set('activeTab', tab);
}

export async function deleteRecipe(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('recipes').delete().eq('id', id);

  if (error) {
    console.error(error);
    return { status: 'error' };
  }
  return { status: 'success' };
}
