import { LoginForm } from "@/components/login-form";
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export const Page = {
  // return (
  //   <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
  //     <div className="w-full max-w-sm">
  //       <LoginForm />
  //     </div>
  //   </div>
  // );
  signIn: async (email:string, password:string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  
  }
}
