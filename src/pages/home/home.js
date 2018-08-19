import React from 'react';
import {
  View,
  ScrollView,
  Text,
  Animated,
  StyleSheet,
  Image,
   PixelRatio,
  Easing,
  TouchableHighlight,
  Modal,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { DrawerNavigator, NavigationActions, createStackNavigator } from 'react-navigation';
import resource from '../resource';
import UploadPhoto from '../../Components/UploadPhoto';
import ImagePicker from '../../Components/ImagePickers';
import { colors } from 'theme';
import search from '../search/search';




 class home extends React.Component {
  constructor(props) {
    super(props);

  this.animate = this.animate.bind(this);
  this.toggleModal = this.toggleModal.bind(this);

  this.animatedIcon = new Animated.Value(0);

  this.state = {
    apiResponse: null,
    loading: true,
    modalVisible: false,
  }
}

componentDidMount() {
  this.animate();
}

animate() {
  Animated.loop(
    Animated.timing(
      this.animatedIcon,
      {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear,
      }
    )
  ).start();
}

toggleModal() {
  if (!this.state.modalVisible) {
    this.animate();
  }

  this.setState((state) => ({ modalVisible: !state.modalVisible }));
}

  render() {
    const { loading, apiResponse } = this.state;
    const spin = this.animatedIcon.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const AddResourceRoutes = createStackNavigator({
      AddResource: { screen: resource },
      Search: { screen: search }

    });

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

          <View style={{ position: 'absolute', bottom: 25, right: 26, zIndex: 1 }}>
          <Text style ={{color: "red"}}> add resource</Text>
          <Icon
            onPress={this.toggleModal}
            raised
            reverse
            name='add'
            size={44}
            containerStyle={{ width: 50, height: 50 }}
            color={colors.primary}
          />
        </View>
           <Text>view resources</Text>
        <Button
          title="search Resources"
          onPress={() => this.props.navigation.push('Search')}
        />
           <Text>view map</Text>
        <Button
          title="view map"
          onPress={() => this.props.navigation.push('Maps')}
        />
               <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={this.toggleModal}
        >
          <AddResourceRoutes screenProps={{  toggleModal: this.toggleModal }} />
        </Modal>

      </View>
    );
  }
};
styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  title: {
    color: colors.darkGray,
    fontSize: 18,
    marginBottom: 15,
  },
  petInfoContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  petInfoName: {
    color: colors.darkGray,
    fontSize: 20,
    marginLeft: 17
  },
  petInfoAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  }
})

export default home;
