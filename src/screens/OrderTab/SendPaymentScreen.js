import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  AddIcon,
  Box,
  Button,
  Center,
  CheckIcon,
  DeleteIcon,
  FormControl,
  HStack,
  IconButton,
  Image,
  NativeBaseProvider,
  Slide,
  Spinner,
  Text,
} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../../src/services/supabase';
import { decode } from 'base64-arraybuffer';
import { SuccessToast, FailedToast } from '../../components/Toast';

const STORAGE_FOLDER = 'payments';
const CONTENT_TYPE = 'image/png';
const CACHE_CONTROL = '3600';

export default function SendPaymentScreen({ navigation }) {
  const [imgData, setImgData] = useState([]);
  const route = useRoute();
  const { item, session } = route.params;
  const paymentUrls = item[0]?.orders?.payment_urls || [];
  const [imgDataItem, setImgDataItem] = useState(paymentUrls);
  console.log(imgDataItem);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [failedToast, setFailedToast] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      const storagePath = `${session.user.id}`;
      const folderName = item[0].orders.id.toString();
      const uploadedImageUrls = [...paymentUrls];

      for (const imgDataItem of imgData) {
        if (imgDataItem.startsWith('http')) {
          uploadedImageUrls.push(imgDataItem);
          continue;
        }

        const imgPath = `${storagePath}/${folderName}.png`;

        const response = await supabase.storage
          .from(STORAGE_FOLDER)
          .upload(imgPath, decode(imgDataItem), {
            contentType: CONTENT_TYPE,
            cacheControl: CACHE_CONTROL,
            upsert: false,
          });

        if (response.error) {
          setIsUploading(false);
          console.error('Error uploading image:', response.error.message);
          // Provide feedback to the user that an error occurred during upload
          return;
        }

        const { data: createSignedUrl, error: errSignedUrl } =
          await supabase.storage
            .from('payments')
            .createSignedUrl(`${session.user.id}/${folderName}.png`, 604800);

        uploadedImageUrls.push(createSignedUrl.signedUrl);

        const { data, error } = await supabase
          .from('orders')
          .update({ payment_urls: uploadedImageUrls })
          .eq('id', item[0].orders.id)
          .select();

        if (error) {
          console.error('Error insert payment receipt', error);
          // Provide feedback to the user that an error occurred during the update
        }

        setIsUploading(false); // Stop uploading
        setImgData([]); // Clear selected images
        if (data && createSignedUrl) {
          setSuccessToast(true);
          setTimeout(() => {
            setSuccessToast(false);
          }, 4000);
        } else {
          setFailedToast(true);
          setTimeout(() => {
            setFailedToast(false);
          }, 4000);
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.error('Error uploading images:', error);
      // Provide feedback to the user that an error occurred
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

    // Create a copy of imgDataItem without the image at the specified index
    const updatedImgDataItem = imgDataItem.filter(
      (_, index) => index !== indexToRemove,
    );
    setImgDataItem(updatedImgDataItem);

    console.log('Remove berhasil');
  };

  const removeImage = async (indexToRemove) => {
    try {
      if (indexToRemove < 0 || indexToRemove >= paymentUrls.length) {
        console.error('Invalid indexToRemove');
        return;
      }

      const imageUrlToDelete = paymentUrls[indexToRemove];
      const parts = imageUrlToDelete.split('/payments/');
      const path = parts[1].split('?')[0];

      // Remove the image URL from the paymentUrls array
      const updatedPaymentUrls = [...paymentUrls];
      updatedPaymentUrls.splice(indexToRemove, 1);

      // Delete the image from storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from(STORAGE_FOLDER)
        .remove([path]);

      if (storageError) {
        console.error('Error deleting image:', storageError.message);
        return;
      }

      // Update the order with null payment_urls
      const { data: ordersData, error: errorOrders } = await supabase
        .from('orders')
        .update({ payment_urls: null })
        .eq('id', item[0].orders.id)
        .select();

      if (errorOrders) {
        console.error('Error updating order', errorOrders.message);
        return;
      }

      setIsUploading(false);
      setImgDataItem(null);
      if (storageData && ordersData) {
        setSuccessToast(true);
        setTimeout(() => {
          setSuccessToast(false);
        }, 4000);
      } else {
        setFailedToast(true);
        setTimeout(() => {
          setFailedToast(false);
        }, 4000);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <NativeBaseProvider>
      <Box safeArea>
        <Center>
          {/* Form Gambar Produk */}
          <FormControl>
            <FormControl.Label
              _text={{ fontFamily: 'RedHatDisplayBlack' }}
              alignSelf="center"
            >
              Tambah Gambar
            </FormControl.Label>
            <IconButton
              icon={<AddIcon />}
              onPress={pickImage}
              colorScheme="pink"
              isDisabled={isUploading} // Disable when uploading
            />
            <Box
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
                    onPress={() => removePickImage(index)} // Button to remove an image
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
          <FormControl>
            <FormControl.Label
              _text={{ fontFamily: 'RedHatDisplayBlack' }}
              alignSelf="center"
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
              {paymentUrls.map((paymentUrl, index) => (
                <Box key={index} p="2">
                  <Image
                    source={{
                      uri: paymentUrl || null,
                    }}
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
          {/* Button Submit */}
          <Button
            width="90%"
            borderRadius="xl"
            block
            mt="3"
            colorScheme="pink"
            onPress={handleSubmit}
            disabled={imgData.length === 0 || isUploading} // Disable during upload
          >
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <Text fontFamily="RedHatDisplayBlack" color="white">
                Kirim Bukti Pembayaran
              </Text>
            )}
          </Button>
          {successToast && <SuccessToast showToast={successToast} />}
          {failedToast && <FailedToast showToast={failedToast} />}
        </Center>
      </Box>
    </NativeBaseProvider>
  );
}
