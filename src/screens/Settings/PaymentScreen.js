import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import { AntDesign } from '@expo/vector-icons';
import {
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  Divider,
  IconButton,
  NativeBaseProvider,
  ScrollView,
  Spacer,
  Stack,
  Text,
  useClipboard,
} from 'native-base';
import BCA from '../../../assets/icons/bca-icon.svg';
import Mandiri from '../../../assets/icons/mandiri-icon.svg';
import Dana from '../../../assets/icons/dana-icon.svg';
import Shopee from '../../../assets/icons/shopee-icon.svg';

const banks = [
  {
    title: 'Bank BCA',
    icon: <BCA width={48} height={32} />,
    accountNumber: '1510700461',
    copyNumber: '1510700461',
  },
  {
    title: 'Bank MANDIRI',
    icon: <Mandiri width={48} height={32} />,
    accountNumber: '1130017569025',
    copyNumber: '1130017569025',
  },
  {
    title: 'E-Wallet DANA',
    icon: <Dana width={48} height={32} />,
    accountNumber: '0852-6714-7399',
    copyNumber: '085267147399',
  },
  {
    title: 'E-Wallet ShopeePay',
    icon: <Shopee width={48} height={32} />,
    accountNumber: '0882-7409-3130',
    copyNumber: '088274093130',
  },
];

const getContent = (bankName) => (
  <Text>
    <Text>Melalui {bankName}</Text>
    {'\n\n'}
    <Text bold>1. </Text>
    <Text>Lakukan log in pada aplikasi {bankName} mobile.</Text>
    {'\n'}
    <Text bold>2. </Text>
    <Text>
      Pilih “m-{bankName}” masukan kode akses m-{bankName}.
    </Text>
    {'\n'}
    <Text bold>3. </Text>
    <Text>Pilih “m-Transfer“.</Text>
    {'\n'}
    <Text bold>4. </Text>
    <Text>Masukkan nomor rekening {bankName} kami dan klik “OK“.</Text>
    {'\n'}
    <Text bold>5. </Text>
    <Text>Konfirmasi nomor rekening.</Text>
    {'\n'}
    {bankName === 'DANA' ? null : (
      <>
        <Text bold>6. </Text>
        <Text>Periksa kembalian rincian pembayaran kamu, lalu klik “Ya”</Text>
      </>
    )}
    {'\n'}
    {bankName === 'DANA' ? null : (
      <>
        <Text bold>7. </Text>
        <Text>Masukan pin m-{bankName}.</Text>
      </>
    )}
    {'\n'}
    {bankName === 'DANA' ? null : (
      <>
        <Text bold>8. </Text>
        <Text>Kirim bukti Transfer kamu tadi melalui Chat.</Text>
      </>
    )}
    {'\n'}
    {bankName === 'DANA' ? null : (
      <>
        <Text bold>9. </Text>
        <Text>
          Tunggu hingga konfirmasi dari Admin, jika berhasil pesanan akan
          diproses.
        </Text>
      </>
    )}
  </Text>
);

export default function App() {
  const [activeSections, setActiveSections] = useState([]);
  const { onCopy } = useClipboard();

  const setSections = (sections) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text style={styles.headerText}>{section.title}</Text>
          {isActive ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Box>
        <Divider bg="gray.100" />
      </Animatable.View>
    );
  };

  const renderContent = (section, _, isActive) => {
    return (
      <ScrollView h="80">
        <Animatable.View
          duration={400}
          style={[styles.content, isActive ? styles.active : styles.inactive]}
          transition="backgroundColor"
        >
          <Animatable.Text
            animation={isActive ? 'bounceIn' : undefined}
            style={styles.contentText}
          >
            {section.content}
          </Animatable.Text>
        </Animatable.View>
      </ScrollView>
    );
  };

  return (
    <NativeBaseProvider>
      <Box safeArea>
        <Text
          font="18"
          highlight
          fontFamily="RedHatDisplayBlack"
          textAlign="center"
        >
          Setelah Transfer Harap Konfirmasi Ke Admin Untuk Melanjutkan Proses
          Pemesanan
        </Text>
        {banks.map((bank) => (
          <React.Fragment key={bank.title}>
            <Box>
              {bank.title === 'E-Wallet DANA' && (
                <Text highlight alignSelf="center" textAlign="center" mx="3">
                  Khusus DANA harap tambah total Transfer +Rp. 500 (Biaya Admin)
                </Text>
              )}
              <Stack direction="row" paddingX="3" paddingY="1">
                <Text>{`${bank.title}`}</Text>
                <Spacer />
                {bank.icon}
              </Stack>
              <Stack direction="row" alignItems="center" paddingX="3">
                <Stack>
                  {['E-Wallet DANA', 'E-Wallet ShopeePay'].includes(
                    bank.title,
                  ) ? (
                    <Text>No. Handphone </Text>
                  ) : (
                    <Text>No. Rekening </Text>
                  )}
                </Stack>

                <Spacer />
                <Text fontFamily="RedHatDisplayBlack">{`${bank.accountNumber}`}</Text>
                <IconButton
                  colorScheme="pink"
                  variant="ghost"
                  _icon={{
                    as: AntDesign,
                    name: 'copy1',
                  }}
                  onPress={() => onCopy(bank.copyNumber)}
                />
                <Text>Salin</Text>
              </Stack>
            </Box>
            <Divider thickness="2" />
          </React.Fragment>
        ))}
        <Text alignSelf="center" fontFamily="RedHatDisplayBlack" highlight>
          Panduan Pembayaran/Cara Transaksi
        </Text>

        <Accordion
          activeSections={activeSections}
          sections={banks.map((bank) => ({
            title: bank.title,
            content: getContent(bank.title),
          }))}
          touchableComponent={TouchableOpacity}
          renderHeader={renderHeader}
          renderContent={renderContent}
          duration={400}
          onChange={setSections}
          renderAsFlatList={false}
        />
      </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFF',
    padding: 10,
  },
  headerText: {
    fontSize: 14,
    fontFamily: 'RedHatDisplaySemiBold',
  },
  contentText: {
    fontSize: 14,
    fontFamily: 'RedHatDisplay',
    color: '#52525b',
  },
  content: {
    padding: 10,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: '#fff',
  },
  inactive: {
    backgroundColor: '#F2F2F2',
  },
});
