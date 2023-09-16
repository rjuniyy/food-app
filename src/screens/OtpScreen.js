import React from 'react';
import { Box, Center, Heading, NativeBaseProvider, VStack } from 'native-base';

const OtpScreen = () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} w="100%">
        <Box safeArea p="2" w="90%" maxW="270">
          <VStack space="3" alignItems="center">
            <Heading
              size="lg"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: 'warmGray.50',
              }}
            >
              Masukkan OTP
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
              Kami telah mengirimkan kode OTP ke
            </Heading>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default OtpScreen;
