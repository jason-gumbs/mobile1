import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0D1E30",
    paddingRight: 20,
    paddingLeft: 20
  },
  activityIndicator: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  formContainer: {
    height: 190,
    justifyContent: "center",
    paddingHorizontal: 5
  },
  input: {
    fontFamily: "lato"
  },
  validationText: {
    fontFamily: "lato"
  },

  imageContainer: {
    alignItems: "center"
  },
  cancelButton: {
    color: "green",
    marginTop: 20,
    textAlign: "center"
  },
  resetInfoMessage: {
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 11
  }
});

export default styles;
