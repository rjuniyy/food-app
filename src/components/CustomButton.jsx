import React, { useState } from 'react';
import { Flex, Button, Stack, Text, useToast, Spinner } from 'native-base';
import AddRound from '../../assets/icons/add-round.svg';
import MinRound from '../../assets/icons/min-round.svg';
import { supabase } from '../services/supabase';

import Delete from '../../assets/icons/delete.svg';

const CART_TOAST_OPTIONS = {
  variant: 'top-accent',
  placement: 'bottom',
};

const deleteCartItem = async (item, toast) => {
  try {
    const { data, error } = await supabase
      .from('cart')
      .delete()
      .eq('id', item.id);

    if (!error) {
      toast.show({
        title: 'Produk terhapus',
        variant: 'top-accent',
        placement: 'top',
        backgroundColor: 'red.600',
      });
      console.log('Deleted');
    } else {
      console.error('Error: ' + error);
    }
  } catch (error) {
    console.error('Error while deleting' + item.id, error);
  }
};

export function ButtonQuantity({
  item,
  onIncrement,
  onDecrement,
  quantity,
  showDeleteButton,
}) {
  const toast = useToast();

  const handleDelete = () => {
    deleteCartItem(item, toast);
  };

  const handleIncrement = () => {
    onIncrement(item);
  };

  const handleDecrement = () => {
    onDecrement(item);
  };

  return (
    <Stack direction="row">
      {showDeleteButton && (
        <Button
          backgroundColor="transparent"
          height="30px"
          width="30px"
          mr="5"
          // onPress={() => deleteCartItem(item.id)}
          onPress={handleDelete}
        >
          <Delete fill="red" />
        </Button>
      )}
      <Button
        backgroundColor="transparent"
        borderWidth="2"
        borderRadius="20"
        borderColor="pink.400"
        onPress={handleDecrement}
        title="decrement"
        height="32px"
        width="32px"
      >
        <MinRound />
      </Button>

      <Text
        height="35px"
        width="30px"
        fontFamily="RedHatDisplaySemiBold"
        textAlign="center"
        p={1}
      >
        {quantity}
      </Text>

      <Button
        backgroundColor="transparent"
        borderWidth={2}
        borderRadius="20"
        borderColor="pink.400"
        onPress={handleIncrement}
        title="increment"
        height="30px"
        width="30px"
      >
        <AddRound />
      </Button>
    </Stack>
  );
}
export const ButtonQuantityMemo = React.memo(ButtonQuantity);

export function BuyButton({ handleOrder }) {
  return (
    <Button bgColor="pink.500" borderRadius="20" onPress={handleOrder}>
      <Text fontSize="14" fontFamily="RedHatDisplayBlack" color="white">
        Order
      </Text>
    </Button>
  );
}

export function AddCartButton({ item, quantity }) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const handleAddCart = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: cartItems, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('menu_item_id', item.id);

      if (error) {
        throw error;
      }

      if (cartItems.length > 0) {
        toast.show({
          ...CART_TOAST_OPTIONS,
          title: 'Produk telah berada dalam keranjang',
          backgroundColor: 'danger.600',
        });
        return;
      }

      const { data, error: insertError } = await supabase.from('cart').insert([
        {
          user_id: user.id, // Replace with the user ID of the current user
          menu_item_id: item.id, // Assuming the item has an 'id' property
          quantity: quantity, // Set the initial quantity to 1 or any desired value
        },
      ]);

      if (insertError) {
        throw insertError;
      } else {
        toast.show({
          title: 'Produk berhasil ditambahkan',
          variant: 'top-accent',
          placement: 'bottom',
          backgroundColor: 'green.600',
        });
      }
      console.log('Cart item added successfully:', data);
    } catch (error) {
      console.error('Error adding cart item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      position="absolute"
      justifyContent="center"
      alignItems="center"
      borderTopLeftRadius="25"
      borderTopRightRadius="25"
      backgroundColor="white"
      bottom="0"
      width="100%"
      height="80px"
    >
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <Button
          width="80%"
          borderRadius="15"
          bg="pink.400"
          justifyContent="center"
          onPress={handleAddCart}
          colorScheme="dark"
        >
          <Text fontFamily="RedHatDisplayBlack" color="white">
            Tambahkan Keranjang
          </Text>
        </Button>
      )}
    </Flex>
  );
}
