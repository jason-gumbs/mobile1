import React from "react";
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  Dimensions
} from "react-native";
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
  Avatar,
  Text
} from "react-native-elements";
import { createStackNavigator } from "react-navigation";
import { Auth } from "aws-amplify";
import ImagePicker from "react-native-image-picker";
import { colors } from "../Utils/theme";
import Constants from "../Utils/constants";

const { width } = Dimensions.get("window");

class Settings extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) =>
    console.log(navigation.state.params.username) || {
      title: `hey`
    };
  state = {
    showActivityIndicator: false,
    username: "",
    password: "",
    errorMessage: "",
    cognitoUser: "",
    avatarSource: null,
    selectedImage: {}
  };

  async onLogIn() {
    this.props.onLogIn();
  }
  async doLogout() {
    let session = null;

    session = Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }
  AddUser = async () => {
    const resourceInfo = this.state.input;
    const { node: imageNode } = this.state.selectedImage;
    this.setState({ showActivityIndicator: true });
    console.log("****selectedImage*******", this.state.selectedImage);

    this.readImage(this.state.selectedImage)
      .then(fileInfo => ({
        ...resourceInfo,
        picKey: fileInfo && fileInfo.key
      }))
      .then(this.apiSaveUser)
      .then(data => {
        this.setState({ showActivityIndicator: false });
        this.props.navigation.push("Search");
      })
      .catch(err => {
        console.log("error saving resource...", err);
        this.setState({ showActivityIndicator: false });
      });
  };
  apiSaveUser = async resource => {
    return await API.post("freeApi", "/resource", { body: resource });
  };
  readImage = (imageNode = null) => {
    if (imageNode === null) {
      console.log("image null");
      return Promise.resolve();
    }
    const extension = mime.extension(imageNode.type);
    const imagePath = imageNode.uri;
    const picName = `${uuid.v1()}.${extension}`;
    const key = `${picName}`;
    console.log(imagePath);
    return files
      .readFile(imagePath)
      .then(buffer =>
        Storage.put(key, buffer, {
          level: "public",
          contentType: imageNode.type
        })
          .then(fileInfo => ({ key: fileInfo.key }))
          .then(x => console.log("SAVED", x) || x)
      )
      .catch(err => console.log("********READIMAGE***********", err));
  };
  selectPhotoTapped = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
        this.setState({
          selectedImage: response
        });
        console.log(this.state.selectedImage);
      }
    });
  };

  render() {
    const {
      payload
    } = this.props.navigation.state.params.signInUserSession.idToken;

    return (
      <View style={styles.bla}>
        <Modal
          visible={this.state.showActivityIndicator}
          onRequestClose={() => null}
        >
          <ActivityIndicator size="large" />
        </Modal>
        <View style={styles.image_view}>
          {this.state.avatarSource === null ? (
            <Avatar
              xlarge
              rounded
              icon={{ name: "user", type: "font-awesome" }}
              onPress={this.selectPhotoTapped}
              activeOpacity={0.7}
              showEditButton
            />
          ) : (
            <Avatar
              xlarge
              rounded
              source={this.state.avatarSource}
              onPress={this.selectPhotoTapped}
              activeOpacity={0.7}
              showEditButton
            />
          )}
        </View>
        <View style={styles.formContainer}>
          <Text style={{ color: "white" }}>
            Username: {this.props.navigation.state.params.username}
          </Text>
          <Text style={{ color: "white" }}>Email: {payload.email}</Text>
          <Button
            backgroundColor="#00A3FF"
            buttonStyle={{
              borderRadius: 30,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
              height: 40
            }}
            onPress={() => this.setState({ isVisible: true })}
            title="Save Profile"
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
  },
  image_view: {
    alignItems: "center"
  }
});

export default Settings;
