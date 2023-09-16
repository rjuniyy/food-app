import { supabase } from '../services/supabase'; // Adjust the import path

export const calculateDiscountedPriceRPC = async (discount, price) => {
  try {
    const { data, error } = await supabase.rpc('calculate_discounted_price', {
      discount,
      price,
    });

    if (error) {
      console.error(error);
      return null; // You might want to handle the error more gracefully
    }

    return data;
  } catch (error) {
    console.error('Error calling calculate_discounted_price:', error.message);
    return null; // Handle error
  }
};
