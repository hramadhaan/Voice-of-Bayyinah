import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const AboutUsScreen = (props) => {
  const [isEnabled, setIsEnabled] = useState(false);

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

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 8,
        backgroundColor: isEnabled ? 'black' : 'white',
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <Image
            source={require('../../assets/images/vob2.png')}
            style={{
              width: 200,
              height: 200,
              borderRadius: 10,
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
          <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 12}}>
            Tentang Voice of Bayyinah
          </Text>
          <Text
            style={{
              marginTop: 12,
              textAlign: 'justify',
              letterSpacing: 0.3,
            }}>
            {`VoB dan AoQ adalah bagian dari komunitas NAK Indonesia dan Yayasan Bayyinah Qur’an Indonesia.

Voice of Bayyinah (VoB) berdiri pada 17 Juni 2020, awalnya bernama Lessons from Bayyinah’s Production (LBP). Atas masukan para anggota, LBP berubah nama menjadi VoB pada 20 Agustus 2020 yang bertepatan dengan tahun baru Islam 1442 H.

Tujuan VoB adalah untuk menghadirkan mutiara hikmah yang bersumber dari Bayyinah TV setiap hari. Termasuk akhir pekan dan hari libur. Karena petunjuk-Nya adalah seperti air. Kita membutuhkannya setiap hari.

Bayyinah TV adalah program berbayar yang berisi lebih dari 2,000 jam pelajaran dalam bentuk video yang diperbarui setiap bulannya. Di Bayyinah TV, Ustaz Nouman Ali Khan memberikan bimbingan melalui sebuah pendekatan yang praktis untuk mempelajari Al-Qur’an.

Arabic of the Quran (AoQ) berdiri pada 5 September 2020 sebagai sebuah grup belajar bahasa Arab. Tujuan awal didirikannya adalah untuk menyambut program Dream Live, kelas belajar bahasa Arab online yang diadakan oleh Bayyinah yang rencananya dimulai pada 2 Oktober 2020.

Materi pembelajaran bahasa Arab di AoQ menggunakan kurikulum Bayyinah TV dengan materi yang sudah disesuaikan dengan konteks keindonesiaan dan ketimuran.`}
          </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 12}}>
            Profil Penulis
          </Text>
          <Text
            style={{
              marginTop: 8,
              textAlign: 'justify',
              letterSpacing: 0.3,
              marginBottom: 12,
            }}>
            Klik{' '}
            <Text
              style={{fontWeight: 'bold', fontSize: 15}}
              onPress={() => {
                Linking.openURL('https://nakindonesia.com/profil-penulis/');
              }}>
              disini
            </Text>{' '}
            untuk melihat profil dari penulis Voice of Bayyinah
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

AboutUsScreen.navigationOptions = (navData) => {
  return {
    title: 'About Us',
  };
};

export default AboutUsScreen;
