import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import * as artikelAction from '../../store/action/ArtikelAction';
import * as kategoriAction from '../../store/action/KategoriAction';
import ItemArtikel from '../../components/ItemArtikel';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Feather';

const PostScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const artikel = useSelector((state) => state.artikel.artikel);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [holder, setHolder] = useState([]);

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

  const loadArtikel = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(artikelAction.fetchArtikel());
      await dispatch(kategoriAction.fetchKategori());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadArtikel().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadArtikel]);

  useEffect(() => {
    setData(artikel);
    setHolder(artikel);
  }, [artikel]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{color: isEnabled ? 'white' : 'black'}}>
          An error occurred!
        </Text>
        <Button title="Try again" onPress={loadArtikel} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (artikel.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{color: isEnabled ? 'white' : 'black'}}>
          Tidak ada artikel dalam New Post ini
        </Text>
      </View>
    );
  }

  const selectItemHandler = (id, title, kategori) => {
    props.navigation.navigate('DetailScreen', {
      postId: id,
      postTitle: title,
      kategori: kategori,
    });
  };

  const searchFilterFunction = (text) => {
    const newData = holder.filter((item) => {
      const itemData = `${item.judul.toUpperCase()} ${item.partOne.toUpperCase()} ${item.partTwo.toUpperCase()} ${item.partThree.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setData(newData);
  };

  return (
    <View
      style={[styles.main, {backgroundColor: isEnabled ? 'black' : 'white'}]}>
      <View
        style={{
          backgroundColor: isEnabled ? '#262626' : 'white',
          borderColor: isEnabled ? '#262626' : '#ccc',
          borderWidth: 0.8,
          margin: 8,
          borderRadius: 8,
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TextInput
          placeholder="Mau cari apa ?"
          style={{
            color: isEnabled ? 'white' : 'black',
          }}
          placeholderTextColor={isEnabled ? '#a0a0a0' : 'black'}
          onChangeText={(text) => searchFilterFunction(text)}
        />
        <Icon name="search" size={18} color={isEnabled ? 'white' : '#262626'} />
      </View>
      <FlatList
        onRefresh={loadArtikel}
        refreshing={isRefreshing}
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 16,
          marginTop: 8,
          backgroundColor: isEnabled ? 'black' : 'white',
        }}
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderColor: isEnabled ? 'white' : '#ccc',
              borderWidth: 0.2,
            }}
          />
        )}
        renderItem={(itemData) => (
          <ItemArtikel
            judul={itemData.item.judul}
            penulis={itemData.item.penulis}
            hashtag={itemData.item.hashtag}
            kategoriId={itemData.item.kategoriId}
            id={itemData.item.id}
            onSelect={() => {
              // const pdfFull = itemData.item.fullPdf;
              console.log(itemData.item.kategoriId);
              selectItemHandler(
                itemData.item.id,
                itemData.item.judul,
                itemData.item.kategoriId,
              );
            }}
          />
        )}
      />
    </View>
  );
};

PostScreen.navigationOptions = (navData) => {
  return {
    title: 'New Post',
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
  },
});

export default PostScreen;
