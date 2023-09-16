import React from 'react';
import { Collapse, Alert, Text } from 'native-base';
import AnimatedLottieView from 'lottie-react-native';

export function SuccessToast({ showToast }) {
  return (
    <Collapse isOpen={showToast} alignSelf="center">
      <Alert maxW="400" bg="pink.300" rounded="20">
        <AnimatedLottieView
          source={require('../../assets/animations/success.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text fontFamily="RedHatDisplay">Data berhasil diubah.</Text>
      </Alert>
    </Collapse>
  );
}

export function FailedToast({ showToast }) {
  return (
    <Collapse isOpen={showToast} alignSelf="center">
      <Alert maxW="400" bg="pink.300" rounded="20">
        <AnimatedLottieView
          source={require('../../assets/animations/failed.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text fontFamily="RedHatDisplay">Data gagal diubah.</Text>
      </Alert>
    </Collapse>
  );
}
