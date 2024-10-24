import {
  loginEndpoint,
  forgotPassEndpoint,
  userInfoEndpoint,
  changePassEndpoint,
  logoutEndpoint,
  citizenUser,
  tempCitizenUser,
  otpRegenerate,
  otpVerify,
  resetPass,
  termsConditions,
  changePassword,
  sendLoginOtpEndpoint,
  otpLoginEndpoint,
  loginOtpRegenerateEndpoint,
} from '../constants/endpoint-constants';
import apiService from './axios-service';

export const userLoginApi = data => {
  console.log('data=', data);
  return apiService.post(`${loginEndpoint}`, data);
};

export const sendLoginOtpApi = data => {
  return apiService.post(`${sendLoginOtpEndpoint}?loginId=${data.loginId}`);
};

export const forgotPassApi = loginId => {
  let queryParams = '';
  if (loginId) {
    queryParams = `?loginId=${loginId}`;
  }
  return apiService.get(`${forgotPassEndpoint}${queryParams}`);
};

export const userInfoApi = () => {
  return apiService.get(`${userInfoEndpoint}`);
};

export const changePassApi = (data, phoneNo) => {
  return apiService.put(
    `${citizenUser}${changePassword}?phoneNumber=${phoneNo}`,
    data,
  );
};

export const logoutApi = () => {
  return apiService.put(`${logoutEndpoint}`);
};

export const userRegistrationApi = data => {
  console.log('register=', data);
  return apiService.post(`${citizenUser}${tempCitizenUser}`, data);
};

export const userRegistrationProfileApi = data => {
  return apiService.post(`${citizenUser}/`, data);
};

export const regenerateOtpApi = data => {
  const queryParams = data.phoneNumber
    ? `?phoneNumber=${data.phoneNumber}&isForgotPassword=${data.isForgotPassword}`
    : `?email=${data.email}&isForgotPassword=${data.isForgotPassword}`;
  return apiService.put(`${citizenUser}${otpRegenerate}${queryParams}`);
};

export const verifyOtpApi = data => {
  let queryParams = data.phoneNumber
    ? `?isForgotPassword=${data.isForgotPassword}&otp=${data.otp}&phoneNumber=${data.phoneNumber}`
    : `?isForgotPassword=${data.isForgotPassword}&otp=${data.otp}&email=${data.email}`;
    if (data?.tempCitizenUserId) {
      queryParams = `${queryParams}&tempCitizenUserId=${data.tempCitizenUserId}`
    }
  return apiService.get(`${citizenUser}${otpVerify}${queryParams}`);
};

export const otpLoginApi = data => {
  return apiService.post(`${otpLoginEndpoint}?loginId=${data.loginId}&otp=${data.otp}`);
};

export const regenerateOtpLoginApi = data => {
  return apiService.post(`${loginOtpRegenerateEndpoint}?loginId=${data.loginId}`);
};

export const resetPassApi = data => {
  let queryParams = '';
  queryParams = data.phoneNumber
    ? `?phoneNumber=${data.phoneNumber}`
    : `?email=${data.email}`;
  return apiService.put(`${citizenUser}${resetPass}${queryParams}`, {
    newPassword: data.newPassword,
  });
};

export const termsAndConditionsApi = () => {
  return apiService.get(`${citizenUser}${citizenUser}${termsConditions}`);
};
