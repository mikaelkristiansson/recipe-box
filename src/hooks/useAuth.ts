import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const getUserData = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  return {
    data,
    error,
  };
};

export const useAuth = () => {
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    getUserData().then((res) => setUser(res.data.user));
  }, []);

  return user;
};
