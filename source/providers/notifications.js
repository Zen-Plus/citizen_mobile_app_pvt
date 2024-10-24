import notifee, {AndroidImportance} from '@notifee/react-native';
import * as RootNavigation from '../../source/RootNavigation';
import {navigations} from '../../source/constants';
import {getAsyncStorage} from '../utils/asyncStorage';
import messaging from '@react-native-firebase/messaging';
import notification from '../screens/NotificationContainer/notification';

export async function handleNotifications(notification = null) {
  const isUserLoggedIn = await getAsyncStorage('authToken');
  const initialNotification = await messaging().getInitialNotification();
  const notifeeData = await notifee.getInitialNotification();

  if (isUserLoggedIn && (initialNotification || notification || notifeeData)) {
    RootNavigation.navigate(navigations?.MyRequest);
  }
}

export async function onMessageReceived(remoteMessage) {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    vibration: true,
    vibrationPattern: [300, 500],
    lights: true,
  });

  // Display a notification
  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    android: {
      channelId,
      smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      importance: AndroidImportance.HIGH,
      pressAction: {id: 'default', launchActivity: 'default'},
    },
  });
}
