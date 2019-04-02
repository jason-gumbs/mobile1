/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
import React from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { Icon, Input, Button } from "react-native-elements";
import { createStackNavigator } from "react-navigation";
import { Auth } from "aws-amplify";
import awsmobile from "../aws-exports";
import LogoTitle from "./LogoTitle";
import ForgotPassword from "./ForgotPassword";
import { colors } from "../Utils/theme";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  bla: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0D1E30"
  }
});

class UserConfirm extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle />,

      headerTitleStyle: {
        color: "white",
        alignSelf: "center",
        flex: 1
      },
      headerStyle: {
        backgroundColor: "#0D1E30",
        shadowColor: "transparent",
        elevation: 0,
        shadowOpacity: 0
      },
      headerTintColor: "white"
    };
  };
  state = {
    showActivityIndicator: false,
    username: "",
    code: "",
    showMFAPrompt: false,
    errorMessage: "",
    cognitoUser: ""
  };

  ConfirmEmail = e => {
    this.setState({ showActivityIndicator: true });
    const { username, code } = this.state;
    let errorMessage = "";
    let session = null;
    Auth.confirmSignUp(username, code)
      .then(data => {
        console.log(data) || this.setState({ showActivityIndicator: false });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <View style={styles.bla}>
        <Input
          label="Username"
          selectionColor={colors.primary}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          editable={true}
          placeholder="Please enter your username"
          returnKeyType="next"
          ref="username"
          textInputRef="usernameInput"
          inputContainerStyle={{
            borderRadius: 30,
            borderWidth: 1,
            borderColor: "#d6d7da"
          }}
          inputStyle={{ marginLeft: 5, color: "white" }}
          onSubmitEditing={() => {
            this.refs.password.refs.passwordInput.focus();
          }}
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
        />
        <Input
          label="Code"
          selectionColor={colors.primary}
          underlineColorAndroid="transparent"
          keyboardType="phone-pad"
          editable={true}
          secureTextEntry={true}
          inputContainerStyle={{
            borderRadius: 30,
            borderWidth: 1,
            borderColor: "#d6d7da"
          }}
          inputStyle={{ marginLeft: 5, color: "white" }}
          placeholder="Please enter your code"
          returnKeyType="next"
          ref="code"
          textInputRef="codeInput"
          onChangeText={code => this.setState({ code })}
          value={this.state.code}
        />
        <Button
          title="Confirm"
          backgroundColor="#00A3FF"
          buttonStyle={{
            borderRadius: 30,
            marginTop: 30,
            marginRight: 0,
            marginBottom: 0,
            height: 40
          }}
          icon={{
            name: "paper-plane",
            size: 18,
            color: "white",
            type: "font-awesome"
          }}
          loading={this.state.showActivityIndicator ? true : false}
          onPress={this.ConfirmEmail}
        />
      </View>
    );
  }
}

export default UserConfirm;
