import React from "react";
import {
  View,
  ScrollView,
  Text,
  Animated,
  StyleSheet,
  Platform,
  Image,
  Easing,
  FlatList,
  TouchableHighlight,
  Modal,
  ActivityIndicator
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
import { API, Storage, Hub, Auth, Logger } from "aws-amplify";
import SplashScreen from "react-native-splash-screen";
import viewResource from "../viewResource";
import LogoTitle from "../../../src/Components/LogoTitle";
import Footer from "../../../src/Components/Footer";
import SignLogo from "../../../src/Components/SignLogo";
import SigninLogo from "../../../src/Components/SigninLogo";
import { listResources } from "../../graphql/queries";
import { graphql } from "react-apollo";
import awsmobile from "../../aws-exports";
import { colors } from "../../Utils/theme";
import { Query } from "react-apollo";

let styles = {};

class search extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle />,
      headerRight: (
        <SignLogo
          handleSettingClick={navigation.getParam("handleSettingClick")}
        />
      ),
      headerStyle: {
        backgroundColor: "#0D1E30",
        borderBottomWidth: 0,
        shadowColor: "transparent",
        elevation: 0,
        shadowOpacity: 0
      },
      headerTitleStyle: {
        color: "white",
        marginLeft: 100
      },
      headerTintColor: "white",
      gesturesEnabled: false,
      headerBackTitle: null
    };
  };

  state = {
    selectedImage: {},
    selectedImageIndex: null,
    images: [],
    showSearch: false,
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
    loading: false,
    modalVisible: false
  };

  componentDidMount() {
    SplashScreen.hide();
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

    // this.loadResources();
    this.props.navigation.setParams({
      handleSettingClick: this.handleSettingClick
    });
    this.props.navigation.setParams({
      handleSigninClick: this.handleSigninClick
    });
    const logger = new Logger("My-Logger");

    const listener = data => {
      switch (data.payload.event) {
        case "signIn":
          logger.info("user signed in"); //[ERROR] My-Logger - user signed in
          break;
        case "signUp":
          logger.error("user signed up");
          break;
        case "signOut":
          logger.info("search user signed out");
          this.props.navigation.navigate("AuthLoading");
          break;
        case "signIn_failure":
          logger.error("user sign in failed");
          break;
        case "configured":
          logger.error("the Auth module is configured");
      }
    };

    Hub.listen("auth", listener);
  }

  componentWillUnmount() {}

  handleAddResource = e =>
    this.props.navigation.push("Resource", this.state.currentUser);
  showSearch = e => this.setState({ showSearch: !this.state.showSearch });
  handleSettingClick = e =>
    this.props.navigation.navigate("Settings", this.state.currentUser);
  handleSigninClick = e => this.props.navigation.navigate("SignIn");

  keyExtractor = (item, index) => item.id;

  renderItem = ({ item }) => (
    <Card
      title={this.renderOwner(item.company)}
      image={{
        uri: item.file
          ? item.file.key
          : "http://chittagongit.com//images/no-image-icon/no-image-icon-17.jpg"
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
  renderHeader = () => {
    return (
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
    );
  };

  renderFooter = () => {
    return (
      <Footer
        handleAddResource={this.handleAddResource}
        handleHome={this.handleHome}
      />
    );
  };

  renderOwner = item => {
    if (!(item.files == null)) {
      return (
        <ListItem
          title={item.companyname}
          subtitle={item.subtitle || ""}
          leftAvatar={{
            source: {
              uri: item.files[0].key
            }
          }}
          contentContainerStyle={{ marginRight: "auto" }}
        />
      );
    } else {
      return (
        <ListItem
          title={item.companyname}
          subtitle={item.subtitle || ""}
          onPress={() => console.log("hey")}
          leftIcon={{
            name: "user-circle",
            type: "font-awesome",
            color: "grey",
            size: 30
          }}
          contentContainerStyle={{ marginRight: "auto" }}
        />
      );
    }
  };
  getMorePost = () => {
    this.setState({ loading: true });
    this.props
      .loadMorePosts()
      .then(data => {
        this.setState({ loading: false });
        console.log("Congrats...", data);
      })
      .catch(err => {
        console.log("error saving resource...", err);
        this.setState({ loading: false });
      });
  };
  render() {
    return (
      <Query query={listResources} fetchPolicy={"cache-and-network"}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <ActivityIndicator color={"#287b97"} />;
          if (error) return <Text>{`Error: ${error}`}</Text>;

          return (
            <View
              style={{ flex: 1, paddingBottom: 0, backgroundColor: "#0D1E30" }}
            >
              {this.state.showSearch && (
                <SearchBar
                  round
                  platform={Platform.OS === "ios" ? "ios" : "android"}
                  onChangeText={this.updateInput}
                  containerStyle={{
                    backgroundColor: "#0D1E30",
                    borderColor: "#0D1E30",
                    borderBottomWidth: 0,
                    borderTopWidth: 0
                  }}
                  inputStyle={{ backgroundColor: "white" }}
                  inputContainerStyle={{ backgroundColor: "white" }}
                  placeholder="Search"
                />
              )}
              <FlatList
                refreshing={this.state.loading}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                style={{ flex: 1 }}
                data={data.listResources.items}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onRefresh={refetch}
              />
              <Footer
                handleAddResource={this.handleAddResource}
                showSearch={this.showSearch}
              />
            </View>
          );
        }}
      </Query>
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

export default search;
