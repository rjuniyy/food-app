/* eslint-disable react/prop-types */
import React from 'react';
import OrderList from '../../components/OrderList';
import { useRoute } from '@react-navigation/native';

export default function CanceledTab({ navigation }) {
  const route = useRoute();
  const { session, status, refresh } = route.params;

  return (
    <OrderList
      navigation={navigation}
      session={session}
      status={status}
      refresh={refresh}
    />
  );
}
