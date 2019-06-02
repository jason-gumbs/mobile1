import React from "react";
import {
  View,
  ScrollView,
  Text,
  Animated,
  StyleSheet,
  Image,
  PixelRatio,
  Easing,
  TouchableHighlight,
  Modal
} from "react-native";
import { Button, SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  DrawerNavigator,
  NavigationActions,
  createStackNavigator
} from "react-navigation";
import resource from "../resource";
import UploadPhoto from "../../Components/UploadPhoto";
import ImagePicker from "../../Components/ImagePickers";
import { colors } from "../../Utils/theme";
import search from "../search/search";
import SplashScreen from "react-native-splash-screen";
import { Auth, Hub, Logger } from "aws-amplify";

class home extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.animate = this.animate.bind(this);
    this.toggleModal = this.toggleModal.bind(this);

    this.animatedIcon = new Animated.Value(0);

    this.state = {
      apiResponse: null,
      loading: true,
      modalVisible: false
    };
  }

  componentDidMount() {
    SplashScreen.hide();

    console.log(this.props.navigation.state.params);
  }

  componentWillUnmount() {}
  updateInput = (key, value) => {
    this.setState(state => ({
      input: {
        ...state.input,
        [key]: value
      }
    }));
  };

  animate() {
    Animated.loop(
      Animated.timing(this.animatedIcon, {
        toValue: 2,
        duration: 1300,
        easing: Easing.linear
      })
    ).start();
  }

  toggleModal() {
    if (!this.state.modalVisible) {
      this.animate();
    }

    this.setState(state => ({ modalVisible: !state.modalVisible }));
  }

  render() {
    const { loading, apiResponse } = this.state;
    const spin = this.animatedIcon.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    const AddResourceRoutes = createStackNavigator({
      AddResource: { screen: resource },
      Search: { screen: search }
    });

    return (
      <View style={styles.container}>
        <Image
          style={{ width: 200, height: 200 }}
          source={{
            uri:
              "https://raw.githubusercontent.com/wilfredgumbs/React-Frelief/master/client/src/pages/Home/logo.png"
          }}
        />
        <View>
          <SearchBar
            round
            onChangeText={this.updateInput}
            containerStyle={{
              backgroundColor: "#0D1E30",
              borderColor: "#0D1E30"
            }}
            inputStyle={{ backgroundColor: "white" }}
            placeholder="Type Here..."
          />
          <View style={{ marginTop: 20 }}>
            <Icon.Button
              name="search"
              backgroundColor="#00A3FF"
              onPress={() => this.props.navigation.push("Search")}
            >
              Search Resources
            </Icon.Button>
          </View>
          <View style={{ marginTop: 20 }}>
            <Icon.Button
              name="search"
              backgroundColor="#00A3FF"
              onPress={() => this.props.navigation.push("SignUp")}
            >
              Sign Up
            </Icon.Button>
          </View>
          <View style={{ marginTop: 20 }}>
            <Icon.Button
              name="search"
              backgroundColor="#00A3FF"
              onPress={() => this.props.navigation.push("UserConfirm")}
            >
              MFA
            </Icon.Button>
          </View>
          <View style={{ marginTop: 20 }}>
            <Icon.Button
              name="search"
              backgroundColor="#00A3FF"
              onPress={() => this.props.navigation.push("SignIn")}
            >
              Sign In
            </Icon.Button>
          </View>
          <View style={{ marginTop: 10 }}>
            <Icon.Button
              name="map"
              backgroundColor="#00A3FF"
              onPress={() => this.props.navigation.push("Maps")}
            >
              View Map
            </Icon.Button>
          </View>
          <View style={{ marginTop: 10 }}>
            <Icon.Button
              name="plus"
              backgroundColor="#00A3FF"
              onPress={this.toggleModal}
            >
              Add Resources
            </Icon.Button>
          </View>
        </View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={this.toggleModal}
        >
          <AddResourceRoutes screenProps={{ toggleModal: this.toggleModal }} />
        </Modal>
      </View>
    );
  }
}
styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#0D1E30",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: colors.darkBlue,
    fontSize: 18,
    marginBottom: 15
  },
  petInfoContainer: {
    flex: 1,
    flexDirection: "row"
  },
  petInfoName: {
    color: colors.darkGray,
    fontSize: 20,
    marginLeft: 17
  },
  petInfoAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  }
});

export default home;
