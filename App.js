import React from 'react';
import { StackNavigator } from 'react-navigation';
import Amplify, { API }  from 'aws-amplify';
import awsmobile from './src/aws-exports';
import resource from './src/pages/resource'; 
import home from './src/pages/home'; 


// Version can be specified in package.json
Amplify.configure(awsmobile);

const RootStack = StackNavigator(
  {
    Home: {
      screen: home,
    },
    Resource: {
      screen: resource,
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
