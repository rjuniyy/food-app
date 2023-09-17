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
  Center,
} from 'native-base';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { fetchUser } from '../../../src/services/api';
import { supabase } from '../../../src/services/supabase';
// import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

export default function AdminProfileScreen({ navigation }) {
  const route = useRoute();
  const { session } = route.params;
  const [userData, setUserData] = useState([]);
  // Fetch real data for your pie chart
  const [chartData, setChartData] = useState([]);

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

        // Transform the data for the pie chart
        const chartData = menuItems.map((item) => ({
          name: `${item.name} (${item.ordercount})`,
          population: item.ordercount,
          color: getRandomColor(), // Add a function to generate random colors
          legendFontColor: '#7F7F7F',
          legendFontSize: 15,
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
      </Box>
      <Center>
        <Text alignSelf="center" fontFamily="RedHatDisplayBlack">
          Pesanan Selesai
        </Text>
        <PieChart
          data={chartData}
          width={screenWidth}
          height={260}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          hasLegend={false}
        />
      </Center>
    </NativeBaseProvider>
  );
}
