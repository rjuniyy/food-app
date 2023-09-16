import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { supabase } from '../../src/services/supabase';

export default function UserList({ onUserPress }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) {
        console.error('Error fetching users:', error.message);
        return;
      }
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onUserPress(item)}>
          <View style={{ padding: 16 }}>
            <Text>{item.full_name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
