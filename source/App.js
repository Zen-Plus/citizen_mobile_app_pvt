import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StatusBar, Platform, PermissionsAndroid} from 'react-native';
import {Provider} from 'react-redux';
import store from './redux/store';
import AppNavigator from './navigation';
import LocalizationProvider from './providers/localization';
import messaging from '@react-native-firebase/messaging';
import DeviceTimeIncorrectModal from './components/deviceTimeIncorrectModal';
import {colors} from './library';
import {handleNotifications} from './providers/notifications';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

console.disableYellowBox = true;

const App = () => {
  useEffect(() => {
    Sentry.init({
      dsn: Config.SENTRY_DSN,
    });
    requestUserPermission();
    handleNotifications();
    checkApplicationPermission();
  }, []);

  async function requestUserPermission() {
    await messaging().requestPermission();
  }

  async function checkApplicationPermission() {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (error) {
        console.log('===> error', error);
      }
    }
  }

  return (
    <Provider store={store}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <LocalizationProvider>
        <AppNavigator />
      </LocalizationProvider>
      <DeviceTimeIncorrectModal />
    </Provider>
  );
};

export default App;
