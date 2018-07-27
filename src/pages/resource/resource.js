import React from 'react';
import { Button, View, Text,TouchableWithoutFeedback, ScrollView, Picker,Image,CameraRoll, StyleSheet } from 'react-native';
import { FormLabel,
   FormInput,
   FormValidationMessage,Icon,
   Divider } from 'react-native-elements'
   import { API } from 'aws-amplify';
   import awsmobile from '../../aws-exports';
    //  import{ files} from '../Utils/files';
   import { colors } from 'theme';
   import RNFetchBlob from 'react-native-fetch-blob';
   import uuid from 'react-native-uuid';
import mime from 'mime-types';


 class resource extends React.Component {
  static navigationOptions = {
    title: 'post an item',
  }


  state = {
    selectedImage: {},
    selectedImageIndex: null,
    images: [],
    Resources: [],
    selectedGenderIndex: null,
    modalVisible: false,
    input: {
      name: '',
      product: '',
      address: '',
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


  AddResource = async () => {
    const resourceInfo = this.state.input;
    const { node: imageNode } = this.state.selectedImage;

    this.setState({ showActivityIndicator: true });

    this.readImage(imageNode)
      .then(fileInfo => ({
        ...resourceInfo,
        picKey: fileInfo && fileInfo.key,
      }))
      .then(this.apiSaveResource)
      .then(data => {
        this.setState({ showActivityIndicator: false });
        this.props.screenProps.handleRetrievePet();
        this.props.screenProps.toggleModal();
      })
      .catch(err => {
        console.log('error saving pet...', err);
        this.setState({ showActivityIndicator: false });
      });
  }

 apiSaveResource = ()=> {
    return  API.post('Resource', '/resource',
    { body: this.state.input }).then(response => {
     console.log(response);
  }).catch(error => {
      console.log(error.response)
  });
  }

  
  

  updateSelectedImage = (selectedImage, selectedImageIndex) => {
    if (selectedImageIndex === this.state.selectedImageIndex) {
      this.setState({
        selectedImageIndex: null,
        selectedImage: {}
      })
    } else {
      this.setState({
        selectedImageIndex,
        selectedImage,
      });
    }
  }

  getPhotos = () => {
    CameraRoll
      .getPhotos({
        first: 20,
      })
      .then(res => {
        this.setState({ images: res.edges })
        this.props.navigation.navigate('UploadPhoto', { data: this.state, updateSelectedImage: this.updateSelectedImage })
      })
      .catch(err => console.log('error getting photos...:', err))
  }

  toggleModal = () => {
    this.setState(() => ({ modalVisible: !this.state.modalVisible }))
  }

  readImage(imageNode = null) {
    if (imageNode === null) {
      return Promise.resolve();
    }

    const { image } = imageNode;
    const result = {};

    if (Platform.OS === 'ios') {
      result.type = mime.lookup(image.filename);
    } else {
      result.type = imageNode.type;
    }

    const extension = mime.extension(result.type);
    const imagePath = image.uri;
    const picName = `${uuid.v1()}.${extension}`;
    const key = `${picName}`;

    return files.readFile(imagePath)
      .then(buffer => Storage.put(key, buffer, { level: 'private', contentType: result.type }))
      .then(fileInfo => ({ key: fileInfo.key }))
      .then(x => console.log('SAVED', x) || x);
  }

  fileChangedHandler = (event) => {
    this.setState({selectedFile: event.target.files[0]})
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
  
    return (
      <View style={{ flex: 1, paddingBottom: 0 }}>
      <ScrollView  style={{ flex: 1 }}>
      
          <FormLabel>Name</FormLabel>
          <FormInput onChangeText={(name) => this.updateInput('name', name)}
          //inputStyle is used to style input box
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          inputStyle={{fontSize:26, color: "pink" }}
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
          onValueChange={(itemValue, itemIndex) => this.setState({category: itemValue})}>
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
           <View style={{flex: 1, flexDirection: 'row'}}>
           
        <View style={{width: 150, height: 100, backgroundColor: 'powderblue'}} >
        <FormLabel>City</FormLabel>
          <FormInput onChangeText={(city) => this.updateInput('city', city)}
          //inputStyle is used to style input box
          ref="city"
          textInputRef="cityInput"
          inputStyle={{fontSize:26, color: "pink" }}
          value={this.state.input.city}
          />
        </View>
        <View style={{width: 150, height: 100, backgroundColor: 'skyblue'}} >
        <FormLabel> state</FormLabel>
          <FormInput onChangeText={( state) => this.updateInput('state',  state)}
          //inputStyle is used to style input box
          ref="state"
          textInputRef="stateInput"
          inputStyle={{fontSize:26, color: "pink" }}
          value={this.state.input.state}
          />
        </View>
        <View style={{width: 150, height: 100, backgroundColor: 'steelblue'}} >
        <FormLabel> zip</FormLabel>
          <FormInput onChangeText={(zip) => this.updateInput('zip',  zip)}
          //inputStyle is used to style input box
          ref="zip"
          value={this.state.input.zip}
          textInputRef="zipInput"
          inputStyle={{fontSize:26, color: "pink" }}/>
        </View>
        </View>
      <FormLabel>What are you offering</FormLabel>
          <FormInput onChangeText={(offering) => this.updateInput('offering', offering)}
          //inputStyle is used to style input box
          ref="offering"
          textInputRef="offeringInput"
          value={this.state.input.offering}
          inputStyle={{fontSize:26, color: "pink" }}
          />
          <FormLabel>Phone Number</FormLabel>
          <FormInput onChangeText={(number) => this.updateInput('number', number)}
          //inputStyle is used to style input box
          ref="number"
          textInputRef="numberInput"
          value={this.state.input.number}
          inputStyle={{fontSize:26, color: "pink" }}
          />
          <Button
            title='submit'
            onPress={this.apiSaveResource} />
          <Divider style={{ backgroundColor: 'yellow', height: 10 }} />
          </ScrollView>
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
});

export default resource;