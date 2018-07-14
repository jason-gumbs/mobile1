import React from 'react';
import { Button, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import button from './src/pages/button' 
import home from './src/pages/home' 


// Version can be specified in package.json

// class HomeScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Home Screen</Text>
//         <Button
//           title="Go to Details sir "
//           onPress={() => this.props.navigation.navigate('Details')}
//         />
//       </View>
//     );
//   }
// }
//
// class DetailsScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Details Screen</Text>
//         <Button
//           title="Go to Details... again"
//           onPress={() => this.props.navigation.push('Details')}
//         />
//         <Button
//           title="Go to Home"
//           onPress={() => this.props.navigation.navigate('Home')}
//         />
//         <Button
//           title="Go back"
//           onPress={() => this.props.navigation.goBack()}
//         />
//       </View>
//     );
//   }
// }

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
