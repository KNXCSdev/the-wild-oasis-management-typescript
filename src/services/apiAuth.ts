import supabase from "./supabase";

export async function login({ email, password }: { email: string; password: string }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}
