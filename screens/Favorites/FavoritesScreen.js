import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SQLite from 'react-native-sqlite-storage';
import ItemArtikel from '../../components/ItemArtikel';
import * as artikelAction from '../../store/action/ArtikelAction';
import AsyncStorage from '@react-native-community/async-storage';

const db = SQLite.openDatabase(
  {name: 'Favorite.db'},
  () => {},
  (error) => {
    console.log('Error: ' + error);
  },
);

const FavoritesScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const [items, setItems] = useState([]);

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

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM table_favorite', [], (tx, results) => {
          console.log('hasil:' + results);
          var temp = [];
          for (let i = 0; i < results.rows.length; i++) {
            temp.push(results.rows.item(i));
          }
          setItems(temp.reverse());
          console.log(temp);
        });
      });
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [setIsLoading, setError, db]);

  useEffect(() => {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [loadProducts]);

  useEffect(() => {
    dispatch(artikelAction.fetchArtikel()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  if (items.length === 0) {
    return (
      <View
        style={[
          styles.centered,
          {
            backgroundColor: isEnabled ? 'black' : 'white',
          },
        ]}>
        <Text
          style={{
            color: isEnabled ? 'white' : 'black',
            alignItems: 'center',
            textAlign: 'center',
          }}>
          Untuk saat ini kamu belum mempunyai artikel favorite
        </Text>
        <Button title="Try again" onPress={loadProducts} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.centered,
          {
            backgroundColor: isEnabled ? 'black' : 'white',
          },
        ]}>
        <Text style={{color: isEnabled ? 'white' : 'black'}}>
          An error occurred!
        </Text>
        <Button title="Try again" onPress={loadProducts} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View
        style={[
          styles.centered,
          {
            backgroundColor: isEnabled ? 'black' : 'white',
          },
        ]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const selectItemHandler = (id, title, kategoriId) => {
    props.navigation.navigate('Details', {
      favId: id,
      favTitle: title,
      kategori: kategoriId,
    });
    console.log(kategoriId);
  };

  return (
    <View style={{flex: 1, backgroundColor: isEnabled ? 'black' : 'white'}}>
      <FlatList
        style={{marginTop: 8, marginHorizontal: 12}}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={items}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <ItemArtikel
            judul={item.judul}
            penulis={item.penulis}
            kategoriId={item.kategoriId}
            hashtag={item.hashtag}
            id={item.favorite_id}
            onSelect={() => {
              selectItemHandler(item.favorite_id, item.judul, item.kategori);
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoritesScreen;
