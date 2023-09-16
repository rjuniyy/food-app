/* eslint-disable react/prop-types */
import React from 'react';
import {
  Box,
  Center,
  Divider,
  FlatList,
  Image,
  NativeBaseProvider,
  Pressable,
  Spacer,
  Stack,
  Text,
} from 'native-base';
import AnimatedLottieView from 'lottie-react-native';
import { supabase } from '../../src/services/supabase';

export default function AdminOrderList({ navigation, status }) {
  const [data, setData] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(true);

  const hasOrdersWithStatus = data.some(
    (item) => item.orders.status === status,
  );
  const fetchOrders = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orderitems')
        .select('*, menu_items(*), orders(*), profiles(*)');

      if (error) {
        console.error(error);
        return;
      }
      setData(orders);
    } catch (error) {
      console.error('Error Fetching Order Items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item, index }) => {
    const formattedTimestamp = new Date(item.created_at).toLocaleString();

    const handleItemPress = () => {
      // Filter the unpaidOrder data to get items with the same order_id
      const itemsWithSameOrderId = data.filter(
        (orderItem) => orderItem.order_id === item.order_id,
      );

      navigation.navigate('AdminDetailOrder', {
        items: itemsWithSameOrderId,
        // onDelete: fetchOrders,
      });
    };

    const isSameOrder = index > 0 && item.order_id === data[index - 1].order_id;

    // Render the item only if it's the first item for a new order_id and matches the status
    if (!isSameOrder && item.orders.status === status) {
      return (
        <Pressable
          bgColor="gray.100"
          height={170}
          alignSelf="center"
          width="90%"
          rounded="5"
          my="2"
          flexDirection="column"
          onPress={handleItemPress}
        >
          <Stack direction="row" justifyContent="center">
            <Text fontFamily="RedHatDisplayBlack" fontSize="18" underline>
              {item.profiles.full_name}
            </Text>
          </Stack>
          <Stack
            direction="row"
            space={2}
            alignItems="center"
            paddingBottom={1}
            paddingX={4}
          >
            <Image
              source={{ uri: item.menu_items.image_urls[0] }}
              alt="image"
              size={20}
              borderRadius="20"
            />
            <Stack direction="column" flex={3}>
              <Text fontFamily="RedHatDisplaySemiBold">
                {item.menu_items.name} <Text> x {item.quantity}</Text>
              </Text>
            </Stack>
            <Text fontFamily="RedHatDisplayBlack">
              Rp. {item.orders.total_price}
            </Text>
          </Stack>
          <Divider />
          <Stack padding="2">
            <Text fontFamily="RedHatDisplay" fontSize="11">
              Dipesan pada:
            </Text>
            <Stack direction="row">
              <Text fontFamily="RedHatDisplay" fontSize="11">
                {formattedTimestamp}
              </Text>
              <Spacer />
              <Text fontFamily="RedHatDisplay" mx="2" fontSize="13" highlight>
                {item.orders.status}
              </Text>
            </Stack>
          </Stack>
        </Pressable>
      );
    }
  };

  if (isLoading) {
    return (
      <NativeBaseProvider>
        <Text alignSelf="center">Loading...</Text>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider>
      <Box safeArea>
        {!hasOrdersWithStatus ? (
          <Center boxSize="xs" alignSelf="center">
            <AnimatedLottieView
              source={require('../../assets/animations/not-found.json')}
              autoPlay
              loop
            />
            <Spacer />
            <Text fontFamily="RedHatDisplaySemiBold" fontSize="18">
              Belum ada pesanan.
            </Text>
          </Center>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </Box>
    </NativeBaseProvider>
  );
}
