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
  Text,
  Spinner,
} from 'native-base';
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../services/supabase';
import { SuccessToast, FailedToast } from '../components/Toast';

export default function ForgotPasswordScreen({ navigation }) {
  const [successToast, setSuccessToast] = useState(false);
  const [failedToast, setFailedToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      const { email } = values;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        setFailedToast(true);
        setTimeout(() => {
          setFailedToast(false);
        }, 3000);

        console.error('Error resetting password:', error);
        // Handle error appropriately, e.g., show an error message.
      } else {
        setSuccessToast(true);
        setTimeout(() => {
          setSuccessToast(false);
        }, 3000);

        console.log('Password reset email sent successfully!');
        // You can navigate the user to a confirmation screen or show a message.
      }
      resetForm();
    } catch (error) {
      console.error('Error resetting password:', error);
      // Handle error appropriately, e.g., show an error message.
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        navigation.navigate('Signin');
      }, 3000);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email tidak valid!')
      .required('Email harus diisi!'),
  });

  return (
    <NativeBaseProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                Lupa Password?
              </Heading>
              <Heading
                mt="1"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontSize="13"
                fontWeight="light"
                textAlign="center"
              >
                Kami akan mengirimkan sebuah link ke email anda untuk mereset
                password.
              </Heading>
            </VStack>

            <VStack space="xs" mt="5">
              <Formik
                initialValues={{
                  email: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleForgotPassword}
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
                    <FormControl>
                      <FormControl.Label>E-mail</FormControl.Label>
                      <Input
                        placeholder="Alamat E-mail...."
                        variant="rounded"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        isInvalid={touched.email && errors.email}
                      />
                      {touched.email && errors.email && (
                        <Text style={styles.error}>{errors.email}</Text>
                      )}
                      <Button
                        borderRadius="xl"
                        block
                        mt="3"
                        colorScheme="pink"
                        onPress={handleSubmit}
                        disabled={
                          Object.keys(errors).length !== 0 || isLoading === true
                        }
                      >
                        {isLoading ? (
                          <Spinner size="sm" />
                        ) : (
                          <Text
                            color="white"
                            fontFamily="RedHatDisplaySemiBold"
                          >
                            Kirim Link Reset
                          </Text>
                        )}
                      </Button>
                    </FormControl>
                  </>
                )}
              </Formik>
            </VStack>
          </Box>
          <Center position="absolute">
            {successToast && (
              <SuccessToast
                showToast={successToast}
                message={'Link reset password berhasil dikirim.'}
              />
            )}
            {failedToast && (
              <FailedToast
                showToast={failedToast}
                message={'Link reset password gagal dikirim!'}
              />
            )}
          </Center>
        </Center>
      </TouchableWithoutFeedback>
    </NativeBaseProvider>
  );
}
const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
});
