import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Linking,
  Image,
} from 'react-native';
import {Context} from '../../providers/localization.js';
import {loginUser, validateUser, sendLoginOtp} from '../../redux/actions/auth.actions';
import {globalConfig, getPickist} from '../../redux/actions/app.actions';
import LinearGradient from 'react-native-linear-gradient';
import {getProfile} from '../../redux/actions/app.actions';
import {connect} from 'react-redux';
import {colors, scaling, fonts} from '../../library';
import Modal from 'react-native-modal';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import {removeAsyncStorage} from '../../utils/asyncStorage';
import {zenzoLogo} from '../../../assets';
import {useIsFocused} from '@react-navigation/native';
import PhoneInput from '../../components/PhoneInput';
import CustomButton from '../../components/CustomButton';
import Toast from 'react-native-simple-toast';

const version = DeviceInfo.getVersion();
const {normalize, widthScale, heightScale, moderateScale} = scaling;

const LoginScreen = props => {
  const strings = React.useContext(Context).getStrings();
  const {configuration} = strings;

  const isFocused = useIsFocused();

  const [loginID, setLoginID] = useState('');
  const [password, setPassword] = useState('');
  const [loginIdError, setLoginIdError] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [commonError, setCommonError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [loginIdInvalid, setLoginIdInvalid] = useState(false);
  const [phoneIncorrect, setPhoneIncorrect] = useState(false);
  const [isLoginButtonDisabled, setLoginButtonDisabled] = useState(true);

  useEffect(() => {
    if (loginID) {
      setLoginButtonDisabled(false);
    } else {
      setLoginButtonDisabled(true);
    }
  }, [loginID]);

  useEffect(() => {
    setLoginID('');
    setPassword('');
  }, [isFocused]);

  useEffect(() => {
    if (props.userLoginFail) {
      if (props.userLoginFailCode === 'ZQTZA0001') {
        setLoginError(strings.loginScreen.invalidCredentials);
      } else if (props.userLoginFailCode === 'ZQTZA0008') {
        setLoginError(strings.loginScreen.tempPasswordExpired);
      } else if (props.userLoginFailCode === 'ZQTZA0004') {
        setPhoneIncorrect(true);
      } else if (props.userLoginFailCode === 'ZQTZA0029') {
        setLoginError(strings.loginScreen.loginPersonalNotAllowed);
      } else if (props.userLoginFailCode === 'ZQTZA0036') {
        setVersionError(true);
        setLoginError(props.userLoginFailMessage);
      } else if (props.userLoginFailMessage) {
        setLoginError(props.userLoginFailMessage);
      }
      setCommonError(true);
    }
  }, [props.userLoginFail]);

  useEffect(() => {
    if (props.userLoginSuccess && props.userLoginSuccess.data) {
      props.getProfile();
    }
  }, [props.userLoginSuccess]);

  useEffect(() => {
    if (props.getProfileSuccess?.data) {
      props.globalConfig();
      props.getPickist();
      props.validateUser(true);
    }
  }, [props.getProfileSuccess]);

  useEffect(() => {
    if (props.sendLoginOtpSuccess) {
      props.navigation.navigate('OTP', {
        flow: 'loginScreen',
        mobile: loginID,
      });
    }
  }, [props.sendLoginOtpSuccess]);

  useEffect(() => {
    if (props.sendLoginOtpFail && props.sendLoginOtpFail.apierror) {
      if (props.sendLoginOtpFail.apierror.code === 'ZQTZA0039') {
        setPhoneIncorrect(true);
      } else if (props.sendLoginOtpFail.apierror.message) {
        Toast.showWithGravity(props.sendLoginOtpFail.apierror.message, Toast.LONG, Toast.TOP);
      } else {
        setCommonError(true);
      }
    }
  }, [props.sendLoginOtpFail]);

  const signInHandler = () => {
    const errorCount = validate();
    if (errorCount === 0) {
      removeAsyncStorage('authToken', () => {
        props.sendLoginOtp({ loginId: loginID });
      });
    }
    if (errorCount > 0) {
      setPassword('');
    }
  };

  const openStore = () => {
    let storeLink = Config.APP_CENTER_LINK;
    Linking.canOpenURL(storeLink)
      .then(() => {
        Linking.openURL(storeLink);
      })
      .catch();
  };

  const validate = () => {
    let errorCount = 0;
    if (loginID === '') {
      setLoginIdError(true);
      errorCount = errorCount + 1;
    }
    if (loginID && loginID.length < 10) {
      setLoginIdInvalid(true);
      errorCount = errorCount + 1;
    }
    return errorCount;
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.container}>
        <SafeAreaView />
        <LinearGradient colors={[colors.white, colors.PaleBlue]} style={{flex: 1, justifyContent: 'center' }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={styles.container2}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Modal isVisible={versionError}>
                <View style={styles.modalContainer}>
                  <Text style={styles.heading}>{`${
                    configuration.versionExpired
                  } ${DeviceInfo.getVersion()}`}</Text>
                  <Text style={styles.description}>
                    {configuration.pleaseUpdate}
                  </Text>
                  <View
                    style={[
                      styles.buttonsContainer,
                      {flexDirection: 'column', alignItems: 'center'},
                    ]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.modalButton,
                        {
                          borderWidth: 0,
                          backgroundColor: colors.primary,
                          marginLeft: widthScale(16),
                        },
                      ]}
                      onPress={() => openStore()}>
                      <Text style={[styles.buttonText, {color: colors.white}]}>
                        {configuration.update}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <View style={{paddingHorizontal: widthScale(25)}}>
                <View style={styles.headerContainer}>
                  <View
                    style={
                      Platform.OS === 'ios' ? styles.headerios : styles.header
                    }>
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Image
                        source={zenzoLogo}
                        style={styles.logo}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={{marginTop: heightScale(36)}}>
                      <Text style={styles.title}>
                        {strings.loginScreen.welcomeBack}
                      </Text>
                      <Text style={styles.subTitle1}>
                        {strings.loginScreen.signInToYourAccount}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.inputCard}>
                  <View>
                    <View>
                      <View>
                        <PhoneInput
                          placeholder={strings.loginScreen.yourPhoneNumber}
                          value={loginID}
                          fieldName="phoneInput"
                          onChangeText={value => {
                            setLoginID(value);
                            setCommonError(false);
                            setLoginIdInvalid(false);
                            setPhoneIncorrect(false);
                            setLoginIdError(false);
                          }}
                          error={
                            loginIdError
                              ? strings.loginScreen.phoneNumberError
                              : loginIdInvalid
                              ? strings.loginScreen.phoneNumberInvalid
                              : phoneIncorrect
                              ? strings.loginScreen.phoneUnregistered
                              : null
                          }
                        />
                      </View>
                      {!loginIdError && !passwordError && (
                        <View>
                          {!commonError ? null : (
                            <Text style={styles.textAlert}>
                              {props.userLoginFailMessage &&
                              props.userLoginFailMessage.includes(
                                'MOBILE_LOGIN_NOT_ALLOWED',
                              )
                                ? strings.loginScreen.mobileLogin
                                : props.userLoginFailMessage &&
                                  props.userLoginFailMessage.includes(
                                    'User blocked',
                                  )
                                ? strings.loginScreen.accountBlocked
                                : props.userLoginFailMessage &&
                                  props.userLoginFailMessage.includes(
                                    'DEVICE_NOT_REGISTERED',
                                  )
                                ? strings.loginScreen.deviceNotRegistered
                                : props.userLoginFailMessage &&
                                  props.userLoginFailMessage.includes(
                                    'LINKED_WITH_PERSONAL_DEVICE',
                                  )
                                ? strings.loginScreen.sharedDeviceError
                                : loginError != ''
                                ? loginError
                                : phoneIncorrect
                                ? setCommonError(false)
                                : strings.common.generalError}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={{marginTop: heightScale(36)}}>
                    <CustomButton
                      loading={
                        props.userLoginLoading || props.getProfileLoading || props.sendLoginOtpLoading
                      }
                      onPress={signInHandler}
                      title={strings.loginScreen.signIn}
                      disabled={isLoginButtonDisabled}
                      containerStyles={{flex: 0}}
                      leftIconContainerStyles={{flex: 0}}
                      rightIconContainerStyles={{flex: 0}}
                    />
                  </View>
                  <View style={styles.footer}>
                    <Text style={styles.alreadyText}>
                      {`${strings.loginScreen.dontHaveAnAccount} `}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setPasswordError(false);
                        setCommonError(false);
                        setLoginIdInvalid(false);
                        setPhoneIncorrect(false);
                        setLoginIdError(false);
                        props.navigation.navigate('SignupScreen');
                      }}>
                      <Text style={styles.contactText}>
                        {strings.loginScreen.signUp}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.alreadyText}>
                      {Config.APP_TYPE} v
                      {version}
                    </Text>
                  </View>
                </View>
              </View>
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
  container2: {
    flexGrow: 1,
  },
  headerContainer: {},
  buttonsContainer: {
    marginTop: heightScale(28),
    flexDirection: 'row',
  },
  modalButton: {
    backgroundColor: colors.white,
    color: colors.white,
    borderWidth: widthScale(2),
    borderColor: colors.primary,
    width: widthScale(120),
    height: heightScale(36),
    borderRadius: moderateScale(5),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: heightScale(32),
    marginBottom: heightScale(15),
  },
  headerios: {
    marginBottom: heightScale(15),
  },
  title: {
    fontSize: normalize(24),
    fontFamily: fonts.calibri.bold,
    color: colors.black,
  },
  subTitle1: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.black,
  },
  inputCard: {
    marginTop: heightScale(20),
  },
  logo: {
    height: heightScale(110),
    width: heightScale(145),
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  textAlert: {
    color: colors.red,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    marginTop: heightScale(15),
  },
  forgotTextContainer: {
    alignItems: 'flex-end',
    marginTop: heightScale(25),
  },
  forgotText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    color: colors.primary,
    fontWeight: '600',
  },
  alreadyText: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.black,
  },
  contactText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    marginTop: heightScale(16),
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: heightScale(30),
  },
  modalContainer: {
    height: heightScale(170),
    width: widthScale(288),
    backgroundColor: colors.white,
    borderRadius: moderateScale(5),
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: heightScale(15),
    marginHorizontal: widthScale(16),
    fontSize: normalize(18),
    color: colors.greyishBrownTwo,
    fontFamily: fonts.calibri.bold,
  },
  description: {
    textAlign: 'center',
    marginTop: heightScale(22),
    marginHorizontal: widthScale(34),
    fontSize: normalize(16),
    color: colors.darkBlue,
    fontFamily: fonts.calibri.regular,
  },
});

const mapStateToProps = ({Auth, App}) => {
  const {
    userLoginLoading,
    userLoginSuccess,
    userLoginFail,
    userLoginFailMessage,
    userLoginFailCode,
    sendLoginOtpLoading,
    sendLoginOtpSuccess,
    sendLoginOtpFail,
  } = Auth;
  const {
    getProfileSuccess,
    getProfileLoading,
    getProfileFail,
    globalConfigurationLoading,
    globalConfigurationSuccess,
    globalConfigurationFail,
  } = App;

  return {
    userLoginLoading,
    userLoginSuccess,
    userLoginFail,
    userLoginFailMessage,
    userLoginFailCode,
    getProfileSuccess,
    getProfileLoading,
    getProfileFail,
    globalConfigurationLoading,
    globalConfigurationSuccess,
    globalConfigurationFail,
    sendLoginOtpLoading,
    sendLoginOtpSuccess,
    sendLoginOtpFail,
  };
};

const mapDispatchToProps = {
  loginUser,
  validateUser,
  getProfile,
  globalConfig,
  getPickist,
  sendLoginOtp,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
