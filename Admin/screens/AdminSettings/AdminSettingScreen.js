// import { View, Text } from 'react-native';
import React from 'react';
import { NativeBaseProvider, Text, Center, Button } from 'native-base';
import { signOut } from '../../../src/services/AuthService';

export default function AdminSettingScreen({ navigation }) {
  return (
    <NativeBaseProvider>
      <Center safeArea>
        <Button
          bgColor="red.600"
          onPress={() => signOut()}
          colorScheme="danger"
          marginTop="10"
          width="80%"
        >
          <Text fontFamily="RedHatDisplayBlack" fontSize="16" color="light.300">
            Log Out
          </Text>
        </Button>
      </Center>
    </NativeBaseProvider>
  );
}
