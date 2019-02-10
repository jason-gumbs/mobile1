import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  Modal,
  Dimensions
} from "react-native";
import { Icon } from "react-native-elements";

class SigninLogo extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: 50
        }}
      >
        <Icon
          name="external-link"
          type="evilicon"
          color="#00aced"
          size={40}
          onPress={this.props.handleSigninClick}
          containerStyle={{ marginTop: 5, marginRight: 20 }}
        />
      </View>
    );
  }
}

export default SigninLogo;
