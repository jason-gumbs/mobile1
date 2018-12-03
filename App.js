global.Buffer = global.Buffer || require('buffer').Buffer;
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from 'react-navigation';
import Amplify, {API, Storage }  from 'aws-amplify';
import awsmobile from './src/aws-exports';
import resource from './src/pages/resource';
import viewResource from './src/pages/viewResource';
import search from './src/pages/search';
import home from './src/pages/home';
import map from './src/pages/map'


// Version can be specified in package.json
Amplify.configure(awsmobile);

const RootStack = createStackNavigator(
  {
    Home: {
      screen: home,
    },
    Resource: {
      screen: resource,
    },
    Search: {
      screen: search,
    },
    Maps: {
      screen: map,
    },
    ViewResource: {
      screen: viewResource,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  componentDidMount() {
   SplashScreen.hide()
 }
  render() {
    return <RootStack />;
  }
}
