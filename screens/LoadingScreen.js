import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import * as authAction from '../store/action/AuthAction';
import AsyncStorage from '@react-native-community/async-storage';

const LoadingScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      const tryLogin = async () => {
        const userData = await AsyncStorage.getItem('userData');

        if (!userData) {
          props.navigation.navigate('App');
          return;
        }

        const transformedData = JSON.parse(userData);
        const {token, userId, expiryDate} = transformedData;
        const expirationDate = new Date(expiryDate);

        if (expirationDate <= new Date() || !token || !userId) {
          props.navigation.navigate('App');
          return;
        }

        const expirationTime = expirationDate.getTime() - new Date().getTime();

        props.navigation.navigate('Auth');
        dispatch(authAction.authenticate(userId, token, expirationTime));
      };
      tryLogin();
    }, 1800);
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <View style={{width: 280, height: 280}}>
        <Image
          source={require('../assets/icon/splash_logo.png')}
          resizeMode="center"
          style={{width: '100%', height: '100%'}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#861F1B',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
