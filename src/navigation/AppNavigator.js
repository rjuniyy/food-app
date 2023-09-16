import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import customStyles from '../styles/customStyles';
//note Import SVG Files
import Chat from '../../assets/icons/chat.svg';
import Favorite from '../../assets/icons/favorite.svg';
import User from '../../assets/icons/user.svg';
import Basket from '../../assets/icons/basket.svg';
import Home from '../../assets/icons/home.svg';
//note Import HomeTab
import HomeScreen from '../screens/HomeTab/HomeScreen';
import ProfileScreen from '../screens/HomeTab/ProfileScreen';
import FavoriteScreen from '../screens/HomeTab/FavoriteScreen';
import CartScreen from '../screens/HomeTab/CartScreen';
import ChatScreen from '../screens/HomeTab/ChatScreen';

//note Import Screen
import DetailScreen from '../screens/DetailScreen';

//note || Import OrderTab Screen
import UnpaidTab from '../screens/OrderTab/UnpaidTab';
import CanceledTab from '../screens/OrderTab/CanceledTab';
import DeliveryTab from '../screens/OrderTab/DeliveryTab';
import ProcessTab from '../screens/OrderTab/ProcessTab';
import CompletedTab from '../screens/OrderTab/CompletedTab';
import DetailOrderScreen from '../screens/OrderTab/DetailOrderScreen';
//note Import Settings Screen
import SettingScreen from '../screens/Settings/SettingScreen';
import EditProfileScreen from '../screens/Settings/EditProfileScreen';
import AddressListScreen from '../screens/Settings/AddressListScreen';
import AddNewAddress from '../screens/Settings/AddNewAddress';
import EditProfileData from '../screens/Settings/EditProfileData';
import PaymentScreen from '../screens/Settings/PaymentScreen';
import ReviewScreen from '../screens/OrderTab/ReviewScreen';
import SendPaymentScreen from '../screens/OrderTab/SendPaymentScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Top = createMaterialTopTabNavigator();

function HomeTab({ route }) {
  const { session, status } = route.params;

  return (
    <Tab.Navigator initialRouteName="Feed" screenOptions={customStyles.tabBar}>
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerTitle: 'Keranjang',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
          tabBarIcon: () => <Basket />,
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          headerTitle: 'Menu Favorit',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
          tabBarIcon: () => <Favorite />,
        }}
        initialParams={{ session: session }}
      />
      <Tab.Screen
        name="Feed"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Feed',
          tabBarIcon: () => <Home />,
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat Admin',
          headerTitle: 'Chat Admin',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
          // tabBarBadge: 1,
          tabBarIcon: () => <Chat />,
          tabBarHideOnKeyboard: true,
        }}
        initialParams={{ session }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => <User />,
          headerTitle: '',
          headerShown: false,
        }}
        initialParams={{ session: session }}
      />
    </Tab.Navigator>
  );
}

function OrderTab({ route }) {
  const { session } = route.params;
  return (
    <Top.Navigator
      backBehavior="history"
      initialRouteName="Unpaid"
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          backgroundColor: '#f472b6',
          height: 4,
        },
        tabBarItemStyle: {
          width: 130,
        },
        tabBarLabelStyle: {
          fontFamily: 'RedHatDisplaySemiBold',
          fontSize: 12,
        },
      }}
      sceneContainerStyle={{ backgroundColor: 'white' }}
    >
      <Top.Screen
        name="Unpaid"
        component={UnpaidTab}
        options={{
          tabBarLabel: 'Belum Bayar',
        }}
        initialParams={{ session: session, status: 'pending' }}
      />
      <Top.Screen
        name="Process"
        component={ProcessTab}
        options={{
          tabBarLabel: 'Diproses',
        }}
        initialParams={{ session: session, status: 'diproses' }}
      />
      <Top.Screen
        name="Delivery"
        component={DeliveryTab}
        options={{
          tabBarLabel: 'Dikirim',
        }}
        initialParams={{ session: session, status: 'dikirim' }}
      />
      <Top.Screen
        name="Completed"
        component={CompletedTab}
        options={{
          tabBarLabel: 'Selesai',
        }}
        initialParams={{ session: session, status: 'selesai' }}
      />
      <Top.Screen
        name="Canceled"
        component={CanceledTab}
        options={{
          tabBarLabel: 'Dibatalkan',
        }}
        initialParams={{ session: session, status: 'dibatalkan' }}
      />
    </Top.Navigator>
  );
}

const AppNavigator = ({ session }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeTab}
        options={{ headerShown: false }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="Order"
        component={OrderTab}
        options={{
          headerTitle: 'Pesanan Anda',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
        }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={() => ({
          headerTransparent: true,
          headerTitle: '',
        })}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="DetailOrder"
        component={DetailOrderScreen}
        options={{ headerShown: false }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{ headerTitle: 'Pengaturan' }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerTitle: 'Ubah Data Profil',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
        }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="Address"
        component={AddressListScreen}
        options={{
          headerTitle: 'Daftar Alamat',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
        }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="EditProfileData"
        component={EditProfileData}
        options={{
          headerTitle: 'Ubah Data',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
        }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="AddNewAddress"
        component={AddNewAddress}
        options={{
          headerTitle: 'Tambah Alamat',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
        }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          headerTitle: 'Cara Pembayaran',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
        }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="SendPayment"
        component={SendPaymentScreen}
        options={{
          headerTitle: 'Bukti Pembayaran',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
        }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          headerTitle: 'Beri Ulasan Menu',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
        }}
        initialParams={{ session: session }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
