import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const ItemHome = (props) => {
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

  return (
    <View
      style={[
        styles.kategori,
        {backgroundColor: isEnabled ? '#212121' : 'white'},
      ]}>
      <TouchableOpacity onPress={props.onSelect} useForeground>
        <View style={styles.imageContainer}>
          <Image source={{uri: props.image}} style={styles.image} />
        </View>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[styles.title, {color: isEnabled ? 'white' : 'black'}]}>
          Kategori:
        </Text>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={[styles.text, {color: isEnabled ? 'white' : 'black'}]}>
          {props.kategori}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  kategori: {
    height: 200,
    margin: 20,
    overflow: 'hidden',
    elevation: 8,
    borderRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 12,
    marginHorizontal: 9,
    marginTop: 2,
  },
  text: {
    fontSize: 19,
    fontWeight: 'bold',
    marginHorizontal: 9,
  },
});

export default ItemHome;
