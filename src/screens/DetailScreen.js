/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import {
  NativeBaseProvider,
  Image,
  Text,
  Flex,
  View,
  Center,
  Divider,
  ScrollView,
  Box,
  Stack,
  Spacer,
  Alert,
  Collapse,
} from 'native-base';
import { Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { AddCartButton, ButtonQuantity } from '../components/CustomButton';
import Favorite from '../../assets/icons/favoritebtn.svg';
import { supabase } from '../services/supabase';
import AnimatedLottieView from 'lottie-react-native';

export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const DetailScreen = ({ route }) => {
  const [detailItem, setDetailItem] = useState(route.params);
  const [quantity, setQuantity] = useState(1);

  const { session } = route.params;
  const [showAddFavorite, setShowAddFavorite] = React.useState(false);
  const [showRemoveFavorite, setShowRemoveFavorite] = React.useState(false);
  const [existingFavorites, setExistingFavorites] = React.useState([]);

  const data = detailItem.img.map((imageUrl) => ({ img: imageUrl }));

  const isCarousel = React.useRef(null);

  const ALERT_TIMEOUT = 3000;

  React.useEffect(() => {
    // Check if the favorite data exists
    const checkExistingFavorites = async () => {
      try {
        const { data: existingFavorites, error: existingFavoritesError } =
          await supabase
            .from('favorites')
            .select()
            .eq('menu_item_id', detailItem.id)
            .eq('user_id', session.user.id);

        setExistingFavorites(existingFavorites);
      } catch (error) {
        console.error('error checking existing favorites', error);
      }
    };

    checkExistingFavorites();
  }, [detailItem.id, session.user.id, showAddFavorite, showRemoveFavorite]);

  const handleAddFavorite = async () => {
    try {
      // Add the favorite data
      const { data: addedFavorites, error: addedFavoritesError } =
        await supabase
          .from('favorites')
          .insert([{ menu_item_id: detailItem.id, user_id: session.user.id }])
          .select();

      if (addedFavorites.length > 0) {
        // Show the success alert
        setShowAddFavorite(true);
        setTimeout(() => {
          setShowAddFavorite(false);
        }, ALERT_TIMEOUT); // Use a named constant instead of a magic number
      }
    } catch (error) {
      console.error('Error inserting favorite', error);
      // Handle the error gracefully, e.g., show an error message to the user
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('menu_item_id', detailItem.id);

      if (!error) {
        // Remove the favorite from existingFavorites state
        setExistingFavorites([]);
        setShowRemoveFavorite(true);
        setTimeout(() => {
          setShowRemoveFavorite(false);
        }, ALERT_TIMEOUT); // Use a named constant instead of a magic number
      }
    } catch (error) {
      console.error('Error deleting favorite', error);
      // Handle the error gracefully, e.g., show an error message to the user
    }
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const renderItem = ({ item }) => {
    return (
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
  };

  return (
    <NativeBaseProvider>
      <Flex safeArea flex={1}>
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
              {detailItem.name}
            </Text>
            <Text fontFamily="RedHatDisplay" fontSize="18" color="pink.600">
              Rp. {detailItem.final_price}
              {detailItem.discount !== 0 && (
                <Text fontSize="14" color="coolGray.400" strikeThrough>
                  Rp. {detailItem.price}
                </Text>
              )}
            </Text>
          </Stack>
          <Spacer />

          <Box justifyContent="center">
            {existingFavorites.length > 0 ? (
              <TouchableOpacity onPress={handleRemoveFavorite}>
                <Favorite fill="pink" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleAddFavorite}>
                <Favorite />
              </TouchableOpacity>
            )}
          </Box>
        </Stack>
        <Box alignItems="flex-end" marginRight="2">
          <ButtonQuantity
            item={route.params}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            quantity={quantity}
          />
        </Box>

        <Divider />

        <ScrollView padding="3">
          <Text fontSize="14" fontFamily="RedHatDisplay">
            {detailItem.desc}
          </Text>
        </ScrollView>
        <AddCartButton
          item={detailItem}
          quantity={quantity}
          showDeleteButton={false}
        />
      </Flex>
      <Center position="absolute" top="200" alignSelf="center">
        {showAddFavorite && (
          <Collapse isOpen={showAddFavorite}>
            <Alert maxW="400" bg="pink.50" rounded="20">
              <AnimatedLottieView
                source={require('../../assets/animations/favorite.json')}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
              <Text fontFamily="RedHatDisplay">Ditambahkan ke favorite.</Text>
            </Alert>
          </Collapse>
        )}
        {showRemoveFavorite && (
          <Collapse isOpen={showRemoveFavorite}>
            <Alert
              maxW="400"
              rounded="20"
              status="error"
              justifyContent="center"
            >
              <Text fontFamily="RedHatDisplay">
                Produk telah dihapus dari favorite.
              </Text>
            </Alert>
          </Collapse>
        )}
      </Center>
    </NativeBaseProvider>
  );
};

export default DetailScreen;
