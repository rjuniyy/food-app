import React, { useState } from 'react';
import {
  AddIcon,
  Box,
  Button,
  Center,
  CheckIcon,
  DeleteIcon,
  FormControl,
  IconButton,
  Image,
  Input,
  NativeBaseProvider,
  Select,
  Spinner,
  Text,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { Keyboard, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../../src/services/supabase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function AdminAddMenuScreen() {
  const [kategoriID, setKategoriID] = useState('');
  const [imgData, setImgData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let kategoriData = '';

  if (kategoriID === '1') {
    kategoriData = 'daifuku';
  } else if (kategoriID === '2') {
    kategoriData = 'minuman';
  } else if (kategoriID === '3') {
    kategoriData = 'gorengan';
  }
  const handleAddMenu = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      const { name, price, desc, stock, discount } = values;
      const storagePath = `${kategoriData}/${name.replace(/\s+/g, '-')}`;
      const uploadedImageUrls = [];

      for (const imgDataItem of imgData) {
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
        .insert([
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
        .select();

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setImgData([]);
      setKategoriID('');
      resetForm();
      setIsLoading(false);
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

  const removeImage = (indexToRemove) => {
    // Create a copy of imgData without the image at the specified index
    const updatedImgData = imgData.filter(
      (_, index) => index !== indexToRemove,
    );
    setImgData(updatedImgData);
    console.log('Remove berhasil');
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
              name: '',
              price: '',
              category: '',
              desc: '',
              discount: '',
              stock: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddMenu}
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
                            mt="2"
                            onPress={() => removeImage(index)} // Button to remove an image
                            variant="unstyled"
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
                      placeholder="Harga"
                      keyboardType="numeric"
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
                      keyboardType="numeric"
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
                      selectedValue={kategoriID}
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
                    {touched.category && errors.category && (
                      <Text style={styles.error}>{errors.category}</Text>
                    )}
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
                    colorScheme="pink"
                    onPress={handleSubmit}
                  >
                    {isLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <Text fontFamily="RedHatDisplayBlack" color="white">
                        Tambah Menu
                      </Text>
                    )}
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

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
});
