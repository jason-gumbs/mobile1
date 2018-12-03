global.Buffer = global.Buffer || require('buffer').Buffer;
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from 'react-navigation';
import Amplify, {API, Storage, Auth }  from 'aws-amplify';
import awsmobile from './src/aws-exports';
import resource from './src/pages/resource';
import viewResource from './src/pages/viewResource';
import search from './src/pages/search';
import home from './src/pages/home';
import map from './src/pages/map'
import SignIn from './src/Components/LogIn';
import SignUp from './src/Components/SignUp';
import MFAPrompt from './src/Components/MFAPrompt';


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
    SignUp: {
      screen: SignUp,
    },
    SignIn: {
      screen: SignIn,
    },
    UserConfirm: {
      screen: MFAPrompt,
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
