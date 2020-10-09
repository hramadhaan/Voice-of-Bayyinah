import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  BackHandler,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const SECTIONS = [
  {
    title: 'About Us',
    content: `VoB dan AoQ adalah bagian dari komunitas NAK Indonesia dan Yayasan Bayyinah Qur’an Indonesia.

    Voice of Bayyinah (VoB) berdiri pada 17 Juni 2020, awalnya bernama Lessons from Bayyinah’s Production (LBP). Atas masukan para anggota, LBP berubah nama menjadi VoB pada 20 Agustus 2020 yang bertepatan dengan tahun baru Islam 1442 H.
    
    Tujuan VoB adalah untuk menghadirkan mutiara hikmah yang bersumber dari Bayyinah TV setiap hari. Termasuk akhir pekan dan hari libur. Karena petunjuk-Nya adalah seperti air. Kita membutuhkannya setiap hari.
    
    Bayyinah TV adalah program berbayar yang berisi lebih dari 2,000 jam pelajaran dalam bentuk video yang diperbarui setiap bulannya. Di Bayyinah TV, Ustaz Nouman Ali Khan memberikan bimbingan melalui sebuah pendekatan yang praktis untuk mempelajari Al-Qur’an.
    
    Arabic of the Quran (AoQ) berdiri pada 5 September 2020 sebagai sebuah grup belajar bahasa Arab. Tujuan awal didirikannya adalah untuk menyambut program Dream Live, kelas belajar bahasa Arab online yang diadakan oleh Bayyinah yang rencananya dimulai pada 2 Oktober 2020.
    
    Materi pembelajaran bahasa Arab di AoQ menggunakan kurikulum Bayyinah TV dengan materi yang sudah disesuaikan dengan konteks keindonesiaan dan ketimuran.`,
  },
];

const SettingScreen = (props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loginShow, setIsLoginShow] = useState(false);

  const [activeSections, setActiveSections] = useState([]);

  const loadKey = useCallback(async () => {
    try {
      const key = await AsyncStorage.getItem('dark');
      console.log(key);
      if (key !== null) {
        setIsEnabled(true);
      } else if (key === null) {
        setIsEnabled(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  useEffect(() => {
    loadKey().then(() => {});
  }, [loadKey]);

  const setToDark = async (value) => {
    console.log(value);
    setIsEnabled(value);
    await AsyncStorage.setItem('dark', value.toString());
    BackHandler.exitApp();
  };

  const toggleSwitch = async (value) => {
    // setIsEnabled(value);
    if (value === true) {
      Alert.alert(
        'Ingin menggantikan ke Night Mode ?',
        'Aplikasi Voice of Bayyinah akan keluar jika Anda ingin mengganti perubahan.',
        [
          {
            text: 'Batal',
            style: 'cancel',
          },
          {
            text: 'Oke',
            onPress: () => setToDark(value),
          },
        ],
      );
    } else if (value === false) {
      Alert.alert(
        'Ingin menggantikan ke Light Mode ?',
        'Aplikasi Voice of Bayyinah akan keluar jika Anda ingin mengganti perubahan.',
        [
          {
            text: 'Batal',
            style: 'cancel',
          },
          {
            text: 'Oke',
            onPress: async () => {
              setIsEnabled(value);
              await AsyncStorage.removeItem('dark');
              BackHandler.exitApp();
            },
          },
        ],
      );
    }
  };

  const toggleToLogin = () => {
    setIsLoginShow(true);
  };

  const goToAboutUs = () => {
    props.navigation.navigate('AboutUs');
  };

  const login = (
    <TouchableWithoutFeedback
      onPress={() => props.navigation.navigate('Login')}>
      <View style={styles.row}>
        <Text style={{color: isEnabled ? 'white' : 'black'}}>
          Login as Writer
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={{flex: 1, backgroundColor: isEnabled ? 'black' : 'white'}}>
      <TouchableWithoutFeedback
        onLongPress={toggleToLogin}
        delayLongPress={2000}>
        <View style={styles.row}>
          <Text style={{color: isEnabled ? 'white' : 'black'}}>Night Mode</Text>
          <Switch
            // onTouchEnd={touchEnd}
            trackColor={{false: '#767577', true: '#ccc'}}
            thumbColor={isEnabled ? 'red' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* <TouchableWithoutFeedback
        onPress={() => {
          Linking.openURL('https://nakindonesia.com/profil-penulis');
        }}>
        <View style={styles.row}>
          <Text>Profil Penulis</Text>
        </View>
      </TouchableWithoutFeedback> */}

      <TouchableWithoutFeedback onPress={goToAboutUs}>
        <View style={styles.row}>
          <Text style={{color: isEnabled ? 'white' : 'black'}}>About Us</Text>
        </View>
      </TouchableWithoutFeedback>

      {loginShow ? login : undefined}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 48,
    marginHorizontal: 16,
    // backgroundColor: 'white',
    alignItems: 'center',
  },
});

export default SettingScreen;
