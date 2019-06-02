import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  Modal,
  Dimensions,
  ScrollView
} from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { createStackNavigator, NavigationActions } from "react-navigation";
import { Auth } from "aws-amplify";
import ForgotPassword from "./ForgotPassword";
import { colors } from "../Utils/theme";
import Constants from "../Utils/constants";

const { width } = Dimensions.get("window");

class LogIn extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#0D1E30",
      shadowColor: "transparent",
      borderBottomWidth: 0,
      elevation: 0,
      shadowOpacity: 0
    },
    headerTitleStyle: {
      color: "white"
    },
    headerTintColor: "white"
  };
  state = {
    showActivityIndicator: false,
    username: "",
    password: "",
    showErrorMessage: false,
    errorMessage: "Wrong password or user name please try again"
  };

  doLogin = async () => {
    const { username, password } = this.state;
    let showErrorMessage = false;
    await Auth.signIn(username, password)
      .then(user =>
        this.props.navigation.reset(
          [NavigationActions.navigate({ routeName: "Search" })],
          0
        )
      )
      .catch(err => {
        console.log("ERRORSS", err);
        this.setState({
          showErrorMessage: true,
          showActivityIndicator: false,
          errorMessage: err.message
        });
      });
  };

  handleLogInClick = () => {
    this.setState({ showActivityIndicator: true });

    this.doLogin();
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.image_view}>
            <Image
              style={{ width: 200, height: 200 }}
              source={{
                uri:
                  "https://raw.githubusercontent.com/wilfredgumbs/React-Frelief/master/client/src/pages/Home/logo.png"
              }}
            />
          </View>
          {this.state.showErrorMessage && (
            <Text style={{ color: "grey" }}>{this.state.errorMessage} </Text>
          )}

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
            selectionColor={"white"}
            autoCapitalize="none"
            autoCorrect={false}
            editable={true}
            returnKeyType="next"
            ref="username"
            textInputRef="usernameInput"
            onSubmitEditing={() => {
              this.refs.password.refs.passwordInput.focus();
            }}
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            leftIcon={{
              type: "font-awesome",
              name: "user",
              color: colors.primary
            }}
          />
          <Input
            label="password"
            labelStyle={{ color: "white", marginBottom: 5 }}
            inputContainerStyle={{
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            selectionColor={"white"}
            editable={true}
            secureTextEntry={true}
            returnKeyType="next"
            ref="password"
            textInputRef="passwordInput"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            leftIcon={{
              type: "font-awesome",
              name: "lock",
              color: colors.primary
            }}
          />
          <Button
            fontFamily="lato"
            containerViewStyle={{ marginTop: 20 }}
            backgroundColor={colors.primary}
            icon={
              <Icon
                name="check-circle"
                size={20}
                color="white"
                iconStyle={{ marginRight: 20 }}
              />
            }
            iconContainerStyle={{ marginRight: 20 }}
            buttonStyle={{
              borderRadius: 30,
              marginTop: 15,
              marginRight: 0,
              marginBottom: 0,
              height: 50
            }}
            title="SIGN IN"
            titleStyle={{ marginLeft: 5 }}
            loading={this.state.showActivityIndicator ? true : false}
            onPress={this.handleLogInClick}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15
            }}
          >
            <Text
              onPress={() => this.props.navigation.navigate("ForgotPassword")}
              style={{ color: colors.primary }}
            >
              Forgot Password
            </Text>
            <Text
              onPress={() => this.props.navigation.navigate("SignUp")}
              style={{ color: colors.primary }}
            >
              Create Account
            </Text>
          </View>
        </ScrollView>
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
    justifyContent: "center",
    height: 420
  },
  image_view: {
    alignItems: "center"
  },
  header: {},
  container: {
    paddingRight: 20,
    paddingLeft: 20,

    flex: 1,
    backgroundColor: "#0D1E30"
  }
});

export default LogIn;
