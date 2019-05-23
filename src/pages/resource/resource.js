import React from "react";
import {
  KeyboardAvoidingView,
  View,
  PixelRatio,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  Picker,
  Image,
  CameraRoll,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Platform
} from "react-native";
import { Input, Divider, Text, Button, Avatar } from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import { graphql, compose } from "react-apollo";
import { API, Storage, Auth } from "aws-amplify";
import awsmobile from "../../aws-exports";
import files from "../../Utils/files";
import { colors } from "../../Utils/theme";
import RNFetchBlob from "rn-fetch-blob";
import uuid from "react-native-uuid";
import mime from "mime-types";
import { createResource } from "../../graphql/mutations";
import { listResources, listCompanys } from "../../graphql/queries";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { width, height } = Dimensions.get("window");

let styles = {};

Storage.configure({
  AWSS3: {
    bucket: "mobile1cf03fdb5f8214d64aaa06e794ebf3045", //Your bucket name;
    region: "us-east-1" //Specify the region your bucket was created in;
  }
});

class resource extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) =>
    console.log("") || {
      title: "List an item",
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
    selectedImage: {},
    selectedImageIndex: null,
    images: [],
    Resources: [],
    fileInput: {},
    avatarSource: null,
    selectedGenderIndex: null,
    isSelected: false,
    modalVisible: false,
    key: "",
    picUrl: null,
    input: {
      name: "",
      product: "",
      address: "",
      location: "",
      offering: "",
      category: "",
      city: "",
      description: "",
      number: "",
      state: "",
      zip: ""
    },
    showActivityIndicator: false
  };

  componentDidMount() {
    console.log(this.props.companys.items[0].id);
    console.log(process.env);
  }
  componentWillUnmount() {}

  AddResource = async e => {
    e.preventDefault();

    // this.setState({ showActivityIndicator: true });
    // const { bucket, region } = this.props.navigation.state.params;
    const visibility = "public";
    const resources = this.state.input;
    const { identityId } = await Auth.currentCredentials();
    // const { payload } = this.props.navigation.state.params.idToken || "null";
    // const owner = payload["cognito:username"] || "null";
    const bucket = "mobile1cf03fdb5f8214d64aaa06e794ebf3045";
    const region = "us-east-1";
    resources.id = `${uuid.v1()}`;

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
      .createResource({
        id: "",
        name: this.state.input.name || " N/A",
        file: file,
        visibility: visibility,
        product: this.state.input.product || "N/A",
        address: this.state.input.address || "N/A",
        location: this.state.input.location || "N/A",
        owner: identityId || "UNAUHTH",
        offering: this.state.input.offering || "N/A",
        category: this.state.input.category || "N/A",
        city: this.state.input.city || "N/A",
        description: this.state.input.description || "N/A",
        number: this.state.input.number || "N/A",
        state: this.state.input.state || "N/A",
        zip: this.state.input.zip || "N/A",
        content: "String",
        resourceCompanyId: this.props.companys.items[0].id || "null"
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

  updateInput = (key, value) => {
    this.setState(state => ({
      input: {
        ...state.input,
        [key]: value
      }
    }));
  };

  toggleModal = () => {
    this.setState(() => ({ modalVisible: !this.state.modalVisible }));
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
      console.log("Response = ", response.mimeType);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        //let source = { uri: "data:image/jpeg;base64," + response.data };

        this.setState({
          avatarSource: source
        });
        this.setState({
          selectedImage: response
        });
      }
    });
  };

  updateInput = (key, value) => {
    this.setState(state => ({
      input: {
        ...state.input,
        [key]: value
      }
    }));
  };
  render() {
    const {
      selectedImageIndex,
      selectedImage,
      selectedGenderIndex
    } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.image_view}>
            {this.state.avatarSource === null ? (
              <Avatar
                size="xlarge"
                rounded
                icon={{ name: "image", type: "font-awesome" }}
                onPress={this.selectPhotoTapped}
                activeOpacity={0.7}
                showEditButton
              />
            ) : (
              <Avatar
                size="xlarge"
                rounded
                source={this.state.avatarSource}
                onPress={this.selectPhotoTapped}
                activeOpacity={0.7}
                showEditButton
              />
            )}
          </View>
          <Input
            label="Name"
            labelStyle={{ color: "white", marginBottom: 5 }}
            onChangeText={name => this.updateInput("name", name)}
            //inputStyle is used to style input box
            autoCapitalize="none"
            selectionColor={"white"}
            autoCorrect={true}
            returnKeyType="next"
            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: "#d6d7da",
              marginBottom: 0
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            ref="name"
            textInputRef="nameInput"
            editable={true}
            value={this.state.input.name}
          />
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: 11,
              marginBottom: 3
            }}
          >
            Address
          </Text>

          <GooglePlacesAutocomplete
            placeholder=""
            onPress={(data, details = null) => {
              this.setState(
                state => ((state.input.address = data.description), state)
              );
              this.setState(
                state => (
                  (state.input.location = details.geometry.location), state
                )
              );
            }}
            getDefaultValue={() => ""}
            listViewDisplayed="true"
            minLength={2}
            selectionColor={"white"}
            autoFocus={false}
            fetchDetails={true}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: process.env.REACT_APP_GKEY || "",
              language: "en", // language of the results
              types: "address" // default: 'geocode'
            }}
            styles={{
              container: {
                borderWidth: 1.5,
                borderRadius: 30,
                borderColor: "#d6d7da",
                marginBottom: 0
              },
              textInputContainer: {
                backgroundColor: "#0D1E30",
                padding: 5,
                width: "85%",
                marginLeft: 20
              },
              description: {
                fontWeight: "bold",
                color: "white"
              },
              textInput: {
                width: "75%",
                color: "white",
                fontSize: 16,
                backgroundColor: "#0D1E30"
              }
            }}
            currentLocation={false}
          />
          <Input
            label="Product/Service"
            labelStyle={{ color: "white", marginBottom: 5 }}
            onChangeText={product => this.updateInput("product", product)}
            autoCapitalize="none"
            selectionColor={"white"}
            autoCorrect={true}
            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: "#d6d7da",
              marginBottom: 0
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            ref="product"
            textInputRef="productInput"
            value={this.state.input.product}
          />
          <Input
            label="Description"
            labelStyle={{ color: "white", marginBottom: 5 }}
            onChangeText={description =>
              this.updateInput("description", description)
            }
            //inputStyle is used to style input box

            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: "#d6d7da",
              marginBottom: 0
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            multiline={true}
            numberOfLines={4}
            autoCapitalize="none"
            selectionColor={"white"}
            autoCorrect={true}
            ref="description"
            textInputRef="descriptionInput"
            value={this.state.input.description}
          />
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: 11,
              marginBottom: 3
            }}
          >
            Category
          </Text>
          <Picker
            selectedValue={this.state.input.category}
            itemStyle={{ color: "white", height: 44 }}
            style={{
              marginLeft: 12,
              color: "white",
              borderWidth: 0.5,
              shadowColor: "white",
              borderColor: "white",
              height: 44
            }}
            borderStyle="solid"
            onValueChange={(itemValue, itemIndex) =>
              this.updateInput("category", itemValue)
            }
          >
            <Picker.Item label="Food & Water" value="Food & Water" />
            <Picker.Item label="Clothing" value="Clothing" />
            <Picker.Item label="Shelter" value="Shelter" />
            <Picker.Item label="Medical" value="Medical" />
            <Picker.Item label="Childrens Health" value="Childrens Health" />
            <Picker.Item label="Survival" value="Survival" />
            <Picker.Item label="Tech" value="Tech" />
          </Picker>
          <Input
            label="What are you offering"
            labelStyle={{ color: "white", marginBottom: 5 }}
            onChangeText={offering => this.updateInput("offering", offering)}
            //inputStyle is used to style input box
            ref="offering"
            textInputRef="offeringInput"
            value={this.state.input.offering}
            autoCapitalize="none"
            selectionColor={"white"}
            autoCorrect={true}
            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: "#d6d7da",
              marginBottom: 0
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
          />
          <Input
            label="Phone Number"
            labelStyle={{ color: "white", marginBottom: 5 }}
            onChangeText={number => this.updateInput("number", number)}
            //inputStyle is used to style input box
            keyboardType="numeric"
            ref="number"
            textContentType="telephoneNumber"
            textInputRef="numberInput"
            value={this.state.input.number}
            autoCapitalize="none"
            selectionColor={"white"}
            autoCorrect={true}
            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: "#d6d7da",
              marginBottom: 0
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
          />

          <View
            style={{
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20
            }}
          >
            <Button
              onPress={this.AddResource}
              title="Add Resources"
              backgroundColor="#00A3FF"
              buttonStyle={{
                borderRadius: 30,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0,
                height: 40
              }}
            />
          </View>
        </ScrollView>
        <Modal
          visible={this.state.showActivityIndicator}
          onRequestClose={() => null}
        >
          <ActivityIndicator style={styles.activityIndicator} size="large" />
        </Modal>
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
    borderColor: "white",
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
  container: {
    paddingRight: 20,
    paddingLeft: 20,
    flex: 1,
    backgroundColor: "#0D1E30"
  },
  image_view: {
    alignItems: "center"
  },
  avatarContainer: {
    borderColor: "#9B9B9B",
    borderWidth: 5 / PixelRatio.get(),
    justifyContent: "center",
    alignItems: "center"
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
  graphql(createResource, {
    options: {
      refetchQueries: [{ query: listResources }],
      update: (dataProxy, { data: { createResource } }) => {
        const query = listResources;
        const data = dataProxy.readQuery({ query });
        data.listResources = {
          ...data.listResources,
          items: [...data.listResources.items, createResource]
        };
        dataProxy.writeQuery({ query, data });
      }
    },
    props: props => ({
      createResource: resource =>
        props.mutate({
          variables: { input: resource },
          optimisticResponse: () => ({
            createResource: {
              ...resource,
              __typename: "ResourcePosts",
              file:
                resource.file == null
                  ? null
                  : { ...resource.file, __typename: "S3Object" },
              comment: {
                __typename: "Comment",
                items: [],
                nextToken: null
              },
              company: null
            }
          })
        })
    })
  })
)(resource);
