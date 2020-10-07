import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import SQLite, {openDatabase} from 'react-native-sqlite-storage';
import {useTheme, ThemeColors} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import * as kategoriAction from '../../store/action/KategoriAction';
import ItemHome from '../../components/ItemHome';

const db = SQLite.openDatabase(
  {name: 'Favorite.db'},
  () => {},
  (error) => {
    console.log('Error: ' + error);
  },
);

const HomeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const kategoris = useSelector((state) => state.kategori.kategoris);
  const dispatch = useDispatch();

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
    SQLite.DEBUG(true);
    SQLite.enablePromise(false);
    db.transaction((txn) => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_favorite'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length === 0) {
            console.log('row nya 0 ');
            txn.executeSql('DROP TABLE IF EXISTS table_favorite', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_favorite(id INTEGER PRIMARY KEY AUTOINCREMENT, favorite_id VARCHAR(255), judul VARCHAR(255), penulis VARCHAR(255), kategori VARCHAR(255), hashtag VARCHAR(255))',
              [],
            );
          }
        },
      );
    });
  }, []);

  const loadArtikel = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(kategoriAction.fetchKategori());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  const selectItemHandler = (id) => {
    props.navigation.navigate('ArtikelKategori', {
      kategoriId: id,
    });
  };

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadArtikel);

    return () => {
      willFocusSub.remove();
    };
  }, [loadArtikel]);

  useEffect(() => {
    setIsLoading(true);
    loadArtikel().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadArtikel]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{color: isEnabled ? 'white' : 'black'}}>
          Terjadi Kesalahan
        </Text>
        <Button title="Ulangi Lagi" onPress={loadArtikel} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  if (!isLoading && kategoris.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{color: isEnabled ? 'white' : 'black'}}>
          Saat ini belum tersedia pilihan kategori
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.home, {backgroundColor: isEnabled ? 'black' : 'white'}]}>
      <FlatList
        onRefresh={loadArtikel}
        refreshing={isRefreshing}
        data={kategoris}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(itemdata) => (
          <ItemHome
            onSelect={() => {
              selectItemHandler(itemdata.item.id);
            }}
            kategori={itemdata.item.kategori}
            image={itemdata.item.gambar}
          />
        )}
      />
    </View>
  );
};

HomeScreen.navigationOptions = (navData) => {
  const click = () => {
    navData.navigation.navigate('Setting');
  };

  return {
    headerShown: true,
    title: 'Voice of Bayyinah',
    headerRight: () => (
      <TouchableOpacity style={{marginRight: 16}} onPress={click}>
        <Icon name="settings" size={20} color="white" />
      </TouchableOpacity>
    ),
    headerStyle: {
      backgroundColor: '#DD0004',
    },
    headerTintColor: 'white',
  };
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
