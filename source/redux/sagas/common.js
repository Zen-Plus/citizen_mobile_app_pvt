import {takeEvery, call, put} from 'redux-saga/effects';
import _ from 'lodash';
import {clearAsyncStorage} from '../../utils/asyncStorage';
import authActions from '../constants/action-types/auth.actionTypes';
import CommonActions from '../constants/action-types/common';
import appActions from '../constants/action-types/app.actionTypes';
import NetInfo from '@react-native-community/netinfo';
// import { setDbData, getDbData, updateDbData, updateSyncData, selectSyncData, createSyncData, getUnsyncedPendingDataCount } from '../../utils/database';
import Toast from 'react-native-simple-toast';
import store from '../store';
import {toastDuration, toastLONG} from '../../constants';

function* handleApiCall(action) {
  const {promise, onSuccessCallback, placeholderData} = action;
  const {START, SUCCESS, FAIL} = action.subtypes;

  yield put({type: START, data: action.data});

  try {
    let isConnected = (yield NetInfo.fetch()).isConnected;

    if (!isConnected) {
      Toast.showWithGravity('No Internet Connection', Toast.LONG, Toast.TOP);
      yield put({
        type: FAIL,
        errors,
        data: action.data,
      });
      return '';
    } else {
      const response = yield call(promise);
      const result = yield response.data;
      yield put({
        type: SUCCESS,
        payload: placeholderData || result,
        data: action.data,
      });
    }

    if (onSuccessCallback && _.isFunction(onSuccessCallback)) {
      yield call(onSuccessCallback);
    }
  } catch (errors) {
    console.log('catch commmon', errors);
    // console.log("======= catch commmon", errors && errors.response);
    if (
      errors.response &&
      errors.response.data &&
      errors.response.data.apierror
    ) {
      if (errors.response.data.apierror.code === 'ZQTZA0050') {
        store.dispatch({
          type: appActions.DEVICE_TIME_INCORRECT,
          payload: {
            isIncorrectTime: true,
          },
        });
      }
      if (
        errors?.response?.data?.apierror?.status === 'UNAUTHORIZED' &&
        (errors?.response?.data?.apierror?.debugMessage?.includes(
          'Invalid access token',
        ) ||
          errors?.response?.data?.apierror?.message?.includes('Invalid Token'))
      ) {
        clearAsyncStorage();
        yield put({
          type: authActions.RESET_AUTH_REDUCER,
        });
      }
    }

    if (errors.toString().includes('Network Error'))
      Toast.showWithGravity('Please check your Internet Connection', Toast.LONG, Toast.TOP);
    yield put({type: FAIL, errors, data: action.data});
  }
}

export default function* () {
  yield takeEvery(CommonActions.COMMON_API_CALL, handleApiCall);
}
