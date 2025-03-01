import supabase from "./supabase";

interface Setting {
  id: number;

  [key: string]: any;
}

// Fetch the settings from the "settings" table (returns a single row)
export async function getSettings(): Promise<Setting> {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
  return data as Setting;
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting: Record<string, any>): Promise<Setting> {
  const { data, error } = await supabase
    .from("settings")
    .update(newSetting)
    .eq("id", 1) // We assume there's only one row of settings with id=1
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
  return data as Setting;
}
