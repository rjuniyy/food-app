/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
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
import StarRating from '../../components/StarRating';
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
  const [reviewData, setReviewData] = useState([]);
  const [rating, setRating] = useState(0);
  const [ratingText, setRatingText] = useState('');

  // eslint-disable-next-line react/prop-types
  const { menu_items, orders } = items.item;
  const { name, image_urls } = menu_items;

  useEffect(() => {
    if (items.item.review_id !== null) {
      fetchReview();
    }
  }, []);

  const handleRate = (newRating) => {
    setRating(newRating);
  };

  const fetchReview = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', items.item.review_id);
      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      } else if (data.length > 0) {
        // If review data exists, update the rating state and rating text state
        setRating(data[0].rating);
        setRatingText(data[0].review_text); // Update ratingText state
      }
      setReviewData(data);
    } catch (error) {
      console.error('Error fetching review:', error);
      return;
    }
  };

  const updateReview = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          review_text: ratingText,
          rating: rating,
        })
        .eq('id', reviewData[0].id);

      if (error) {
        console.error('Error updating reviews:', error);
        return;
      }
    } catch (error) {
      console.error('Error updating review', error);
      return;
    }
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

      const { data: orderItems, error: orderitemsError } = await supabase
        .from('orderitems')
        .update({ review_id: reviewId })
        .eq('id', items.item.id)
        .select();

      if (orderitemsError) {
        console.error('Update orderitems failed', orderitemsError);
      }
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
          <Stack direction="row" ml="2">
            <Image
              source={{ uri: image_urls[0] }}
              alt="image"
              size="sm"
              resizeMode="contain"
            />
            <Text fontFamily="RedHatDisplaySemiBold" alignSelf="center" ml="2">
              {name}
            </Text>
          </Stack>
          <Divider my="2" />
          <Box alignItems="center">
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
            <Button
              my="2"
              colorScheme="pink"
              onPress={reviewData.length > 0 ? updateReview : addNewReview}
            >
              <Text fontFamily="RedHatDisplaySemiBold" color="white">
                {reviewData.length > 0 ? 'Update Penilaian' : 'Kirim Penilaian'}
              </Text>
            </Button>
          </Box>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </NativeBaseProvider>
  );
}
