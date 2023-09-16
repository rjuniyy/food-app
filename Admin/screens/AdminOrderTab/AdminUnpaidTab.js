import { View, Text } from 'react-native';
import React from 'react';
import AdminOrderList from '../AdminOrderList';
import { useRoute } from '@react-navigation/native';

export default function AdminUnpaidTab({ navigation }) {
  const route = useRoute();
  const { session, status, refresh } = route.params;

  return (
    <AdminOrderList
      navigation={navigation}
      session={session}
      status={status}
      refresh={refresh}
    />
  );
}
