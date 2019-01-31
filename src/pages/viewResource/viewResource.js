import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Card, ListItem, Button } from "react-native-elements";
import { colors } from "../../Utils/theme";
import { Storage } from "aws-amplify";
import { Popup } from "react-native-map-link";

class viewResource extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) =>
    console.log(screenProps) || {
      title: `${navigation.state.params.item.name}`
    };
  state = {
    isVisible: false,
    geoLoc: {}
  };
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  render() {
    const { item } = this.props.navigation.state.params;
    const lat = item.location.lat || "-37.000000";
    const lng = item.location.lng || "172.99999";
    const uri = item.picUrl;
    return (
      <View style={{ flex: 1, paddingBottom: 0, backgroundColor: "#0D1E30" }}>
        <Card
          image={{
            uri:
              item.picUrl ||
              "http://chittagongit.com//images/no-image-icon/no-image-icon-17.jpg"
          }}
          containerStyle={{ borderWidth: 0, borderRadius: 10 }}
          imageStyle={{ height: 350 }}
        >
          <Text style={{ fontSize: 18, color: "black" }}>
            {item.description || "No description"}
          </Text>
          <Text style={styles.info}>{item.address || "No breed"}</Text>
          <Text style={styles.info}>{"birthDay"}</Text>
          <Text style={styles.info}>{lat || "No gender"}</Text>
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
            title="Get Directions"
          />
        </Card>
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
