import authActions from '../constants/action-types/auth.actionTypes';
import persistWraper from './persistWraper';
import _ from 'lodash';
import {clearAsyncStorage, setAsyncStorage} from '../../utils/asyncStorage';

const initialState = {
  userLoginLoading: false,
  userLoginSuccess: null,
  userLoginFail: false,
  userLoginFailMessage: '',
  userLoginFailCode: null,

  sendLoginOtpLoading: false,
  sendLoginOtpSuccess: null,
  sendLoginOtpFail: null,

  forgotPassLoading: false,
  forgotPassSuccess: null,
  forgotPassFail: false,

  userinfoLoading: false,
  userInfoSuccess: null,
  userInfoFail: false,

  changePassLoading: false,
  changePassSuccess: null,
  changePassFail: false,

  isLoggedIn: null,
  userRole: null,

  userRegistrationLoading: false,
  userRegistrationSuccess: null,
  userRegistrationFail: false,
  userRegistrationFailCode: null,

  userRegistrationProfileLoading: false,
  userRegistrationProfileSuccess: null,
  userRegistrationProfileFail: false,
  userRegistrationProfileFailCode: null,

  resendOtpLoading: false,
  resendOtpSuccess: null,
  resendOtpFail: false,

  verifyOtpLoading: false,
  verifyOtpSuccess: null,
  verifyOtpFail: false,

  otpLoginLoading: false,
  otpLoginSuccess: null,
  otpLoginFail: null,

  regenerateOtpLoading: false,
  regenerateOtpSuccess: null,
  regenerateOtpFail: null,

  resetPassLoading: false,
  resetPassSuccess: null,
  resetPassFail: false,

  termsAndConditionsLoading: false,
  termsAndConditionsSuccess: null,
  termsAndConditionsFail: false,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case authActions.USER_LOGIN.START:
      return {
        ...state,
        userLoginLoading: true,
        userLoginSuccess: null,
        userLoginFail: false,
      };
    case authActions.USER_LOGIN.SUCCESS:
      setAsyncStorage('traceId', action.payload.data.trace_id);
      setAsyncStorage('authToken', action.payload.data.access_token);
      return {
        ...state,
        userLoginLoading: false,
        userLoginSuccess: action.payload,
      };

    case authActions.USER_LOGIN.FAIL:
      return {
        ...state,
        userLoginFail: !state.userLoginFail,
        userLoginLoading: false,
        userLoginFailCode:
          action?.errors?.response?.data?.apierror?.code || null,
        userLoginFailMessage:
          action?.errors?.response?.data?.apierror?.message || null,
      };
    
    case authActions.SEND_LOGIN_OTP.START:
      return {
        ...state,
        sendLoginOtpLoading: true,
        sendLoginOtpSuccess: null,
        sendLoginOtpFail: null,
      };
    case authActions.SEND_LOGIN_OTP.SUCCESS:
      return {
        ...state,
        sendLoginOtpLoading: false,
        sendLoginOtpSuccess: action.payload,
        sendLoginOtpFail: null,
      };
    case authActions.SEND_LOGIN_OTP.FAIL:
      return {
        ...state,
        sendLoginOtpLoading: false,
        sendLoginOtpSuccess: null,
        sendLoginOtpFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
      };

    case authActions.FORGOT_PASSWORD.START:
      return {
        ...state,
        forgotPassLoading: true,
        forgotPassSuccess: null,
        forgotPassFail: false,
      };
    case authActions.FORGOT_PASSWORD.SUCCESS:
      return {
        ...state,
        forgotPassLoading: false,
        forgotPassSuccess: action.payload,
      };
    case authActions.FORGOT_PASSWORD.FAIL:
      return {
        ...state,
        forgotPassFail: !state.forgotPassFail,
        forgotPassLoading: false,
      };

    case authActions.GET_USERINFO.START:
      return {
        ...state,
        userinfoLoading: true,
        userInfoSuccess: null,
        userInfoFail: false,
      };
    case authActions.GET_USERINFO.SUCCESS:
      return {
        ...state,
        userinfoLoading: false,
        userInfoSuccess: action.payload,
      };
    case authActions.GET_USERINFO.FAIL:
      clearAsyncStorage();
      return {
        ...state,
        userInfoFail: !state.userInfoFail,
        userinfoLoading: false,
        userInfoSuccess: null,
        userLoginSuccess: null,
      };

    case authActions.CHANGE_PASSWORD.START:
      return {
        ...state,
        changePassLoading: true,
        changePassSuccess: null,
        changePassFail: false,
      };
    case authActions.CHANGE_PASSWORD.SUCCESS:
      return {
        ...state,
        changePassLoading: false,
        changePassSuccess: action.payload,
        changePassFail: false,
      };
    case authActions.CHANGE_PASSWORD.FAIL:
      return {
        ...state,
        changePassLoading: false,
        changePassSuccess: null,
        changePassFail: action,
      };

    case authActions.IS_LOGGED_IN:
      return {...state, isLoggedIn: action.payload};

    case authActions.USER_ROLE:
      return {...state, userRole: action.payload};

    case authActions.RESET_AUTH_REDUCER:
      return {...initialState};

    case authActions.USER_REGISTRATION.START:
      return {
        ...state,
        userRegistrationLoading: true,
        userRegistrationSuccess: null,
        userRegistrationFail: false,
        userRegistrationFailCode: null,
      };
    case authActions.USER_REGISTRATION.SUCCESS:
      return {
        ...state,
        userRegistrationLoading: false,
        userRegistrationSuccess: action.payload,
        userRegistrationFail: false,
        userRegistrationFailCode: null,
      };
    case authActions.USER_REGISTRATION.FAIL:
      return {
        ...state,
        userRegistrationLoading: false,
        userRegistrationSuccess: null,
        userRegistrationFail: action,
        userRegistrationFailCode:
          action?.errors?.response?.data?.apierror?.code || null,
      };
    // Signup flow profile 
    case authActions.USER_REGISTRATION_PROFILE.START:
      return {
        ...state,
        userRegistrationProfileLoading: true,
        userRegistrationProfileSuccess: null,
        userRegistrationProfileFail: false,
        userRegistrationProfileFailCode: null,
      };
    case authActions.USER_REGISTRATION_PROFILE.SUCCESS:
      return {
        ...state,
        userRegistrationProfileLoading: false,
        userRegistrationProfileSuccess: action.payload,
        userRegistrationProfileFail: false,
        userRegistrationProfileFailCode: null,
      };
    case authActions.USER_REGISTRATION_PROFILE.FAIL:
      return {
        ...state,
        userRegistrationProfileLoading: false,
        userRegistrationProfileSuccess: null,
        userRegistrationProfileFail: action,
        userRegistrationProfileFailCode:
          action?.errors?.response?.data?.apierror?.code || null,
      };

    

    case authActions.RESEND_OTP.START:
      return {
        ...state,
        resendOtpLoading: true,
        resendOtpSuccess: null,
        resendOtpFail: false,
      };
    case authActions.RESEND_OTP.SUCCESS:
      return {
        ...state,
        resendOtpLoading: false,
        resendOtpSuccess: action.payload,
        resendOtpFail: false,
      };
    case authActions.RESEND_OTP.FAIL:
      return {
        ...state,
        resendOtpLoading: false,
        resendOtpSuccess: null,
        resendOtpFail: action,
      };
    case authActions.RESEND_OTP.RESET:
      return {
        ...state,
        resendOtpLoading: false,
        resendOtpSuccess: null,
        resendOtpFail: false,
      };

    case authActions.VERIFY_OTP.START:
      return {
        ...state,
        verifyOtpLoading: true,
        verifyOtpSuccess: null,
        verifyOtpFail: false,
      };
    case authActions.VERIFY_OTP.SUCCESS:
      return {
        ...state,
        verifyOtpLoading: false,
        verifyOtpSuccess: action.payload,
        verifyOtpFail: false,
      };
    case authActions.VERIFY_OTP.FAIL:
      return {
        ...state,
        verifyOtpLoading: false,
        verifyOtpSuccess: null,
        verifyOtpFail: action,
      };
    case authActions.VERIFY_OTP.RESET:
      return {
        ...state,
        verifyOtpLoading: false,
        verifyOtpSuccess: null,
        verifyOtpFail: false,
      };
    
    case authActions.OTP_LOGIN.START:
      return {
        ...state,
        otpLoginLoading: true,
        otpLoginSuccess: null,
        otpLoginFail: null,
      };
    case authActions.OTP_LOGIN.SUCCESS:
      return {
        ...state,
        otpLoginLoading: false,
        otpLoginSuccess: action.payload,
        otpLoginFail: null,
      };
    case authActions.OTP_LOGIN.FAIL:
      return {
        ...state,
        otpLoginLoading: false,
        otpLoginSuccess: null,
        otpLoginFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
      };
    case authActions.OTP_LOGIN.RESET:
      return {
        ...state,
        otpLoginLoading: false,
        otpLoginSuccess: null,
        otpLoginFail: null,
      };

    case authActions.REGENERATE_OTP.START:
      return {
        ...state,
        regenerateOtpLoading: true,
        regenerateOtpSuccess: null,
        regenerateOtpFail: null,
      };
    case authActions.REGENERATE_OTP.SUCCESS:
      return {
        ...state,
        regenerateOtpLoading: false,
        regenerateOtpSuccess: action.payload,
        regenerateOtpFail: null,
      };
    case authActions.REGENERATE_OTP.FAIL:
      return {
        ...state,
        regenerateOtpLoading: false,
        regenerateOtpSuccess: null,
        regenerateOtpFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
      };
    case authActions.REGENERATE_OTP.RESET:
      return {
        ...state,
        regenerateOtpLoading: false,
        regenerateOtpSuccess: null,
        regenerateOtpFail: null,
      };

    case authActions.RESET_PASS.START:
      return {
        ...state,
        resetPassLoading: true,
        resetPassSuccess: null,
        resetPassFail: false,
      };
    case authActions.RESET_PASS.SUCCESS:
      return {
        ...state,
        resetPassLoading: false,
        resetPassSuccess: action.payload,
        resetPassFail: false,
      };
    case authActions.RESET_PASS.FAIL:
      return {
        ...state,
        resetPassLoading: false,
        resetPassSuccess: null,
        resetPassFail: action,
      };

    case authActions.TERMS_CONDITIONS.START:
      return {
        ...state,
        termsAndConditionsLoading: true,
        termsAndConditionsSuccess: null,
        termsAndConditionsFail: false,
      };
    case authActions.TERMS_CONDITIONS.SUCCESS:
      return {
        ...state,
        termsAndConditionsLoading: false,
        termsAndConditionsSuccess: action.payload,
        termsAndConditionsFail: false,
      };
    case authActions.TERMS_CONDITIONS.FAIL:
      return {
        ...state,
        termsAndConditionsLoading: false,
        termsAndConditionsSuccess: null,
        termsAndConditionsFail: action,
      };

    default:
      return state;
  }
};

const blackList = _.without(
  Object.keys(initialState),
  // Persist all the keys listed below
  'userInfoSuccess',
  'isLoggedIn',
  'userRole',
);

export default persistWraper(AuthReducer, blackList, 'Auth');
