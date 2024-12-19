import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { PageTabs } from './Tabs';
import { Metadata } from 'next';
import { RecipeProvider } from '@/hooks/useRecipe';
import { cookies } from 'next/headers';

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

  return (
    <div className="flex w-full flex-col">
      <RecipeProvider value={{ id: activeRecipe }}>
        <PageTabs />
      </RecipeProvider>
    </div>
  );
}
