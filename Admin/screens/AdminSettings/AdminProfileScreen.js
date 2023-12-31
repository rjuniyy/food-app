import React, { useEffect, useState } from 'react';
import {
  Button,
  NativeBaseProvider,
  Stack,
  Text,
  Box,
  FlatList,
  Image,
  Divider,
  View,
  ScrollView,
} from 'native-base';
import { PieChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { fetchUser } from '../../../src/services/api';
import { supabase } from '../../../src/services/supabase';

export default function AdminProfileScreen({ navigation }) {
  const route = useRoute();
  const { session } = route.params;
  const [userData, setUserData] = useState([]);
  // Fetch real data for your pie chart
  const [chartData, setChartData] = useState([]);
  const totalOrderCount = chartData.reduce(
    (total, item) => total + item.value,
    0,
  );
  // Fetch order completed data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from Supabase
        const { data: menuItems, error } = await supabase
          .from('menu_items')
          .select('name, ordercount'); // Fetch only the required fields

        // Check for errors
        if (error) {
          console.error('Error fetching menu items data:', error);
          return;
        }
        const chartData = menuItems.map((item) => ({
          value: item.ordercount,
          name: item.name,
          color: getRandomColor(),
        }));

        // Update the state with the chart data
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching order completed data:', error);
      }
    };

    fetchData();
  }, []);

  const getRandomColor = () => {
    // Generate random values for R, G, and B components
    const r = Math.floor(Math.random() * 256); // Random integer between 0 and 255
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Convert the RGB values to hexadecimal format
    const rHex = r.toString(16).padStart(2, '0'); // Ensure two digits
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');

    // Combine the hexadecimal values to form the color string
    const color = `#${rHex}${gHex}${bHex}`;

    return color;
  };

  useEffect(() => {
    fetchUser({ session, setUserData });
  }, []);

  const renderProfile = ({ item }) => (
    <Stack direction="row" padding="5" alignContent="center">
      <Box justifyContent="center">
        <Image alt="image" source={{ uri: item.avatar_url }} size={20} />
      </Box>

      <Box padding="3">
        <Text fontFamily="RedHatDisplayBlack">{item.full_name}</Text>
        <Text fontFamily="RedHatDisplay">{item.email}</Text>
        <Divider bg="muted.400" />
        <Text fontFamily="RedHatDisplay">{item.phone}</Text>
      </Box>
    </Stack>
  );

  const renderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendComponent = (data) => {
    return data.map((item, index) => (
      <View
        key={index} // Make sure to provide a unique key for each legend item
        flexDir="row"
      >
        <Stack direction="row" width="90%">
          <Text fontSize="14" fontFamily="RedHatDisplay" color="white">
            {renderDot(item.color)} {item.name}
          </Text>
        </Stack>
        <Stack direction="row" width="10%">
          <Text fontSize="12" fontFamily="RedHatDisplayBlack" color="white">
            {item.value}
          </Text>
        </Stack>
      </View>
    ));
  };
  const legends = renderLegendComponent(chartData);
  return (
    <NativeBaseProvider>
      <Box safeArea>
        <Text alignSelf="center" fontFamily="RedHatDisplayBlack" fontSize="18">
          Personal Details
        </Text>
        <Box
          borderRadius="3xl"
          bgColor="pink.300"
          width="90%"
          alignSelf="center"
          justifyContent="center"
          alignItems="center"
        >
          <FlatList
            data={userData}
            renderItem={renderProfile}
            keyExtractor={(item) => item.id.toString()}
          />
        </Box>
        <Box>
          <Stack direction="row" justifyContent="center" space="1" padding="3">
            <Button
              rightIcon={
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color="black"
                  style={{ alignSelf: 'center' }}
                />
              }
              borderRadius="full"
              bg="white"
              colorScheme="dark"
              onPress={() => navigation.navigate('AdminSettings')}
            >
              <Text fontFamily="RedHatDisplaySemiBold" fontSize="12">
                Pengaturan
              </Text>
            </Button>
          </Stack>
        </Box>

        <View
          style={{
            margin: 20,
            padding: 16,
            borderRadius: 20,
            backgroundColor: '#232B5D',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontFamily: 'RedHatDisplayBlack',
            }}
          >
            Total Penjualan
          </Text>
          <View style={{ padding: 10, alignItems: 'center' }}>
            <PieChart
              data={chartData}
              donut
              showGradient
              sectionAutoFocus
              radius={80}
              innerRadius={60}
              innerCircleColor={'#232B5D'}
              centerLabelComponent={() => {
                return (
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text
                      style={{
                        fontSize: 22,
                        color: 'white',
                        fontFamily: 'RedHatDisplayBlack',
                      }}
                    >
                      {totalOrderCount}
                    </Text>
                    <Text
                      fontSize="14"
                      color="white"
                      fontFamily="RedHatDisplayBlack"
                    >
                      Produk Terjual
                    </Text>
                  </View>
                );
              }}
            />
          </View>
          <ScrollView w="100%" h="200">
            {legends}
          </ScrollView>
        </View>
      </Box>
    </NativeBaseProvider>
  );
}
