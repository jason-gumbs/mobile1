import React from "react";
import {
  View,
  ScrollView,
  Text,
  Animated,
  StyleSheet,
  Image,
  Easing,
  FlatList,
  TouchableHighlight,
  Modal
} from "react-native";
import {
  Card,
  ListItem,
  Button,
  SearchBar,
  Header
} from "react-native-elements";
import {
  DrawerNavigator,
  NavigationActions,
  StackNavigator
} from "react-navigation";
import { API, Storage, Cache, Auth } from "aws-amplify";
import viewResource from "../viewResource";
import LogoTitle from "../../../src/Components/LogoTitle";
import Footer from "../../../src/Components/Footer";
import SignLogo from "../../../src/Components/SignLogo";
import SigninLogo from "../../../src/Components/SigninLogo";
import { listResources } from "../../graphql/queries";
import { graphql } from "react-apollo";
import awsmobile from "../../aws-exports";
import { colors } from "../../Utils/theme";

let styles = {};

class search extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle />,
      headerRight:
        navigation.getParam("currentUser", "No current user") ==
        "No current user" ? (
          <SigninLogo
            handleSigninClick={navigation.getParam("handleSigninClick")}
          />
        ) : (
          <SignLogo
            handleSettingClick={navigation.getParam("handleSettingClick")}
          />
        ),
      headerStyle: {
        backgroundColor: "#0D1E30",
        shadowColor: "transparent",
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0
      }
    };
  };

  state = {
    selectedImage: {},
    selectedImageIndex: null,
    images: [],
    Resources: [],
    selectedGenderIndex: null,
    modalVisible: false,
    currentUser: {},
    input: {
      name: "",
      product: "",
      address: "",
      offering: "",
      category: "",
      city: "",
      description: "",
      number: "",
      state: "",
      zip: ""
    },
    showActivityIndicator: false,
    apiResponse: null,
    loading: true,
    modalVisible: false
  };

  componentDidMount() {
    Auth.currentSession()
      .then(data => {
        this.setState({ currentUser: data });
        this.props.navigation.setParams({
          currentUser: data
        });
      })
      .catch(err => {
        this.setState({ currentUser: err });
        this.props.navigation.setParams({
          currentUser: err
        });
      });

    console.log(this.props.resources);

    // this.loadResources();
    this.props.navigation.setParams({
      handleSettingClick: this.handleSettingClick
    });
    this.props.navigation.setParams({
      handleSigninClick: this.handleSigninClick
    });
  }

  componentWillUnmount() {
    // Cache.removeItem("resources");
    // Cache.setItem("resources", this.state.apiResponse);
  }

  async loadResources() {
    return await API.get("freeApi", "/resource")
      .then(apiResponse => {
        return Promise.all(
          apiResponse.map(async Resource => {
            const [, , , key] = /(([^\/]+\/){2})?(.+)$/.exec(Resource.picKey);
            const picUrl =
              Resource.picKey && (await Storage.get(key, { level: "public" }));
            return { ...Resource, picUrl };
          })
        );
      })
      .then(apiResponse => {
        this.setState({ apiResponse, loading: false });
      })
      .catch(e => {
        this.setState({ apiResponse: e.message, loading: false });
      });
  }

  handleAddResource = e =>
    this.props.navigation.push("Resource", this.state.currentUser);
  handleHome = e => this.props.navigation.push("Search");
  handleSettingClick = e =>
    this.props.navigation.navigate("Settings", this.state.currentUser);
  handleSigninClick = e => this.props.navigation.navigate("SignIn");

  keyExtractor = (item, index) => item.id;

  renderItem = ({ item }) => (
    <Card
      image={{
        uri:
          item.picUrl ||
          "http://chittagongit.com//images/no-image-icon/no-image-icon-17.jpg"
      }}
      containerStyle={{ borderWidth: 0, borderRadius: 10 }}
      imageStyle={{ height: 350 }}
    >
      <Text style={{ fontSize: 18, color: "black" }}>
        {item.description || "No description"}
      </Text>
      <Button
        backgroundColor="#00A3FF"
        buttonStyle={{
          borderRadius: 30,
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0,
          height: 40
        }}
        onPress={() => {
          this.props.navigation.navigate("ViewResource", { item });
        }}
        title="More Info"
      />
    </Card>
  );

  updateInput = (key, value) => {
    this.setState(state => ({
      input: {
        ...state.input,
        [key]: value
      }
    }));
  };
  render() {
    return (
      <View style={{ flex: 1, paddingBottom: 0, backgroundColor: "#0D1E30" }}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <SearchBar
            round
            onChangeText={this.updateInput}
            containerStyle={{
              backgroundColor: "#0D1E30",
              borderColor: "#0D1E30",
              borderBottomWidth: 0,
              borderTopWidth: 0
            }}
            inputStyle={{ backgroundColor: "white" }}
            placeholder="Search"
          />
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.props.resources.items}
            renderItem={this.renderItem}
          />
        </ScrollView>
        <Footer
          handleAddResource={this.handleAddResource}
          handleHome={this.handleHome}
        />
      </View>
    );
  }
}
styles = StyleSheet.create({
  buttonGroupContainer: {
    marginHorizontal: 8
  },
  addImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: "gray",
    borderColor: "black",
    borderWidth: 1.5,
    marginVertical: 14,
    borderRadius: 60,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  addImageTitle: {
    color: "gray",
    marginTop: 3
  },
  closeModal: {
    color: "gray",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center"
  },
  title: {
    marginLeft: 20,
    marginTop: 19,
    color: "gray",
    fontSize: 18,
    marginBottom: 15
  },
  input: {
    fontFamily: "lato"
  },
  activityIndicator: {
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  subtitleView: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 5
  },
  ratingImage: {
    height: 19.21,
    width: 100
  },
  ratingText: {
    paddingLeft: 10,
    color: "grey"
  }
});

export default graphql(listResources, {
  options: {
    fetchPolicy: "cache-and-network"
  },
  props: props => ({
    resources: props.data.listResources ? props.data.listResources : []
  })
})(search);
