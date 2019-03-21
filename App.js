import React from "react";
import SplashScreen from "react-native-splash-screen";
import { createStackNavigator } from "react-navigation";
import Amplify, { API, Storage, Auth, Hub, Logger } from "aws-amplify";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";
import { Rehydrated } from "aws-appsync-react";
import { ApolloProvider } from "react-apollo";
import awsmobile from "./src/aws-exports";
import resource from "./src/pages/resource";
import viewResource from "./src/pages/viewResource";
import search from "./src/pages/search";
import home from "./src/pages/home";
import map from "./src/pages/map";
import SignIn from "./src/Components/LogIn";
import SignUp from "./src/Components/SignUp";
import Settings from "./src/Components/Settings";
import ForgotPassword from "./src/Components/ForgotPassword";

// Version can be specified in package.json
Amplify.configure(awsmobile);

const GRAPHQL_API_REGION = awsmobile.aws_appsync_region;
const GRAPHQL_API_ENDPOINT_URL = awsmobile.aws_appsync_graphqlEndpoint;
const S3_BUCKET_REGION = awsmobile.aws_user_files_s3_bucket_region;
const S3_BUCKET_NAME = awsmobile.aws_user_files_s3_bucket;

const client = new AWSAppSyncClient({
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    // Get the currently logged in users credential.
    jwtToken: async () =>
      (await Auth.currentSession()).getAccessToken().getJwtToken() ||
      awsmobile.aws_user_pools_web_client_id
  },
  // Amplify uses Amazon IAM to authorize calls to Amazon S3. This provides the relevant IAM credentials.
  complexObjectsCredentials: () => Auth.currentCredentials()
});

const RootStack = createStackNavigator(
  {
    Home: {
      screen: home
    },
    Resource: {
      screen: resource
    },
    Search: {
      screen: search
    },
    Maps: {
      screen: map
    },
    ViewResource: {
      screen: viewResource
    },
    SignUp: {
      screen: SignUp
    },
    SignIn: {
      screen: SignIn
    },
    Settings: {
      screen: Settings
    },
    ForgotPassword: {
      screen: ForgotPassword
    }
  },
  {
    initialRouteName: "Home",
    initialRouteParams: { bucket: S3_BUCKET_NAME, region: S3_BUCKET_REGION }
  }
);

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Rehydrated>
          <RootStack />
        </Rehydrated>
      </ApolloProvider>
    );
  }
}
