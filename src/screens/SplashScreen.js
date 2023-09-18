import React, { useRef } from 'react';
import { Button, Center, NativeBaseProvider, VStack, Image } from 'native-base';

const SplashScreen = ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <Center flex={1} w="100%" alignSelf="center" bgColor="pink.400">
        <VStack space={3} mt="5" w="90%">
          <Center>
            <Image
              source={require('../../assets/images/splash.png')}
              alt="image"
              size="2xl"
            />
          </Center>

          <Button
            bgColor="pink.300"
            onPress={() => navigation.navigate('Signin')}
            mt="3"
            borderRadius="20"
          >
            Masuk
          </Button>
          <Button
            bgColor="pink.400"
            borderWidth="1"
            borderColor="pink.200"
            onPress={() => navigation.navigate('Signup')}
            mt="3"
            borderRadius="20"
          >
            Daftar
          </Button>
        </VStack>
      </Center>
    </NativeBaseProvider>
  );
};

export default SplashScreen;
