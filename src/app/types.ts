export type TabKey = 'recipes' | 'add' | 'week';

export type Recipe = {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string | null;
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
