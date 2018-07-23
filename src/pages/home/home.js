import React from 'react';
import { Button, View, Text } from 'react-native';


 class home extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>go to add Reource page</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Resource')}
        />
    
      </View>
    );
  }
}

export default home;
