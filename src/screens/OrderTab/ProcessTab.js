/* eslint-disable react/prop-types */
import React from 'react';
import { useRoute } from '@react-navigation/native';
import OrderList from '../../components/OrderList';

export default function ProcessTab({ navigation }) {
  const route = useRoute();
  const { session, status } = route.params;

  return (
    <OrderList navigation={navigation} session={session} status={status} />
  );
}
