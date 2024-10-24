import AsyncStorage from '@react-native-community/async-storage';

export const setAsyncStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) { console.log('set async error ', error) }
};

export const setJSONToAsync = (key, value) => new Promise((resolve, reject) => {
  AsyncStorage.setItem(key, JSON.stringify(value))
    .then(resolve)
    .catch(reject);
});

export const setMultiAsyncStorage = async (data) => {
  try {
    await AsyncStorage.multiSet(data);
  } catch (error) { }
};

export const getAsyncStorage = async (key) => {
  let data = null;
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      data = value;
    }
  } catch (error) { }
  return data;
};

export const getJSONFromAsync = (key) => new Promise((resolve, reject) => {
  AsyncStorage.getItem(key)
    .then((value) => {
      if (value?.length > 0) {
        resolve(JSON.parse(value));
      } else {
        reject();
      }
    })
    .catch(reject);
});

export const removeAsyncStorage = async (key, success) => {
  try {
    await AsyncStorage.removeItem(key, success);
  } catch (error) { }
};

export const removeMultiAsyncStorage = async (key, success) => {
  try {
    await AsyncStorage.multiRemove(key, success);
  } catch (error) { }
};

export const getMultiAsyncStorage = async (keys, success) => {
  try {
    await AsyncStorage.multiGet(keys, success);
  } catch (error) { }
};

export const clearAsyncStorage = async (success) => {
  try {
    let Biometric = await getAsyncStorage("isBiometricEnabled");

    let Device = await getAsyncStorage("deviceType");

    let Splash = await getAsyncStorage("showSplashScreen");

    let locJSon = await getAsyncStorage("localizationJson");

    let registeredVehicleNo = await getAsyncStorage("registeredVehicleNo");

    AsyncStorage.clear(async () => {
      if (Splash)
        await AsyncStorage.setItem("showSplashScreen", Splash);
      if (Biometric)
        await AsyncStorage.setItem("isBiometricEnabled", Biometric);
      if (Device)
        await AsyncStorage.setItem("deviceType", Device);
      if (locJSon)
        await AsyncStorage.setItem("localizationJson", locJSon);
      if(registeredVehicleNo)
        await AsyncStorage.setItem("registeredVehicleNo", registeredVehicleNo);
      success && success()

    });

  } catch (error) { }
};
