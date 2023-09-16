import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text, NativeBaseProvider } from 'native-base';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { supabase } from './src/services/supabase';
import { checkUserExists, signUp } from './src/services/AuthService';

const SignupForm = () => {
  const [emailExists, setEmailExists] = useState(false);

  const handleSignup = async (values, { resetForm }) => {
    try {
      const { email, password } = values;

      const userExists = await checkUserExists(email, setEmailExists);

      if (userExists) {
        // User already exists
        Alert.alert('Daftar gagal', 'Email telah terdaftar, silahkan Login');
      } else {
        await signUp(email, password);

        // Handle successful signup, e.g., navigate to another screen
        Alert.alert('Akun berhasil dibuat, cek email untuk mengaktifkan akun.');

        // Reset the form
        resetForm();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Signup</Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSignup}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <Input
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                isInvalid={touched.email && (errors.email || emailExists)}
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
              <Input
                placeholder="Password"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                isInvalid={touched.password && errors.password}
              />
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
              <Button
                block
                onPress={handleSubmit}
                disabled={Object.keys(errors).length !== 0}
              >
                <Text>Signup</Text>
              </Button>
            </>
          )}
        </Formik>
      </View>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default SignupForm;
