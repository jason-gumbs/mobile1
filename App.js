import React from 'react';
import { StackNavigator } from 'react-navigation';
import button from './src/pages/button' 
import home from './src/pages/home' 


// Version can be specified in package.json


const RootStack = StackNavigator(
  {
    Home: {
      screen: home,
    },
    Details: {
      screen: button,
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
