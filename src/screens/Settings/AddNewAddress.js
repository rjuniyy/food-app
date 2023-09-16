import React, { useState } from 'react';
import {
  Box,
  Input,
  NativeBaseProvider,
  Stack,
  Text,
  FormControl,
  Button,
  Divider,
} from 'native-base';
import { SuccessToast, FailedToast } from '../../components/Toast';
import { addNewAddress } from '../../services/api';
import { useRoute } from '@react-navigation/native';

export default function AddNewAddress({ navigation }) {
  const route = useRoute();
  const { session } = route.params;
  const [address, setAddress] = useState('');
  const [isSuccessToastVisible, setSuccessToastVisible] = useState(false);
  const [isFailedToastVisible, setFailedToastVisible] = useState(false);

  const onSubmit = async () => {
    const isSuccess = await addNewAddress(address, session);
    if (isSuccess) {
      setSuccessToastVisible(true);

      setTimeout(() => {
        setSuccessToastVisible(false);
        navigation.navigate('Profile');
      }, 3000); // Show the toast for 3 seconds
    } else {
      setFailedToastVisible(true);
    }
  };

  return (
    <NativeBaseProvider>
      <Box position="relative" safeArea>
        <Stack space="4">
          <FormControl w="90%" alignSelf="center">
            <FormControl.Label>Alamat</FormControl.Label>

            <Input
              defaultValue={address}
              onChangeText={(value) => setAddress(value)}
            />
            <FormControl.HelperText>
              Contoh: (Nama Jalan, Nomor Rumah, RT/RW, Nama Kelurahan, Nama
              Kecamatan, Palembang, Sumatera Selatan).
            </FormControl.HelperText>

            <Divider mt="2" />
            <FormControl.HelperText>
              Mohon diisi dengan data yang lengkap demi memudahkan kurir dalam
              pengantaran.
            </FormControl.HelperText>
          </FormControl>

          <Button
            width="90%"
            alignSelf="center"
            colorScheme="light"
            bg="pink.400"
            onPress={onSubmit}
          >
            <Text color="white" fontFamily="RedHatDisplayBlack">
              Simpan
            </Text>
          </Button>
        </Stack>
        {isSuccessToastVisible && (
          <SuccessToast showToast={setSuccessToastVisible} />
        )}
        {isFailedToastVisible && (
          <FailedToast showToast={setFailedToastVisible} />
        )}
      </Box>
    </NativeBaseProvider>
  );
}
