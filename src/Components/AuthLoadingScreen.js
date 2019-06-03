import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { Auth } from "aws-amplify";
import { NavigationActions } from "react-navigation";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => {
        console.log(user);
        this.props.navigation.navigate("App");
      })
      .catch(err => {
        console.log("not-authenticated");
        this.props.navigation.navigate("Auth");
      });
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
export default AuthLoadingScreen;
