import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { PageTabs } from './Tabs';
import { Metadata } from 'next';
import { RecipeProvider } from '@/hooks/useRecipe';
import { cookies } from 'next/headers';
import { RecipeListProvider } from '@/hooks/useRecipeList';
import { TabKey } from '../types';

export const metadata: Metadata = {
  title: 'Recipe Box',
};

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }
  const cookieStore = await cookies();
  const activeRecipe = cookieStore.get('activeRecipe')?.value || null;
  const activeTab = (cookieStore.get('activeTab')?.value ||
    'recipes') as TabKey;

  return (
    <div className="flex w-full flex-col">
      <RecipeListProvider>
        <RecipeProvider value={{ id: activeRecipe }}>
          <PageTabs activeTab={activeTab} />
        </RecipeProvider>
      </RecipeListProvider>
    </div>
  );
}
