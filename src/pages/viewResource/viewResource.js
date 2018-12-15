import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { colors } from "theme";
import { Storage } from "aws-amplify";
import { Popup } from "react-native-map-link";

class viewResource extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) =>
    console.log(screenProps) || {
      title: `Viewing ${navigation.state.params.item.name}`
    };
  state = {
    isVisible: false,
    geoLoc: {}
  };
  componentDidMount() {}
  componentDidUpdate() {
    console.log("ITEM.LOCATION", this.props.navigation.state.params.location);
  }
  render() {
    const { item } = this.props.navigation.state.params;
    const lat = item.location.lat;
    const lng = item.location.lng;
    const uri = item.picUrl;
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Image
            style={styles.image}
            source={
              uri
                ? { uri }
                : {
                    uri:
                      "http://chittagongit.com//images/no-image-icon/no-image-icon-17.jpg"
                  }
            }
          />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{item.name || "No name"}</Text>
            <Text
              style={styles.info}
              onPress={() => this.setState({ isVisible: true })}
            >
              {item.address || "No breed"}
            </Text>
            <Text style={styles.info}>{"birthDay"}</Text>
            <Text style={styles.info}>{lat || "No gender"}</Text>
          </View>
        </View>
        <View style={styles.breaker} />
        <Popup
          isVisible={this.state.isVisible}
          onCancelPressed={() => this.setState({ isVisible: false })}
          onAppPressed={() => this.setState({ isVisible: false })}
          onBackButtonPressed={() => this.setState({ isVisible: false })}
          modalProps={{
            // you can put all react-native-modal props inside.
            animationIn: "slideInUp"
          }}
          options={{
            latitude: lat,
            longitude: lng
          }}
        />
      </View>
    );
  }
}

const imageSize = 130;
const styles = StyleSheet.create({
  infoContainer: {
    paddingLeft: 20
  },
  breaker: {
    height: 1,
    backgroundColor: colors.darkGray,
    marginVertical: 15,
    width: "100%"
  },
  topContainer: {
    flexDirection: "row",
    width: 600,
    height: 600,
    backgroundColor: "pink"
  },
  container: {
    padding: 20
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2
  },
  title: {
    color: colors.darkGray,
    fontSize: 28,
    marginBottom: 20
  },
  info: {
    color: colors.darkGray,
    marginBottom: 7
  }
});

export default viewResource;
