global.Buffer = global.Buffer || require('buffer').Buffer;
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Amplify, {API, Storage }  from 'aws-amplify';
import awsmobile from './src/aws-exports';
import resource from './src/pages/resource';
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
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
