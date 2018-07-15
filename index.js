import { AppRegistry,YellowBox } from 'react-native';
import App from './App';
//remove yellow box warning with code below
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
AppRegistry.registerComponent('freliefagain', () => App);
