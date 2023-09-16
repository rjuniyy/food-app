import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/services/supabase';
import {
  Avatar,
  Box,
  FlatList,
  HStack,
  NativeBaseProvider,
  Text,
  VStack,
} from 'native-base';
import { Pressable } from 'react-native';

const UserList = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersWithLastMessage = async () => {
      try {
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, user_id');

        if (usersError) {
          console.error('Error fetching users:', usersError.message);
          return;
        }

        const usersWithLastMessage = await Promise.all(
          usersData.map(async (user) => {
            const { data: lastMessageData, error: lastMessageError } =
              await supabase
                .from('messages')
                .select('text, created_at')
                .eq('sender_id', user.user_id)
                .order('created_at', { ascending: false })
                .limit(1);

            if (lastMessageError) {
              console.error(
                'Error fetching last message:',
                lastMessageError.message,
              );
            }

            return {
              ...user,
              lastMessage: lastMessageData?.[0],
            };
          }),
        );
        // Filter out users who don't have a matching sender_id in messages
        const filteredUsers = usersWithLastMessage.filter(
          (user) => user.lastMessage !== undefined,
        );

        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsersWithLastMessage();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Box
        borderBottomWidth="1"
        borderColor="muted.800"
        pl={['0', '4']}
        pr={['0', '5']}
        py="2"
      >
        <Pressable
          onPress={() =>
            navigation.navigate('AdminDetailChat', { userData: item })
          }
        >
          <HStack>
            <Avatar source={{ uri: item.avatar_url }} size="md" ml="4" />
            <VStack>
              <Text fontFamily="RedHatDisplaySemiBold" ml="4" fontSize="16">
                {item.full_name}
              </Text>
              {item.lastMessage && (
                <Text color="gray.500" fontSize="14" ml="4">
                  {item.lastMessage.text}
                </Text>
              )}
            </VStack>
          </HStack>
        </Pressable>
      </Box>
    );
  };

  return (
    <NativeBaseProvider>
      <Box safeArea>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </Box>
    </NativeBaseProvider>
  );
};

export default UserList;
