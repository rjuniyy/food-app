/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Box,
  NativeBaseProvider,
  Text,
  FlatList,
  Stack,
  Pressable,
  Image,
  Spacer,
  Divider,
  Button,
  useDisclose,
  Icon,
  AlertDialog,
  Center,
} from 'native-base';
import { supabase } from '../../services/supabase';
import { Actionsheet } from 'native-base';
import { Path } from 'react-native-svg';
import Wallet from '../../../assets/icons/wallet.svg';
import DotsThree from '../../../assets/icons/dots-three.svg';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DetailOrderScreen({ route, navigation }) {
  const { items, onDelete, session } = route.params;

  //- Declare AlertDialog
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const cancelRef = React.useRef(null);
  const onAlertClose = () => setIsAlertOpen(false);

  const { isOpen, onOpen, onClose } = useDisclose();

  const itemsId = items.map((item) => item.orders.id);
  const itemId = itemsId[0];

  const getStatus = items.map((item) => item.orders.status);
  const status = getStatus[0];

  const formattedTimestamp = new Date(items[0].created_at).toLocaleString();

  const handleCancelButton = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'dibatalkan' })
        .eq('id', itemId)
        .eq('user_id', session.user.id)
        .select();

      if (error) throw error;

      // navigation.navigate('Canceled', { refresh: true });
      navigation.navigate('Unpaid', { refresh: true });

      // Navigate back after successful deletion
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Box mb="2">
        <Pressable
          bgColor="white"
          height={120}
          alignSelf="center"
          width="90%"
          rounded="15"
          flexDirection="column"
          shadow="2"
          onPress={() => {
            if (item.orders.review_id === null && status === 'selesai') {
              // Execute this action when the condition is true
              // For example, navigate to 'Review'
              navigation.navigate('Review', {
                items: items,
              });
            } else {
              // navigation.navigate('Detail', {
              //   id: item.menu_id,
              //   name: item.menu_items.name,
              //   img: item.image_urls,
              //   desc: item.description,
              //   stock: item.stock,
              //   category: item.category,
              //   price: item.price,
              //   discount: item.discount,
              //   final_price: item.final_price,
              // });
            }
          }}
        >
          <Stack direction="row" space={2} alignItems="center" p={4}>
            <Image
              key={item.menu_items.image_urls}
              source={{ uri: item.menu_items.image_urls[0] }}
              alt="image"
              size={20}
              borderRadius="20"
            />
            {/* <Spacer /> */}
            <Stack direction="column" flex={3}>
              <Text
                fontFamily="RedHatDisplaySemiBold"
                key={item.menu_items.name}
              >
                {item.menu_items.name}
                <Text key={item.quantity}> x{item.quantity}</Text>
              </Text>
            </Stack>
            <Text
              fontFamily="RedHatDisplayBlack"
              key={item.menu_items.final_price}
            >
              Rp. {item.menu_items.final_price}
            </Text>
          </Stack>
        </Pressable>
      </Box>
    );
  };

  return (
    <NativeBaseProvider>
      <Box safeArea>
        <Box width="90%" alignSelf="center">
          <Stack direction="row" alignItems="center">
            <Wallet height="24" width="24" />
            <Stack ml="2">
              <Text fontFamily="RedHatDisplayBlack" fontSize="12">
                Nyemilicious
              </Text>
              <Text fontFamily="RedHatDisplay" fontSize="12">
                {formattedTimestamp}
              </Text>
            </Stack>
            <Spacer />
            <Divider orientation="vertical" mx="3" />
            <TouchableOpacity onPress={onOpen}>
              <DotsThree width="32" height="32" fill="red" />
            </TouchableOpacity>
          </Stack>
        </Box>
        <Divider mt="2" />
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          mt="1"
        />
        {/* <Box alignItems="center">
          <Text fontFamily="RedHatDisplaySemiBold">Beri ulasan menu ini</Text>
          <StarRating rating={rating} maxStars={5} onRate={handleRate} />
          <Text fontFamily="RedHatDisplaySemiBold">
            Anda memberi bintang {rating}
          </Text>
        </Box> */}
        <Center>
          <Text>Kirim Bukti Pembayaran</Text>
        </Center>
      </Box>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        {status === 'pending' && (
          <Actionsheet.Content>
            <Actionsheet.Item
              startIcon={
                <Icon viewBox="0 0 512 512" size="5" fill="red">
                  <Path d="M503.467,273.067h-8.533v-128c0-4.71-3.814-8.533-8.533-8.533h-25.6V76.8c0-4.71-3.814-8.533-8.533-8.533h-80.06 l-6.178-12.348c-1.98-3.968-6.69-5.751-10.803-4.105l-25.071,10.027L288.538,3.576c-2.586-3.61-7.484-4.642-11.29-2.381 L163.576,68.557c-0.486-0.085-0.93-0.29-1.442-0.29H42.667C19.14,68.267,0,87.407,0,110.934v392.533 C0,508.177,3.815,512,8.534,512H486.4c4.719,0,8.533-3.823,8.533-8.533v-128h8.533c4.719,0,8.533-3.823,8.533-8.533V281.6 C512,276.89,508.186,273.067,503.467,273.067z M443.734,85.334v51.2H406.34l-25.6-51.2H443.734z M354.279,70.571l32.981,65.963 H189.381L354.279,70.571z M279.211,19.875l34.645,48.495L143.42,136.534H82.338L279.211,19.875z M42.667,85.334h92.595l-86.4,51.2 h-6.195c-14.114,0-25.6-11.486-25.6-25.6S28.553,85.334,42.667,85.334z M477.867,494.934h-460.8v-350.08 c7.151,5.41,15.957,8.747,25.6,8.747h102.374c0.009,0,0.017,0,0.026,0c0.009,0,0.017,0,0.026,0h332.774v119.467h-51.2 c-28.237,0-51.2,22.963-51.2,51.2c0,28.237,22.963,51.2,51.2,51.2h51.2V494.934z M494.934,358.4h-68.267 c-18.825,0-34.133-15.309-34.133-34.133c0-18.825,15.309-34.133,34.133-34.133h68.267V358.4z" />
                </Icon>
              }
              onPress={() => navigation.navigate('Payment')}
            >
              <Text fontSize="14">Cara Bayar</Text>
            </Actionsheet.Item>
            <Actionsheet.Item
              startIcon={
                <Icon viewBox="0 0 24 24" size="5" fill="cyan">
                  <Path d="M1 3h22v13h-1.481L21 15.481v-1.414l1 1V4H2v11.067l2.533-2.533a.503.503 0 0 1 .704-.008.474.474 0 0 0 .678.049l3.627-3.628a.503.503 0 0 1 .677-.03l3.609 3.007a.503.503 0 0 0 .623.016l2.178-1.634a.503.503 0 0 1 .657.047L18.933 12h-1.414l-.635-.635-1.833 1.375a1.502 1.502 0 0 1-1.863-.049l-3.26-2.716-3.307 3.307a1.403 1.403 0 0 1-.997.415 1.506 1.506 0 0 1-.677-.163L2 16.48V20h10v1H1zm15 4.5A1.5 1.5 0 1 1 14.5 6 1.5 1.5 0 0 1 16 7.5zm-1 0a.5.5 0 1 0-.5.5.5.5 0 0 0 .5-.5zM19 18v-4h-1v4h-4v.999h4V23h1v-4.001h4V18z" />
                </Icon>
              }
              onPress={() =>
                navigation.navigate('SendPayment', {
                  item: items, // The params you want to send
                })
              }
            >
              <Text fontSize="14" color="cyan.500">
                Kirim Bukti Pembayaran
              </Text>
            </Actionsheet.Item>
            <Actionsheet.Item
              startIcon={
                <Icon viewBox="0 0 24 24" size="6" fill="red">
                  <Path d="M1.11111 17.7778C1.11111 19 2.11111 20 3.33333 20H12.2222C13.4444 20 14.4444 19 14.4444 17.7778V4.44444H1.11111V17.7778ZM15.5556 1.11111H11.6667L10.5556 0H5L3.88889 1.11111H0V3.33333H15.5556V1.11111Z" />
                </Icon>
              }
              // onPress={handleCancelButton}
              onPress={() => setIsAlertOpen(true)}
            >
              <Text fontSize="14" color="red.500">
                Batalkan Transaksi
              </Text>
            </Actionsheet.Item>
          </Actionsheet.Content>
        )}
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isAlertOpen}
          onClose={onAlertClose}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Batalkan Transaksi?</AlertDialog.Header>
            <AlertDialog.Body>
              Anda yakin ingin membatalkan pesanan ini?
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onAlertClose}
                  ref={cancelRef}
                >
                  Tidak
                </Button>
                <Button colorScheme="danger" onPress={handleCancelButton}>
                  Ya, Batalkan
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Actionsheet>
      {/* <ScrollView>
        {/* <Box
          bgColor="white"
          height={180}
          alignSelf="center"
          width="90%"
          rounded="5"
          my="2"
          flexDirection="column"
          shadow="2"
        >
          <Box padding="3">
            <Text fontFamily="RedHatDisplaySemiBold">Status Pesanan</Text>
            <Stack direction="row">
              <Text>Hari ini</Text>
              <Spacer />
              <Text>Pesananmu dalam pengiriman</Text>
            </Stack>
          </Box>
        </Box> */}
    </NativeBaseProvider>
  );
}
