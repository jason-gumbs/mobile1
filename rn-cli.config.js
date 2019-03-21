const blacklist = require("metro/src/blacklist");
module.exports = {
  resolver: {
    blacklistRE: blacklist([/#current-cloud-backend\/.*/])
  }
};
// 1. Clear watchman watches: `watchman watch-del-all`.
// 2. Delete the `node_modules` folder: `rm -rf node_modules && npm install`.
// 3. Reset Metro Bundler cache: `rm -rf /tmp/metro-bundler-cache-*` or `npm start -- --reset-cache`.
// 4. Remove haste cache: `rm -rf /tmp/haste-map-react-native-packager-*`.
// `watchman watch-del C:/Users/BEAZE/Desktop/mobile1 ; watchman watch-project C:/Users/BEAZE/Desktop/mobile1`
