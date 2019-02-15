import React, { Component } from "react";
import { View, Text } from "react-native";

class MyAppText extends Component {
  render() {
    return (
      <View>
        <Text style={{ fontSize: 20 }}>{this.props.children}</Text>
      </View>
    );
  }
}
