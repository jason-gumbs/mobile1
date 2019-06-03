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
            <Icon
              name="exclamation"
              type="evilicon"
              color="#00aced"
              size={20}
            />
          }
          onPress={this.props.signout}
          title="Sign Out"
          containerStyle={{ marginTop: 10, marginRight: 20 }}
          titleStyle={{ fontSize: 13 }}
          type="outline"
        />
      </View>
    );
  }
}

export default SignOut;
