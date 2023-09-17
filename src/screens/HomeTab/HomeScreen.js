/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Center,
  FlatList,
  Pressable,
  Image,
  NativeBaseProvider,
  Flex,
  Text,
  Stack,
  Collapse,
  AspectRatio,
} from 'native-base';
import customStyles from '../../styles/customStyles';
import BarSearch from '../../components/BarSearch';
import Kategori from '../../components/Kategori';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import {
  fetchAllMenu,
  fetchDaifuku,
  fetchDrink,
  fetchGorengan,
} from '../../services/api';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const [items, setItems] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
    handleButtonPress();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await fetchAllMenu();
      if (!error) {
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching menu items', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonPress = useCallback(async (category = 'all') => {
    try {
      let fetchedItems = [];

      switch (category) {
        case 'all':
          fetchedItems = await fetchAllMenu();
          break;
        case 'drink':
          fetchedItems = await fetchDrink();
          break;
        case 'daifuku':
          fetchedItems = await fetchDaifuku();
          break;
        case 'gorengan':
          fetchedItems = await fetchGorengan();
          break;
        default:
          throw new Error('Invalid category');
      }

      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching menu items', error.message);
    }
  }, []);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSearchBlur = () => {
    setIsCollapsed(true);
  };

  const renderListItem = ({ item }) => {
    return (
      <Flex p={3} flex={1}>
        <Pressable
          bg="white"
          shadow={5}
          borderRadius="20"
          h="2xs"
          onPress={() =>
            navigation.navigate('Detail', {
              id: item.id,
              name: item.name,
              img: item.image_urls,
              desc: item.description,
              stock: item.stock,
              category: item.category,
              price: item.price,
              discount: item.discount,
              final_price: item.final_price,
              ordercount: item.ordercount,
              avgrating: item.avg_rating,
            })
          }
        >
          <AspectRatio>
            <Image
              source={{ uri: item.image_urls[0] }}
              borderTopRadius="20"
              size="xl"
              width="100%"
              alt="image"
            />
          </AspectRatio>

          {item.discount !== 0 && (
            <Center
              bg="#FFD763"
              _dark={{
                bg: '#FFD763',
              }}
              _text={{
                color: 'red.600',
                fontWeight: '700',
                fontSize: 'xs',
              }}
              position="absolute"
              top="0"
              px="3"
              py="1.5"
              right="0"
              borderLeftRadius="0"
              borderRightRadius="20"
              borderBottomRightRadius="0"
            >
              {item.discount}%
            </Center>
          )}

          <Text
            fontFamily="RedHatDisplaySemiBold"
            fontSize="13"
            position="absolute"
            top="55%"
            left="8%"
            right="8%"
          >
            {item.name}
          </Text>
          <Stack direction="row" position="absolute" bottom="15%" left="8%">
            {item.discount === 0 ? (
              <Text fontFamily="RedHatDisplayBlack" fontSize="14">
                Rp {item.price}
              </Text>
            ) : (
              <>
                <Text fontFamily="RedHatDisplayBlack" fontSize="14">
                  Rp {item.final_price}
                </Text>
                <Text
                  fontFamily="RedHatDisplay"
                  fontSize="11"
                  color="coolGray.400"
                  strikeThrough
                >
                  Rp {item.price}
                </Text>
              </>
            )}
          </Stack>
          {item.ordercount > 0 ? (
            <Stack
              position="absolute"
              bottom="5%"
              left="8%"
              right="8%"
              direction="row"
              alignItems="center"
            >
              <Icon name="star" size={18} color="gold" />
              <Text
                fontFamily="RedHatDisplaySemiBold"
                fontSize="12"
                color="coolGray.400"
              >
                {item.avg_rating} | {item.ordercount} Terjual
              </Text>
            </Stack>
          ) : (
            <></>
          )}
        </Pressable>
      </Flex>
    );
  };

  return (
    <NativeBaseProvider>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <Stack direction="row" safeArea>
        <Box ml="5">
          <Text style={customStyles.textHeading1}>Nyemilicious.</Text>
          <Text style={customStyles.textHeading1}>Great for your life.</Text>
        </Box>
      </Stack>

      <Center>
        <BarSearch
          setItems={setItems}
          onFocus={handleCollapseToggle}
          onBlur={handleSearchBlur}
        />
      </Center>
      <Collapse isOpen={isCollapsed}>
        <Box ml="5">
          <Text style={customStyles.textHeading2}>Kategori</Text>
        </Box>
        <Kategori handleButtonPress={handleButtonPress} />
      </Collapse>
      {loading ? (
        <Center flex={1}>
          <Text>Loading...</Text>
        </Center>
      ) : (
        <FlatList
          data={items}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={[{ paddingBottom: tabBarHeight }]}
        />
      )}
      {/* </TouchableWithoutFeedback> */}
    </NativeBaseProvider>
  );
};

export default HomeScreen;
