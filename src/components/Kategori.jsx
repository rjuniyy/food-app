import React, { useState, useEffect } from 'react';
import { Box, Flex, Pressable, Spacer, Text } from 'native-base';
import customStyles from '../styles/customStyles';
import All from '../../assets/icons/all.svg';
import Drink from '../../assets/icons/drink.svg';
import Daifuku from '../../assets/icons/dessert.svg';
import Risol from '../../assets/icons/go-nyah.svg';

// eslint-disable-next-line react/prop-types
export default function Kategori({ handleButtonPress }) {
  const [selected, setSelected] = useState('all');

  useEffect(() => {
    handleButtonPress('all');
  }, []);

  const onPressAll = () => {
    setSelected('all');
    handleButtonPress('all');
  };

  const onPressDrink = () => {
    setSelected('drink');
    handleButtonPress('drink');
  };

  const onPressDaifuku = () => {
    setSelected('daifuku');
    handleButtonPress('daifuku');
  };

  const onPressGorengan = () => {
    setSelected('gorengan');
    handleButtonPress('gorengan');
  };

  return (
    <Flex alignItems="center" direction="row" mx={5} my={5}>
      <Box>
        <Pressable
          style={[
            customStyles.buttonKategori,
            selected === 'all' && customStyles.buttonSelected,
          ]}
          onPress={onPressAll}
        >
          <All width={40} height={40} fill="black" />
          <Text
            position="absolute"
            bottom="-25"
            fontSize="11"
            color="black"
            fontFamily="RedHatDisplaySemiBold"
          >
            Semua
          </Text>
        </Pressable>
      </Box>
      <Spacer />
      <Box>
        <Pressable
          style={[
            customStyles.buttonKategori,
            selected === 'drink' && customStyles.buttonSelected,
          ]}
          onPress={onPressDrink}
        >
          <Drink width={40} height={40} fill="black" />
          <Text
            position="absolute"
            bottom="-25"
            fontSize="11"
            color="black"
            fontFamily="RedHatDisplaySemiBold"
          >
            Minuman
          </Text>
        </Pressable>
      </Box>
      <Spacer />
      <Box>
        <Pressable
          style={[
            customStyles.buttonKategori,
            selected === 'daifuku' && customStyles.buttonSelected,
          ]}
          onPress={onPressDaifuku}
        >
          <Daifuku width={40} height={40} fill="black" />
          <Text
            position="absolute"
            bottom="-25"
            fontSize="11"
            color="black"
            fontFamily="RedHatDisplaySemiBold"
          >
            Dessert
          </Text>
        </Pressable>
      </Box>
      <Spacer />
      <Box>
        <Pressable
          style={[
            customStyles.buttonKategori,
            selected === 'gorengan' && customStyles.buttonSelected,
          ]}
          onPress={onPressGorengan}
        >
          <Risol width={40} height={40} fill="black" />
          <Text
            position="absolute"
            bottom="-25"
            fontSize="11"
            color="black"
            fontFamily="RedHatDisplaySemiBold"
          >
            Go-Nyah
          </Text>
        </Pressable>
      </Box>
    </Flex>
  );
}
