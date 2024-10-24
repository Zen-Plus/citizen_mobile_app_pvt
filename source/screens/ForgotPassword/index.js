import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Context} from '../../providers/localization.js';
import {colors, scaling, fonts} from '../../library';
import {connect} from 'react-redux';
import {regenerateOtp, resetResendOtp} from '../../redux/actions/auth.actions';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
import {mobileAmbulance} from '../../../assets/index.js';
import {BackArrow} from '../../components/BackArrow.js';
import PhoneInput from '../../components/PhoneInput';
import CustomButton from '../../components/CustomButton';
import Input from '../../components/Input.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigations} from '../../constants';

const {normalize, widthScale, heightScale} = scaling;

const ForgotPassword = props => {
  const strings = React.useContext(Context).getStrings();
  const {forgotPasswordScreen} = strings;
  const [inputOption, setInputOption] = useState(true);
  const [input, setInput] = useState('');
  const [validatePhoneAndEmail, setValidatePhoneAndEmail] = useState('');
  const [confirmPressed, setConfirmPressed] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (props.resendOtpFail && confirmPressed) {
      const errMsg =
        props.resendOtpFail?.errors?.response?.data?.apierror?.code || '';
      if (errMsg) {
        if (errMsg === 'ZQTZA0039') {
          inputOption
            ? Toast.showWithGravity(strings.otpScreen.phoneNotRegistered, Toast.LONG, Toast.TOP)
            : Toast.showWithGravity(strings.otpScreen.emailNotRegistered, Toast.LONG, Toast.TOP);
        } else if (errMsg === 'ZQTZA0004') {
          Toast.showWithGravity(strings.otpScreen.userNotFound, Toast.LONG, Toast.TOP);
        }
      }
    }
  }, [props.resendOtpFail]);

  useEffect(() => {
    if (props.resendOtpSuccess && isFocused) {
      props.resetResendOtp();
      if (isValidPhone()) {
        props.navigation.navigate('OTP', {
          mobile: input,
          flow: 'forgotPass',
        });
        return;
      }
      if (isValidEmail()) {
        props.navigation.navigate('OTP', {
          email: input,
          flow: 'forgotPass',
        });
        return;
      }
    }
  }, [props.resendOtpSuccess]);

  function isValidEmail() {
    return /\S+@\S+\.\S+/.test(input);
  }

  function isValidPhone() {
    return /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(input);
  }

  const validateFields = () => {
    if (isValidEmail() || isValidPhone()) {
      setValidatePhoneAndEmail('');
      return true;
    } else {
      setValidatePhoneAndEmail(
        inputOption
          ? forgotPasswordScreen.invalidNumber
          : forgotPasswordScreen.invalidEmail,
      );
      return false;
    }
  };

  const handleSubmit = () => {
    let allFieldsValidated = validateFields();
    if (allFieldsValidated) {
      setConfirmPressed(true);
      if (isValidPhone()) {
        console.log(input, 'isPhone');
        props.regenerateOtp({
          phoneNumber: input,
          isForgotPassword: true,
        });
        return;
      }
      if (isValidEmail()) {
        console.log(input, 'isEmail');
        props.regenerateOtp({
          email: input,
          isForgotPassword: true,
        });
        return;
      }
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
              <View style={{alignSelf: 'center'}}>
                <Image
                  source={mobileAmbulance}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              {inputOption ? (
                <PhoneInput
                  underlineColorAndroid="transparent"
                  placeholder={forgotPasswordScreen.yourPhoneNumber}
                  placeholderTextColor={colors.gray400}
                  autoCapitalize="none"
                  value={input}
                  onChangeText={value => {
                    setInput(value);
                    setValidatePhoneAndEmail('');
                  }}
                  error={validatePhoneAndEmail ? validatePhoneAndEmail : null}
                />
              ) : (
                <Input
                  autoCapitalize="none"
                  placeholder={forgotPasswordScreen.yourEmail}
                  value={input}
                  onChangeText={value => {
                    setInput(value);
                    setValidatePhoneAndEmail('');
                  }}
                  error={validatePhoneAndEmail ? validatePhoneAndEmail : null}
                  rightIcon={
                    <MaterialCommunityIcons
                      name="email-outline"
                      color={colors.gray700}
                      size={24}
                    />
                  }
                />
              )}

              <View style={styles.forgotPassword}>
                <Text style={styles.title}>
                  {strings.forgotPasswordScreen.forgotPassword}
                </Text>
                <View style={{marginTop: heightScale(10)}}>
                  <TouchableOpacity
                    onPress={() => {
                      setInputOption(!inputOption);
                      setValidatePhoneAndEmail('');
                      setInput('');
                    }}>
                    <Text style={[styles.useEmailPhoneText, {color: colors.primary}]}>
                      {inputOption
                        ? forgotPasswordScreen.useEmail
                        : forgotPasswordScreen.usePhone}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.button}>
                <CustomButton
                  onPress={() => {
                    handleSubmit();
                  }}
                  title={strings.forgotPasswordScreen.getOTP}
                  disabled={input === ''}
                />
              </View>
              <BackArrow
                onPress={() => {
                  props.navigation.reset({
                    index: 0,
                    routes: [{name: navigations.LoginScreen}],
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
  mainView: {
    marginHorizontal: widthScale(27),
    marginBottom: heightScale(30),
  },
  container2: {
    flexGrow: 1,
  },
  useEmailPhoneText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    color: colors.primary,
    fontWeight: '600',
  },
  headerContainer: {
    marginLeft: widthScale(25),
  },
  text: {
    color: colors.DarkGray,
    fontSize: normalize(24),
    textAlign: 'center',
  },
  logo: {
    height: heightScale(300),
    width: widthScale(250),
  },
  button: {
    marginTop: heightScale(40),
  },

  title: {
    fontWeight: '400',
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    color: colors.DimGray,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  forgotPassword: {
    marginTop: heightScale(30),
  },
  errorMsg: {
    marginTop: heightScale(3),
    color: colors.Red,
    marginLeft: widthScale(5),
    width: widthScale(250),
    fontSize: normalize(12),
  },
});

const mapStateToProps = ({Auth}) => {
  const {resendOtpLoading, resendOtpSuccess, resendOtpFail} = Auth;

  return {
    resendOtpLoading,
    resendOtpSuccess,
    resendOtpFail,
  };
};

const mapDispatchToProps = {
  regenerateOtp,
  resetResendOtp,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
