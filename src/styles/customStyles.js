import { StyleSheet } from 'react-native';

const customStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'RedHatDisplay',
  },
  tabBar: {
    tabBarActiveBackgroundColor: '#FF647F',
    tabBarShowLabel: false,
    tabBarStyle: {
      position: 'absolute',
      borderTopRightRadius: 35,
      borderTopLeftRadius: 35,
      backgroundColor: 'white',
      left: 0,
      bottom: 0,
      right: 0,
      padding: 5,
      height: 70,
    },
    tabBarItemStyle: {
      borderRadius: 40,
      marginHorizontal: 10,
    },
  },
  textHeading1: {
    fontSize: 32,
    lineHeight: 35,
    fontWeight: 'medium',
    color: 'black',
    fontFamily: 'RedHatDisplay',
  },
  textHeading2: {
    fontSize: 18,
    fontWeight: 'medium',
    color: 'black',
    fontFamily: 'RedHatDisplay',
  },
  buttonKategori: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  darkButtonKategori: {
    backgroundColor: 'primary.400',
  },
  buttonSelected: {
    width: 60,
    height: 60,
    backgroundColor: '#FF647F',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonTextKategori: {
    color: 'warmGray.50',
    fontWeight: 'medium',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default customStyles;
