import React from "react";
import { Text } from "react-native";
import { Icon } from "react-native-elements";

export default class SignOut extends React.Component {
  render() {
    return (<View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        height: 50
      }}
    >
      <Icon
        name="gear"
        type="evilicon"
        color="#00aced"
        size={40}
        onPress={this.props.handleSettingClick}
        containerStyle={{ marginTop: 5, marginRight: 20 }}
      />
    </View>)
  }
}

export default SignOut;
