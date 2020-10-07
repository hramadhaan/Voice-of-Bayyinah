import React, {useState, useReducer, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Image,
  Button,
  ActivityIndicator,
} from 'react-native';
import Input from '../../../components/Input';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import * as kategoriAction from '../../../store/action/KategoriAction';
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

const AddKategoriScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [isImage, setIsImage] = useState(null);

  const kategoriId = props.navigation.getParam('kategoriId');
  const editedKategori = useSelector((state) =>
    state.kategori.kategoris.find((kat) => kat.id === kategoriId),
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
  }, [loadKey]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      judul: editedKategori ? editedKategori.kategori : '',
    },
    inputValidities: {
      judul: editedKategori ? true : false,
    },
    formIsValid: editedKategori ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Wrong Input', error, [{text: 'Okay'}]);
    }
  }, [error]);

  const showImage = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.5,
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      // console.log(response);

      if (response.didCancel) {
        console.log('User cancellled image picker');
      } else if (response.error) {
        console.log(response.error);
      } else {
        const source = await {uri: response.uri};
        // console.log(source);
        setIsImage(source);
      }
    });
  };

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

  const submitHandler = async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong Input', 'Please check the errors in the form.', [
        {
          text: 'Okay',
        },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedKategori) {
        // KOSONG
        await dispatch(
          kategoriAction.updatedKategori(
            kategoriId,
            formState.inputValues.judul,
            isImage,
            editedKategori.fileName,
          ),
        );
        setIsLoading(false);
        // console.log(editedKategori.fileName);
      } else {
        await dispatch(
          kategoriAction.createKategori(formState.inputValues.judul, isImage),
        );
        setIsLoading(false);
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.main}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="judul"
            label="Nama Kategori"
            errorText="Please enter a valid judul"
            keyboardType="default"
            onInputChange={inputChangeHandler}
            initialValue={editedKategori ? editedKategori.kategori : ''}
            initiallyValid={!!editedKategori}
            required
          />
          <TouchableOpacity style={{marginTop: 12}} onPress={showImage}>
            {isImage === null ? (
              <View
                style={[
                  styles.gambar,
                  {backgroundColor: isEnabled ? '#212121' : '#ccc'},
                ]}>
                <Icon name="camera" size={36} color="grey" />
                <Text style={{color: 'grey', fontSize: 13}}>
                  Masukkan Foto Header
                </Text>
              </View>
            ) : (
              <Image
                source={isImage}
                resizeMode="cover"
                style={{width: '100%', height: 190}}
              />
              // <Text>{isImage.uri}</Text>
            )}
          </TouchableOpacity>
          {editedKategori ? (
            <View style={{marginTop: 16}}>
              <Text style={{color: isEnabled ? 'white' : 'black'}}>
                Gambar saat ini
              </Text>
              <Image
                style={{width: '100%', height: 190, marginTop: 12}}
                source={{uri: editedKategori.gambar}}
              />
            </View>
          ) : null}
          <View style={{marginTop: 16}}>
            <Button
              title={editedKategori ? 'UPDATE' : 'SUBMIT'}
              color="red"
              onPress={submitHandler}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

AddKategoriScreen.navigationOptions = (navData) => {
  const id = navData.navigation.getParam('kategoriId');
  return {
    title: id ? 'Edit Kategori' : 'Tambah Kategori',
  };
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  form: {
    margin: 20,
  },
  gambar: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddKategoriScreen;
