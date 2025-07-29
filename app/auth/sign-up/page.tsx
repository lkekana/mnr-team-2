import { SignUpForm } from "@/components/sign-up-form";
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Page() {
  
    // <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    //   <div className="w-full max-w-sm">
    //     <SignUpForm />
    //   </div>
    // </div>
    signUp: async (email:string, password:string, name:string, surname:string, phone_number:string, profile_picture:string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          Name: name,
          Surname: surname,
          Phone_Number: phone_number,
          Profile_Picture: profile_picture
          
        }
      }
    });
    return { data, error };
  }
}
