import { supabase } from './supabase';

export const fetchOrders = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('orderitems')
      .select('*, menu_items(*), orders(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('error fetching orderitems', error);
    return [];
  }
};
