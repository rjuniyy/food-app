/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  AddIcon,
  Box,
  Button,
  Center,
  CheckIcon,
  DeleteIcon,
  FlatList,
  FormControl,
  IconButton,
  Image,
  Input,
  NativeBaseProvider,
  Select,
  Text,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { Keyboard, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../src/services/supabase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function AdminEditMenuScreen({ route, navigation }) {
  const { id, name, price, img, desc, stock, category, discount } =
    route.params;

  const [kategoriID, setKategoriID] = useState(category);
  const [imgData, setImgData] = useState([]);
  const [imgDataItem, setImgDataItem] = useState(img);
  const [loading, setLoading] = useState(false);

  const CATEGORY_MAP = {
    1: 'daifuku',
    2: 'minuman',
    3: 'gorengan',
  };

  const handleUpdateMenu = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const { name, price, desc, stock, discount } = values;
      const storagePath = `${CATEGORY_MAP[kategoriID]}/${name.replace(
        /\s+/g,
        '-',
      )}`;

      const uploadedImageUrls = [...imgDataItem]; // Copy existing URLs

      for (const imgDataItem of imgData) {
        // Check if the image data is already a URL (existing image)
        if (imgDataItem.startsWith('http')) {
          uploadedImageUrls.push(imgDataItem);
          continue;
        }

        const imgPath = `${storagePath}/${Math.random()
          .toString(36)
          .substring(7)}.png`;

        const response = await supabase.storage
          .from('menu')
          .upload(imgPath, decode(imgDataItem), {
            contentType: 'image/png',
            cacheControl: '3600',
            upsert: false,
          });

        if (response.error) {
          console.error('Error uploading image:', response.error.message);
          return;
        }

        const imageUrlResponse = await supabase.storage
          .from('menu')
          .getPublicUrl(response.data.path);

        if (imageUrlResponse.error) {
          console.error(
            'Error retrieving public URL:',
            imageUrlResponse.error.message,
          );
          return;
        }

        uploadedImageUrls.push(imageUrlResponse.data.publicUrl);
      }

      const { error } = await supabase
        .from('menu_items')
        .update([
          {
            name,
            price,
            category_id: kategoriID,
            isAvailable: true,
            description: desc,
            stock,
            discount,
            image_urls: uploadedImageUrls,
          },
        ])
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      // Reset the form on successful submission
      resetForm();
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission to access media library denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const { base64 } = result;
        setImgData([...imgData, base64]); // Store selected image data (base64 strings)
      }
    } catch (error) {
      console.log('Error uploading image:', error.message);
    }
  };

  const removePickImage = (indexToRemove) => {
    // Create a copy of imgData without the image at the specified index
    const updatedImgData = imgData.filter(
      (_, index) => index !== indexToRemove,
    );
    setImgData(updatedImgData);

    // Remove the corresponding URL from imgDataItem
    const updatedImgDataItem = imgDataItem.filter(
      (_, index) => index !== indexToRemove,
    );
    setImgDataItem(updatedImgDataItem);

    console.log('Remove berhasil');
  };

  const removeImage = async (indexToRemove) => {
    try {
      // Check if the indexToRemove is valid
      if (indexToRemove < 0 || indexToRemove >= img.length) {
        console.error('Invalid indexToRemove');
        return;
      }

      const imageUrlToDelete = img[indexToRemove]; // Get the URL of the image to delete
      const parts = imageUrlToDelete.split('/');

      // Get the last three parts and join them with '/'
      const path = parts.slice(-3).join('/');

      const { data, error } = await supabase.storage
        .from('menu')
        .remove([path]);

      // Remove the old image URL from the img array
      img.splice(indexToRemove, 1);

      // Construct the new image_urls array
      const updatedImageUrls = img.map((url) => url);

      const { data: menu, error: errMenu } = await supabase
        .from('menu_items')
        .update({
          image_urls: updatedImageUrls,
        })
        .eq('id', id)
        .select();

      if (errMenu) {
        console.error('Error updating menu', errMenu.message);
      } else {
        console.log('Updated menu successfully');
      }

      if (error) {
        console.error('Error deleting image:', error.message);
      } else {
        console.log('Image deleted successfully');
      }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setImgDataItem([...img]);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Judul/Nama Produk Harus diisi.'),
    price: Yup.string().required('Harga produk harus diisi.'),
    stock: Yup.string().required('Stock produk harus diisi.'),
    desc: Yup.string().required('Deskripsi harus diisi.'),
    discount: Yup.string().required('Diskon harus diisi.'),
  });

  return (
    <NativeBaseProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView>
          <Formik
            initialValues={{
              name: name,
              price: price.toString(),
              category: category,
              desc: desc,
              discount: discount.toString(),
              stock: stock.toString(),
            }}
            validationSchema={validationSchema}
            onSubmit={handleUpdateMenu}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <VStack
                  width="90%"
                  mx="3"
                  alignSelf="center"
                  flex={1}
                  paddingBottom="70"
                  safeArea
                >
                  {/* Form Gambar Produk */}
                  <FormControl>
                    <FormControl.Label
                      _text={{ fontFamily: 'RedHatDisplayBlack' }}
                    >
                      Tambah Gambar
                    </FormControl.Label>
                    <IconButton
                      icon={<AddIcon />}
                      onPress={pickImage}
                      colorScheme="pink"
                    />
                    <Box
                      width="90%"
                      alignSelf="center"
                      justifyContent="center"
                      alignItems="center"
                      flexDir="row"
                    >
                      {imgData.map((base64Image, index) => (
                        <Box key={index} p="2">
                          <Image
                            alt="image"
                            source={{
                              uri: `data:image/png;base64,${base64Image}`,
                            }}
                            size={20}
                          />
                          <Button
                            mt="1"
                            onPress={() => removePickImage(index)} // Button to remove an image
                            variant="ghost"
                            colorScheme="danger"
                            size="xs"
                            endIcon={<DeleteIcon />}
                          >
                            Hapus
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </FormControl>
                  <FormControl>
                    <FormControl.Label
                      _text={{ fontFamily: 'RedHatDisplayBlack' }}
                    >
                      Gambar Terpilih
                    </FormControl.Label>
                    <Box
                      width="90%"
                      alignSelf="center"
                      justifyContent="center"
                      alignItems="center"
                      flexDir="row"
                    >
                      {img.map((imageUrl, index) => (
                        <Box key={index} p="2">
                          <Image
                            source={{ uri: imageUrl }}
                            alt={`Image ${index}`}
                            size={20}
                          />
                          <Button
                            mt="1"
                            onPress={() => removeImage(index)} // Button to remove an image
                            variant="ghost"
                            colorScheme="danger"
                            size="xs"
                            endIcon={<DeleteIcon />}
                          >
                            Hapus
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </FormControl>
                  {/* Form Nama Produk  */}
                  <FormControl isInvalid={touched.name && errors.name}>
                    <FormControl.Label
                      _text={{ fontFamily: 'RedHatDisplayBlack' }}
                    >
                      Nama Produk
                    </FormControl.Label>
                    <Input
                      variant="rounded"
                      placeholder="Nama Produk"
                      autoCapitalize="none"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                    />
                    {touched.name && errors.name && (
                      <Center>
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.name}
                        </FormControl.ErrorMessage>
                      </Center>
                    )}
                  </FormControl>
                  {/* Form Harga Produk  */}
                  <FormControl isInvalid={touched.price && errors.price}>
                    <FormControl.Label
                      _text={{ fontFamily: 'RedHatDisplayBlack' }}
                    >
                      Harga
                    </FormControl.Label>
                    <Input
                      variant="rounded"
                      // placeholder="Harga"
                      // keyboardType="numeric"
                      onChangeText={handleChange('price')}
                      onBlur={handleBlur('price')}
                      value={values.price}
                    />
                    {touched.price && errors.price && (
                      <Center>
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.price}
                        </FormControl.ErrorMessage>
                      </Center>
                    )}
                  </FormControl>
                  {/* Form Stok Produk  */}
                  <FormControl isInvalid={touched.stock && errors.stock}>
                    <FormControl.Label
                      _text={{ fontFamily: 'RedHatDisplayBlack' }}
                    >
                      Stok
                    </FormControl.Label>
                    <Input
                      variant="rounded"
                      placeholder="Stok"
                      onChangeText={handleChange('stock')}
                      onBlur={handleBlur('stock')}
                      value={values.stock}
                    />
                    {touched.stock && errors.stock && (
                      <Center>
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.stock}
                        </FormControl.ErrorMessage>
                      </Center>
                    )}
                  </FormControl>
                  {/* Form Kategori Produk  */}
                  <FormControl isInvalid={touched.category && errors.category}>
                    <FormControl.Label
                      _text={{ fontFamily: 'RedHatDisplayBlack' }}
                    >
                      Kategori
                    </FormControl.Label>
                    <Select
                      selectedValue={kategoriID.toString()}
                      minWidth="200"
                      accessibilityLabel="Pilih Kategori"
                      placeholder="Pilih Kategori"
                      _selectedItem={{
                        bg: 'pink.400',
                        endIcon: <CheckIcon size="5" />,
                      }}
                      rounded="25"
                      mt={1}
                      onValueChange={(itemValue) => setKategoriID(itemValue)}
                    >
                      <Select.Item label="Daifuku" value="1" />
                      <Select.Item label="Minuman" value="2" />
                      <Select.Item label="Gorengan" value="3" />
                    </Select>
                  </FormControl>

                  {/* Form Deskripsi Produk */}
                  <FormControl isInvalid={touched.desc && errors.desc}>
                    <FormControl.Label
                      _text={{ fontFamily: 'RedHatDisplayBlack' }}
                    >
                      Deskripsi
                    </FormControl.Label>
                    <Input
                      variant="rounded"
                      placeholder="Deksripsi Produk"
                      autoCapitalize="none"
                      onChangeText={handleChange('desc')}
                      onBlur={handleBlur('desc')}
                      value={values.desc}
                      isInvalid={touched.desc && errors.desc}
                    />
                    {touched.desc && errors.desc && (
                      <Center>
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.desc}
                        </FormControl.ErrorMessage>
                      </Center>
                    )}
                  </FormControl>
                  {/* Form Diskon Produk */}
                  <FormControl isInvalid={touched.discount && errors.discount}>
                    <FormControl.Label
                      _text={{ fontFamily: 'RedHatDisplayBlack' }}
                    >
                      Diskon
                    </FormControl.Label>
                    <Input
                      variant="rounded"
                      placeholder="Diskon(contoh: 0)"
                      autoCapitalize="none"
                      onChangeText={handleChange('discount')}
                      onBlur={handleBlur('discount')}
                      value={values.discount}
                      isInvalid={touched.discount && errors.discount}
                    />
                    {touched.discount && errors.discount && (
                      <Center>
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.discount}
                        </FormControl.ErrorMessage>
                      </Center>
                    )}
                  </FormControl>
                  {/* Button Submit */}
                  <Button
                    borderRadius="xl"
                    block
                    mt="3"
                    colorScheme="cyan"
                    onPress={handleSubmit}
                  >
                    Simpan Perubahan
                  </Button>
                </VStack>
              </>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </NativeBaseProvider>
  );
}
