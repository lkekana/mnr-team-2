  const { createClient } = require("@supabase/supabase-js");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
  const supabaseKey = process.env.SUPABASE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  
  
  
  
  export const TravelService = {
    insertTravel: async (  user_id:number,
        location:string,
        risk_level:string,
        last_checked:Date) => {
    const { data, error } = await supabase
      .rpc('insert_book', {
        p_user_id: user_id,
        p_location: location,
        p_risk_level: risk_level,
        p_last_check: last_checked
      });
    return { data, error };
  },

  deleteTravel: async (id:number) => {
    const { data, error } = await supabase
      .rpc('delete_book', {
        p_id: id
      });
    return { data, error };
  },

    updateBook: async ( user_id :number,
        risk_level :string,
        location :string,
        last_check :Date,
        id:number) => {
    const { data, error } = await supabase
      .rpc('update_book', {
        p_user_id: user_id,
        p_risk_level: risk_level,
        p_location: location,
        p_last_check: last_check,
        p_id: id
      });
    return { data, error };
  },

  fetchBooks: async (location:string, user_id:number, id:number, risk_level:string) => {
    const { data, error } = await supabase
      .rpc('fetch_books', {
        p_risk_level: risk_level || null,
        p_id: id || null,
        p_user_id: user_id || null,
        p_location: location || null
      });
    return { data, error };
  }

};
