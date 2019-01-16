import React from "react";
import { View, StyleSheet, Text, TextInput, Image } from "react-native";
import {
  Icon,
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from "react-native-elements";
import { createStackNavigator } from "react-navigation";
import { Auth } from "aws-amplify";
import Constants from "../Utils/constants";
import { colors } from "theme";

class SignUp extends React.Component {
  static navigationOptions = {
    title: "Sign up",
    headerTitleStyle: {
      color: "white"
    },
    headerStyle: {
      backgroundColor: "#0D1E30",
      shadowColor: "transparent",
      elevation: 0,
      shadowOpacity: 0
    }
  };
  state = {
    showMFAPrompt: false,
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    errorMessage: ""
  };

  async handleSignUp() {
    const { username, password, email, phoneNumber } = this.state;
    let userConfirmed = true;

    Auth.signUp({
      username,
      password,
      attributes: {
        email // optional
        // optional - E.164 number convention
        // other custom attributes
      }
    })
      .then(data => console.log(data))
      .catch(err => console.log("Auth signup ", err));
  }

  checkPhonePattern = phone => {
    return /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(phone);
  };

  onPhoneSubmit(event) {
    const isValidPhone = this.checkPhonePattern(event.nativeEvent.text);

    this.setState({
      errorMessage:
        !isValidPhone &&
        "Please enter a phone number with the format +(countrycode)(number) such as +12223334444"
    });
  }

  render() {
    return (
      <View style={styles.bla}>
        <View style={styles.formContainer}>
          <View>
            <FormValidationMessage>
              {this.state.errorMessage}
            </FormValidationMessage>
            <FormLabel labelStyle={{ color: "white" }}>Username</FormLabel>
            <FormInput
              editable
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor={"#00A3FF"}
              inputStyle={{
                fontSize: 26,
                borderWidth: 0.5,
                borderColor: "#d6d7da",
                color: "white"
              }}
              underlineColorAndroid="transparent"
              returnKeyType="next"
              ref="username"
              textInputRef="usernameInput"
              containerStyle={{
                borderWidth: 0.5,
                borderColor: "#d6d7da",
                alignSelf: "stretch"
              }}
              onSubmitEditing={() => {
                this.refs.password.refs.passwordInput.focus();
              }}
              value={this.state.username}
              onChangeText={username => this.setState({ username })}
            />
            {false && (
              <FormValidationMessage>Error message</FormValidationMessage>
            )}
          </View>
          <View>
            <FormLabel labelStyle={{ color: "white" }}>Password</FormLabel>
            <FormInput
              editable
              autoCapitalize="none"
              selectionColor={"#00A3FF"}
              inputStyle={{
                fontSize: 26,
                borderWidth: 0.5,
                borderColor: "#d6d7da",
                color: "white"
              }}
              underlineColorAndroid="transparent"
              returnKeyType="next"
              ref="password"
              textInputRef="passwordInput"
              containerStyle={{
                borderWidth: 0.5,
                borderColor: "#d6d7da",
                alignSelf: "stretch"
              }}
              onSubmitEditing={() => {
                this.refs.email.refs.emailInput.focus();
              }}
              secureTextEntry
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
            {false && (
              <FormValidationMessage>Error message</FormValidationMessage>
            )}
          </View>
          <View>
            <FormLabel labelStyle={{ color: "white" }}>Email</FormLabel>
            <FormInput
              editable
              autoCapitalize="none"
              keyboardType="email-address"
              selectionColor={"#00A3FF"}
              inputStyle={{
                fontSize: 26,
                borderWidth: 0.5,
                borderColor: "#d6d7da",
                color: "white"
              }}
              underlineColorAndroid="transparent"
              returnKeyType="next"
              ref="email"
              textInputRef="emailInput"
              containerStyle={{
                borderWidth: 0.5,
                borderColor: "#d6d7da",
                alignSelf: "stretch"
              }}
              onSubmitEditing={() => {
                this.refs.phone.refs.phoneInput.focus();
              }}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
            {false && (
              <FormValidationMessage>Error message</FormValidationMessage>
            )}
          </View>
          <View>
            <FormLabel labelStyle={{ color: "white" }}>Phone Number</FormLabel>
            <FormInput
              editable
              autoCapitalize="none"
              keyboardType="phone-pad"
              selectionColor={"#00A3FF"}
              underlineColorAndroid="transparent"
              returnKeyType="next"
              ref="phone"
              textInputRef="phoneInput"
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
              value={this.state.phoneNumber}
              onBlur={this.onPhoneSubmit}
              onSubmitEditing={this.onPhoneSubmit}
              onChangeText={phoneNumber => this.setState({ phoneNumber })}
            />
            {false && (
              <FormValidationMessage>Error message</FormValidationMessage>
            )}
          </View>
          <Button
            title="Sign Up"
            backgroundColor="#00A3FF"
            buttonStyle={{
              borderRadius: 30,
              marginTop: 30,
              marginRight: 0,
              marginBottom: 0,
              height: 40
            }}
            icon={{ name: "lock", size: 18, type: "font-awesome" }}
            onPress={this.handleSignUp}
          />
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

export default SignUp;
