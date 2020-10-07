import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

const ItemKategori = (props) => {
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
    <View style={styles.item}>
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={props.onSelect}>
          <Text style={{color: isEnabled ? 'white' : 'black'}}>
            {props.kategori}
          </Text>
        </TouchableOpacity>
      </View>
      <Icon
        name="trash-2"
        color={isEnabled ? 'white' : 'black'}
        size={18}
        onPress={props.onRemove}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    height: 38,
    marginHorizontal: 8,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});

export default ItemKategori;
