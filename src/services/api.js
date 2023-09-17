import { supabase } from './supabase';

//note Function untuk menarik data dari database, kemudian di panggil di komponen Screen.

//- Fungsi untuk mengambil data untuk menampilkan data yang telah difilter.
export const fetchAllMenu = async () => {
  try {
    const { data: menu_items, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('id', { ascending: false })
      .eq('isAvailable', true);
    if (error) throw error;

    return menu_items;
  } catch (error) {
    console.error('Error fetching menu items', error.message);
    return [];
  }
};

export const fetchDrink = async () => {
  try {
    const { data: menu_items, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('id', { ascending: false })
      .eq('isAvailable', true)
      .eq('category_id', 2);

    if (error) throw error;
    return menu_items;
  } catch (error) {
    console.error('Error fetching Drink', error.message);
    return [];
  }
};

export const fetchDaifuku = async () => {
  try {
    const { data: menu_items, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('id', { ascending: false })
      .eq('isAvailable', true)
      .eq('category_id', 1);

    if (error) throw error;
    return menu_items;
  } catch (error) {
    console.error('Error fetching Daifuku', error.message);
    return [];
  }
};

export const fetchGorengan = async () => {
  try {
    const { data: menu_items, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('id', { ascending: false })
      .eq('category_id', 3)
      .eq('isAvailable', true);

    if (error) throw error;
    return menu_items;
  } catch (error) {
    console.error('Error fetching Gorengan', error.message);
    return [];
  }
};

export const fetchCartItems = async (setCartItems) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // console.log(user.id);

    const { data: cart, error } = await supabase
      .from('cart')
      .select('*, menu_items(*)')
      .order('id', { ascending: false })
      .eq('user_id', user.id);

    setCartItems(cart);

    if (error) throw error;
  } catch (error) {
    console.error('Error fetching cart items', error.message);
  }
};

export const fetchFavorites = async ({ setFavorites, session }) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, menu_items(*)')
      .order('id', { ascending: false })
      .eq('user_id', session.user.id);

    if (error) {
      throw error;
    }
    setFavorites(data);
  } catch (error) {
    console.error('Error fetching favorites:', error);
  }
};

export const fetchAddress = async ({ session, setAddressData }) => {
  try {
    const { data, error } = await supabase
      .from('address')
      .select('*')
      .eq('user_id', session.user.id);
    if (error) throw error;
    setAddressData(data);
  } catch (error) {
    console.error('Error fetching user:', error);
    return;
  }
};

export const fetchUser = async ({ session, setUserData }) => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', session.user.id);

    if (error) throw error;
    setUserData(user);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};
//- API untuk mengupdate data Profile User.
export const updateProfile = async (label, value, session) => {
  try {
    let profileData, userUpdateData;

    const field = getProfileField(label);
    profileData = await updateProfileData(field, value, session);
    userUpdateData = await updateUser(field, value);

    return {
      profileData,
      userUpdateData,
    };
  } catch (error) {
    console.error('error updating profile', error);
    throw error;
  }
};

const getProfileField = (label) => {
  switch (label) {
    case 'Nama Lengkap':
      return 'full_name';
    case 'No. Handphone':
      return 'phone';
    case 'Email':
      return 'email';
    default:
      throw new Error('Invalid label');
  }
};

const updateProfileData = async (field, value, session) => {
  return await supabase
    .from('profiles')
    .update({ [field]: value })
    .eq('id', session.user.id)
    .select();
};

const updateUser = async (field, value) => {
  return await supabase.auth.updateUser({ data: { [field]: value } });
};

//- API untuk memasukkan sebuah data kedalam tabel 'address'
export const addNewAddress = async (address, session) => {
  try {
    const { error } = await supabase
      .from('address')
      .insert([
        {
          user_id: session.user.id,
          address: address,
          full_name: session.user.user_metadata.full_name,
          phone_number: session.user.user_metadata.phone,
          isPrimary: false,
        },
      ])
      .select();

    if (error) throw error;
  } catch (error) {
    console.error('Error inserting address', error);
    return;
  }
};
//- API untuk update data address.
export const updateAddress = async (value, addressId, isPrimary) => {
  try {
    const { error } = await supabase
      .from('address')
      .update({
        address: value,
        isPrimary: isPrimary,
      })
      .eq('id', addressId);
    if (error) throw error;
  } catch (error) {
    console.error('Error updating address', error);
    return;
  }
};
