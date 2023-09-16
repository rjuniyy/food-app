import { Alert } from 'react-native';
import { supabase } from './supabase';

export const checkUserExists = async (email, setEmailExists) => {
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email);

    const userExists = profiles.length > 0;
    setEmailExists(userExists);
    return userExists;
  } catch (error) {
    throw new Error('Failed to check user existence');
  }
};

export const signUp = async (email, password, full_name, phone) => {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name,
          phone: phone,
          email: email,
          avatar_url:
            'https://rtsmdhjrozectbtqlofe.supabase.co/storage/v1/object/public/avatars/default-avatar.png',
        },
      },
    });
    if (error) {
      throw new Error(error.message);
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
    }
    return user;
  } catch (err) {
    Alert.alert('SignIn failed');
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error('Sign out failed. Please try again.');
  }
};

export const sendPasswordResetEmail = async (email) => {
  try {
    const { error } = await supabase.auth.api.resetPasswordForEmail(email);
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error('Failed to send password reset email. Please try again.');
  }
};
