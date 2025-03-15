import { CabinsData } from "../utils/types";
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

export async function createEditCabin(
  newCabin: {
    description: string;
    discount: number;
    image: File | string;
    maxCapacity: number;
    name: string;
    regularPrice: number;
  },
  id?: number
) {
  const hasImagePath = typeof newCabin.image === "string" && newCabin.image.startsWith(supabaseUrl);

  const imageName = `${Math.random()}-${
    typeof newCabin.image === "string" ? newCabin.image : newCabin.image.name
  }`.replace("/", "");

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  let query: any = supabase.from("cabins");

  //1)CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  //2)Edit
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Upload image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin IF there was an error uplaoding image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Cabin image could not be uploaded and the cabin was not created");
  }

  return data;
}
