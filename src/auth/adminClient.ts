import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/supabase";

export const adminClient = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SECRET
);
