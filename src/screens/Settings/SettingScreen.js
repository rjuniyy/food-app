// import { View, Text } from 'react-native';
import React from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Center,
  Pressable,
  Button,
} from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signOut } from '../../services/AuthService';

export default function SettingScreen({ navigation }) {
  const data = [{ label: 'Alamat Saya' }, { label: 'Keamanan dan Akun' }];

  const renderItems = () => {
    const handlePressItem = (item) => {
      if (item.label === 'Alamat Saya') {
        navigation.navigate('Address');
      } else if (item.label === 'Keamanan dan Akun') {
        navigation.navigate('EditProfile');
      }
    };
    return data.map((item, index) => (
      <Pressable
        key={index}
        flexDirection="row"
        mt="4"
        onPress={() => handlePressItem(item)}
        alignItems="center"
        bgColor="white"
        rounded="10"
        width="90%"
        height={60}
        padding="3"
      >
        <Box width="90%">
          <Text fontFamily="RedHatDisplaySemiBold" fontSize={16}>
            {item.label}
          </Text>
        </Box>

        <Box width="10%">
          <Ionicons name="md-chevron-forward-outline" size={24} color="black" />
        </Box>
      </Pressable>
    ));
  };
  return (
    <NativeBaseProvider>
      <Center safeArea>
        {renderItems()}
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
