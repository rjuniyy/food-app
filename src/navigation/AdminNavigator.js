import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import customStyles from '../styles/customStyles';

//note Import SVG Files
import Chat from '../../assets/icons/chat.svg';
import User from '../../assets/icons/user.svg';
import Home from '../../assets/icons/home.svg';
import Plus from '../../assets/icons/add-square.svg';
import Order from '../../assets/icons/order.svg';

//note Import Screen
import AdminHomeScreen from '../../Admin/screens/AdminHomeTab/AdminHomeScreen';
import AdminAddMenuScreen from '../../Admin/screens/AdminHomeTab/AdminAddMenuScreen';
import AdminDetailScreen from '../../Admin/screens/AdminDetailScreen';
import AdminEditMenuScreen from '../../Admin/screens/AdminEditMenuScreen';
import AdminChatScreen from '../../Admin/screens/AdminHomeTab/AdminChatScreen';
import AdminDetailChatScreen from '../../Admin/screens/AdminDetailChatScreen';
import AdminUnpaidTab from '../../Admin/screens/AdminOrderTab/AdminUnpaidTab';
import AdminProcessTab from '../../Admin/screens/AdminOrderTab/AdminProcessTab';
import AdminDeliveryTab from '../../Admin/screens/AdminOrderTab/AdminDeliveryTab';
import AdminCompletedTab from '../../Admin/screens/AdminOrderTab/AdminCompletedTab';
import AdminCanceledTab from '../../Admin/screens/AdminOrderTab/AdminCanceledTab';
import AdminDetailOrderScreen from '../../Admin/screens/AdminOrderTab/AdminDetailOrderScreen';
import AdminProfileScreen from '../../Admin/screens/AdminSettings/AdminProfileScreen';
import AdminSettingScreen from '../../Admin/screens/AdminSettings/AdminSettingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Top = createMaterialTopTabNavigator();

function HomeTabAdmin({ route }) {
  const { session } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="AdminHome"
      screenOptions={customStyles.tabBar}
    >
      <Tab.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: () => <Home />,
        }}
      />
      <Tab.Screen
        name="AdminOrderTab"
        component={OrderTabAdmin}
        options={{
          headerTitle: 'Daftar Pesanan',

          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
          tabBarIcon: () => <Order />,
        }}
        initialParams={{ session: session }}
      />
      <Tab.Screen
        name="AddMenu"
        component={AdminAddMenuScreen}
        options={{
          tabBarLabel: 'Tambah Menu',
          headerTitle: 'Tambah Menu Baru',
          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
          // tabBarBadge: 1,
          tabBarIcon: () => <Plus />,
          tabBarHideOnKeyboard: true,
        }}
        initialParams={{ session }}
      />
      <Tab.Screen
        name="Inbox"
        component={AdminChatScreen}
        options={{
          tabBarLabel: 'Inbox',
          headerTitle: 'Admin Chat',
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
        name="AdminProfile"
        component={AdminProfileScreen}
        options={{
          tabBarLabel: 'Admin Profil',
          tabBarIcon: () => <User />,
          headerTitle: '',
          headerShown: false,
        }}
        initialParams={{ session: session }}
      />
    </Tab.Navigator>
  );
}

function OrderTabAdmin({ route }) {
  const { session, refresh } = route.params;
  return (
    <Top.Navigator
      backBehavior="history"
      initialRouteName="AdminUnpaid"
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
        name="AdminUnpaid"
        component={AdminUnpaidTab}
        options={{
          tabBarLabel: 'Belum Bayar',
        }}
        initialParams={{
          session: session,
          status: 'pending',
        }}
      />
      <Top.Screen
        name="AdminProcess"
        component={AdminProcessTab}
        options={{
          tabBarLabel: 'Diproses',
        }}
        initialParams={{
          session: session,
          status: 'diproses',
        }}
      />
      <Top.Screen
        name="AdminDelivery"
        component={AdminDeliveryTab}
        options={{
          tabBarLabel: 'Dikirim',
        }}
        initialParams={{ session: session, status: 'dikirim' }}
      />
      <Top.Screen
        name="AdminCompleted"
        component={AdminCompletedTab}
        options={{
          tabBarLabel: 'Selesai',
        }}
        initialParams={{ session: session, status: 'selesai' }}
      />
      <Top.Screen
        name="AdminCanceled"
        component={AdminCanceledTab}
        options={{
          tabBarLabel: 'Dibatalkan',
        }}
        initialParams={{ session: session, status: 'dibatalkan' }}
      />
    </Top.Navigator>
  );
}

const AdminNavigator = ({ session, refresh }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeTabAdmin}
        options={{ headerShown: false }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="AdminOrder"
        component={OrderTabAdmin}
        options={{
          headerTitle: 'Daftar Pesanan',

          headerTitleStyle: {
            fontFamily: 'RedHatDisplaySemiBold',
          },
        }}
        initialParams={{ session: session, refresh: refresh }}
      />

      <Stack.Screen
        name="AdminDetail"
        component={AdminDetailScreen}
        options={{ headerShown: false }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="AdminEditMenu"
        component={AdminEditMenuScreen}
        options={{ headerShown: false }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="AdminDetailChat"
        component={AdminDetailChatScreen}
        options={{ title: 'Admin Chat' }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="AdminDetailOrder"
        component={AdminDetailOrderScreen}
        options={{ title: 'Detail Order' }}
        initialParams={{ session: session }}
      />
      <Stack.Screen
        name="AdminSettings"
        component={AdminSettingScreen}
        options={{ headerTitle: 'Pengaturan' }}
        initialParams={{ session: session }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
