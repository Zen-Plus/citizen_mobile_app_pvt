/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './source/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {
  handleNotifications,
  onMessageReceived,
} from './source/providers/notifications';
import notifee, {EventType} from '@notifee/react-native';

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(async notification => {
  handleNotifications(notification);
});

notifee.onForegroundEvent(({type, detail}) => {
  if (type === EventType.PRESS) {
    handleNotifications(detail);
  }
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification} = detail;
  if (type === EventType.PRESS) {
    handleNotifications(notification);
    await notifee.cancelNotification(notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
