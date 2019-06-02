import React from "react";
import { View, Text } from "react-native";
import { Button, Icon } from "react-native-elements";

class SignOut extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: 50
        }}
      >
        <Button
          icon={
            <Icon name="exclamation" type="evilicon" color="white" size={40} />
          }
          onPress={this.props.signout}
        />
      </View>
    );
  }
}

export default SignOut;
