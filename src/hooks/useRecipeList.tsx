'use client';
import { RecipeList } from '@/app/types';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type SetAction = {
  type: 'set';
  data: RecipeList[];
};

type UpdateAction = {
  type: 'update';
  data: RecipeList;
};

type RecipeAction = SetAction | UpdateAction;

const defaultValues = {
  recipes: null,
  action: () => {},
};

const RecipeListContext = createContext<{
  recipes: RecipeList[] | null;
  action: Dispatch<RecipeAction>;
}>(defaultValues);

function recipeListReducer(
  recipes: RecipeList[],
  action: RecipeAction
): RecipeList[] {
  switch (action.type) {
    case 'update': {
      return [...recipes, action.data];
    }
    case 'set': {
      return action.data;
    }
    default: {
      return recipes;
    }
  }
}

export const useRecipeList = () => useContext(RecipeListContext);

export const RecipeListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [recipes, action] = useReducer(recipeListReducer, []);

  return (
    <RecipeListContext.Provider value={{ recipes, action }}>
      {children}
    </RecipeListContext.Provider>
  );
};
