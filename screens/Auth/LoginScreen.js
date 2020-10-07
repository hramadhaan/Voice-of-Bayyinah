import React, {useCallback, useState, useReducer, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import Input from '../../components/Input';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import * as userAction from '../../store/action/AuthAction';

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

const LoginScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

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

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{text: 'Okay'}]);
    }
  }, [error]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  const submitHandler = async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        {text: 'Okay'},
      ]);
      return;
    }
    let action;

    action = userAction.login(
      formState.inputValues.email,
      formState.inputValues.password,
    );

    setError(null);
    setIsLoading(true);

    try {
      await dispatch(action);
      props.navigation.navigate('Auth');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
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
    <KeyboardAvoidingView>
      <ScrollView>
        <View style={styles.mainForm}>
          <Input
            id="email"
            label="E-Mail"
            errorText="Please enter a valid email"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={''}
            initiallyValid={''}
            required
          />
          <Input
            id="password"
            label="Password"
            errorText="Please enter a valid password"
            keyboardType="default"
            autoCorrect
            onInputChange={inputChangeHandler}
            initialValue={''}
            initiallyValid={''}
            secureTextEntry={true}
            required
            submitEditing={submitHandler}
          />

          <View style={{marginTop: 16}}>
            <Button title="Login" color="red" onPress={submitHandler} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

LoginScreen.navigationOptions = (navData) => {
  return {
    title: 'Login as Writer',
    headerLeft: () => null,
  };
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainForm: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  itemColumn: {
    flexDirection: 'column',
    marginTop: 12,
  },
  textInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  button: {
    marginTop: 16,
    backgroundColor: 'red',
    height: 36,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;
