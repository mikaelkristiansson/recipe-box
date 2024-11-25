import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { PageTabs } from "./Tabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipe Box",
};

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="flex w-full flex-col">
      <PageTabs />
    </div>
  );
}
