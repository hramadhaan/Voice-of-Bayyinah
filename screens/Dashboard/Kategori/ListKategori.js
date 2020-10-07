import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import * as kategoriAction from '../../../store/action/KategoriAction';
import ItemKategori from '../../../components/ItemKategori';

const ListKategoriScreen = (props) => {
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

  const loadKategori = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(kategoriAction.fetchKategori());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadKategori,
    );
    return () => {
      willFocusSub.remove();
    };
  }, [loadKategori]);

  useEffect(() => {
    setIsLoading(true);
    loadKategori().then(() => {
      setIsLoading(false);
    });
    props.navigation.setParams({
      add: addKategoriScreen,
    });
  }, [dispatch, loadKategori, addKategoriScreen]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button title="Try Again" onPress={loadKategori} />
      </View>
    );
  }

  const addKategoriScreen = useCallback(() => {
    props.navigation.navigate('AddKategori');
  });

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('AddKategori', {
      kategoriId: id,
      kategoriTitle: title,
    });
  };

  const deleteHandler = (id, fileName) => {
    Alert.alert(
      'Are you sure ?',
      'Do you really want to delete this category?',
      [
        {text: 'No', style: 'default'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            dispatch(kategoriAction.deleteKategori(id, fileName));
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoading && kategoris.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <FlatList
        onRefresh={loadKategori}
        refreshing={isRefreshing}
        data={kategoris}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ItemKategori
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.kategori);
            }}
            kategori={itemData.item.kategori}
            onRemove={() => {
              deleteHandler(itemData.item.id);
            }}
          />
        )}
      />
    </View>
  );
};

ListKategoriScreen.navigationOptions = (navData) => {
  const add = navData.navigation.getParam('add');

  return {
    headerRight: () => (
      <Icon
        name="plus"
        color="white"
        style={{marginRight: 16}}
        size={22}
        onPress={add}
      />
    ),
    title: 'List Kategori',
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
  floatButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListKategoriScreen;
