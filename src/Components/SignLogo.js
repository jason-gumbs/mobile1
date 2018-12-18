import React from "react";
import { Image } from "react-native";

class SignLogo extends React.Component {
  render() {
    return (
      <Image
        source={{
          uri: "https://img.icons8.com/material-outlined/24/000000/enter-2.png"
        }}
        style={{ width: 30, height: 30, marginRight: 10 }}
      />
    );
  }
}

export default SignLogo;
