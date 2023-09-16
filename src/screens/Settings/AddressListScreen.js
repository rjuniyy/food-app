import React, { useState, useEffect } from 'react';
import {
  NativeBaseProvider,
  Text,
  FlatList,
  Pressable,
  Box,
} from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { fetchAddress } from '../../services/api';
import { useRoute, useIsFocused } from '@react-navigation/native';

export default function AddressListScreen({ navigation }) {
  const route = useRoute();
  const { session } = route.params;
  const [addressData, setAddressData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchAddress({ session, setAddressData });
    }
  }, [isFocused, session]);

  const renderItem = ({ item }) => {
    return (
      <Box mt="5">
        <Pressable
          rounded="10"
          bgColor="white"
          width="90%"
          alignSelf="center"
          padding="3"
          onPress={() =>
            navigation.navigate('EditProfileData', { item, label: 'Address' })
          }
        >
          <Text fontFamily="RedHatDisplayBlack">
            {item.full_name} | <Text>{item.phone_number}</Text>
          </Text>
          <Text fontFamily="RedHatDisplay">{item.address}</Text>
          {item.isPrimary === true ? (
            <Box width="20%" borderWidth="1" borderColor="pink.400">
              <Text
                alignSelf="center"
                color="pink.400"
                fontFamily="RedHatDisplay"
              >
                Utama
              </Text>
            </Box>
          ) : (
            <Text position="absolute" />
          )}
        </Pressable>
      </Box>
    );
  };

  return (
    <NativeBaseProvider>
      <Box safeArea>
        <FlatList data={addressData} renderItem={renderItem} />
        <Pressable
          bgColor="white"
          alignSelf="center"
          flexDirection="row"
          rounded="15"
          mt="5"
          width="60%"
          padding="4"
          justifyContent="center"
          onPress={() => navigation.navigate('AddNewAddress')}
        >
          <Ionicons name="add-circle" size={32} color="pink" />
          <Text
            color="pink.300"
            fontSize="15"
            fontFamily="RedHatDisplaySemiBold"
            alignSelf="center"
          >
            Tambah Alamat Baru
          </Text>
        </Pressable>
      </Box>
    </NativeBaseProvider>
  );
}
