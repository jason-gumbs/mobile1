import React from 'react';
import { Button, View, Text } from 'react-native';


 class home extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>go to add Reource page</Text>
        <Button
          title="Add Resource"
          onPress={() => this.props.navigation.push('Resource')}
        />
           <Text>view resources</Text>
        <Button
          title="search Resources"
          onPress={() => this.props.navigation.push('Search')}
        />
    
      </View>
    );
  }
}

export default home;
