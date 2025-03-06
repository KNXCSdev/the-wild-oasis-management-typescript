import { CabinsCreate, CabinsData } from "../utils/types";
import supabase, { supabaseUrl } from "./supabase";

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

export async function createCabin(formData: {
  description: string;
  discount: number;
  image: File;
  maxCapacity: number;
  name: string;
  regularPrice: number;
}) {
  console.log(formData);
  const imageName = `${Math.random()}-${formData.image.name}`.replace("/", "");
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...formData, image: imagePath }])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, formData.image);

  return data;
}
