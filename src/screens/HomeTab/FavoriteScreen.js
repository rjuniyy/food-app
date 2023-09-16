import React from 'react';
import {
  FlatList,
  NativeBaseProvider,
  Center,
  Box,
  Image,
  Heading,
  Stack,
  Flex,
  Text,
  Pressable,
} from 'native-base';
import { supabase } from '../../services/supabase';
import { useRoute } from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import { fetchFavorites } from '../../services/api';
import { useIsFocused } from '@react-navigation/native';

export default function FavoriteScreen({ navigation }) {
  const [favorites, setFavorites] = React.useState([]);
  const route = useRoute();
  const { session } = route.params;
  const isFocused = useIsFocused();

  React.useEffect(() => {
    // Fetch initial favorites on component mount
    fetchFavorites({ setFavorites, session });

    const favoritesSubscription = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'favorites' },
        (payload) => {
          fetchFavorites({ setFavorites, session });
        },
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      favoritesSubscription.unsubscribe();
    };
  }, [isFocused]);

  const renderFavoriteItem = ({ item }) => (
    <Flex flex={1} p={3}>
      <Pressable
        shadow={5}
        bgColor="white"
        height="200"
        rounded="lg"
        onPress={() =>
          navigation.navigate('Detail', {
            id: item.menu_items.id,
            name: item.menu_items.name,
            img: item.menu_items.image_urls,
            desc: item.menu_items.description,
            stock: item.menu_items.stock,
            category: item.menu_items.category,
            price: item.menu_items.price,
          })
        }
      >
        <Box>
          <Image
            source={{ uri: item.menu_items.image_urls[0] }}
            borderTopRadius="lg"
            size="xl"
            width="100%"
            alt="image"
          />

          <Center
            bg="pink.400"
            position="absolute"
            bottom="0"
            px="3"
            py="1.5"
            borderTopRightRadius={5}
            fontFamily="RedHatDisplay"
          >
            {<Text fontFamily="RedHatDisplay">Rp{item.menu_items.price}</Text>}
          </Center>
        </Box>
        <Box p="3">
          <Heading fontSize="md" fontFamily="RedHatDisplay" size="md" ml="-1">
            {item.menu_items.name}
          </Heading>
        </Box>
      </Pressable>
    </Flex>
  );

  return (
    <NativeBaseProvider>
      {favorites.length === 0 ? (
        <Stack flex={1} alignItems="center">
          <Box size="xs">
            <AnimatedLottieView
              source={require('../../../assets/animations/heart.json')}
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
          numColumns={2}
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </NativeBaseProvider>
  );
}
