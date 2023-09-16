/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  Image,
  Input,
  KeyboardAvoidingView,
  NativeBaseProvider,
  ScrollView,
  Stack,
  Text,
  VStack,
  View,
} from 'native-base';
import StarRating from '../../components/StartRating';
import { Carousel } from 'react-native-snap-carousel';
import {
  Dimensions,
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { StyleSheet } from 'react-native';

export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

export default function ReviewScreen({ route, navigation }) {
  const { items } = route.params;
  const [rating, setRating] = useState(0);

  // eslint-disable-next-line react/prop-types
  const { menu_items, quantity } = items[0];

  const {
    name,
    final_price,
    price,
    discount,
    description: desc, // Rename 'description' to 'desc'
    image_urls,
  } = menu_items;

  const data = image_urls.map((imageUrl) => ({ img: imageUrl }));

  const isCarousel = React.useRef(null);

  const handleRate = (newRating) => {
    setRating(newRating);
  };

  const renderItem = ({ item }) => (
    <View>
      <Image
        source={{ uri: item.img }}
        alt="image"
        height="100%"
        width="100%"
        resizeMode="contain"
      />
    </View>
  );

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        h={{
          base: 'auto',
          lg: 'auto',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Center height="xs">
          <Carousel
            layout="default"
            data={data}
            ref={isCarousel}
            renderItem={renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            useScrollView={true}
          />
        </Center>
        <Divider mt="5" />
        <Stack direction="row" padding="3">
          <Stack>
            <Text fontFamily="RedHatDisplaySemiBold" fontSize="20">
              {name}
            </Text>
            <Text fontFamily="RedHatDisplay" fontSize="18" color="pink.600">
              Rp. {final_price}
              {discount !== 0 && (
                <Text fontSize="14" color="coolGray.400" strikeThrough>
                  Rp. {price}
                </Text>
              )}
            </Text>
          </Stack>
        </Stack>
        <Divider />
        <ScrollView padding="3">
          <Text fontSize="14" fontFamily="RedHatDisplay">
            {desc}
          </Text>
        </ScrollView>
        <Box alignItems="center">
          <Text fontFamily="RedHatDisplaySemiBold">Beri ulasan menu ini</Text>
          <StarRating rating={rating} maxStars={5} onRate={handleRate} />
          <Text fontFamily="RedHatDisplaySemiBold">
            Anda memberi bintang {rating}
          </Text>
          <Input />
        </Box>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}
