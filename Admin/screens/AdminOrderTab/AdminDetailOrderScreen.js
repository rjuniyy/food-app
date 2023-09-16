import React, { useEffect, useState } from 'react';
import {
  Box,
  NativeBaseProvider,
  Text,
  FlatList,
  Stack,
  Pressable,
  Image,
  Divider,
  Button,
  Select,
  Center,
  FormControl,
  CheckIcon,
} from 'native-base';
import Wallet from '../../../assets/icons/wallet.svg';
import { supabase } from '../../../src/services/supabase';

export default function AdminDetailOrderScreen({ route, navigation }) {
  const { items, session } = route.params;
  const [addressData, setAddressData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(items[0].orders.status);

  const getStatus = items.map((item) => item.orders.status);
  const formattedTimestamp = new Date(items[0].created_at).toLocaleString();
  const accountName = items[0].profiles.full_name;
  const accountEmail = items[0].profiles.email;
  const accountAddress = addressData[0]?.address || '';

  useEffect(() => {
    fetchAddress();
  }, []);

  function calculateDeliveryPrice(deliveryMethodId) {
    return deliveryMethodId === 1 ? 15000 : 0;
  }

  const countDelivery = items[0].orders.delivery_method_id;
  const priceDelivery = calculateDeliveryPrice(countDelivery);

  const fetchAddress = async () => {
    try {
      const { data, error } = await supabase
        .from('address')
        .select('*')
        .eq('user_id', items[0].profiles.user_id);

      if (error) {
        console.error(error);
        return;
      }
      setAddressData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: selectedStatus })
        .eq('id', items[0].orders.id);
      if (error) {
        console.error(error);
        return;
      }
      navigation.navigate('AdminOrder', { refresh: true });
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <Box mb="2">
      <Pressable
        bgColor="white"
        height={120}
        alignSelf="center"
        width="90%"
        rounded="15"
        flexDirection="column"
        shadow="2"
      >
        <Stack direction="row" space={2} alignItems="center" p={4}>
          <Image
            source={{ uri: item.menu_items.image_urls[0] }}
            alt="image"
            size={20}
            borderRadius="20"
          />
          <Stack direction="column" flex={3}>
            <Text fontFamily="RedHatDisplaySemiBold">
              {item.menu_items.name} x{item.quantity}
            </Text>
          </Stack>
          <Text fontFamily="RedHatDisplayBlack">
            Rp. {item.menu_items.final_price}
          </Text>
        </Stack>
      </Pressable>
    </Box>
  );

  return (
    <NativeBaseProvider>
      <Box safeArea mt={15}>
        <Box width="90%" alignSelf="center">
          <Stack direction="row" alignItems="center">
            <Wallet height={24} width={24} />
            <Stack ml={2}>
              <Text fontFamily="RedHatDisplayBlack" fontSize={12}>
                {accountName} | {accountEmail}
              </Text>
              <Text fontFamily="RedHatDisplay" fontSize={12}>
                {accountAddress}
              </Text>
              <Text fontFamily="RedHatDisplay" fontSize={12}>
                {formattedTimestamp}
              </Text>
            </Stack>
          </Stack>
        </Box>
        <Divider mt={2} />
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          mt={1}
        />
        <Box padding={5}>
          <Stack>
            <Text fontFamily="RedHatDisplaySemiBold">Ringkasan Pembayaran</Text>
            <Stack direction="row" justifyContent="space-between">
              <Text fontFamily="RedHatDisplay">Harga</Text>
              <Text fontFamily="RedHatDisplay">
                {items[0].orders.total_price}
              </Text>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Text fontFamily="RedHatDisplay">Ongkos Kirim</Text>
              <Text fontFamily="RedHatDisplay">{priceDelivery}</Text>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Text fontFamily="RedHatDisplay">Total</Text>
              <Text fontFamily="RedHatDisplay">
                {items[0].orders.order_price}
              </Text>
            </Stack>
          </Stack>
          <FormControl padding="5">
            <FormControl.Label justifyContent="center">
              Ubah Status Pesanan
            </FormControl.Label>
            <Select
              accessibilityLabel="Choose Service"
              placeholder="Choose Service"
              _selectedItem={{
                bg: 'pink.600',
                endIcon: <CheckIcon size={5} />,
                rounded: 'full',
              }}
              mt="1"
              selectedValue={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
              bgColor="pink.50"
              rounded={40}
            >
              <Select.Item label="Pending" value="pending" />
              <Select.Item label="Diproses" value="diproses" />
              <Select.Item label="Dikirim" value="dikirim" />
              <Select.Item label="Selesai" value="selesai" />
              <Select.Item label="Dibatalkan" value="dibatalkan" />
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Center
        bgColor="white"
        roundedTop={40}
        position="absolute"
        bottom={0}
        width="100%"
        alignSelf="center"
        size="lg"
        shadow="3"
      >
        <Button
          width="60%"
          colorScheme="pink"
          rounded="20"
          height="60%"
          onPress={handleUpdateStatus}
        >
          <Text fontFamily="RedHatDisplayBlack" color="white">
            Update Status
          </Text>
        </Button>
      </Center>
    </NativeBaseProvider>
  );
}
