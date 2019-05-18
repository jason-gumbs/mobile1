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
import { Auth, API, Storage, Logger } from "aws-amplify";
import ImagePicker from "react-native-image-picker";
import { colors } from "../Utils/theme";
import { updateCompany } from "../graphql/mutations";
import { listCompanys } from "../graphql/queries";
import { graphql, compose } from "react-apollo";
import Constants from "../Utils/constants";
import files from "../Utils/files";
import uuid from "react-native-uuid";
import LogoTitle from "./LogoTitle";
import mime from "mime-types";
import RNFetchBlob from "react-native-fetch-blob";

const { width } = Dimensions.get("window");
const logger = new Logger("foo");

Storage.configure({
  AWSS3: {
    bucket: "mobile1cf03fdb5f8214d64aaa06e794ebf3045", //Your bucket name;
    region: "us-east-1" //Specify the region your bucket was created in;
  }
});

class Settings extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) =>
    console.log("") || {
      title: "Settings",
      headerStyle: {
        backgroundColor: "#0D1E30",
        borderBottomWidth: 0,
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
    showActivityIndicator: false,
    errorMessage: "",
    cognitoUser: "",
    avatarSource: null,
    apiResponse: null,
    selectedImage: {},
    picUrl: null,
    user: { userId: "", usersid: "" },
    key: "",
    input: {
      companyname: "",
      email: "",
      phonenumber: ""
    }
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
  AddUser = async e => {
    e.preventDefault();

    // this.setState({ showActivityIndicator: true });
    // const { bucket, region } = this.props.navigation.state.params;
    const visibility = "public";
    const company = this.state.input;
    const { identityId } = await Auth.currentCredentials();
    // const { payload } = this.props.navigation.state.params.idToken || "null";
    // const owner = payload["cognito:username"] || "null";
    const bucket = "mobile1cf03fdb5f8214d64aaa06e794ebf3045";
    const region = "us-east-1";
    let file;
    let location = "";
    if (this.state.selectedImage.uri) {
      await this.readImage(this.state.selectedImage).then(data =>
        this.setState({ key: `${data.key}` })
      );
      await Storage.get(this.state.key, { bucket, region })
        .then(result => {
          console.log("Success");
          this.setState({ picUrl: result });
        })
        .catch(err => console.log("error", err));

      file = {
        __typename: "S3Object",
        bucket,
        region,
        key: this.state.picUrl
      };
    } else {
      file = null;
    }
    console.log(file);

    this.props
      .updateCompany({
        id: this.props.companys.items[0].id,
        companyname:
          company.companyname || this.props.companys.items[0].companyname,
        email: company.email || this.props.companys.items[0].email,
        phonenumber:
          company.phonenumber || this.props.companys.items[0].phonenumber,
        visibility: "public",
        files: file
      })
      .then(data => {
        this.setState({ showActivityIndicator: false });
        console.log("Congrats...", data);
      })
      .catch(err => {
        console.log("error saving resource...", err);
        this.setState({ showActivityIndicator: false });
      });
  };

  async readImage(imageNode = null) {
    if (imageNode === null) {
      console.log("image null");
      return Promise.resolve();
    }
    const extension = mime.extension(imageNode.type);
    const imagePath = imageNode.uri;
    const visibility = "public";
    const { identityId } = await Auth.currentCredentials();
    const picName = `${visibility}/${identityId}/${uuid.v1()}${extension &&
      "."}${extension}`;
    const key = `${picName}`;
    return await RNFetchBlob.fs
      .readFile(imagePath, "base64")
      .then(data => new Buffer(data, "base64"))
      .then(buffer =>
        Storage.put(key, buffer, {
          level: "public",
          contentType: imageNode.type
        })
      )
      .then(fileInfo => ({ key: fileInfo.key }))
      .then(x => console.log("SAVED", x) || x)

      .catch(err => console.log("********READIMAGE***********", err));
  }

  componentDidMount() {}
  componentWillUnmount() {}
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
    const { payload } = this.props.companys.items[0];

    return (
      <View style={styles.bla}>
        <Modal
          visible={this.state.showActivityIndicator}
          transparent={true}
          onRequestClose={() => null}
        >
          <ActivityIndicator size="large" />
        </Modal>
        <View style={styles.image_view}>
          {this.props.companys.items[0].files !== null ||
          this.state.avatarSource !== null ? (
            <Avatar
              size="xlarge"
              rounded
              source={
                this.state.avatarSource === null
                  ? { uri: this.props.companys.items[0].files[0].key }
                  : this.state.avatarSource
              }
              onPress={this.selectPhotoTapped}
              activeOpacity={0.7}
              showEditButton
            />
          ) : (
            <Avatar
              size="xlarge"
              rounded
              icon={{ name: "user", type: "font-awesome" }}
              onPress={this.selectPhotoTapped}
              activeOpacity={0.7}
              showEditButton
            />
          )}
        </View>
        <View style={styles.formContainer}>
          <Text style={{ color: "white" }}>
            Username: {this.props.companys.items[0].companyname || "N/A"}
          </Text>
          <Text style={{ color: "white" }}>
            Email: {this.props.companys.items[0].email || "N/A"}
          </Text>
          <Text style={{ color: "white" }}>
            Phone Number: {this.props.companys.items[0].phonenumber || "N/A"}
          </Text>
          <Button
            backgroundColor="#00A3FF"
            buttonStyle={{
              borderRadius: 30,
              height: 40,
              width: "75%"
            }}
            containerStyle={{ marginLeft: 50 }}
            onPress={this.AddUser}
            title="Update Profile"
          />
          <Modal
            visible={this.state.showActivityIndicator}
            onRequestClose={() => null}
          >
            <ActivityIndicator style={styles.activityIndicator} size="large" />
          </Modal>
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
    flex: 1,
    justifyContent: "space-around",

    height: 420
  },
  image_view: {
    alignItems: "center"
  },
  activityIndicator: {
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});

export default compose(
  graphql(listCompanys, {
    options: {
      fetchPolicy: "cache-and-network"
    },
    props: ({ data: { listCompanys: companys } }) => ({
      companys
    })
  }),
  graphql(updateCompany, {
    options: {
      refetchQueries: [{ query: listCompanys }],
      update: (dataProxy, { data: { updateCompany } }) => {
        const query = listCompanys;
        const data = dataProxy.readQuery({ query });
        data.listCompanys = {
          ...data.listCompanys,
          items: [...data.listCompanys.items, updateCompany]
        };
        dataProxy.writeQuery({ query, data });
      }
    },
    props: ({ ownProps, mutate }) => ({
      updateCompany: resource =>
        mutate({
          variables: { input: resource },
          optimisticResponse: () => ({
            updateCompany: {
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
  })
)(Settings);
