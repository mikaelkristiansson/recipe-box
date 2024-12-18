'use client';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type RecipeInfo = {
  id: string | null;
};

type RecipeAction = {
  type: 'update';
  data: RecipeInfo;
};

const defaultValues = {
  recipe: { id: null },
  action: () => {},
};

const RecipeContext = createContext<{
  recipe: RecipeInfo;
  action: Dispatch<RecipeAction>;
}>(defaultValues);

function recipeReducer(recipe: RecipeInfo, action: RecipeAction) {
  switch (action.type) {
    case 'update': {
      return {
        ...action.data,
      };
    }
    default: {
      return recipe;
    }
  }
}

export const useRecipe = () => useContext(RecipeContext);

export const RecipeProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: RecipeInfo;
}) => {
  const [recipe, action] = useReducer(recipeReducer, value);

  return (
    <RecipeContext.Provider value={{ recipe, action }}>
      {children}
    </RecipeContext.Provider>
  );
};
