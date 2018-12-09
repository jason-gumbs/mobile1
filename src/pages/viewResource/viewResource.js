
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { colors } from 'theme';
import { Storage } from 'aws-amplify';

class viewResource extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => console.log(screenProps) || ({
    title: `Viewing ${navigation.state.params.item.name}`,
  })
  render() {
    const { item } = this.props.navigation.state.params;

    const uri = item.picUrl;
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Image
            style={styles.image}
            source={uri ? { uri } : {uri:"http://chittagongit.com//images/no-image-icon/no-image-icon-17.jpg"}}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{item.name || 'No name'}</Text>
            <Text style={styles.info}>{item.breed || 'No breed'}</Text>
            <Text style={styles.info}>{"birthDay"}</Text>
            <Text style={styles.info}>{item.gender || 'No gender'}</Text>
          </View>
        </View>
        <View style={styles.breaker} />
      </View>
    );
  }
}

const imageSize = 130;
const styles = StyleSheet.create({
  infoContainer: {
    paddingLeft: 20,
  },
  breaker: {
    height: 1,
    backgroundColor: colors.darkGray,
    marginVertical: 15,
    width: '100%',
  },
  topContainer: {
    flexDirection: 'row',
  },
  container: {
    padding: 20,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  },
  title: {
    color: colors.darkGray,
    fontSize: 28,
    marginBottom: 20,
  },
  info: {
    color: colors.darkGray,
    marginBottom: 7,
  },
});

export default viewResource;
