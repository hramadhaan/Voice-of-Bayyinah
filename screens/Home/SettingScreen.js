import React, { useState, useEffect, useCallback } from 'react';
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
import VersionCheck from 'react-native-version-check';

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
    loadKey().then(() => { });
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
        <Text style={{ color: isEnabled ? 'white' : 'black' }}>
          Login as Writer
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isEnabled ? 'black' : 'white' }}>
      <TouchableWithoutFeedback
        onLongPress={toggleToLogin}
        delayLongPress={2000}>
        <View style={styles.row}>
          <Text style={{ color: isEnabled ? 'white' : 'black' }}>Night Mode</Text>
          <Switch
            // onTouchEnd={touchEnd}
            trackColor={{ false: '#767577', true: '#ccc' }}
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
          <Text style={{ color: isEnabled ? 'white' : 'black' }}>About Us</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.row}>
        <Text style={{ color: isEnabled ? 'white' : 'black' }} >Versi</Text>
        <Text>{VersionCheck.getCurrentVersion() ?? 'Unknown'}</Text>
      </View>

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
