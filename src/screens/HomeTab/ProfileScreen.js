import React, { useEffect, useState } from 'react';
import {
  Button,
  NativeBaseProvider,
  Stack,
  Text,
  Box,
  FlatList,
  Spacer,
  Pressable,
  Image,
  Divider,
} from 'native-base';
import Courrier from '../../../assets/icons/courrier.svg';
import Bag from '../../../assets/icons/bag.svg';
import Wallet from '../../../assets/icons/wallet.svg';
import Rating from '../../../assets/icons/rating.svg';

import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { fetchUser } from '../../services/api';

export default function ProfileScreen({ navigation }) {
  const route = useRoute();
  const { session } = route.params;
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchUser({ session, setUserData });
  }, []);

  const renderProfile = ({ item }) => (
    <Stack direction="row" padding="5" alignContent="center">
      <Box justifyContent="center">
        <Image alt="image" source={{ uri: item.avatar_url }} size={20} />
      </Box>

      <Box padding="3">
        <Text fontFamily="RedHatDisplayBlack">{item.full_name}</Text>
        <Text fontFamily="RedHatDisplay">{item.email}</Text>
        <Divider bg="muted.400" />
        <Text fontFamily="RedHatDisplay">{item.phone}</Text>
      </Box>
    </Stack>
  );
  return (
    <NativeBaseProvider>
      <Box safeArea>
        <Stack direction="row" maxWidth="100%" justifyContent="center">
          <Text
            width="70%"
            alignSelf="center"
            fontFamily="RedHatDisplayBlack"
            fontSize="18"
            ml="8"
          >
            Personal Details
          </Text>
          <Button
            rightIcon={
              <Ionicons name="create-outline" size={18} color="black" />
            }
            bgColor="transparent"
            width="30%"
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text textAlign="center" color="pink.500" fontSize="15">
              Edit
            </Text>
          </Button>
        </Stack>
        <Box
          borderRadius="3xl"
          bgColor="pink.300"
          width="90%"
          alignSelf="center"
          justifyContent="center"
          alignItems="center"
        >
          <FlatList
            data={userData}
            renderItem={renderProfile}
            keyExtractor={(item) => item.id.toString()}
          />
        </Box>

        <Box>
          <Stack direction="row" justifyContent="center" space="1" padding="3">
            {/* <Button
              rightIcon={
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="black"
                  style={{ alignSelf: 'center' }}
                />
              }
              borderRadius="full"
              bg="white"
              colorScheme="dark"
            >
              <Text fontFamily="RedHatDisplaySemiBold" fontSize="12">
                Notifikasi
              </Text>
            </Button> */}

            <Button
              rightIcon={
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color="black"
                  style={{ alignSelf: 'center' }}
                />
              }
              borderRadius="full"
              bg="white"
              colorScheme="dark"
              onPress={() => navigation.navigate('Settings')}
            >
              <Text fontFamily="RedHatDisplaySemiBold" fontSize="12">
                Pengaturan
              </Text>
            </Button>

            <Button
              rightIcon={
                <Ionicons
                  name="card-outline"
                  size={24}
                  color="black"
                  style={{ alignSelf: 'center' }}
                />
              }
              borderRadius="20"
              bg="white"
              colorScheme="dark"
              fontFamily="RedHatDisplaySemiBold"
              onPress={() => navigation.navigate('Payment')}
            >
              <Text fontFamily="RedHatDisplaySemiBold" fontSize="12">
                Pembayaran
              </Text>
            </Button>
          </Stack>

          <Box
            width="90%"
            bg="white"
            alignSelf="center"
            padding="2"
            rounded="14"
            shadow="2"
          >
            <Pressable
              flexDirection="row"
              onPress={() => navigation.navigate('Order')}
            >
              <Text fontFamily="RedHatDisplayBlack">Pesanan Saya</Text>
              <Spacer />
              <Text fontSize="12" fontFamily="RedHatDisplay">
                Lihat riwayat pesanan
              </Text>
            </Pressable>

            <Stack
              direction="row"
              width="90%"
              bg="white"
              alignSelf="center"
              justifyContent="center"
              space="10"
              mt="5"
            >
              <Pressable
                alignItems="center"
                onPress={() =>
                  navigation.navigate('Order', {
                    screen: 'Unpaid',
                  })
                }
              >
                <Wallet height="24" width="24" />
                <Text fontFamily="RedHatDisplaySemiBold" fontSize="10" mt="2">
                  Belum Bayar
                </Text>
              </Pressable>
              <Pressable
                alignItems="center"
                onPress={() => navigation.navigate('Order', { screen: 'Pack' })}
              >
                <Bag height="24" width="24" />
                <Text fontFamily="RedHatDisplaySemiBold" fontSize="10" mt="2">
                  Dibuat
                </Text>
              </Pressable>
              <Pressable
                alignItems="center"
                onPress={() =>
                  navigation.navigate('Order', { screen: 'Delivery' })
                }
              >
                <Courrier width="24" height="24" />
                <Text fontFamily="RedHatDisplaySemiBold" fontSize="10" mt="2">
                  Dikirim
                </Text>
              </Pressable>
              <Pressable
                alignItems="center"
                onPress={() =>
                  navigation.navigate('Order', { screen: 'Completed' })
                }
              >
                <Rating width="24" height="24" />
                <Text fontFamily="RedHatDisplaySemiBold" fontSize="10" mt="2">
                  Beri Penilaian
                </Text>
              </Pressable>
            </Stack>
          </Box>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}
