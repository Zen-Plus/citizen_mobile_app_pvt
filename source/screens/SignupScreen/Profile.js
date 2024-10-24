import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import {Context} from '../../providers/localization.js';
import {colors, scaling, fonts} from '../../library';
import {
  resetAuthReducerWithoutLogout,
  validateUser,
  registerUserProfile
} from '../../redux/actions/auth.actions';
import {connect} from 'react-redux';
import {validatePassword as passwordValidation, validateNameWithoutSpecialCharacters} from '../../utils/validators';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
import {zenzoLogo} from '../../../assets/index.js';
import {BackArrow} from '../../components/BackArrow.js';
import Input from '../../components/Input.js';
import IconOcticons from 'react-native-vector-icons/Octicons';
import CustomButton from '../../components/CustomButton';
import {removeAsyncStorage, setAsyncStorage} from '../../utils/asyncStorage';
import {getProfile, globalConfig, getPickist} from '../../redux/actions/app.actions';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const SignupProfile = props => {
  const [fullName, setFullName] = useState('');
  const [validateFullName, setValidateFullName] = useState('');
  const [registerPressed, setRegisterPressed] = useState(false);
  const [isSignupButtonDisabled, setSignupButtonDisabled] = useState(true);

  const {mobile} = props.route.params;

  const strings = React.useContext(Context).getStrings();

  useEffect(() => {
    if (props.resetPassSuccess) {
      Toast.showWithGravity(
        strings.resetPass.passResetComplete,
        Toast.LONG,
        Toast.TOP,
      );
    }
  }, [props.resetPassSuccess]);

  useEffect(() => {
    if (props.resetPassFail && registerPressed) {
      const errMsg =
        props.resetPassFail?.errors?.response?.data?.apierror?.code || '';
      if (errMsg) {
        if (errMsg === 'ZQTZA0003') {
          Toast.showWithGravity(strings.changePasswordScreen.fieldsEmpty, Toast.LONG, Toast.TOP);
        }
        if (errMsg === 'ZQTZA0002') {
          Toast.showWithGravity(strings.changePasswordScreen.incorrectPasswordFormat, Toast.LONG, Toast.TOP);
        }
        if (errMsg === 'ZQTZA0039') {
          Toast.showWithGravity(strings.changePasswordScreen.phoneNotRegistered, Toast.LONG, Toast.TOP);
        }
      }
    }
  }, [props.resetPassFail]);

  useEffect(() => {
    if (fullName === '') {
      setSignupButtonDisabled(true);
    } else {
      setSignupButtonDisabled(false);
    }
  }, [fullName]);

  const fullNameValidationFunc = () => {
    if (fullName == '') {
      setValidateFullName(strings.signUpScreen.enterName);
    } else if (fullName.length > 32 || fullName.length < 2) {
      setValidateFullName(strings.signUpScreen.fullNameMaxLength);
    } else if (!validateNameWithoutSpecialCharacters(fullName)) {
      setValidateFullName(strings.signUpScreen.wrongNameFormat);
    } else {
      setValidateFullName('');
      return true;
    }
  };

  const validateFields = () => {
    let fullNameValidated = fullNameValidationFunc();
    if (fullNameValidated) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(()=>{
    if (props.userRegistrationProfileSuccess && props.userRegistrationProfileSuccess.data) {
      setAsyncStorage('traceId', props.userRegistrationProfileSuccess.data.trace_id);
      setAsyncStorage('authToken', props.userRegistrationProfileSuccess.data.access_token);
      props.getProfile();
    }    
  }, [props.userRegistrationProfileSuccess]);

  useEffect(() => {
    if (props.getProfileSuccess?.data) {
      props.globalConfig();
      props.getPickist();
      props.validateUser(true);
    }
  }, [props.getProfileSuccess]);

  const handleSubmit = () => {
    let allFieldsValidated = validateFields();
    if (allFieldsValidated) {
      setRegisterPressed(true);
      removeAsyncStorage('authToken', () => {
        props.registerUserProfile({
          firstName: fullName,
          lastName: '',
          phoneNumber: mobile,
        });
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.container}>
        <SafeAreaView />
        <LinearGradient colors={[colors.white, colors.PaleBlue]} style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={styles.container2}>
            <View style={styles.mainView}>
              <View style={styles.logoView}>
                <Image
                  source={zenzoLogo}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.title}>
                  {strings.myProfile.completeYourProfile}
                </Text>
                <Text style={styles.subTitle}>
                  {strings.myProfile.provideDetailsToaddToProfile}
                </Text>
              </View>

              <View style={styles.inputContainer}>
              <View style={styles.marginTop10}>
                  <Input
                    placeholder={strings.signUpScreen.yourFullName}
                    value={fullName}
                    fieldName="fullNameInput"
                    onChangeText={value => {
                      setFullName(value);
                    }}
                    error={validateFullName && validateFullName}
                    rightIcon={
                      <IconOcticons
                        name="person"
                        color={colors.gray700}
                        size={30}
                      />
                    }
                  />
                </View>
              </View>

              <View style={{ marginTop: heightScale(70) }}>
                <CustomButton
                  loading={
                    props.userRegistrationProfileLoading
                    || props.getProfileLoading
                    || props.globalConfigurationLoading
                    || props.getPicklistLoading
                  }
                  onPress={handleSubmit}
                  title={strings.loginScreen.signUp}
                  disabled={isSignupButtonDisabled}
                />
              </View>
              <BackArrow
                onPress={() => {
                  props.navigation.reset({
                    index: 0,
                    routes: [{name: 'SignupScreen'}],
                  });
                }}
              />
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

  mainView: {
    paddingTop: heightScale(50),
    marginHorizontal: widthScale(27),
    marginBottom: heightScale(30),
  },

  errorMsg: {
    marginTop: heightScale(3),
    color: colors.Red,
    marginLeft: widthScale(5),
    width: widthScale(250),
    fontSize: normalize(12),
  },

  marginTop10: {
    marginTop: heightScale(28),
  },

  inputPassword: {
    paddingLeft: widthScale(10),
    borderColor: colors.gray400,
    width: '100%',
  },

  title: {
    marginTop: heightScale(26),
    fontSize: normalize(24),
    fontFamily: fonts.calibri.bold,
    color: colors.DarkGray,
    fontWeight: 'bold',
  },
  subTitle: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(12),
    color: colors.DarkGray,
  },

  inputContainer: {
    marginTop: heightScale(2),
  },
  logo: {
    height: heightScale(107),
    width: heightScale(142),
  },

  inputStyles: {
    fontSize: normalize(15),
    lineHeight: normalize(15),
    borderRadius: normalize(10),
  },
  button: {
    backgroundColor: colors.primary,
    color: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: heightScale(15),
    paddingHorizontal: widthScale(50),
    marginTop: heightScale(40),
    borderRadius: moderateScale(100),
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    fontWeight: 'bold',
  },

  logoView: {alignSelf: 'center', marginBottom: heightScale(64)},
  textView: {},
  errorStyles: {
    borderColor: colors.Red,
    borderWidth: widthScale(1),
    borderRadius: normalize(10),
  },
});

const mapStateToProps = ({Auth, App}) => {
  const {userRegistrationProfileLoading,
    userRegistrationProfileSuccess,
    userRegistrationProfileFail,
    userRegistrationProfileFailCode,} = Auth;
  
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
    userRegistrationProfileLoading,
  userRegistrationProfileSuccess,
  userRegistrationProfileFail,
  userRegistrationProfileFailCode,
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
  registerUserProfile,
  resetAuthReducerWithoutLogout,
  validateUser,
  getProfile,
  globalConfig,
  getPickist,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupProfile);
