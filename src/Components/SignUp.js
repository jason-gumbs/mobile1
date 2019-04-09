import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Icon, Input, Button } from "react-native-elements";
import { createStackNavigator } from "react-navigation";
import { Auth } from "aws-amplify";
import LogoTitle from "./LogoTitle";
import MyAppText from "./MyAppText";
import Constants from "../Utils/constants";
import { colors } from "../Utils/theme";
import { createCompany } from "../graphql/mutations";
import { listCompanys } from "../graphql/queries";
import { graphql } from "react-apollo";

class SignUp extends React.Component {
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
    username: "",
    password: "",
    confirmpassword: "",
    email: "",
    phoneNumber: "",
    errorMessage: ""
  };

  handleSignUp = e => {
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
      .then(data => {
        this.props.createCompany({
          id: "",
          companyname: username,
          email: email,
          phonenumber: phoneNumber,
          visibility: "public",
          files: null
        });
      })
      .then(mutationData => console.log(mutationData))
      .catch(err => console.log("Auth signup ", err));
  };

  // checkPhonePattern = phone => {
  //   return /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(phone);
  // };

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
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <Input
            label="Org. Name"
            labelStyle={{ color: "white", marginBottom: 5 }}
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor={"white"}
            inputContainerStyle={{
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            returnKeyType="next"
            ref="username"
            textInputRef="usernameInput"
            onSubmitEditing={() => {
              this.refs.password.refs.passwordInput.focus();
            }}
            value={this.state.username}
            onChangeText={username => this.setState({ username })}
            leftIcon={{
              type: "font-awesome",
              name: "user",
              color: colors.primary
            }}
          />

          <Input
            label="Password"
            labelStyle={{ color: "white", marginBottom: 5 }}
            autoCapitalize="none"
            selectionColor={"white"}
            inputContainerStyle={{
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            returnKeyType="next"
            ref="password"
            textInputRef="passwordInput"
            onSubmitEditing={() => {
              this.refs.email.refs.emailInput.focus();
            }}
            secureTextEntry
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            leftIcon={{
              type: "font-awesome",
              name: "lock",
              color: colors.primary
            }}
          />
          <Input
            label="Confirm Password"
            labelStyle={{ color: "white", marginBottom: 5 }}
            autoCapitalize="none"
            selectionColor={"white"}
            inputContainerStyle={{
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            returnKeyType="next"
            ref="confirmpassword"
            textInputRef="passwordInput"
            onSubmitEditing={() => {
              this.refs.email.refs.emailInput.focus();
            }}
            secureTextEntry
            value={this.state.confirmpassword}
            onChangeText={confirmpassword => this.setState({ confirmpassword })}
            leftIcon={{
              type: "font-awesome",
              name: "lock",
              color: colors.primary
            }}
          />

          <Input
            label="Email"
            labelStyle={{ color: "white", marginBottom: 5 }}
            autoCapitalize="none"
            keyboardType="email-address"
            selectionColor={"white"}
            inputContainerStyle={{
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            underlineColorAndroid="transparent"
            returnKeyType="next"
            ref="email"
            textInputRef="emailInput"
            onSubmitEditing={() => {
              this.refs.phone.refs.phoneInput.focus();
            }}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            leftIcon={{
              type: "font-awesome",
              name: "at",
              color: colors.primary
            }}
          />

          <Input
            label="Phone Number"
            labelStyle={{ color: "white", marginBottom: 5 }}
            autoCapitalize="none"
            keyboardType="phone-pad"
            selectionColor={"white"}
            underlineColorAndroid="transparent"
            returnKeyType="next"
            ref="phone"
            textInputRef="phoneInput"
            inputContainerStyle={{
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            value={this.state.phoneNumber}
            onChangeText={phoneNumber => this.setState({ phoneNumber })}
            leftIcon={{
              type: "font-awesome",
              name: "phone",
              color: colors.primary
            }}
          />

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
            icon={{
              name: "paper-plane",
              size: 18,
              color: "white",
              type: "font-awesome"
            }}
            onPress={this.handleSignUp}
          />
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  bla: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0D1E30",
    paddingRight: 20,
    paddingLeft: 20
  },
  formContainer: {
    justifyContent: "center",
    height: 420
  }
});

export default graphql(createCompany, {
  options: {
    refetchQueries: [{ query: listCompanys }],
    update: (dataProxy, { data: { createCompany } }) => {
      const query = listCompanys;
      const data = dataProxy.readQuery({ query });
      data.listCompanys = {
        ...data.listCompanys,
        items: [...data.listCompanys.items, createCompany]
      };
      dataProxy.writeQuery({ query, data });
    }
  },
  props: ({ ownProps, mutate }) => ({
    createCompany: resource =>
      mutate({
        variables: { input: resource },
        optimisticResponse: () => ({
          createCompany: {
            ...resource,
            __typename: "Company",
            file:
              resource.file == null
                ? null
                : { ...resource.file, __typename: "S3Object" },
            resources: {
              __typename: "ResourcePosts",
              items: [],
              nextToken: null
            }
          }
        })
      })
  })
})(SignUp);
