/* eslint-disable react/prop-types */
import React, { useState } from 'react';
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
  Button,
  useDisclose,
  Actionsheet,
  Icon,
  AlertDialog,
} from 'native-base';
import { Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { supabase } from '../../src/services/supabase';
import AnimatedLottieView from 'lottie-react-native';
import { Path } from 'react-native-svg';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const AdminDetailScreen = ({ route, navigation }) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const onCloseAlert = () => setIsOpenAlert(false);

  const cancelRef = React.useRef(null);
  const {
    id,
    name,
    price,
    img,
    desc,
    stock,
    category,
    session,
    discount,
    final_price,
  } = route.params;

  const data = img.map((imageUrl) => ({ img: imageUrl }));

  const isCarousel = React.useRef(null);

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) {
        console.error('Error Delete', error);
      }
      navigation.navigate('AdminHome');
    } catch (error) {
      console.error('Error Handle Delete', error);
      return;
    }
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
          <Spacer />
        </Stack>
        <Divider />
        <ScrollView padding="3">
          <Text fontSize="14" fontFamily="RedHatDisplay">
            {desc}
          </Text>
        </ScrollView>

        <Center
          bgColor="white"
          roundedTop={40}
          position="absolute"
          bottom={0}
          width="100%"
          alignSelf="center"
          size="lg"
          shadow="3"
        >
          <Button
            width="60%"
            colorScheme="red"
            rounded="20"
            height="60%"
            onPress={onOpen}
          >
            <Text fontFamily="RedHatDisplayBlack" color="white">
              Ubah Menu
            </Text>
          </Button>

          <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
            <Actionsheet.Content>
              <Actionsheet.Item
                startIcon={
                  <Icon
                    as={MaterialIcons}
                    name="edit"
                    size="6"
                    color="cyan.600"
                  />
                }
                onPress={() =>
                  navigation.navigate('AdminEditMenu', {
                    id,
                    name,
                    price,
                    img,
                    desc,
                    stock,
                    category,
                    session,
                    discount,
                    final_price,
                  })
                }
              >
                <Text fontFamily="RedHatDisplayBlack" color="cyan.600">
                  UBAH DATA MENU
                </Text>
              </Actionsheet.Item>
              <Actionsheet.Item
                startIcon={
                  <Icon
                    as={MaterialIcons}
                    size="6"
                    name="delete"
                    color="red.600"
                  />
                }
                onPress={() => setIsOpenAlert(!isOpenAlert)}
              >
                <Text fontFamily="RedHatDisplayBlack" color="red.600">
                  HAPUS MENU
                </Text>
              </Actionsheet.Item>

              <Actionsheet.Item
                startIcon={
                  <Icon viewBox="0 0 24 24" size="6" fill="none">
                    <Path d="M12.0007 10.5862L16.9507 5.63623L18.3647 7.05023L13.4147 12.0002L18.3647 16.9502L16.9507 18.3642L12.0007 13.4142L7.05072 18.3642L5.63672 16.9502L10.5867 12.0002L5.63672 7.05023L7.05072 5.63623L12.0007 10.5862Z" />
                  </Icon>
                }
                onPress={onClose}
              >
                <Text fontFamily="RedHatDisplayBlack">CANCEL</Text>
              </Actionsheet.Item>
            </Actionsheet.Content>
          </Actionsheet>
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isOpenAlert}
            onClose={onCloseAlert}
          >
            <AlertDialog.Content>
              <AlertDialog.CloseButton />
              <AlertDialog.Header>Yakin Menghapus Menu Ini?</AlertDialog.Header>
              <AlertDialog.Body>
                Ini akan menghapus semua data menu yang telah anda pilih.
                Menekan tombol hapus dapat menghapus data dan tidak dapat
                dipulihkan.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="unstyled"
                    colorScheme="coolGray"
                    onPress={onCloseAlert}
                    ref={cancelRef}
                  >
                    Tidak Jadi
                  </Button>
                  <Button colorScheme="danger" onPress={handleDelete}>
                    Ya, Hapus
                  </Button>
                </Button.Group>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
        </Center>
      </Flex>
    </NativeBaseProvider>
  );
};

export default AdminDetailScreen;
