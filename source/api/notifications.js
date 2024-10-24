import {Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getPreferredLanguageTag} from '../localization';
import Config from 'react-native-config';
import messaging from '@react-native-firebase/messaging';
export const registerDevice = async (entityId) => {
  try {
    const deviceToken = await messaging().getToken();
    const authToken = await AsyncStorage.getItem('authToken');
    if (authToken && authToken.length > 1) {
      const response = await fetch(
        `${Config.NOTIFICATION_BASE_URL}/push-notifications/register-push-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${authToken}`,
            'ziqitza-api-key': `${Config.API_KEY}`,
          },
          body: JSON.stringify({
            roleId: 0,
            entityId:entityId,
            pushNotificationToken: deviceToken,
            entityName: "USER",
            applicationName: Config.APP_NAME_ENUM_FOR_API,
          }),
        },
      );
      if (response.status === 401) {
        // clearAsyncStorage();
      } else {
        return response.ok && response.status === 200
          ? Promise.resolve(response)
          : Promise.reject(response);
      }
    } else {
      return Promise.reject();
    }
  } catch (err) {}
};
export const removeDevice = async roleId => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    if (authToken && authToken.length > 1) {
      const response = await fetch(
        `${Config.BASE_URL}/users/notification-device-token/clear?roleId=${roleId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${authToken}`,
            'ziqitza-api-key': `${Config.API_KEY}`,
          },
        },
      );
      if (response.status === 401) {
      } else {
        return response.ok && response.status === 200
          ? Promise.resolve(response)
          : Promise.reject(response);
      }
    } else {
      return Promise.reject();
    }
  } catch (err) {}
};
