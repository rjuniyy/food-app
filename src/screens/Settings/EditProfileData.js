import React, { useState, useCallback } from 'react';
import {
  Text,
  NativeBaseProvider,
  Input,
  Button,
  Stack,
  FormControl,
  Box,
  Divider,
  Switch,
  Spacer,
} from 'native-base';
import { useRoute } from '@react-navigation/native';
import { SuccessToast, FailedToast } from '../../components/Toast';
import { updateAddress, updateProfile } from '../../services/api';

export default function EditProfileData({ navigation }) {
  const route = useRoute();
  const { item, label, session } = route.params;
  const [value, setValue] = useState(item.value);
  const [successToast, setSuccessToast] = useState(false);
  const [failedToast, setFailedToast] = useState(false);
  const [isPrimary, setIsPrimary] = useState(item.isPrimary);

  const handlePress = async () => {
    try {
      let addressId;
      if (label === 'Address') {
        addressId = item.id;
        await updateAddress(value, addressId, isPrimary);
        navigation.navigate('Address');
      } else {
        const { profileData, userUpdateData } = await updateProfile(
          label,
          value,
          session,
          addressId, // Pass the addressId only when the label is 'Address'
        );
        if (profileData && userUpdateData) {
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
      console.error('Error updating profile', error);
      return;
    }
  };

  const onToggle = async () => {
    console.log('Before toggle:', isPrimary);
    const updatedIsPrimary = !isPrimary; // Toggle the state
    setIsPrimary(updatedIsPrimary); // Update the state
  };

  // const onToggle = async () => {
  //   console.log('Before toggle:', isPrimary);
  //   setIsPrimary(!isPrimary); // Toggle the state
  //   try {
  //     // Call updateAddress only when the label is 'Address'
  //     if (label === 'Address') {
  //       await updateAddress(value, item.id, isPrimary);
  //     }
  //   } catch (error) {
  //     console.error('Error updating primary address', error);
  //   }
  // };

  const renderComponent = () => {
    return (
      <Box position="relative" safeArea>
        <Stack space="4">
          <FormControl w="90%" alignSelf="center">
            <FormControl.Label>{label}</FormControl.Label>
            {label !== 'Address' && (
              <>
                <Input
                  defaultValue={item.value}
                  onChangeText={(text) => setValue(text)}
                  keyboardType={
                    label === 'No. Handphone' ? 'numeric' : 'default'
                  }
                />
                <FormControl.HelperText>
                  {getHelperText(label)}
                </FormControl.HelperText>
              </>
            )}

            {label === 'Address' && (
              <>
                <Input
                  defaultValue={item.address}
                  onChangeText={(text) => setValue(text)}
                />
                <Stack direction="row" alignItems="center">
                  <Text fontSize="14" color="pink.600">
                    Jadikan Sebagai Alamat Utama
                  </Text>
                  <Spacer />
                  <Switch
                    size="md"
                    colorScheme="pink"
                    onToggle={() => onToggle()}
                    isChecked={isPrimary}
                  />
                </Stack>

                <FormControl.HelperText>
                  {getHelperText(label)}
                </FormControl.HelperText>
                <Divider mt={2} />
                <FormControl.HelperText>
                  Mohon diisi dengan data yang lengkap demi memudahkan kurir
                  dalam pengantaran.
                </FormControl.HelperText>
              </>
            )}
          </FormControl>

          <Button
            width="90%"
            alignSelf="center"
            colorScheme="light"
            bg="pink.400"
            onPress={handlePress}
          >
            <Text color="white" fontFamily="RedHatDisplayBlack">
              Simpan
            </Text>
          </Button>
        </Stack>
        {successToast && <SuccessToast showToast={successToast} />}
        {failedToast && <FailedToast showToast={failedToast} />}
      </Box>
    );
  };

  const getHelperText = (label) => {
    switch (label) {
      case 'Nama Lengkap':
        return 'Isi nama lengkap anda untuk memudahkan verifikasi.';
      case 'No. Handphone':
        return 'Isi Nomor Handphone anda yang aktif untuk memudahkan pengantaran.';
      case 'Email':
        return 'Ubah alamat email anda.';
      case 'Address':
        return 'Contoh: (Nama Jalan, Nomor Rumah, RT/RW, Nama Kelurahan, Nama Kecamatan, Palembang, Sumatera Selatan).';
      default:
        return '';
    }
  };

  return <NativeBaseProvider>{renderComponent()}</NativeBaseProvider>;
}
