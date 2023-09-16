import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator();

const ScreenNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Details"
        options={{ animationEnabled: false, header: () => null }}
        component={DetailScreen}
      />
    </Stack.Navigator>
  );
};

export default ScreenNavigator;
