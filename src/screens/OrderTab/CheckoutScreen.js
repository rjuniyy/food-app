import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FlatList,
  NativeBaseProvider,
  Text,
  Image,
  Box,
  Stack,
  Flex,
  Spacer,
} from 'native-base';
import { fetchCartItems } from '../../services/api';
import { ButtonQuantity } from '../../components/CustomButton';
import { CartBox } from '../../components/CustomBox';
import { supabase } from '../../services/supabase';
import AnimatedLottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';

export default function PaymentScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [session, setSession] = useState([]);
  const [hasItems, setHasItems] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    let cartItemsSubscription;
    const fetchAndSetCartItems = async () => {
      fetchCartItems(setCartItems);
    };

    if (isFocused) {
      cartItemsSubscription = supabase
        .channel('custom-all-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'cart' },
          (payload) => {
            fetchAndSetCartItems();
          },
        )
        .subscribe();
    }

    fetchAndSetCartItems();

    return () => {
      if (cartItemsSubscription) {
        cartItemsSubscription.unsubscribe();
      }
    };
  }, [isFocused]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleIncrement = useCallback(
    (item) => {
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem,
      );
      setCartItems(updatedCartItems);
    },
    [cartItems],
  );

  const handleDecrement = useCallback(
    (item) => {
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.id && cartItem.quantity > 1
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem,
      );
      setCartItems(updatedCartItems);
    },
    [cartItems],
  );

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.menu_items.final_price * item.quantity;
      return total + itemPrice;
    }, 0);
  }, [cartItems]);

  const renderItem = ({ item }) => {
    return (
      <Flex bgColor="white" borderRadius="20" h={120} mb={5}>
        <Box width="100%" padding="5">
          <Stack direction="row">
            <Image
              source={{ uri: item.menu_items.image_urls[0] }}
              alt="image"
              size={20}
              borderRadius="20"
            />
            <Box marginLeft="3" maxW="80%">
              <Text fontSize={14} fontFamily="RedHatDisplayBlack">
                {item.menu_items.name}
              </Text>
              <Spacer />
              {item.menu_items.discount !== 0 && (
                <Text
                  fontSize="12"
                  fontFamily="RedHatDisplaySemiBold"
                  color="coolGray.400"
                  strikeThrough
                >
                  Rp {item.menu_items.price}
                </Text>
              )}
              <Text fontSize="14" fontFamily="RedHatDisplaySemiBold">
                Rp.{item.menu_items.final_price}
              </Text>
            </Box>
          </Stack>
        </Box>

        <Box position="absolute" bottom={2} p={2} alignSelf="flex-end">
          <ButtonQuantity
            item={item}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            quantity={item.quantity}
          />
        </Box>
      </Flex>
    );
  };

  return (
    <NativeBaseProvider>
      <Box flex={1} p={4}>
        {cartItems.length === 0 && hasItems ? (
          <Stack flex={1} alignItems="center">
            <Box size="xs">
              <AnimatedLottieView
                source={require('../../../assets/animations/not-found.json')}
                autoPlay
                loop
              />
            </Box>
            <Text
              fontFamily="RedHatDisplaySemiBold"
              fontSize="16"
              color="gray.500"
            >
              Tidak ada item di keranjang.
            </Text>
          </Stack>
        ) : (
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={[{ paddingBottom: 140 }]}
          />
        )}
      </Box>
      {cartItems.length > 0 &&
        hasItems && ( // Conditionally render the CartBox component
          <CartBox
            totalPrice={totalPrice}
            items={cartItems}
            setCartItems={setCartItems}
            session={session}
          />
        )}
    </NativeBaseProvider>
  );
}
