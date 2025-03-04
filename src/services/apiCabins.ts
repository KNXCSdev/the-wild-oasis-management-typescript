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
