export default {
  IS_LOGGED_IN: 'auth.is_logged_in.reducer',

  USER_ROLE: 'auth.user_role.reducer',

  RESET_AUTH_REDUCER: 'auth.reset.auth.reducer',

  USER_LOGIN: {
    START: 'auth.user_login:start',
    SUCCESS: 'auth.user_login:success',
    FAIL: 'auth.user_login:fail',
  },

  SEND_LOGIN_OTP: {
    START: 'auth.send_login_otp:start',
    SUCCESS: 'auth.send_login_otp:success',
    FAIL: 'auth.send_login_otp:fail',
  },

  FORGOT_PASSWORD: {
    START: 'auth.forgot_password:start',
    SUCCESS: 'auth.forgot_password:success',
    FAIL: 'auth.forgot_password:fail',
  },

  GET_USERINFO: {
    START: 'auth.get_userinfo:start',
    SUCCESS: 'auth.get_userinfo:success',
    FAIL: 'auth.get_userinfo:fail',
  },

  CHANGE_PASSWORD: {
    START: 'auth.change_password:start',
    SUCCESS: 'auth.change_password:success',
    FAIL: 'auth.change_password:fail',
  },

  USER_REGISTRATION: {
    START: 'auth.user_registration:start',
    SUCCESS: 'auth.user_registration:success',
    FAIL: 'auth.user_registration:fail',
  },

  USER_REGISTRATION_PROFILE: {
    START: 'auth.user_registration_profile:start',
    SUCCESS: 'auth.user_registration_profile:success',
    FAIL: 'auth.user_registration_profile:fail',
  },

  RESEND_OTP: {
    START: 'auth.resend_otp:start',
    SUCCESS: 'auth.resend_otp:success',
    FAIL: 'auth.resend_otp:fail',
    RESET: 'auth.resend_otp:reset',
  },

  VERIFY_OTP: {
    START: 'auth.verify_otp:start',
    SUCCESS: 'auth.verify_otp:success',
    FAIL: 'auth.verify_otp:fail',
    RESET: 'auth.verify_otp:reset',
  },

  OTP_LOGIN: {
    START: 'auth.otp_login:start',
    SUCCESS: 'auth.otp_login:success',
    FAIL: 'auth.otp_login:fail',
    RESET: 'auth.otp_login:reset',
  },

  REGENERATE_OTP: {
    START: 'auth.regenerate_otp:start',
    SUCCESS: 'auth.regenerate_otp:success',
    FAIL: 'auth.regenerate_otp:fail',
    RESET: 'auth.regenerate_otp:reset',
  },

  RESET_PASS: {
    START: 'auth.reset_pass:start',
    SUCCESS: 'auth.reset_pass:success',
    FAIL: 'auth.reset_pass:fail',
  },
  TERMS_CONDITIONS: {
    START: 'auth.terms_conditions:start',
    SUCCESS: 'auth.terms_conditions:success',
    FAIL: 'auth.terms_conditions:fail',
  },
};
