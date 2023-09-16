import React from 'react';
import {
  AspectRatio,
  Image,
  Flatlist,
  Flex,
  HStack,
  Text,
  View,
  ScrollView,
} from 'native-base';

export function DetailImgFlatlist({ data }) {
  const renderItem = ({ item }) => {
    return (
      <AspectRatio>
        <Image source={{ uri: item.image }} alt="image" resizeMode="contain" />
      </AspectRatio>
    );
  };
  return (
    <Flatlist
      renderItem={renderItem}
      data={data}
      keyExtractor={(item) => item.id}
      horizontal
    />
  );
}

export const DetailDataFlatlist = ({ data }) => {
  const renderItem = ({ item }) => {
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
  return (
    <Flatlist
      renderItem={renderItem}
      data={data}
      keyExtractor={(item) => item.id}
    />
  );
};
