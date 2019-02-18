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
  Image,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions
} from "react-native";
import { Input, Button } from "react-native-elements";
import { Auth } from "aws-amplify";
import { colors } from "../Utils/theme";
import styles from "../styles/styles";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

class ForgotPassword extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#0D1E30",
      shadowColor: "transparent",
      elevation: 0,
      shadowOpacity: 0
    },
    headerTitleStyle: {
      color: "white"
    },
    headerTintColor: "white"
  };
  state = {
    currentUser: null,
    username: "",
    password: "",
    errorMessage: "",
    showActivityIndicator: false
  };

  async componentDidMount() {
    this.getCurrentUser();
  }

  async getCurrentUser() {
    return await Auth.currentSession()
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleResetClick() {
    const { auth } = this.props;
    const { username, currentUser: user } = this.state;
    const send = user ? user.username : username;
    auth
      .forgotPassword(send)
      .then(this.setState({ showMFAPrompt: true }))
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { currentUser: user } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{ color: "white" }}>
          {user
            ? "Change your password"
            : "Please enter your username and we’ll help you reset your password."}
        </Text>
        <View style={styles.formContainer}>
          <Input
            label="username"
            labelStyle={{ color: "white", marginBottom: 5 }}
            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: "#d6d7da",
              marginBottom: 0
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            selectionColor="white"
            autoCapitalize="none"
            autoCorrect={false}
            editable={user == null}
            placeholder="Please enter your username"
            placeholderTextColor="white"
            returnKeyType="next"
            ref="username"
            textInputRef="usernameInput"
            leftIcon={{
              type: "font-awesome",
              name: "user",
              color: colors.primary
            }}
            onChangeText={username => this.setState({ username })}
            value={user ? user.username : this.state.username}
          />
          <Button
            fontFamily="lato"
            containerViewStyle={{ marginTop: 20 }}
            backgroundColor={colors.primary}
            buttonStyle={{
              borderRadius: 30,
              marginTop: 15,
              marginRight: 0,
              marginBottom: 0,
              height: 50
            }}
            large
            title="RESET"
            loading={this.state.showActivityIndicator ? true : false}
            onPress={this.handleResetClick}
          />
        </View>
      </ScrollView>
    );
  }
}

export default ForgotPassword;
