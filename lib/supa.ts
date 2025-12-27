import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabasekey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabasekey)

export const uploadImageToSupabase = async (
  file: File | null
) => {
  if (!file) return;

  try {
    const { data, error } = await supabase.storage
      .from("sccd")
      .upload(`public/${file.name}`, file, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    return `${supabaseUrl}/storage/v1/object/public/${data.fullPath}`;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
