import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { NativeBaseProvider, Box, Center } from 'native-base';
import UserList from '../UserList';

const AdminChatScreen = ({ navigation }) => {
  const route = useRoute();
  const { session } = route.params;

  return (
    <NativeBaseProvider>
      <UserList navigation={navigation} />
      <Box paddingBottom={70} />
    </NativeBaseProvider>
  );
};

export default AdminChatScreen;
