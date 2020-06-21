/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import App from './app/App';
import {name as appName} from './app.json';
import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);

AppRegistry.registerComponent(appName, () => App);
