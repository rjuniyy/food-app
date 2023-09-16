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
import { Dimensions } from 'react-native';

export default function AdminProfileScreen({ navigation }) {
  const route = useRoute();
  const { session } = route.params;
  const [userData, setUserData] = useState([]);

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

        <Box>
          <Text>Bezier Line Chart</Text>
          <LineChart
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June'],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={Dimensions.get('window').width} // from react-native
            height={220}
            yAxisLabel="Rp"
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}
