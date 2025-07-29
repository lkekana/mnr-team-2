import { SignUpForm } from "@/components/sign-up-form";
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Page() {

    signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

}