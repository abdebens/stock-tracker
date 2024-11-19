import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import { supabase } from "./supabase.js";

async function fetchStocks() {
  const { data, error } = await supabase.from("stocks").select("*");

  if (error) {
    console.error("Error fetching stocks:", error);
  } else {
    console.log("Stocks data:", data);
  }
}

fetchStocks();

async function addStock(stock) {
  const { data, error } = await supabase.from("stocks").insert([stock]);

  if (error) {
    console.error("Error adding stock:", error);
  } else {
    console.log("Stock added:", data);
  }
}

// Example usage:
addStock({
  product_name: "Product A",
  category: "Category 1",
  stock_unit: 50,
  unit: "kg",
  stock_entry: 20,
  stock_output: 10,
  final_stock: 60,
  entry_date: "2024-11-19",
});

//update

async function updateStock(id, updatedData) {
  const { data, error } = await supabase
    .from("stocks")
    .update(updatedData)
    .eq("id", id);

  if (error) {
    console.error("Error updating stock:", error);
  } else {
    console.log("Stock updated:", data);
  }
}

// Example usage:
updateStock(1, { stock_unit: 80 });

//del
async function deleteStock(id) {
  const { data, error } = await supabase.from("stocks").delete().eq("id", id);

  if (error) {
    console.error("Error deleting stock:", error);
  } else {
    console.log("Stock deleted:", data);
  }
}

// Example usage:
deleteStock(1);
