import React, {useState, useReducer, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Button,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Input from '../../components/Input';
import {Picker} from '@react-native-community/picker';
import * as artikelAction from '../../store/action/ArtikelAction';
import * as kategoriAction from '../../store/action/KategoriAction';
import AsyncStorage from '@react-native-community/async-storage';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AddArtikelScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const artikelId = props.navigation.getParam('artikelId');
  const [isKategori, setIsKategori] = useState('');
  const kategoriId = props.navigation.getParam('kategoriId');

  const kategoris = useSelector((state) => state.kategori.kategoris);

  const editedArtikel = useSelector((state) =>
    state.artikel.artikel.find((art) => art.id === artikelId),
  );
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
    if (kategoriId) {
      setIsKategori(kategoriId);
    }
  }, [loadKey]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      judul: editedArtikel ? editedArtikel.judul : '',
      penulis: editedArtikel ? editedArtikel.penulis : '',
      partOne: editedArtikel ? editedArtikel.partOne : '',
      partTwo: editedArtikel ? editedArtikel.partTwo : '',
      partThree: editedArtikel ? editedArtikel.partThree : '',
      hashtag: editedArtikel ? editedArtikel.hashtag : '',
    },
    inputValidities: {
      judul: editedArtikel ? true : false,
      penulis: editedArtikel ? true : false,
      partOne: editedArtikel ? true : false,
      partTwo: editedArtikel ? true : false,
      partThree: editedArtikel ? true : false,
      hashtag: editedArtikel ? true : false,
    },
    formIsValid: editedArtikel ? true : false,
  });

  const loadKategori = useCallback(async () => {
    setError(null);
    try {
      await dispatch(kategoriAction.fetchKategori());
    } catch (err) {
      setError(err.message);
    }
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
  }, [dispatch, loadKategori]);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error, [
        {
          text: 'Okay',
        },
      ]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (
      formState.inputValues.judul === '' ||
      formState.inputValues.penulis === '' ||
      isKategori === '' ||
      formState.inputValues.partOne === '' ||
      formState.inputValues.hashtag === ''
    ) {
      Alert.alert(
        'Wrong input!',
        'Harap masukkan kolom judul, penulis, part satu, dan hashtag',
        [{text: 'Okay'}],
      );
      setIsLoading(false);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedArtikel) {
        await dispatch(
          artikelAction.updateArtikel(
            artikelId,
            formState.inputValues.judul,
            formState.inputValues.penulis,
            isKategori,
            formState.inputValues.partOne,
            formState.inputValues.partTwo,
            formState.inputValues.partThree,
            formState.inputValues.hashtag,
            editedArtikel.kategoriId,
          ),
        );
      } else {
        if (formState.inputValues.partOne === '') {
          Alert.alert(
            'Wrong input!',
            'Posting Pertama harus menampilkan part satu',
            [{text: 'Okay'}],
          );
          setIsLoading(false);
          return;
        }
        await dispatch(
          artikelAction.addArtikel(
            formState.inputValues.judul,
            formState.inputValues.penulis,
            isKategori,
            formState.inputValues.partOne,
            formState.inputValues.partTwo,
            formState.inputValues.partThree,
            formState.inputValues.hashtag,
          ),
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, kategoriId, formState]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState],
  );

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
        <Text>Tidak ada pilihan kategori</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{flex: 1, backgroundColor: isEnabled ? '#212121' : 'white'}}>
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.form}>
          <Input
            id="judul"
            label="Judul"
            errorText="Harap isi dengan benar"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedArtikel ? editedArtikel.judul : ''}
            initiallyValid={!!editedArtikel}
            required
            fontWeights="bold"
          />
          <Input
            id="penulis"
            label="Penulis"
            errorText="Harap isi dengan benar"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedArtikel ? editedArtikel.penulis : ''}
            initiallyValid={!!editedArtikel}
            required
            fontWeights="bold"
          />

          <Input
            id="partOne"
            label="Part Satu"
            errorText="Harap isi dengan benar"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            onInputChange={inputChangeHandler}
            initialValue={editedArtikel ? editedArtikel.partOne : ''}
            initiallyValid={!!editedArtikel}
            required
            multiline
            textAlignVertical="top"
            returnKeyType="none"
            fontWeights="bold"
          />

          <Input
            id="partTwo"
            label="Part Dua"
            errorText="Harap isi dengan benar"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            onInputChange={inputChangeHandler}
            initialValue={editedArtikel ? editedArtikel.partTwo : ''}
            initiallyValid={!!editedArtikel}
            multiline
            textAlignVertical="top"
            returnKeyType="none"
            fontWeights="bold"
          />

          <Input
            id="partThree"
            label="Part Tiga"
            errorText="Harap isi dengan benar"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            onInputChange={inputChangeHandler}
            initialValue={editedArtikel ? editedArtikel.partThree : ''}
            initiallyValid={!!editedArtikel}
            multiline
            textAlignVertical="top"
            returnKeyType="none"
            fontWeights="bold"
          />

          <Input
            id="hashtag"
            label="Hashtag"
            errorText="Harap isi dengan benar"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedArtikel ? editedArtikel.hashtag : ''}
            initiallyValid={!!editedArtikel}
            required
            fontWeights="bold"
          />

          <View>
            <Text
              style={{
                marginVertical: 8,
                color: isEnabled ? 'white' : 'black',
                fontWeight: 'bold',
              }}>
              Pilih Kategori
            </Text>
            <Picker
              style={{
                marginVertical: 5,
                width: '100%',
                color: isEnabled ? 'white' : 'black',
              }}
              itemStyle={{
                backgroundColor: isEnabled ? 'black' : 'black',
                borderWidth: 1,
              }}
              selectedValue={isKategori}
              onValueChange={(itemValue, itemIndex) =>
                setIsKategori(itemValue)
              }>
              <Picker.Item label="Pilih Kategori" value="" />
              {kategoris.map((element) => (
                <Picker.Item
                  key={element.id}
                  label={element.kategori}
                  value={element.id}
                />
              ))}
            </Picker>
          </View>

          <View style={{marginVertical: 8}}>
            <Button
              title={editedArtikel ? 'UPDATE' : 'SUBMIT'}
              color="red"
              onPress={submitHandler}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

AddArtikelScreen.navigationOptions = (navData) => {
  const id = navData.navigation.getParam('artikelId');
  return {
    title: id ? 'Edit Artikel' : 'Tambah Artikel',
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddArtikelScreen;
