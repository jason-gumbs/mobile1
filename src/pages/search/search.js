import React from 'react';
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
  Modal,
} from 'react-native';
import { ListItem  } from 'react-native-elements';
import { DrawerNavigator, NavigationActions, StackNavigator } from 'react-navigation';
import { API, Storage } from 'aws-amplify';
// import AddPet from './AddPet';
 import viewResource from './viewResource';
import awsmobile from '../../aws-exports';
import { colors } from 'theme';

let styles = {};

class search extends React.Component {
  static navigationOptions = {
    title: 'Resources Available',
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
    apiResponse: null,
    loading: true,
    modalVisible: false,
  }

   componentDidMount() {
    this.loadResources();
  }

    loadResources(){
    API.get('freeApi', '/resource')
      .then(apiResponse =>{
        return Promise.all(apiResponse.map(async (Resource) => {
          const [, , , key] = /(([^\/]+\/){2})?(.+)$/.exec(Resource.picKey);
          const picUrl = Resource.picKey && await Storage.get(key, { level: 'public' });
           return { ...Resource, picUrl };
      }));}).then(apiResponse => {
        this.setState({ apiResponse, loading: false });
      }).catch(e => {
        this.setState({ apiResponse: e.message, loading: false });
      });
    }






keyExtractor = (item, index) => item.resourceId

renderItem = ({ item }) => (
  // <TouchableHighlight
  //    onPress={() => {
  //      this.props.navigation.navigate('viewResource', { Resource })
  //    }}
  //    underlayColor='transparent'
  //    key={Resource.resourceId}
  //  >
  <ListItem
    title={item.name}
    subtitle={item.product}
    avatar={{uri:item.picUrl}}
  />
      // </TouchableHighlight>
)



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
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  ratingImage: {
    height: 19.21,
    width: 100
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey'
  },
});

export default search;
