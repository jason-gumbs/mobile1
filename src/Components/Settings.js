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
  Card,
  Icon,
  Text
} from "react-native-elements";
import { createStackNavigator } from "react-navigation";
import { Auth, API, Storage, Logger } from "aws-amplify";
import ImagePicker from "react-native-image-picker";
import { colors } from "../Utils/theme";
import { updateCompany } from "../graphql/mutations";
import { listCompanys } from "../graphql/queries";
import { graphql, compose, Query, Mutation } from "react-apollo";
import Constants from "../Utils/constants";
import files from "../Utils/files";
import uuid from "react-native-uuid";
import LogoTitle from "./LogoTitle";
import SignOut from "./SignOut";
import mime from "mime-types";
import RNFetchBlob from "rn-fetch-blob";

const { width } = Dimensions.get("window");
const logger = new Logger("foo");

Storage.configure({
  AWSS3: {
    bucket: "mobile1cf03fdb5f8214d64aaa06e794ebf3045", //Your bucket name;
    region: "us-east-1" //Specify the region your bucket was created in;
  }
});

class Settings extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "Settings",
    headerRight: <SignOut signout={navigation.getParam("signout")} />,
    headerStyle: {
      backgroundColor: "#0D1E30",
      borderBottomWidth: 0,
      shadowColor: "transparent",
      elevation: 0,
      shadowOpacity: 0
    },
    headerBackTitle: null,
    headerTitleStyle: {
      color: "white"
    },
    headerTintColor: "white"
  });
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
    isImageRead: true,
    showErrorMessage: false,
    errorMessage: "",
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
    let file = null;
    let location = "";
    if (this.state.selectedImage.uri) {
      await this.readImage(this.state.selectedImage)
        .then(data => this.setState({ key: `${data.key}` }))
        .catch(err => {
          this.setState({
            isImageRead: false,
            showErrorMessage: true,
            errorMessage:
              "there is a problem uploading your image please try agian later"
          });
        });
      if (this.state.isImageRead) {
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
      }
    } else {
      file = null;
    }
    console.log("Files", file);

    this.props
      .updateCompany({
        id: data.listCompanys.items[0].id,
        companyname:
          company.companyname || data.listCompanys.items[0].companyname,
        email: company.email || data.listCompanys.items[0].email,
        phonenumber:
          company.phonenumber || data.listCompanys.items[0].phonenumber,
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
    console.log(imagePath);
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

  componentDidMount() {
    this.props.navigation.setParams({
      signout: this.signout
    });
  }
  signout = e => Auth.signOut();

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
    // const { payload } = data.listCompanys.items[0];
    return (
      <Query query={listCompanys} fetchPolicy={"cache-and-network"}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <ActivityIndicator color={"#287b97"} />;
          if (error) return <Text>{`Error: ${error}`}</Text>;
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
                {data.listCompanys.items[0].files !== null ||
                this.state.avatarSource !== null ? (
                  <Avatar
                    size="xlarge"
                    rounded
                    source={
                      this.state.avatarSource === null
                        ? { uri: data.listCompanys.items[0].files[0].key }
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
                {this.state.showErrorMessage && (
                  <Text style={{ color: "grey", fontSize: 10, padding: 30 }}>
                    {this.state.errorMessage}
                  </Text>
                )}
              </View>
              <View style={styles.formContainer}>
                <Card>
                  <Text style={{ color: "black", padding: 20 }}>
                    Username:
                    {data.listCompanys.items[0].companyname || "N/A"}
                  </Text>

                  <Text style={{ color: "black", padding: 20 }}>
                    Email:
                    {data.listCompanys.items[0].email || "N/A"}
                  </Text>

                  <Text style={{ color: "black", padding: 20 }}>
                    Phone Number:
                    {data.listCompanys.items[0].phonenumber || "N/A"}
                  </Text>
                </Card>
                <Mutation
                  mutation={updateCompany}
                  update={(cache, { data: { updateCompany } }) => {
                    const dataq = cache.readQuery({
                      query: listCompanys
                    });
                    dataq.listCompanys = {
                      ...dataq.listCompanys,
                      items: [...dataq.listCompanys.items, updateCompany]
                    };
                    cache.writeQuery({
                      query: listCompanys,
                      data: dataq
                    });
                  }}
                >
                  {updateCompany => (
                    <Button
                      backgroundColor="#00A3FF"
                      buttonStyle={{
                        borderRadius: 30,
                        height: 40,
                        width: "75%"
                      }}
                      containerStyle={{ marginLeft: 50 }}
                      onPress={e => {
                        e.preventDefault();
                        updateCompany({
                          variables: {
                            input: {
                              id: data.listCompanys.items[0].id,
                              email: "input.value"
                            }
                          },
                          optimisticResponse: {
                            __typename: "Mutation",
                            updateCompany: {
                              ...data.listCompanys.items[0],
                              __typename: "Company",
                              file:
                                data.listCompanys.items[0].files == null
                                  ? null
                                  : {
                                      ...data.listCompanys.items[0].files,
                                      __typename: "S3Object"
                                    },
                              resources: {
                                __typename: "ResourcePosts",
                                items: [],
                                nextToken: null
                              }
                            }
                          }
                        });
                      }}
                      title="Update Profile"
                    />
                  )}
                </Mutation>
                <Modal
                  visible={this.state.showActivityIndicator}
                  onRequestClose={() => null}
                >
                  <ActivityIndicator
                    style={styles.activityIndicator}
                    size="large"
                  />
                </Modal>
              </View>
            </View>
          );
        }}
      </Query>
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

export default Settings;

// export default compose(
//   graphql(listCompanys, {
//     options: {
//       fetchPolicy: "cache-and-network"
//     },
//     props: ({ data: { listCompanys: companys } }) => ({
//       companys
//     })
//   }),
//   graphql(updateCompany, {
//     options: {
//       update: (dataProxy, { data: { updateCompany } }) => {
//         const query = listCompanys;
//         const data = dataProxy.readQuery({ query });
//         data.listCompanys = {
//           ...data.listCompanys,
//           items: [...data.listCompanys.items, updateCompany]
//         };
//         dataProxy.writeQuery({ query, data });
//       }
//     },
//     props: ({ ownProps, mutate }) => ({
//       updateCompany: resource =>
//         mutate({
//           variables: { input: resource },
//           optimisticResponse: () => ({
//             updateCompany: {
//               ...resource,
//               __typename: "Company",
//               file:
//                 resource.file == null
//                   ? null
//                   : { ...resource.file, __typename: "S3Object" },
//               resources: {
//                 __typename: "ResourcePosts",
//                 items: [],
//                 nextToken: null
//               }
//             }
//           })
//         })
//     })
//   })
// )(Settings);
