import React from 'react';
import {
  AspectRatio,
  Image,
  View,
  Text,
  HStack,
  Flex,
  ScrollView,
} from 'native-base';

export const imageItem = ({ item }) => {
  return (
    <AspectRatio>
      <Image source={{ uri: item.image }} alt="image" resizeMode="contain" />
    </AspectRatio>
  );
};

export const detailItem = ({ item }) => {
  <View>
    <Text fontFamily="RedHatDisplaySemiBold" fontSize="18" padding="2">
      {item.name}
    </Text>
    <HStack space="3" alignItems="center" position="relative">
      <Flex direction="row" width="60%" padding="2">
        <Text fontFamily="RedHatDisplayBlack" fontSize="20" color="pink.600">
          <Text fontSize="14" fontFamily="RedHatDisplaySemiBold">
            Rp
          </Text>
          {item.price}
        </Text>
      </Flex>
    </HStack>
    <ScrollView
      marginBottom="80px"
      showsVerticalScrollIndicator={false}
      marginTop="3"
    >
      <Text fontFamily="RedHatDisplay" fontSize="14" padding="3">
        {item.description}
      </Text>
    </ScrollView>
  </View>;
};
