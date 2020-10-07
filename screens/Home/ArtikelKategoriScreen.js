import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ActivityIndicator,
  FlatList,
  ImageBackground,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import * as artikelAction from '../../store/action/ArtikelKategoriAction';
import ItemArtikel from '../../components/ItemArtikel';

const ArtikelKategoriScreen = (props) => {
  const kategoriId = props.navigation.getParam('kategoriId');
  const kategoriKatalog = useSelector((state) =>
    state.kategori.kategoris.find((kat) => kat.id === kategoriId),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const artikels = useSelector((state) => state.artikelKategori.subArtikel);
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

  const loadArtikels = useCallback(async () => {
    console.log('load artikel');
    setError(null);

    setIsRefreshing(true);
    try {
      dispatch(artikelAction.fetchSubArtikel(kategoriId));
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    console.log(kategoriId);
    setIsLoading(true);
    loadArtikels().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadArtikels]);

  const selectItemHandler = (id, title, gambar, kategori) => {
    props.navigation.navigate('Detail', {
      artikelId: id,
      artikelTitle: title,
      artikelGambar: gambar,
      kategori: kategori,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{color: isEnabled ? 'white' : 'black'}}>
          Terjadi masalah
        </Text>
        <Button title="Coba Ulangi" onPress={loadArtikels} />
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

  if (!isLoading && artikels.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{color: isEnabled ? 'white' : 'black'}}>
          Tidak ada artikel di kategori ini
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.main, {backgroundColor: isEnabled ? 'black' : 'white'}]}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{uri: kategoriKatalog.gambar}}
          style={styles.image}
          resizeMode="cover">
          <View style={{flex: 1, backgroundColor: 'black', opacity: 0.31}} />
          <Text style={styles.title}>{kategoriKatalog.kategori}</Text>
        </ImageBackground>
      </View>
      <FlatList
        style={{marginHorizontal: 16, marginTop: 8}}
        onRefresh={loadArtikels}
        refreshing={isRefreshing}
        showsVerticalScrollIndicator={false}
        data={artikels}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={{borderBottomColor: '#ccc', borderBottomWidth: 1}} />
        )}
        renderItem={(itemData) => (
          <ItemArtikel
            id={itemData.item.id}
            judul={itemData.item.judul}
            penulis={itemData.item.penulis}
            hashtag={itemData.item.hashtag}
            kategoriId={kategoriKatalog.id}
            onSelect={() => {
              console.log(itemData.item.id);
              selectItemHandler(
                itemData.item.id,
                itemData.item.judul,
                kategoriKatalog.gambar,
                kategoriKatalog.id,
              );
              // console.log(kategoriKatalog.id);
            }}
            onAdd={() => {
              console.log('Add to Favorites');
            }}
          />
        )}
      />
    </View>
  );
};

ArtikelKategoriScreen.navigationOptions = (navData) => {
  return {
    headerShown: false,
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
  imageContainer: {
    height: 180,
  },
  image: {
    height: '100%',
    width: '100%',
    color: 'black',
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    position: 'absolute',
    top: 15,
    left: 10,
  },
});

export default ArtikelKategoriScreen;
