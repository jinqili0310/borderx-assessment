import { supabase } from "../supabaseClient";
import { Database } from "../../types/database.types";

export type Tables = Database["public"]["Tables"];
export type TableName = keyof Tables;

export async function fetchData<T extends TableName>(
  table: T,
  query?: string
): Promise<Tables[T]["Row"][]> {
  let queryBuilder = supabase.from(table).select("*");

  if (query) {
    queryBuilder = queryBuilder.textSearch("name", query);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    throw error;
  }

  return data as Tables[T]["Row"][];
}

export async function insertData<T extends TableName>(
  table: T,
  data: Tables[T]["Insert"]
) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return result as Tables[T]["Row"];
}

export async function updateData<T extends TableName>(
  table: T,
  id: string,
  data: Tables[T]["Update"]
) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return result as Tables[T]["Row"];
}

export async function deleteData<T extends TableName>(table: T, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    throw error;
  }
}
