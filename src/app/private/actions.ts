'use server';

import { ScrapeRecipe } from '@/utils/recipe/scraper';
import { createClient } from '@/utils/supabase/server';

export type Recipe = {
  id: string;
  name: string;
  description: string;
  image: string;
  prep_time: string;
  cook_time: string;
  total_time: string;
  yield: string;
  category: string;
  cuisine: string;
  keywords: string;
  instructions: Array<{
    '@type': string;
    name: string;
    text: string;
    url: string;
    image: string;
  }>;
  ingredients: string[];
  nutrition: {
    servingSize: string;
    calories: string;
    fatContent: string;
    carbohydrateContent: string;
    proteinContent: string;
  };
  created_at: string;
  updated_at: string;
  user_id: string;
};

export type RecipeList = {
  name: string;
  image: string;
  category: string;
  id: string;
};

function fetchImage(url: string) {
  return fetch(url).then((res) => res.blob());
}

type RecipeData = {
  image: string | string[] | File;
} & Omit<ScrapeRecipe, 'id' | 'image'>;

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

  return { status: 'success', id: data.id as string };
}

export async function getRecipes() {
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
}

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

  return recipe;
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
