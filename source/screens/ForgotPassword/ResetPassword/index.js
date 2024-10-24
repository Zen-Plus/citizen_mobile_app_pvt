import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Context} from '../../../providers/localization.js';
import {colors, scaling, fonts} from '../../../library';
import {
  resetPass,
  resetAuthReducerWithoutLogout,
} from '../../../redux/actions/auth.actions';
import base64 from 'react-native-base64';
import {connect} from 'react-redux';
import {validatePassword as passwordValidation} from '../../../utils/validators';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
import PasswordChangedSuccessful from './changedPasswordSuccesful.js';
import {zenzoLogo} from '../../../../assets/index.js';
import {BackArrow} from '../../../components/BackArrow.js';
import Input from '../../../components/Input.js';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../../components/CustomButton.js';

const {normalize, widthScale, heightScale} = scaling;

const ResetPassword = props => {
  const [enterPassword, setenterPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [validateConfirmPass, setValidateConfirmPass] = useState('');
  const [validateEnterPass, setValidateEnterPass] = useState('');
  const [confirmPressed, setConfirmPressed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [confirmShowPass, setConfirmShowPass] = useState(false);
  const [showPasswordChangedPage, setShowPasswordChangedPage] = useState(false);

  const {mobile, email} = props.route.params;

  const strings = React.useContext(Context).getStrings();
  const {changePasswordScreen} = strings;

  useEffect(() => {
    if (props.resetPassSuccess) {
      setShowPasswordChangedPage(true);
      Toast.showWithGravity(
        'Password has been reset. Please login with your new password',
        Toast.LONG,
        Toast.TOP,
      );
    }
  }, [props.resetPassSuccess]);

  useEffect(() => {
    if (props.resetPassFail && confirmPressed) {
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

  const passwordValidationFunc = () => {
    if (enterPassword == '') {
      setValidateEnterPass(strings.signUpScreen.enterPass);
    } else if (!passwordValidation(enterPassword)) {
      setValidateEnterPass(strings.signUpScreen.enterValidPass);
    } else {
      setValidateEnterPass('');
      return true;
    }
  };
  const confirmPassValidationFunc = () => {
    if (confirmPassword == '') {
      setValidateConfirmPass(strings.signUpScreen.enterConfirmPass);
    } else if (enterPassword != confirmPassword) {
      setValidateConfirmPass(strings.signUpScreen.confirmPassDiff);
    } else {
      setValidateConfirmPass('');
      return true;
    }
  };

  const validateFields = () => {
    let passValidated = passwordValidationFunc();
    let confirmPassValidated = confirmPassValidationFunc();
    if (passValidated && confirmPassValidated) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = () => {
    let allFieldsValidated = validateFields();
    if (allFieldsValidated) {
      setConfirmPressed(true);
      if (mobile) {
        props.resetPass({
          phoneNumber: mobile,
          newPassword: base64.encode(enterPassword),
        });
      } else {
        props.resetPass({
          email: email,
          newPassword: base64.encode(enterPassword),
        });
      }
    }
  };

  const handleBackToLogin = () => {
    props.resetAuthReducerWithoutLogout();
    props.navigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}],
    });
  };
  const handleBackToForget = () => {
    props.resetAuthReducerWithoutLogout();
    props.navigation.reset({
      index: 0,
      routes: [{name: 'ForgotPassword'}],
    });
  };

  if (showPasswordChangedPage) {
    return <PasswordChangedSuccessful handleBackToLogin={handleBackToLogin} />;
  }

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
                  {changePasswordScreen.changePassword}
                </Text>
                <Text style={styles.subTitle}>
                  {changePasswordScreen.pleaseEnterPassword}
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.marginTop10}>
                  <Input
                    placeholder={strings.resetPass.newPass}
                    value={enterPassword}
                    fieldName="passwordInput"
                    onChangeText={value => {
                      setenterPassword(value);
                    }}
                    error={validateEnterPass && validateEnterPass}
                    secureTextEntry={!showPass}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => {
                          setShowPass(preVal => !preVal);
                        }}>
                        {!showPass ? (
                          <IconMaterial
                            name="eye-off-outline"
                            color={colors.gray700}
                            size={30}
                          />
                        ) : (
                          <IconMaterial
                            name="eye-outline"
                            color={colors.gray700}
                            size={30}
                          />
                        )}
                      </TouchableOpacity>
                    }
                  />
                </View>

                <View style={styles.marginTop10}>
                  <Input
                    placeholder={strings.resetPass.confirmNewPass}
                    value={confirmPassword}
                    fieldName="passwordInput"
                    onChangeText={value => {
                      setconfirmPassword(value);
                    }}
                    error={validateConfirmPass && validateConfirmPass}
                    secureTextEntry={!confirmShowPass}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => {
                          setConfirmShowPass(preVal => !preVal);
                        }}>
                        {!confirmShowPass ? (
                          <IconMaterial
                            name="eye-off-outline"
                            color={colors.gray700}
                            size={30}
                          />
                        ) : (
                          <IconMaterial
                            name="eye-outline"
                            color={colors.gray700}
                            size={30}
                          />
                        )}
                      </TouchableOpacity>
                    }
                  />
                </View>
              </View>

              {props.resetPassLoading ? (
                <View style={styles.button}>
                  <ActivityIndicator color={colors.white} size="small" />
                </View>
              ) : (
                <View style={styles.button}>
                  <CustomButton
                    title={strings.resetPass.updatePassword}
                    onPress={() => {
                      handleSubmit();
                    }}
                    disabled={
                      enterPassword === '' || confirmPassword.length == ''
                    }
                  />
                </View>
              )}
              <BackArrow
                onPress={() => {
                  handleBackToForget();
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
    marginTop: heightScale(40),
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

const mapStateToProps = ({Auth}) => {
  const {resetPassLoading, resetPassSuccess, resetPassFail} = Auth;
  return {
    resetPassLoading,
    resetPassSuccess,
    resetPassFail,
  };
};

const mapDispatchToProps = {
  resetPass,
  resetAuthReducerWithoutLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
