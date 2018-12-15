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
import { Card, ListItem, Button } from "react-native-elements";
import {
  DrawerNavigator,
  NavigationActions,
  StackNavigator
} from "react-navigation";
import { API, Storage, Cache } from "aws-amplify";
import viewResource from "../viewResource";
import awsmobile from "../../aws-exports";
import { colors } from "theme";

let styles = {};

class search extends React.Component {
  static navigationOptions = {
    title: "Resources Available"
  };

  state = {
    selectedImage: {},
    selectedImageIndex: null,
    images: [],
    Resources: [],
    selectedGenderIndex: null,
    modalVisible: false,
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
    Cache.getItem("resources").then(apiResponse => {
      if (apiResponse) {
        this.setState({ apiResponse });
      }
    });
    this.loadResources();
  }

  componentWillUnmount() {
    Cache.removeItem("resources");
    Cache.setItem("resources", this.state.apiResponse);
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

  keyExtractor = (item, index) => item.resourceId;

  renderItem = ({ item }) => (
    <Card
      title={item.name}
      featuredSubtitle={item.name}
      image={{
        uri:
          item.picUrl ||
          "http://chittagongit.com//images/no-image-icon/no-image-icon-17.jpg"
      }}
    >
      <Text style={{ marginBottom: 10 }}>
        {item.description || "No description"}
      </Text>
      <Button
        icon={{ name: "pageview", size: 32 }}
        backgroundColor="#00A3FF"
        buttonStyle={{
          borderRadius: 0,
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0
        }}
        onPress={() => {
          this.props.navigation.navigate("ViewResource", { item });
        }}
        title="VIEW NOW"
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
      <View style={{ flex: 1, paddingBottom: 0 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.state.apiResponse}
            renderItem={this.renderItem}
          />
        </ScrollView>
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

export default search;
