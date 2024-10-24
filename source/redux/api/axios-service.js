import axios from 'axios';
import Config from 'react-native-config';
import {getAsyncStorage} from '../../utils/asyncStorage';
import store from '../store';
import appActions from '../constants/action-types/app.actionTypes';
// import { updateSyncedData } from "../../utils/database";
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';

axios.defaults.baseURL = Config.BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers['ziqitza-api-key'] = Config.API_KEY;
axios.defaults.headers['mobile-app-version'] = DeviceInfo.getVersion();
axios.defaults.headers['mobile-app-name'] = Config.APP_NAME_ENUM_FOR_API;
axios.defaults.headers['mobile-app-platform'] = Platform.OS.toLowerCase();
axios.defaults.timeout = 15000;

const edsAxios = axios.create({
  baseURL: Config.EDS_BASE_URL,
});

edsAxios.defaults.baseURL = Config.EDS_BASE_URL;
edsAxios.defaults.headers.common['Content-Type'] = 'application/json';
edsAxios.defaults.headers.common.Accept = 'application/json';
edsAxios.defaults.headers['ziqitza-api-key'] = Config.API_KEY;
edsAxios.defaults.headers['mobile-app-version'] = DeviceInfo.getVersion();
edsAxios.defaults.headers['mobile-app-name'] = Config.APP_NAME_ENUM_FOR_API;
edsAxios.defaults.headers['mobile-app-platform'] = Platform.OS.toLowerCase();
edsAxios.defaults.timeout = 15000;

const vtsAxios = axios.create({
  baseURL: Config.VTS_BASE_URL,
});

vtsAxios.defaults.baseURL = Config.VTS_BASE_URL;
vtsAxios.defaults.headers.common['Content-Type'] = 'application/json';
vtsAxios.defaults.headers.common.Accept = 'application/json';
vtsAxios.defaults.headers['ziqitza-api-key'] = Config.API_KEY;
vtsAxios.defaults.headers['mobile-app-version'] = DeviceInfo.getVersion();
vtsAxios.defaults.headers['mobile-app-name'] = Config.APP_NAME_ENUM_FOR_API;
vtsAxios.defaults.headers['mobile-app-platform'] = Platform.OS.toLowerCase();
vtsAxios.defaults.timeout = 15000;

const paymentAxios = axios.create({
  baseURL: Config.PAYMENT_BASE_URL,
});

paymentAxios.defaults.baseURL = Config.PAYMENT_BASE_URL;
paymentAxios.defaults.headers.common['Content-Type'] = 'application/json';
paymentAxios.defaults.headers.common.Accept = 'application/json';
paymentAxios.defaults.headers['ziqitza-api-key'] = Config.API_KEY;
paymentAxios.defaults.headers['mobile-app-version'] = DeviceInfo.getVersion();
paymentAxios.defaults.headers['mobile-app-name'] = Config.APP_NAME_ENUM_FOR_API;
paymentAxios.defaults.headers['mobile-app-platform'] = Platform.OS.toLowerCase();
paymentAxios.defaults.timeout = 15000;

const usersAxiosv2 = axios.create({
  baseURL: Config.BASE_URL_V2,
});
usersAxiosv2.defaults.baseURL = Config.BASE_URL_V2;
usersAxiosv2.defaults.headers.common['Content-Type'] = 'application/json';
usersAxiosv2.defaults.headers.common.Accept = 'application/json';
usersAxiosv2.defaults.headers['ziqitza-api-key'] = Config.API_KEY;
usersAxiosv2.defaults.headers['mobile-app-version'] = DeviceInfo.getVersion();
usersAxiosv2.defaults.headers['mobile-app-name'] = Config.APP_NAME_ENUM_FOR_API;
usersAxiosv2.defaults.headers['mobile-app-platform'] =
  Platform.OS.toLowerCase();
usersAxiosv2.defaults.timeout = 15000;

const notificationAxios = axios.create({
  baseURL: Config.NOTIFICATION_BASE_URL,
});
notificationAxios.defaults.baseURL = Config.NOTIFICATION_BASE_URL;
notificationAxios.defaults.headers.common['Content-Type'] = 'application/json';
notificationAxios.defaults.headers.common.Accept = 'application/json';
notificationAxios.defaults.headers['ziqitza-api-key'] = Config.API_KEY;
notificationAxios.defaults.headers['mobile-app-version'] =
  DeviceInfo.getVersion();
notificationAxios.defaults.headers['mobile-app-name'] =
  Config.APP_NAME_ENUM_FOR_API;
notificationAxios.defaults.headers['mobile-app-platform'] =
  Platform.OS.toLowerCase();
notificationAxios.defaults.timeout = 15000;

axios.interceptors.response.use(
  function (response) {
   console.log("interceptor response", response);
    return response;
  },
  function (error) {
    console.log(
      'interceptor response error',
      error.config,
      error.response,
      error.request,
    );
    return Promise.reject(error);
  },
);

axios.interceptors.request.use(
  function (response) {
    console.log("interceptor request", response);
    return response;
  },
  function (error) {
    console.log('interceptor request error', error);
    return Promise.reject(error);
  },
);

const AxiosService = function async() {
  let Authorization = null;

  async function addHeaders(userConfig) {
    const {params, headers, timeout, ...restConfigs} = userConfig;
    let globalHeaders = {
      'current-timestamp': moment().valueOf(),
    };

    const traceId = await getAsyncStorage('traceId');
    const authToken = await getAsyncStorage('authToken');
    if (Authorization || authToken) {
      globalHeaders.Authorization = `bearer ${Authorization || authToken}`;
    }

    if (traceId) {
      globalHeaders['X-Correlation-ID'] = traceId;
    }

    const {filter, ...restParams} = params || {};
    return {
      ...restConfigs,
      headers: {
        ...globalHeaders,
        ...headers,
      },
      params: {
        ...restParams,
      },
      timeout,
    };
  }

  function getAuthorizationToken() {
    return Authorization;
  }

  function setAuthorizationToken(token) {
    Authorization = token;
  }

  function resetAuthorizationToken() {
    Authorization = null;
  }

  async function get(endPoint, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return axios.get(endPoint, headers);
  }

  async function edsGet(endPoint, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return edsAxios.get(endPoint, headers);
  }

  async function userGet(endPoint, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return usersAxiosv2.get(endPoint, headers);
  }
  async function post(endPoint, params = {}, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return axios.post(endPoint, params, headers);
  }

  async function edsPost(endPoint, params = {}, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return edsAxios.post(endPoint, params, headers);
  }

  async function put(endPoint, params = {}, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return axios.put(endPoint, params, headers);
  }

  async function edsPut(endPoint, params = {}, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return edsAxios.put(endPoint, params, headers);
  }

  async function remove(endPoint, params = {}, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return axios.delete(endPoint, {...headers, data: params});
  }

  async function edsRemove(endPoint, params = {}, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return edsAxios.delete(endPoint, {...headers, data: params});
  }

  async function postFormData(endPoint, formData, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return axios.post(endPoint, formData, headers);
  }

  async function notificationGet(endPoint, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return notificationAxios.get(endPoint, headers);
  }

  async function notificationPut(endPoint, params = {}, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return notificationAxios.put(endPoint, params, headers);
  }
  async function vtsGet(endPoint, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return vtsAxios.get(endPoint, headers);
  }
  async function vtsPost(endPoint, params = {}, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return vtsAxios.post(endPoint, params, headers);
  }
  async function vtsPut(endPoint, params = {}, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return vtsAxios.put(endPoint, params, headers);
  }

  async function paymentGet(endPoint, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return paymentAxios.get(endPoint, headers);
  }

  async function paymentPost(endPoint, params = {}, userConfig = {}) {
    const headers = await addHeaders(userConfig);
    return paymentAxios.post(endPoint, params, headers);
  }

  return {
    setAuthorizationToken,
    getAuthorizationToken,
    resetAuthorizationToken,
    get,
    post,
    put,
    remove,
    postFormData,
    edsGet,
    edsPut,
    edsPost,
    edsRemove,
    userGet,
    notificationGet,
    notificationPut,
    vtsGet,
    vtsPost,
    vtsPut,
    paymentGet,
    paymentPost,
  };
};

export default AxiosService();
