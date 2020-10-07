import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation-tabs';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import HomeScreen from '../screens/Home/HomeScreen';
import PostScreen from '../screens/Post/PostScreen';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import Icon from 'react-native-vector-icons/Feather';
import SettingScreen from '../screens/Home/SettingScreen';
import ListArtikelScreen from '../screens/Dashboard/ListArtikelScreen';
import LoadingScreen from '../screens/LoadingScreen';
import ListKategoriScreen from '../screens/Dashboard/Kategori/ListKategori';
import AddKategoriScreen from '../screens/Dashboard/Kategori/AddKategori';
import AddArtikelScreen from '../screens/Dashboard/AddArtikelScreen';
import ArtikelKategoriScreen from '../screens/Home/ArtikelKategoriScreen';
import PartOneScreen from '../screens/Detail/PartOneScreen';
import PartThreeScreen from '../screens/Detail/PartThreeScreen';
import PartTwoScreen from '../screens/Detail/PartTwoScreen';
import AboutUsScreen from '../screens/Home/AboutUsScreen';

const tabs = createMaterialTopTabNavigator(
  {
    one: PartOneScreen,
    two: PartTwoScreen,
    three: PartThreeScreen,
  },
  {
    tabBarOptions: {
      tabStyle: {
        backgroundColor: '#DD0004',
      },
    },
    tabBarPosition: 'bottom',
  },
);

const Home = createStackNavigator(
  {
    Home: HomeScreen,
    Setting: SettingScreen,
    Login: LoginScreen,
    ArtikelKategori: ArtikelKategoriScreen,
    Detail: {
      screen: tabs,
      navigationOptions: {
        headerShown: false,
      },
    },
    AboutUs: {
      screen: AboutUsScreen,
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#DD0004',
      },
      headerTintColor: 'white',
    },
  },
);

Home.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == 'Detail') {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const Post = createStackNavigator(
  {
    Post: PostScreen,
    DetailScreen: {
      screen: tabs,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#DD0004',
      },
      headerTintColor: 'white',
      tabBarVisible: false,
    },
  },
);

Post.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == 'DetailScreen') {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const Favorites = createStackNavigator(
  {
    Favorite: FavoritesScreen,
    Details: {
      screen: tabs,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#DD0004',
      },
      headerTintColor: 'white',
    },
  },
);

Favorites.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == 'Details') {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const BottomNavigator = createBottomTabNavigator(
  {
    Home: Home,
    Post: {
      screen: Post,
      navigationOptions: {
        title: 'New Post',
      },
    },
    Favorite: Favorites,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'home';
        } else if (routeName === 'Post') {
          iconName = 'book';
        } else if (routeName === 'Favorite') {
          iconName = 'heart';
        }

        return <Icon name={iconName} size={20} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'red',
      inactiveTintColor: 'gray',
    },
  },
);

const Auth = createStackNavigator(
  {
    ListArtikel: ListArtikelScreen,
    ListKategori: ListKategoriScreen,
    AddKategori: AddKategoriScreen,
    AddArtikel: AddArtikelScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#DD0004',
      },
      headerTintColor: 'white',
    },
  },
);

const SwitchNavigator = createSwitchNavigator({
  Loading: LoadingScreen,
  App: BottomNavigator,
  Auth: Auth,
});

export default createAppContainer(SwitchNavigator);
