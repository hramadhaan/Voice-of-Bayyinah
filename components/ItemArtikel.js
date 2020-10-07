import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';

const db = SQLite.openDatabase(
  {name: 'Favorite.db'},
  () => {},
  (error) => {
    console.log('Error: ' + error);
  },
);

const ItemArtikel = (props) => {
  const [isLiked, setIsLiked] = useState(false);

  const {id, onSelect, judul, penulis, hashtag, kategoriId} = props;

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
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_favorite where favorite_id=?',
        [id],
        (tx, results) => {
          if (results.rows.length > 0) {
            setIsLiked(true);
          } else {
            setIsLiked(false);
          }
          console.log('ROW: ', results.rows.length);
        },
      );
    });
  });

  const deleteToFavorite = (idArtikel) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM table_favorite where favorite_id=?',
        [idArtikel],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setIsLiked(false);
            alert('Berhasil di hapus');
          }
        },
      );
    });
  };

  const saveToFavorite = (
    idArtikel,
    judulArtikel,
    penulisArtikel,
    kategoriArtikel,
    hashtagArtikel,
  ) => {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO table_favorite (favorite_id, judul, penulis, kategori, hashtag) VALUES (?,?,?,?,?)',
        [
          idArtikel,
          judulArtikel,
          penulisArtikel,
          kategoriArtikel,
          hashtagArtikel,
        ],
        (tx, results) => {
          console.log('Results: ', idArtikel);
          if (results.rowsAffected > 0) {
            setIsLiked(true);
            Alert.alert('Success', 'Favorite ditambahkan', [{text: 'Ok'}]);
          } else {
            alert('Gagal menambahkan favorite !');
          }
        },
      );
    });
    console.log(kategoriArtikel);
  };

  const setLike = () => {
    // console.log('KlikI');
    if (isLiked) {
      console.log('Mau di dislike');
      deleteToFavorite(id);
    } else {
      console.log('Mau di like');
      saveToFavorite(id, judul, penulis, kategoriId, hashtag);
      console.log(kategoriId);
    }
  };

  return (
    <View
      style={[styles.main, {backgroundColor: isEnabled ? 'black' : 'white'}]}>
      <TouchableOpacity style={{width: 300, maxWidth: 300}} onPress={onSelect}>
        <View style={styles.subMain}>
          <Text
            style={[
              styles.judul,
              {fontSize: 16, color: isEnabled ? 'white' : 'black'},
            ]}
            numberOfLines={2}
            ellipsizeMode="tail">
            {judul}
          </Text>
          <Text
            style={[styles.penulis, {color: isEnabled ? 'white' : 'black'}]}>
            {penulis}
          </Text>
          <Text
            style={[styles.hashtag, {color: isEnabled ? 'white' : 'black'}]}>
            {hashtag}
          </Text>
        </View>
      </TouchableOpacity>
      {isLiked ? (
        <IconMaterial name="favorite" color="red" size={20} onPress={setLike} />
      ) : (
        <Icon
          name="heart"
          color={isEnabled ? 'white' : 'black'}
          size={18}
          onPress={setLike}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  judul: {
    fontWeight: 'bold',
    maxWidth: 300,
  },
  main: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hashtag: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  subMain: {
    flexDirection: 'column',
  },
  penulis: {
    fontSize: 14,
  },
});

export default ItemArtikel;
