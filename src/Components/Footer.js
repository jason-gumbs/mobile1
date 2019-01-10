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
import {
  DrawerNavigator,
  NavigationActions,
  createStackNavigator
} from "react-navigation";
import { Icon } from "react-native-elements";

class Footer extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: 50
        }}
      >
        <View style={{ width: 60, height: 50 }}>
          <Icon
            name="home"
            type="font-awesome"
            color="#00aced"
            size={40}
            onPress={this.props.handleHome}
            containerStyle={{ marginTop: 2, marginLeft: 20 }}
          />
        </View>
        <View style={{ width: 100, height: 100 }}>
          <Icon
            name="plus"
            type="evilicon"
            color="#00aced"
            size={80}
            onPress={this.props.handleAddResource}
            containerStyle={{
              marginTop: -30,
              backgroundColor: "#0D1E30",
              borderRadius: 100,
              width: 90,
              height: 90
            }}
          />
        </View>
        <View style={{ width: 60, height: 50 }}>
          <Icon
            name="star"
            type="evilicon"
            color="#00aced"
            size={40}
            containerStyle={{ marginTop: 10, marginRight: 20 }}
          />
        </View>
      </View>
    );
  }
}

export default Footer;
