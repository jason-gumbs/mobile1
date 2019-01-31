global.Buffer = global.Buffer || require("buffer").Buffer;
import React from "react";
import SplashScreen from "react-native-splash-screen";
import { createStackNavigator } from "react-navigation";
import Amplify, { API, Storage, Aut, Hub, Logger } from "aws-amplify";
import awsmobile from "./src/aws-exports";
import resource from "./src/pages/resource";
import viewResource from "./src/pages/viewResource";
import search from "./src/pages/search";
import home from "./src/pages/home";
import map from "./src/pages/map";
import SignIn from "./src/Components/LogIn";
import SignUp from "./src/Components/SignUp";
import Settings from "./src/Components/Settings";
import MFAPrompt from "./src/Components/MFAPrompt";

// Version can be specified in package.json
Amplify.configure(awsmobile);
const alex = new Logger("Alexander_the_auth_watcher");

alex.onHubCapsule = capsule => {
  switch (capsule.payload.event) {
    case "signIn":
      alex.error("user signed in"); //[ERROR] Alexander_the_auth_watcher - user signed in
      break;
    case "signUp":
      alex.error("user signed up");
      break;
    case "signOut":
      alex.error("user signed out");
      break;
    case "signIn_failure":
      alex.error("user sign in failed");
      break;
    case "configured":
      alex.error("the Auth module is configured");
  }
};

Hub.listen("auth", alex);

const RootStack = createStackNavigator(
  {
    Home: {
      screen: home
    },
    Resource: {
      screen: resource
    },
    Search: {
      screen: search
    },
    Maps: {
      screen: map
    },
    ViewResource: {
      screen: viewResource
    },
    SignUp: {
      screen: SignUp
    },
    SignIn: {
      screen: SignIn
    },
    Settings: {
      screen: Settings
    }
  },
  {
    initialRouteName: "Home"
  }
);

export default class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }
  render() {
    return <RootStack />;
  }
}
