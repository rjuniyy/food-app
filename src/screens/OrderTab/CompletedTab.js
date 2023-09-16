/* eslint-disable react/prop-types */
import React from 'react';
import OrderList from '../../components/OrderList';
import { useRoute } from '@react-navigation/native';

export default function CompletedTab({ navigation }) {
  const route = useRoute();
  const { session, status } = route.params;

  return (
    <OrderList navigation={navigation} session={session} status={status} />
  );
}
