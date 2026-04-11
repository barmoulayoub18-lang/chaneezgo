import { supabase } from "./supabaseClient";

export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw error;

  await supabase.from("profiles").insert({
    id: data.user.id,
    email,
    full_name: fullName,
    role: "student"
  });

  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  return data;
};

export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};