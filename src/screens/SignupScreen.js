import React, { useState } from 'react';
import {
  Center,
  Box,
  Heading,
  VStack,
  NativeBaseProvider,
  Input,
  Button,
  FormControl,
} from 'native-base';
import { StyleSheet, Text, Alert } from 'react-native';
import { checkUserExists, signUp } from '../services/AuthService';
import { Formik } from 'formik';
import * as Yup from 'yup';

export default function SignupScreen({ navigation }) {
  const [emailExists, setEmailExists] = useState(false);

  const handleSignup = async (values, { resetForm }) => {
    try {
      const { email, password, full_name, phone } = values;

      const userExists = await checkUserExists(email, setEmailExists);

      if (userExists) {
        // User already exists
        Alert.alert('Daftar gagal', 'Email telah terdaftar, silahkan Login');
      } else {
        await signUp(email, password, full_name, phone);

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
    full_name: Yup.string().required('Nama Lengkap harus diisi!'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    phone: Yup.string().required('Nomor handphone harus diisi!'),
  });

  return (
    <NativeBaseProvider>
      <Center flex={1} w="100%" bgColor="white">
        <Box safeArea p="2" w="90%" maxW="290" py="8">
          <VStack alignItems="center">
            <Heading
              size="lg"
              color="coolGray.800"
              _dark={{
                color: 'warmGray.50',
              }}
              fontWeight="semibold"
            >
              Selamat Datang!
            </Heading>
            <Heading
              mt="1"
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}
              fontWeight="medium"
              size="xs"
            >
              Daftar untuk melanjutkan!
            </Heading>
          </VStack>

          <VStack space="xs" mt="5">
            <Formik
              initialValues={{
                full_name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
              }}
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
                  <FormControl.Label isRequired>Nama Lengkap</FormControl.Label>
                  <Input
                    mb="3"
                    variant="rounded"
                    placeholder="Nama Lengkap"
                    autoCapitalize="none"
                    onChangeText={handleChange('full_name')}
                    onBlur={handleBlur('full_name')}
                    value={values.full_name}
                    isInvalid={touched.full_name && errors.full_name}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}
                  <FormControl.Label isRequired>Email</FormControl.Label>
                  <Input
                    mb="3"
                    variant="rounded"
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
                  <FormControl.Label isRequired>
                    Nomor Telepon
                  </FormControl.Label>
                  <Input
                    placeholder="Nomor Telepon"
                    mb="3"
                    variant="rounded"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    value={values.phone}
                    isInvalid={touched.phone && errors.phone}
                  />
                  {touched.phone && errors.phone && (
                    <Text style={styles.error}>{errors.phone}</Text>
                  )}

                  <FormControl.Label isRequired>Kata Sandi</FormControl.Label>
                  <Input
                    placeholder="Masukkan kata sandi"
                    mb="3"
                    variant="rounded"
                    secureTextEntry
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    isInvalid={touched.password && errors.password}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                  <FormControl.Label isRequired>
                    Konfirmasi Sandi
                  </FormControl.Label>
                  <Input
                    placeholder="Ulangi kata sandi"
                    mb="3"
                    variant="rounded"
                    secureTextEntry
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    isInvalid={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.error}>{errors.confirmPassword}</Text>
                  )}

                  <Button
                    borderRadius="xl"
                    block
                    mt="3"
                    colorScheme="pink"
                    onPress={handleSubmit}
                    disabled={Object.keys(errors).length !== 0}
                  >
                    Daftar
                  </Button>
                </>
              )}
            </Formik>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
});
