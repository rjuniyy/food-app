/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Image,
  KeyboardAvoidingView,
  NativeBaseProvider,
  Stack,
  Text,
  TextArea,
} from 'native-base';
import StarRating from '../../components/StartRating';
import {
  Dimensions,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { supabase } from '../../services/supabase';

export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

export default function ReviewScreen({ route, navigation }) {
  const { items, session } = route.params;
  const [rating, setRating] = useState(0);
  const [ratingText, setRatingText] = useState('');

  // eslint-disable-next-line react/prop-types
  const { menu_items, orders } = items[0];

  const { name, image_urls, id } = menu_items;

  const handleRate = (newRating) => {
    setRating(newRating);
  };

  const addNewReview = async () => {
    try {
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert([
          {
            user_id: session.user.id,
            menu_item_id: menu_items.id,
            rating: rating,
            review_text: ratingText,
          },
        ])
        .select();

      if (reviewError) throw reviewError;

      const reviewId = reviewData[0].id; // Assuming the ID field is named 'id'

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .update([
          {
            review_id: reviewId,
          },
        ])
        .eq('id', orders.id)
        .select();

      if (ordersError) throw ordersError;
    } catch (error) {
      console.error('Error inserting data', error);
      return;
    } finally {
      navigation.navigate('Order', {
        screen: 'Completed',
      });
    }
  };

  return (
    <NativeBaseProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          flex={1}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          mt="2"
        >
          <Stack direction="row">
            <Image
              source={{ uri: image_urls[0] }}
              alt="image"
              size="sm"
              resizeMode="contain"
            />
            <Text fontFamily="RedHatDisplaySemiBold">{name}</Text>
          </Stack>
          <Divider my="2" />
          <Box alignItems="center">
            {/* <Text fontFamily="RedHatDisplaySemiBold">Beri ulasan menu ini</Text> */}
            <StarRating rating={rating} maxStars={5} onRate={handleRate} />
            <Text fontFamily="RedHatDisplaySemiBold">
              Anda memberi bintang{' '}
              <Text fontFamily="RedHatDisplayBlack">{rating}</Text>
            </Text>
            <TextArea
              value={ratingText}
              onChangeText={(text) => setRatingText(text)} // for android and ios
              w="100%"
              maxW="300"
              placeholder="Beri penilaian anda disini....."
            />
            <Button my="2" colorScheme="pink" onPress={addNewReview}>
              <Text fontFamily="RedHatDisplaySemiBold" color="white">
                Kirim Penilaian
              </Text>
            </Button>
          </Box>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </NativeBaseProvider>
  );
}
