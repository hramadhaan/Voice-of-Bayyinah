import React, {useEffect, useRef, useState, useCallback} from 'react';
import {useSelector} from 'react-redux';

import {NavigationActions} from 'react-navigation';
import AppNavigator from './AppNavigator';
// import {AppearanceProvider, } from 'react-native-appearance';
import AsyncStorage from '@react-native-community/async-storage';

const NavigationContainer = (props) => {
  const navRef = useRef();
  const isAuth = useSelector((state) => !!state.auth.token);

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

  useEffect(() => {
    if (isAuth) {
      navRef.current.dispatch(NavigationActions.navigate({routeName: 'Auth'}));
    }
  }, [isAuth]);

  // let theme = useColorScheme();

  return <AppNavigator ref={navRef} theme={isEnabled ? 'dark' : 'light'} />;
};

export default NavigationContainer;
