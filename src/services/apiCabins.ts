import { CabinsData } from "../utils/types";
import supabase from "./supabase";

export async function getCabins(): Promise<CabinsData[]> {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data as CabinsData[];
}

export async function deleteCabin(id: number) {
  let { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
