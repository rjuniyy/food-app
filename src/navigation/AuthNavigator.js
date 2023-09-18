import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SigninScreen from '../screens/SigninScreen';
import SplashScreen from '../screens/SplashScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        options={{ animationEnabled: false, header: () => null }}
        component={SplashScreen}
      />
      <Stack.Screen
        name="Signin"
        options={{ animationEnabled: true, header: () => null }}
        component={SigninScreen}
      />
      <Stack.Screen
        name="Signup"
        options={{ animationEnabled: true, header: () => null }}
        component={SignupScreen}
      />
      <Stack.Screen
        name="ForgotPassword"
        options={{ animationEnabled: true, header: () => null }}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
