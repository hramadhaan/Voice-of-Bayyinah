import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import Thunk from 'redux-thunk';
import authReducer from './store/reducer/AuthReducer';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import NavigationContainer from './navigation/NavigationContainer';
import artikelReducer from './store/reducer/ArtikelReducer';
import kategoriReducer from './store/reducer/KategoriReducer';
import artikelKategoriReducer from './store/reducer/ArtikelKategoriReducer';
import firebase from 'firebase';
import favoriteReducer from './store/reducer/FavoriteReducer';

// ADMIN

const config = {
  apiKey: 'AIzaSyAF_TJWvjbBmGV7TCzIinYPF1Q3BQXs5io',
  authDomain: 'vob-bayyinah-apps.firebaseapp.com',
  databaseURL: 'https://vob-bayyinah-apps.firebaseio.com',
  projectId: 'vob-bayyinah-apps',
  storageBucket: 'vob-bayyinah-apps.appspot.com',
  messagingSenderId: '953873338692',
  appId: '1:953873338692:web:771f731c3eab36e2f08711',
  measurementId: 'G-VTXQX0MT9V',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const rootReducer = combineReducers({
  auth: authReducer,
  artikel: artikelReducer,
  kategori: kategoriReducer,
  artikelKategori: artikelKategoriReducer,
  favorite: favoriteReducer,
});

const store = createStore(rootReducer, applyMiddleware(Thunk));

const App = (props) => {
  return (
    <Provider store={store}>
      <StatusBar backgroundColor="#DD0004" />
      <NavigationContainer />
    </Provider>
  );
};

export default App;
