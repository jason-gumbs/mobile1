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
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from "react-native-elements";
import { createStackNavigator } from "react-navigation";
import { Auth } from "aws-amplify";
import ForgotPassword from "./ForgotPassword";
import { colors } from "../Utils/theme";
import Constants from "../Utils/constants";

const { width } = Dimensions.get("window");

class LogIn extends React.Component {
  state = {
    showActivityIndicator: false,
    username: "",
    password: "",
    showMFAPrompt: false,
    errorMessage: "",
    cognitoUser: ""
  };

  onLogIn = async () => {
    this.props.onLogIn();
  };
  doLogout = async () => {
    let session = null;

    session = Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };
  doLogin = async () => {
    const { username, password } = this.state;
    let errorMessage = "";
    let showMFAPrompt = false;
    let session = null;
    session = await Auth.signIn(username, password)
      .then(user => console.log(user))
      .catch(err => console.log("ERRORSS", err));

    this.setState(
      {
        showMFAPrompt,
        errorMessage,
        session,
        showActivityIndicator: false
      },
      () => {
        if (session) {
          this.onLogIn();
        }
      }
    );
  };

  handleLogInClick = () => {
    this.setState({ showActivityIndicator: true });

    setTimeout(this.doLogin, 0);
  };

  handleMFACancel() {
    this.setState({ showMFAPrompt: false });
  }

  handleMFASuccess() {
    this.setState(
      {
        showMFAPrompt: false
      },
      () => {
        this.onLogIn();
      }
    );
  }

  render() {
    return (
      <View style={styles.bla}>
        <Modal
          visible={this.state.showActivityIndicator}
          onRequestClose={() => null}
        >
          <ActivityIndicator style={styles.activityIndicator} size="large" />
        </Modal>

        <View style={styles.formContainer}>
          <FormValidationMessage labelStyle={styles.validationText}>
            {this.state.errorMessage}
          </FormValidationMessage>
          <FormLabel>Username</FormLabel>
          <FormInput
            inputStyle={{
              fontSize: 26,
              borderWidth: 0.5,
              borderColor: "#d6d7da",
              color: "white"
            }}
            containerStyle={{
              borderWidth: 0.5,
              borderColor: "#d6d7da",
              alignSelf: "stretch"
            }}
            selectionColor={"white"}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            editable={true}
            placeholder="Please enter your username"
            returnKeyType="next"
            ref="username"
            textInputRef="usernameInput"
            onSubmitEditing={() => {
              this.refs.password.refs.passwordInput.focus();
            }}
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
          />
          <FormLabel>Password</FormLabel>
          <FormInput
            inputStyle={{
              fontSize: 26,
              borderWidth: 0.5,
              borderColor: "#d6d7da",
              color: "white"
            }}
            containerStyle={{
              borderWidth: 0.5,
              borderColor: "#d6d7da",
              alignSelf: "stretch"
            }}
            selectionColor={"white"}
            underlineColorAndroid="transparent"
            editable={true}
            secureTextEntry={true}
            placeholder="Please enter your password"
            returnKeyType="next"
            ref="password"
            textInputRef="passwordInput"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <Button
            fontFamily="lato"
            containerViewStyle={{ marginTop: 20 }}
            backgroundColor={colors.primary}
            buttonStyle={{
              borderRadius: 30,
              marginTop: 30,
              marginRight: 0,
              marginBottom: 0,
              height: 40
            }}
            title="SIGN IN"
            onPress={this.handleLogInClick}
          />
          <Button
            fontFamily="lato"
            containerViewStyle={{ marginTop: 20 }}
            backgroundColor={colors.primary}
            buttonStyle={{
              borderRadius: 30,
              marginTop: 30,
              marginRight: 0,
              marginBottom: 0,
              height: 40
            }}
            title="LOG OUT"
            onPress={this.doLogout}
          />
          <Text
            onPress={() => this.props.navigation.navigate("ForgotPassword")}
            style={styles.passwordResetButton}
          >
            Forgot your password?
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  bla: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0D1E30"
  },
  formContainer: {
    justifyContent: "space-around",
    height: 420
  }
});

export default LogIn;
