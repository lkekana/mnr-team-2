import { UpdatePasswordForm } from "@/components/update-password-form";
import { SignUpForm } from "@/components/sign-up-form";

const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)



export const Page = {
  // return (
  //   <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
  //     <div className="w-full max-w-sm">
  //       <UpdatePasswordForm />
  //     </div>
  //   </div>
  // );
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  }
}
