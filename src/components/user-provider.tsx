import type { User } from "@supabase/supabase-js";
import { user as userAtom } from "../stores/user";

export const UserProvider = ({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) => {
  if (user != null) {
    userAtom.set(user);
  }
  return children;
};
