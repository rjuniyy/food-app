import React, { useState } from 'react';
import { Box, VStack, Input, Divider, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase'; // Import your Supabase client

const BarSearch = ({ setItems, onFocus, onBlur }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query) => {
    setSearchQuery(query);

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .ilike('name', `%${query}%`); // Use ilike operator for case-insensitive search
      setItems(data);
      if (error) {
        console.error('Error fetching menu items:', error.message);
        return;
      }

      // console.log('Menu items:', data);
      // Process the fetched menu items as per your requirement
    } catch (error) {
      console.error('Error fetching menu items:', error.message);
    }
  };

  const handleInputBlur = () => {
    if (onBlur) {
      onBlur(); // Call onBlur prop if provided
    }
    setSearchQuery('');
  };

  return (
    <VStack
      my="5"
      w="100%"
      maxW="380px"
      divider={
        <Box px="2">
          <Divider />
        </Box>
      }
    >
      <VStack w="100%" alignSelf="center">
        <Input
          h="50"
          placeholder="Apa yang sedang anda cari?"
          variant="filled"
          width="100%"
          bg="white"
          borderRadius="20"
          py="1"
          px="2"
          value={searchQuery}
          onChangeText={handleSearch}
          InputLeftElement={
            <Icon
              ml="2"
              size="6"
              color="gray.400"
              as={<Ionicons name="ios-search" />}
            />
          }
          onFocus={onFocus}
          onBlur={handleInputBlur}
        />
      </VStack>
    </VStack>
  );
};

export default BarSearch;
