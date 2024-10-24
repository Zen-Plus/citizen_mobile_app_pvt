import authActions from '../constants/action-types/auth.actionTypes';
import commonActions from '../constants/action-types/common';
import * as authApi from '../api/auth.api';

export const loginUser = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.USER_LOGIN,
  promise: () => authApi.userLoginApi(data),
});

export const sendLoginOtp = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.SEND_LOGIN_OTP,
  promise: () => authApi.sendLoginOtpApi(data),
});

export const forgotPass = loginId => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.FORGOT_PASSWORD,
  promise: () => authApi.forgotPassApi(loginId),
});

export const getUserInfo = () => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.GET_USERINFO,
  promise: () => authApi.userInfoApi(),
});

export const changePass = (data, phoneNo) => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.CHANGE_PASSWORD,
  promise: () => authApi.changePassApi(data, phoneNo),
});

export const validateUser = data => ({
  type: authActions.IS_LOGGED_IN,
  payload: data,
});

export const setUserRole = data => ({
  type: authActions.USER_ROLE,
  payload: data,
});

export const resetAuthReducer = () => ({
  type: authActions.RESET_AUTH_REDUCER,
  promise: () => authApi.logoutApi(),
});

export const registerUser = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.USER_REGISTRATION,
  promise: () => authApi.userRegistrationApi(data),
});

export const registerUserProfile = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.USER_REGISTRATION_PROFILE,
  promise: () => authApi.userRegistrationProfileApi(data),
});

export const regenerateOtp = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.RESEND_OTP,
  promise: () => authApi.regenerateOtpApi(data),
});

export const verifyOtp = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.VERIFY_OTP,
  promise: () => authApi.verifyOtpApi(data),
});

export const otpLogin = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.OTP_LOGIN,
  promise: () => authApi.otpLoginApi(data),
});

export const resetOtpLogin = () => ({
  type: authActions.OTP_LOGIN.RESET,
});

export const regenerateOtpLogin = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.REGENERATE_OTP,
  promise: () => authApi.regenerateOtpLoginApi(data),
});

export const resetRegenerateOtpLogin = () => ({
  type: authActions.REGENERATE_OTP.RESET,
});

export const resetPass = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.RESET_PASS,
  promise: () => authApi.resetPassApi(data),
});

export const resetResendOtp = () => ({
  type: authActions.RESEND_OTP.RESET,
});

export const resetVerifyOtp = () => ({
  type: authActions.VERIFY_OTP.RESET,
});

export const resetAuthReducerWithoutLogout = () => ({
  type: authActions.RESET_AUTH_REDUCER,
});

export const termsAndConditions = () => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: authActions.TERMS_CONDITIONS,
  promise: () => authApi.termsAndConditionsApi(),
});
