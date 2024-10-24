import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import {Context} from '../../providers/localization.js';
import {colors, scaling, fonts} from '../../library';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {TouchableOpacity} from 'react-native-gesture-handler';
import OTPVerifiedPopup from '../../components/otp-verified-popup.js';
import {
  regenerateOtp,
  verifyOtp,
  resetResendOtp,
  resetVerifyOtp,
  resetAuthReducerWithoutLogout,
  otpLogin,
  regenerateOtpLogin,
  validateUser,
} from '../../redux/actions/auth.actions';
import {OTP_TIMER} from '../../utils/constants';
import {mobileAmbulance} from '../../../assets';
import {BackArrow} from '../../components/BackArrow.js';
import CustomButton from '../../components/CustomButton.js';
import {removeAsyncStorage, setAsyncStorage} from '../../utils/asyncStorage.js';
import {
  getProfile,
  globalConfig,
  getPickist,
} from '../../redux/actions/app.actions.js';
import SmsRetriever from 'react-native-sms-retriever';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const OTPScreen = props => {
  const strings = React.useContext(Context).getStrings();
  const {otpScreen} = strings;
  const {flow, mobile, email} = props.route.params;
  const [otp, setOtp] = useState('');
  const [confirmPressed, setConfirmPressed] = useState(false);
  const [resetPressed, setResetPressed] = useState(false);
  const [time, setTime] = React.useState(OTP_TIMER);
  const [otpVerifiedPopup, setVerifiedPopup] = useState(false);
  let timeOutRef = useRef().current;

  const smsListener = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        // stop previous listener if any
        SmsRetriever.removeSmsListener();
        await SmsRetriever.addSmsListener(event => {
          const otpPattern = /\b\d{4}\b/; // Regular expression to match exactly 4 digits
          // Use the match method with the regular expression to extract the OTP
          const matches = event.message?.match(otpPattern);
          if (matches) {
            setOtp(matches[0]);
          }
          SmsRetriever.removeSmsListener();
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      smsListener();
    }
    timer();

    return () => {
      if (Platform.OS === 'android') {
        SmsRetriever.removeSmsListener();
      }
    };
  }, []);

  useEffect(() => {
    if (props.resendOtpFail && confirmPressed) {
      const errMsg =
        props.resendOtpFail?.errors?.response?.data?.apierror?.code || '';
      if (errMsg) {
        if (errMsg === 'ZQTZA0039') {
          Toast.showWithGravity(
            strings.otpScreen.phoneNotRegistered,
            Toast.LONG,
            Toast.TOP,
          );
        } else if (errMsg === 'ZQTZA0004') {
          Toast.showWithGravity(
            strings.otpScreen.userNotFound,
            Toast.LONG,
            Toast.TOP,
          );
        }
      }
    }
  }, [props.resendOtpFail]);

  useEffect(() => {
    if (props.resendOtpSuccess && resetPressed) {
      setResetPressed(false);
      setTime(OTP_TIMER);
      console.log('===> props.resendOtpSuccess', props.resendOtpSuccess);
      Toast.showWithGravity(strings.otpScreen.OTPresendSuccessfully, Toast.LONG, Toast.TOP);
    }
  }, [props.resendOtpSuccess]);

  useEffect(() => {
    if (props.regenerateOtpSuccess && resetPressed) {
      setResetPressed(false);
      setTime(OTP_TIMER);
      Toast.showWithGravity(strings.otpScreen.OTPresendSuccessfully, Toast.LONG, Toast.TOP);
    }
  }, [props.regenerateOtpSuccess]);

  useEffect(() => {
    if (props.regenerateOtpFail && props.regenerateOtpFail.apierror) {
      const _code = props.regenerateOtpFail.apierror.code || '';
      if (_code === 'ZQTZA0039') {
        Toast.showWithGravity(
          strings.otpScreen.phoneNotRegistered,
          Toast.LONG,
          Toast.TOP,
        );
      } else if (_code === 'ZQTZA0004') {
        Toast.showWithGravity(
          strings.otpScreen.userNotFound,
          Toast.LONG,
          Toast.TOP,
        );
      }
    }
  }, [props.regenerateOtpFail]);

  useEffect(() => {
    if (props.verifyOtpFail && confirmPressed) {
      const errMsg =
        props.verifyOtpFail?.errors?.response?.data?.apierror?.code || '';
      if (errMsg) {
        if (errMsg === 'ZQTZA0039') {
          Toast.showWithGravity(
            strings.otpScreen.phoneNotRegistered,
            Toast.LONG,
            Toast.TOP,
          );
        } else if (errMsg === 'ZQTZA0002') {
          Toast.showWithGravity(
            strings.otpScreen.verificationUnSuccessful,
            Toast.LONG,
            Toast.TOP,
          );
        } else if (errMsg === 'ZQTZA0004') {
          Toast.showWithGravity(
            strings.otpScreen.userNotFound,
            Toast.LONG,
            Toast.TOP,
          );
        } else if (errMsg === 'ZQTZA0040') {
          Toast.showWithGravity(
            strings.otpScreen.otpExpired,
            Toast.LONG,
            Toast.TOP,
          );
        }
      }
    }
  }, [props.verifyOtpFail]);

  useEffect(() => {
    if (props.verifyOtpSuccess) {
      if (flow === 'forgotPass') {
        props.resetVerifyOtp();
        if (mobile) {
          props.navigation.navigate('ResetPass', {mobile: mobile});
        } else {
          props.navigation.navigate('ResetPass', {email: email});
        }
      } else if (flow === 'signUpScreen') {
        props.resetVerifyOtp();
        props.navigation.navigate('SignupProfile', {
          mobile: mobile,
        });
      } else {
        setVerifiedPopup(true);
        timeOutRef = setTimeout(onHandleContinue, 30000);

        // clear on component unmount
        return () => {
          clearTimeout(timeOutRef);
        };
      }
    }
  }, [props.verifyOtpSuccess]);

  useEffect(() => {
    if (props.getProfileSuccess?.data) {
      props.globalConfig();
      props.getPickist();
      props.validateUser(true);
    }
  }, [props.getProfileSuccess]);

  useEffect(() => {
    if (props.otpLoginSuccess && props.otpLoginSuccess.data) {
      setAsyncStorage('traceId', props.otpLoginSuccess.data.trace_id);
      setAsyncStorage('authToken', props.otpLoginSuccess.data.access_token);
      props.getProfile();
    }
  }, [props.otpLoginSuccess]);

  useEffect(() => {
    if (props.otpLoginFail && props.otpLoginFail.apierror) {
      const _code = props.otpLoginFail.apierror.code || '';
      if (_code === 'ZQTZA0039') {
        Toast.showWithGravity(
          strings.otpScreen.phoneNotRegistered,
          Toast.LONG,
          Toast.TOP,
        );
      } else if (_code === 'ZQTZA0002') {
        Toast.showWithGravity(
          strings.otpScreen.verificationUnSuccessful,
          Toast.LONG,
          Toast.TOP,
        );
      } else if (_code === 'ZQTZA0004') {
        Toast.showWithGravity(
          strings.otpScreen.userNotFound,
          Toast.LONG,
          Toast.TOP,
        );
      } else if (_code === 'ZQTZA0040') {
        Toast.showWithGravity(
          strings.otpScreen.otpExpired,
          Toast.LONG,
          Toast.TOP,
        );
      }
    }
  }, [props.otpLoginFail]);

  const timer = () => {
    let interval = setInterval(() => {
      setTime(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  };
  const handleResendButtonClick = () => {
    if (Platform.OS === 'android') {
      smsListener();
    }
    setResetPressed(true);
    setOtp('');
    setTime(OTP_TIMER);
    timer();
    if (flow === 'loginScreen') {
      props.regenerateOtpLogin({loginId: mobile});
    } else {
      if (flow === 'forgotPass') {
        if (mobile) {
          props.regenerateOtp({
            phoneNumber: mobile,
            isForgotPassword: true,
          });
        } else {
          props.regenerateOtp({
            email: email,
            isForgotPassword: true,
          });
        }
      } else {
        props.regenerateOtp({
          phoneNumber: mobile,
          isForgotPassword: false,
          tempCitizenUserId: props.userRegistrationSuccess?.data,
        });
      }
    }
  };

  const handleSubmit = () => {
    if (otp.length === 4) {
      setConfirmPressed(true);
      if (flow === 'loginScreen') {
        removeAsyncStorage('authToken', () => {
          props.otpLogin({
            loginId: mobile,
            otp: otp,
          });
        });
      } else {
        if (flow === 'forgotPass') {
          props.verifyOtp({
            isForgotPassword: flow === 'forgotPass',
            otp: otp,
            phoneNumber: mobile,
            email: email,
          });
        } else {
          props.verifyOtp({
            isForgotPassword: flow === 'forgotPass',
            otp: otp,
            phoneNumber: mobile,
            email: email,
            tempCitizenUserId: props.userRegistrationSuccess?.data,
          });
        }
      }
    } else {
      Toast.showWithGravity(
        strings.otpScreen.EnterCompleteOTPFirst,
        Toast.LONG,
        Toast.TOP,
      );
    }
  };

  const onHandleContinue = () => {
    setVerifiedPopup(false);
    clearTimeout(timeOutRef);
    props.resetAuthReducerWithoutLogout();
    props.navigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}],
    });
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.container}>
        <OTPVerifiedPopup
          isVisible={otpVerifiedPopup}
          onHandleContinue={onHandleContinue}
        />
        <SafeAreaView />
        <LinearGradient
          colors={[colors.white, colors.PaleBlue]}
          style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={styles.container2}>
            <View style={styles.mainView}>
              <View style={{alignSelf: 'center'}}>
                <View
                  style={{
                    position: 'absolute',
                    marginLeft: widthScale(16),
                    zIndex: 1,
                  }}>
                  <BackArrow
                    onPress={() => {
                      props.navigation.goBack();
                    }}
                  />
                </View>
                <Image
                  source={mobileAmbulance}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.title}>{otpScreen.otpVerification}</Text>
                <Text style={styles.subTitle}>{otpScreen.enterOtpBelow}</Text>
              </View>
              <View style={styles.inputContainer}>
                <OTPInputView
                  style={styles.otpContainer}
                  pinCount={4}
                  code={otp}
                  onCodeChanged={code => {
                    setOtp(code);
                  }}
                  selectionColor={colors.white}
                  placeholderCharacter={'_'}
                  placeholderTextColor={colors.lightGrey6}
                  autoFocusOnLoad
                  editable={true}
                  codeInputFieldStyle={styles.otpTextStyle}
                  codeInputHighlightStyle={styles.otpTextStyleHighlighted}
                  secureTextEntry={true}
                />
              </View>

              <TouchableOpacity
                disabled={time ? true : false}
                onPress={handleResendButtonClick}>
                <View style={styles.resetContainer}>
                  <Text
                    style={time ? styles.resendOtp : styles.resendOtpActive}>
                    {strings.otpScreen.reSendOtp}
                  </Text>
                  {time ? (
                    <Text style={styles.counter}> {`${time} ${strings.otpScreen.sec}`} </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
              {props.resendOtpLoading ||
              props.verifyOtpLoading ||
              props.otpLoginLoading ||
              props.regenerateOtpLoading ||
              props.getProfileLoading ||
              props.globalConfigurationLoading ||
              props.getPicklistLoading ? (
                <View style={styles.button}>
                  <ActivityIndicator color={colors.white} size="small" />
                </View>
              ) : (
                <View>
                  <CustomButton
                    onPress={() => {
                      handleSubmit();
                    }}
                    title={otpScreen.verifyOtp}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainView: {marginHorizontal: widthScale(16), marginBottom: heightScale(30)},
  container2: {
    flexGrow: 1,
  },

  resetContainer: {
    marginBottom: 24,
    marginTop: 16,
    flexDirection: 'row',
  },
  otpContainer: {
    width: '80%',
    height: heightScale(48),
  },
  counter: {
    marginLeft: widthScale(5),
    color: colors.lightRed4,
  },
  otpTextStyle: {
    borderWidth: widthScale(1),
    borderRadius: moderateScale(10),
    width: 56,
    height: 56,
    fontSize: normalize(20),
    borderColor: colors.lightGrey5,
    color: colors.black,
    backgroundColor: colors.white,
  },
  resendOtp: {
    color: colors.DimGray,
    fontSize: normalize(12),
    textAlign: 'center',
    fontFamily: fonts.calibri.semiBold,
    fontWeight: '600',
  },
  resendOtpActive: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.semiBold,
    color: colors.primary,
    fontWeight: '600',
  },
  otpTextStyleHighlighted: {
    borderWidth: widthScale(1),
    borderRadius: moderateScale(10),
    width: 56,
    height: 56,
    fontSize: normalize(20),
    borderColor: colors.primary,
    color: colors.black,
  },

  inputContainer: {marginTop: 16},

  button: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    color: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: heightScale(15),
    paddingHorizontal: widthScale(60),
    borderRadius: moderateScale(100),
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(16),
    fontWeight: '500',
  },
  logo: {
    height: Dimensions.get('screen').height / 2,
    width: Dimensions.get('screen').width,
  },

  textView: {
    marginTop: heightScale(2),
  },
  title: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    color: colors.DarkGray,
  },
  subTitle: {
    fontFamily: fonts.calibri.bold,
    color: colors.DarkGray,
    fontSize: normalize(22),
    padding: 0,
  },
});

const mapStateToProps = ({Auth, App}) => {
  const {
    resendOtpLoading,
    resendOtpSuccess,
    resendOtpFail,
    verifyOtpLoading,
    verifyOtpSuccess,
    verifyOtpFail,
    userRegistrationSuccess,
    otpLoginLoading,
    otpLoginSuccess,
    otpLoginFail,
    regenerateOtpLoading,
    regenerateOtpSuccess,
    regenerateOtpFail,
  } = Auth;
  const {
    getProfileSuccess,
    getProfileLoading,
    getProfileFail,
    globalConfigurationLoading,
    globalConfigurationSuccess,
    globalConfigurationFail,
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
  } = App;

  return {
    resendOtpLoading,
    resendOtpSuccess,
    resendOtpFail,
    verifyOtpLoading,
    verifyOtpSuccess,
    verifyOtpFail,
    userRegistrationSuccess,
    otpLoginLoading,
    otpLoginSuccess,
    otpLoginFail,
    regenerateOtpLoading,
    regenerateOtpSuccess,
    regenerateOtpFail,
    getProfileSuccess,
    getProfileLoading,
    getProfileFail,
    globalConfigurationLoading,
    globalConfigurationSuccess,
    globalConfigurationFail,
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
  };
};

const mapDispatchToProps = {
  regenerateOtp,
  verifyOtp,
  resetResendOtp,
  resetVerifyOtp,
  resetAuthReducerWithoutLogout,
  otpLogin,
  regenerateOtpLogin,
  getProfile,
  globalConfig,
  getPickist,
  validateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(OTPScreen);
