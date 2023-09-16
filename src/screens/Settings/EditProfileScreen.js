import React, { useEffect, useState } from 'react';
import {
  NativeBaseProvider,
  Text,
  Stack,
  Pressable,
  Box,
  Divider,
} from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

export default function EditProfileScreen({ navigation }) {
  const route = useRoute();
  const { session } = route.params;

  const data = [
    { label: 'Nama Lengkap', value: session.user.user_metadata.full_name },
    { label: 'No. Handphone', value: session.user.user_metadata.phone },
    { label: 'Email', value: session.user.user_metadata.email },
  ];

  const renderItems = () => {
    const handlePressItem = (item) => {
      navigation.navigate('EditProfileData', { item, label: item.label });
    };
    return data.map((item, index) => (
      <Pressable
        key={index}
        flexDirection="row"
        onPress={() => handlePressItem(item)}
        padding="4"
      >
        <Box width="45%">
          <Text fontFamily="RedHatDisplaySemiBold" color="gray.500">
            {item.label}
          </Text>
        </Box>
        <Box width="45%">
          <Text fontFamily="RedHatDisplaySemiBold">{item.value}</Text>
        </Box>
        <Box width="10%">
          <Ionicons name="md-chevron-forward-outline" size={24} color="black" />
        </Box>
      </Pressable>
    ));
  };

  return (
    <NativeBaseProvider>
      <Box safeArea>
        <Text fontFamily="RedHatDisplayBlack" fontSize="16" padding="2">
          Kemanan dan Akun
        </Text>
        <Divider />
        <Stack>{renderItems()}</Stack>
      </Box>
    </NativeBaseProvider>
  );
}
