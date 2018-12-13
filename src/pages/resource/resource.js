import React from 'react';
import { Button, View, Text,  PixelRatio,  TouchableOpacity,TouchableWithoutFeedback, Modal, ScrollView, Picker,Image,CameraRoll, Dimensions, StyleSheet,ActivityIndicator,Platform } from 'react-native';
import { FormLabel,
   FormInput,
   FormValidationMessage,
   Divider } from 'react-native-elements'
   import Icon from 'react-native-vector-icons/FontAwesome';
   import ImagePicker from 'react-native-image-picker';
   import { API, Storage } from 'aws-amplify';
   import awsmobile from '../../aws-exports';
   import files from '../../Utils/files';
   import { colors } from 'theme';
   import RNFetchBlob from 'react-native-fetch-blob';
   import uuid from 'react-native-uuid';
   import mime from 'mime-types';
   import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
   const { width, height } = Dimensions.get('window');

   let styles = {};



 class resource extends React.Component {
  static navigationOptions = {
    title: 'List an item',
    headerStyle: {
backgroundColor: "#00A3FF",
},
headerTitleStyle:{
  color: "white"
}
  }


  state = {
    selectedImage: {},
    selectedImageIndex: null,
    images: [],
    Resources: [],
    avatarSource: null,
    selectedGenderIndex: null,
    isSelected: false,
    modalVisible: false,
    input: {
      name: '',
      product: '',
      address: '',
      location:'',
      offering: '',
      category: '',
      city: '',
      description: '',
      number: '',
      state: '',
      zip: '',
    },
    showActivityIndicator: false,

  }

  componentDidMount() {

  }
  componentWillUnmount(){

  }


  AddResource = async () => {
    const resourceInfo = this.state.input;
    const { node: imageNode } = this.state.selectedImage;
    this.setState({ showActivityIndicator: true });
    console.log("****selectedImage*******",this.state.selectedImage)

    this.readImage(this.state.selectedImage)
      .then(fileInfo => ({
        ...resourceInfo,
        picKey: fileInfo && fileInfo.key,
      }))
      .then(this.apiSaveResource)
      .then(data => {
        this.setState({ showActivityIndicator: false });
    this.props.navigation.push('Search');
      })
      .catch(err => {
        console.log('error saving resource...', err);
        this.setState({ showActivityIndicator: false });
      });
  }

  async apiSaveResource (resource) {
    return await  API.post('freeApi', '/resource',
    { body: resource });
  }
  updateInput = (key, value) => {
    this.setState((state) => ({
      input: {
        ...state.input,
        [key]: value,
      }
    }))
  }



  toggleModal = () => {
    this.setState(() => ({ modalVisible: !this.state.modalVisible }))
  }

  readImage(imageNode = null) {
    if (imageNode === null) {
      console.log("image null")
      return Promise.resolve();
    }
    const extension = mime.extension(imageNode.type);
    const imagePath = imageNode.uri;
    const picName = `${uuid.v1()}.${extension}`;
    const key = `${picName}`;
    console.log(imagePath)
    return files.readFile(imagePath)
      .then(buffer => Storage.put(key, buffer, { level: 'public', contentType: imageNode.type })
    .then(fileInfo => ({ key: fileInfo.key }))
    .then(x => console.log('SAVED', x) || x))
      .catch(err => console.log("********READIMAGE***********",err));
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
        this.setState({
          selectedImage: response
        });
        console.log(this.state.selectedImage)
      }
    });
  }

  updateInput = (key, value) => {
    this.setState((state) => ({
      input: {
        ...state.input,
        [key]: value,
      }
    }))
  }
  render() {
     const { selectedImageIndex, selectedImage, selectedGenderIndex } = this.state;


    return (
      <View style={styles.container}>
      <ScrollView  style={{ flex: 1 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
       >
      <View style={{marginLeft: "auto", marginRight: "auto", marginTop: 15}}>
      <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
          {this.state.avatarSource === null ? <Text>Select a Photo</Text> :
            <Image style={styles.avatar} source={this.state.avatarSource} />}
          </View>
        </TouchableOpacity>
      </View>

      <FormLabel>Name</FormLabel>
          <FormInput onChangeText={(name) => this.updateInput('name', name)}
          //inputStyle is used to style input box
          autoCapitalize="none"
          selectionColor= {"black"}
          autoCorrect={false}
          returnKeyType="next"
          inputStyle={{fontSize:26 }}
          ref="name"
          textInputRef="nameInput"
          editable={true}
          value={this.state.input.name}
          />
              <FormLabel>Product/Service</FormLabel>
          <FormInput onChangeText={(product) => this.updateInput('product', product)}
          //inputStyle is used to style input box
          ref="product"
          textInputRef="productInput"
          value={this.state.input.product}
          />
          <FormLabel>Description</FormLabel>
          <FormInput onChangeText={(description) => this.updateInput('description', description)}
          //inputStyle is used to style input box
          inputStyle={{fontSize:26, backgroundColor: "white"}}
          multiline = {true}
          numberOfLines = {4}
          ref="description"
          textInputRef="descriptionInput"
          value={this.state.input.description}
          />
          <FormLabel>Select a category</FormLabel>
          <Picker
          selectedValue={this.state.input.category}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue, itemIndex) => this.updateInput('category', itemValue)}>
          <Picker.Item label="Food & Water" value="Food & Water" />
          <Picker.Item label="Clothing" value="Clothing" />
          <Picker.Item label="Shelter" value="Shelter"/>
          <Picker.Item label="Medical" value="Medical" />
          <Picker.Item label="Childrens Health" value="Childrens Health" />
          <Picker.Item label="Survival" value="Survival" />
          <Picker.Item label="Tech" value="Tech" />
          </Picker>
          <FormLabel>Address</FormLabel>
          <FormInput onChangeText={(address) => this.updateInput('address', address)}
          //inputStyle is used to style input box
          ref="address"
          textInputRef="addressInput"
          value={this.state.input.address}
          />
          <GooglePlacesAutocomplete
      placeholder='Enter Location'
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
       console.log( details.geometry.location);
this.setState(state => (state.input.address = data.description, state))
this.setState(state => (state.input.location = details.geometry.location, state))
}}
      minLength={2}
      autoFocus={false}
      returnKeyType={'done'}
      fetchDetails={true}
      query={{
       // available options: https://developers.google.com/places/web-service/autocomplete
       key: '',
       language: 'en', // language of the results
       types: 'address' // default: 'geocode'
     }}
      styles={{
        textInputContainer: {
          backgroundColor: 'rgba(0,0,0,0)',
          borderTopWidth: 0,
          borderBottomWidth:0
        },
        textInput: {
          marginLeft: 0,
          marginRight: 0,
          height: 38,
          color: '#5d5d5d',
          fontSize: 16
        },
      }}
      currentLocation={false}
    />


          <FormLabel>City</FormLabel>
            <FormInput onChangeText={(city) => this.updateInput('city', city)}
            //inputStyle is used to style input box
            ref="city"
            textInputRef="cityInput"
            inputStyle={{fontSize:26 }}
            value={this.state.input.city}
            />
           <View style={{flex: 1, flexDirection: 'row'}}>


        <View style={{width: 150, height: 100}} >
        <FormLabel> State</FormLabel>
          <FormInput onChangeText={( state) => this.updateInput('state',  state)}
          //inputStyle is used to style input box
          ref="state"
          textInputRef="stateInput"
          inputStyle={{fontSize:26}}
          value={this.state.input.state}
          />
        </View>
        <View style={{width: 150, height: 100}} >
        <FormLabel> Zip</FormLabel>
          <FormInput onChangeText={(zip) => this.updateInput('zip',  zip)}
          //inputStyle is used to style input box
          ref="zip"
          keyboardType= "numeric"
          value={this.state.input.zip}
          textInputRef="zipInput"
          inputStyle={{fontSize:26}}/>
        </View>
        </View>
      <FormLabel>What are you offering</FormLabel>
          <FormInput onChangeText={(offering) => this.updateInput('offering', offering)}
          //inputStyle is used to style input box
          ref="offering"
          textInputRef="offeringInput"
          value={this.state.input.offering}
          inputStyle={{fontSize:26}}
          />
          <FormLabel>Phone Number</FormLabel>
          <FormInput onChangeText={(number) => this.updateInput('number', number)}
          //inputStyle is used to style input box
          keyboardType= "numeric"
          ref="number"
          textContentType= "telephoneNumber"
          textInputRef="numberInput"
          value={this.state.input.number}
          inputStyle={{fontSize:26, color: "pink" }}
          />



            <View style= {{marginTop:10, justifyContent: 'center',alignItems: 'center', marginBottom:20}}>
            <Icon.Button name="paper-plane" backgroundColor="#00A3FF" onPress={this.AddResource}>
            Add Resources
            </Icon.Button>
            </View>
          </ScrollView>
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
    );
  }
}
styles = StyleSheet.create({
  buttonGroupContainer: {
    marginHorizontal: 8,
  },
  addImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: "gray",
    borderColor: "black",
    borderWidth: 1.5,
    marginVertical: 14,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageTitle: {
    color: "gray",
    marginTop: 3,
  },
  closeModal: {
    color: "gray",
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    marginLeft: 20,
    marginTop: 19,
    color: "gray",
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    fontFamily: 'lato',
  },
  activityIndicator: {
    backgroundColor: "gray",
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    paddingRight: 35,
    paddingLeft:20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 5 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  },
});

export default resource;
