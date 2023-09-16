import React, { useEffect, useState } from 'react';
import {
  Box,
  CheckIcon,
  HStack,
  Slide,
  Spinner,
  Stack,
  Text,
  Modal,
  FormControl,
  Button,
  Select,
  Spacer,
} from 'native-base';
import { BuyButton } from './CustomButton';
import { supabase } from '../services/supabase';

export function CartBox({
  totalPrice,
  items,
  setCartItems,
  session,
  navigation,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDeliveryService, setSelectedDeliveryService] =
    useState('kurir');
  const [deliveryData, setDeliveryData] = useState([]);

  useEffect(() => {
    fetchDeliveryService();
  }, [selectedDeliveryService]);

  const fetchDeliveryService = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_method')
        .select()
        .eq('service', selectedDeliveryService);
      if (error) throw error;
      setDeliveryData(data);
    } catch (error) {
      if (error) throw error;
    }
  };

  const handleOrder = async () => {
    if (items.length === 0) {
      return; // Do nothing if the items array is empty
    }
    try {
      setIsLoading(true);
      const [selectedDelivery] = deliveryData;
      // const finalPrice = totalPrice + selectedDelivery.price;
      const deliveryId = selectedDelivery.id;
      // Insert the order with the calculated queue number
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .insert([
          {
            status: 'pending',
            total_price: totalPrice,
            delivery_method_id: deliveryId,
            queue: null,
            user_id: session.user.id,
          },
        ])
        .select();

      setIsOrderSuccess(true);

      // Reset success message after a delay (e.g., 5 seconds)
      setTimeout(() => {
        setIsOrderSuccess(false);
      }, 5000);

      if (ordersError) {
        console.error('Error inserting into Orders table:', ordersError);
        return;
      }

      // Get the generated order ID
      const orderId = ordersData[0].id;

      // Insert into OrderItems table
      const orderItemsPromises = items.map(async (item) => {
        const { error: orderItemsError } = await supabase
          .from('orderitems')
          .insert([
            {
              order_id: orderId,
              menu_id: item.menu_item_id,
              quantity: item.quantity,
              user_id: session.user.id,
            },
          ]);

        if (orderItemsError) {
          // Handle error if necessary
          console.error('Error inserting order item:', orderItemsError);
        } else {
          // Return the item ID to be filtered out from the items array
          return item.id;
        }
      });

      // Wait for all order items to be inserted
      const orderItemsResults = await Promise.all(orderItemsPromises);

      // Filter out the items that were successfully inserted
      const updatedItems = items.filter((item) =>
        orderItemsResults.includes(item.id),
      );

      const { error: deleteError } = await supabase
        .from('cart')
        .delete()
        .in('id', orderItemsResults);

      if (deleteError) {
        console.error('Error deleting cart:', deleteError);
      }

      // Update the items state with the remaining items
      setCartItems(updatedItems);

      // Order successfully placed
      console.log('Order placed successfully!');
    } catch (error) {
      console.error('Error placing the order:', error.message);
    } finally {
      setIsLoading(false); // Set loading to false when handleOrder completes
      navigation.navigate('Order', {
        screen: 'Unpaid',
      });
    }
  };

  return (
    <Box
      safeArea
      flex={1}
      position="absolute"
      bottom="0"
      marginBottom="30"
      bgColor="white"
      width="100%"
      height="15%"
      borderRadius="10"
      shadow="5"
      padding="3"
    >
      <Stack direction="row">
        <Box width="70%">
          <Text fontSize="16" fontFamily="RedHatDisplay">
            Total
            <Text fontSize="11" color="gray.400">
              (Belum Termasuk Ongkir)
            </Text>
          </Text>
          <Text fontSize="20" fontFamily="RedHatDisplayBlack">
            Rp {totalPrice}
          </Text>
        </Box>
        <Slide in={isOrderSuccess} placement="top">
          <Box
            w="100%"
            position="absolute"
            p="2"
            borderRadius="xs"
            bg="emerald.100"
            alignItems="center"
            justifyContent="center"
            _dark={{
              bg: 'emerald.200',
            }}
            safeArea
          >
            <HStack space={2}>
              <CheckIcon
                size="4"
                color="emerald.600"
                mt="1"
                _dark={{
                  color: 'emerald.700',
                }}
              />
              <Text
                color="emerald.600"
                textAlign="center"
                _dark={{
                  color: 'emerald.700',
                }}
                fontWeight="medium"
              >
                Pesanan berhasil dilakukan! harap bayar sesuai petunjuk.
              </Text>
            </HStack>
          </Box>
        </Slide>
        <Box width="30%" marginTop="2">
          {/* Use isLoading state to conditionally render BuyButton or Spinner */}
          {isLoading ? (
            <Spinner size="lg" />
          ) : (
            <Button
              bgColor="pink.500"
              borderRadius="20"
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text fontSize="14" fontFamily="RedHatDisplayBlack" color="white">
                Checkout
              </Text>
            </Button>
          )}
        </Box>
      </Stack>
      <>
        <Modal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          avoidKeyboard
          justifyContent="center"
          bottom="4"
          size="xl"
        >
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Checkout</Modal.Header>
            <Modal.Body>
              <FormControl mt="3">
                <FormControl.Label>Pilih Jasa Pengiriman</FormControl.Label>
                <Select
                  selectedValue={selectedDeliveryService}
                  minWidth="200"
                  accessibilityLabel="Pilih Jasa Pengiriman"
                  _selectedItem={{
                    bg: 'teal.600',
                    endIcon: <CheckIcon size={5} />,
                  }}
                  onValueChange={(itemValue) =>
                    setSelectedDeliveryService(itemValue)
                  }
                  defaultValue={selectedDeliveryService}
                  mt="1"
                >
                  <Select.Item
                    label="Maxim (Ditanggung pembeli)"
                    value="maxim"
                  />
                  <Select.Item label="Ambil di tempat" value="takeaway" />
                  <Select.Item
                    label="Kurir Pribadi hanya Palembang (Rp.15.000)"
                    value="kurir"
                  />
                </Select>
                {/* <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please make a selection!
                </FormControl.ErrorMessage> */}
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Box>
                <Text fontSize="12" fontFamily="RedHatDisplaySemiBold">
                  <Text>Ongkir: </Text>Rp. {deliveryData[0]?.price || 0}
                </Text>
                <Text fontSize="18" fontFamily="RedHatDisplayBlack">
                  <Text>Total: </Text>Rp.
                  {totalPrice + (deliveryData[0]?.price || 0)}
                </Text>
              </Box>
              <Spacer />
              <Box flexDirection="row">
                <BuyButton handleOrder={handleOrder} />
              </Box>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </>
    </Box>
  );
}
