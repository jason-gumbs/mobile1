import React from "react";
import { Text } from "react-native";

export default class SignOut extends React.Component {
  componentDidMount() {
    const { auth } = this.props.screenProps;
    auth.signOut();

    this.props.rootNavigator.navigate("Home");
  }

  render() {
    return <Text>Sign Out</Text>;
  }
}
