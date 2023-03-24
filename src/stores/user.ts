import { useStore } from "@nanostores/react";
import type { User } from "@supabase/supabase-js";
import { atom } from "nanostores";
import { useEffect } from "react";
import { supabase } from "../auth/client";
export const user = atom<User | undefined>();

export const useUserStore = () => {
  useEffect(() => {
    supabase.auth.getSession().then(
      ({ data }) => {
        console.log("data", data);
        if (data?.session != null) {
          document.cookie = `sbat=${data.session.access_token}; Path=/;`;
          user.set(data.session.user);
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  }, []);
  const userInfo = useStore(user);
  return [userInfo, user.set] as const;
};
