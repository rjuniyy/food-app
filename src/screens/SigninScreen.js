import React, { useState } from 'react';
import {
  Center,
  Heading,
  Box,
  VStack,
  HStack,
  FormControl,
  Input,
  Link,
  Button,
  NativeBaseProvider,
  Text,
} from 'native-base';
import { signIn } from '../services/AuthService';

const SigninScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      setError(''); // Clear any previous errors

      // Call the signIn function from the AuthService
      await signIn(email, password);

      // Authentication successful, navigate to the next screen
      // You can perform navigation using libraries like React Navigation
      // Example: navigation.navigate('Home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} w="100%">
        <Box safeArea p="2" w="90%" maxW="290">
          <VStack space="3" alignItems="center">
            <Heading
              size="lg"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: 'warmGray.50',
              }}
            >
              Selamat Datang
            </Heading>
            <Heading
              mt="1"
              _dark={{
                color: 'warmGray.200',
              }}
              color="coolGray.600"
              fontWeight="medium"
              size="xs"
            >
              Masuk untuk melanjutkan!
            </Heading>
          </VStack>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>E-mail</FormControl.Label>
              <Input
                variant="rounded"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Kata Sandi</FormControl.Label>
              <Input
                variant="rounded"
                type="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <Link
                _text={{
                  fontSize: 'xs',
                  fontWeight: '500',
                  color: 'indigo.500',
                }}
                alignSelf="flex-end"
                mt="1"
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                Lupa Password?
              </Link>
            </FormControl>
            <Button
              mt="2"
              colorScheme="pink"
              onPress={() => handleSignIn()}
              disabled={loading}
            >
              Masuk
            </Button>
            <HStack mt="6" justifyContent="center">
              <Text
                fontSize="sm"
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
              >
                Saya adalah pengguna baru.{' '}
              </Text>
              <Link
                _text={{
                  color: 'indigo.500',
                  fontWeight: 'medium',
                  fontSize: 'sm',
                }}
                onPress={() => navigation.navigate('Signup')}
              >
                Klik untuk daftar!
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default SigninScreen;
