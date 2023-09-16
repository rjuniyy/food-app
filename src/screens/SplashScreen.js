import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import {
  Text,
  Button,
  Center,
  NativeBaseProvider,
  VStack,
  AspectRatio,
  Image,
} from 'native-base';
// import logo from '../../assets/images/splash.png';

const SplashScreen = ({ navigation }) => {
  // const [authLoaded, setAuthLoaded] = useState(false);
  // const [animationLoaded, setAnimationLoaded] = useState(false);

  // const ref = useRef(null);

  return (
    <NativeBaseProvider>
      <Center flex={1} w="100%" alignSelf="center" bgColor="pink.400">
        <VStack space={3} mt="5" w="90%">
          {/* <LottieView
            ref={(animation) => {
              ref.current = animation;
            }}
            style={styles.lottieView}
            source={require('../../assets/splash.json')}
            autoPlay
            loop={true}
          /> */}
          <Center>
            <Image
              source={require('../../assets/images/splash.png')}
              alt="image"
              size="2xl"
            />
          </Center>

          <Button
            bgColor="pink.300"
            onPress={() => navigation.navigate('Signin')}
            mt="3"
            borderRadius="20"
          >
            Masuk
          </Button>
          <Button
            bgColor="pink.400"
            borderWidth="1"
            borderColor="pink.200"
            onPress={() => navigation.navigate('Signup')}
            mt="3"
            borderRadius="20"
          >
            Daftar
          </Button>
        </VStack>
      </Center>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieView: {
    width: '100%',
  },
});

export default SplashScreen;
