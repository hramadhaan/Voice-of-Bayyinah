import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as userAction from '../../store/action/AuthAction';
import {useDispatch, useSelector} from 'react-redux';
import * as artikelAction from '../../store/action/ArtikelAction';
import moment from 'moment';
import ItemKategori from '../../components/ItemKategori';
import AsyncStorage from '@react-native-community/async-storage';

const ListArtikelScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const artikels = useSelector((state) => state.artikel.artikel);
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

  const loadArtikel = useCallback(async () => {
    // console.log(artikels.length);

    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(artikelAction.fetchArtikel());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    setData(artikels);
    setDataArray(artikels);
  }, [artikels]);

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

  const submitHandler = useCallback(async () => {
    try {
      await dispatch(userAction.logout());
    } catch (err) {
      console.log(err.message);
    }
    props.navigation.navigate('App');
  }, [dispatch]);

  useEffect(() => {
    props.navigation.setParams({
      submit: submitHandler,
    });
  }, [submitHandler]);

  const selectItemHandler = (id, title, kategoriId) => {
    props.navigation.navigate('AddArtikel', {
      artikelId: id,
      artikelTitle: title,
      kategoriId: kategoriId,
    });
  };

  const deleteHandler = (
    idArtikel,
    kategori,
    fileNameSatu,
    fileNameDua,
    fileNameTiga,
    fileNameFull,
  ) => {
    Alert.alert(
      'Are you sure ?',
      'Do you really want to delete this category?',
      [
        {text: 'No', style: 'default'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            dispatch(
              artikelAction.deleteArtikel(
                idArtikel,
                kategori,
                fileNameSatu,
                fileNameDua,
                fileNameTiga,
                fileNameFull,
              ),
            );
          },
        },
      ],
    );
  };

  const searchFilterFunction = (text) => {
    const newData = dataArray.filter((item) => {
      const itemData = item.judul ? item.judul.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setData(newData);
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button title="Try again" onPress={loadArtikel} />
        <TouchableOpacity
          style={styles.floatButton}
          onPress={() => {
            props.navigation.navigate('AddArtikel');
          }}>
          <Icon name="plus" color="white" size={24} />
        </TouchableOpacity>
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
        <Text>No products found. Maybe start adding some!</Text>
        <TouchableOpacity
          style={[styles.floatButton, {backgroundColor: 'red'}]}
          onPress={() => {
            props.navigation.navigate('AddArtikel');
          }}>
          <Icon name="plus" color="white" size={24} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.main}>
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
          placeholder="Cari berdasarkan judul artikel"
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
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={{borderBottomColor: '#ccc', borderBottomWidth: 1}} />
        )}
        renderItem={(itemData) => (
          <ItemKategori
            onSelect={() => {
              selectItemHandler(
                itemData.item.id,
                itemData.item.judul,
                itemData.item.kategoriId,
              );
              // console.log(itemData.item.timeStamp);
            }}
            kategori={itemData.item.judul}
            onRemove={() => {
              deleteHandler(
                itemData.item.id,
                itemData.item.kategoriId,
                itemData.item.fileNameSatu,
                itemData.item.fileNameDua,
                itemData.item.fileNameTiga,
                itemData.item.fileNameFull,
              );
              // console.log('ID: ' + itemData.item.kategoriId);
              // console.log('K ID: ' + itemData.item.kategoriId);
              // console.log('File 1: ' + itemData.item.fileNameSatu);
              // console.log('File 2: ' + itemData.item.fileNameTiga);
              // console.log('File 3: ' + itemData.item.fileNameFull);
            }}
          />
        )}
      />
      <TouchableOpacity
        style={[styles.floatButton, {backgroundColor: 'red'}]}
        onPress={() => {
          props.navigation.navigate('AddArtikel');
        }}>
        <Icon name="plus" color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
};

ListArtikelScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam('submit');

  return {
    title: 'Welcome Admin',
    headerRight: () => (
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={{marginLeft: 8, marginRight: 16}}
          onPress={() => {
            navData.navigation.navigate('ListKategori');
          }}>
          <Icon name="book" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={submitFn}>
          <Icon name="log-out" size={24} color="white" />
        </TouchableOpacity>
      </View>
    ),
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
  toolbar: {
    flexDirection: 'row',
  },
  floatButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListArtikelScreen;
