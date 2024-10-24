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
  Image,
  Linking,
} from 'react-native';
import {Context} from '../../providers/localization.js';
import {
  registerUser,
  resetAuthReducerWithoutLogout,
} from '../../redux/actions/auth.actions';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {colors, scaling, fonts} from '../../library';
import {mobileAmbulance} from '../../../assets';
import {useIsFocused} from '@react-navigation/native';
import PhoneInput from '../../components/PhoneInput';
import CustomButton from '../../components/CustomButton';
import {
  validateMobileNumber as mobileValidation,
  validateAllSameNumbers,
} from '../../utils/validators';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const SignupScreen = props => {
  const strings = React.useContext(Context).getStrings();

  const isFocused = useIsFocused();

  const [validatePhoneNumber, setValidatePhoneNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSignupButtonDisabled, setSignupButtonDisabled] = useState(true);
  const [registerPressed, setRegisterPressed] = useState(false);

  useEffect(() => {
    if (props.userRegistrationSuccess && registerPressed) {
      setRegisterPressed(false);
      props.navigation.navigate('OTP', {
        flow: 'signUpScreen',
        mobile: phoneNumber,
      });
    }
  }, [props.userRegistrationSuccess]);

  useEffect(() => {
    if (phoneNumber === '') {
      setSignupButtonDisabled(true);
    } else {
      setSignupButtonDisabled(false);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (props.userRegistrationSuccess && registerPressed) {
      setRegisterPressed(false);
      props.navigation.navigate('OTP', {
        flow: 'signUpScreen',
        mobile: phoneNumber,
      });
    }
  }, [props.userRegistrationSuccess]);

  useEffect(() => {
    if (props.userRegistrationFail) {
      if (props.userRegistrationFailCode === 'ZQTZA0009') {
        setValidatePhoneNumber(strings.signUpScreen.phoneAlreadyExists);
      } else if (props.userRegistrationFailCode === 'ZQTZA0038') {
        setValidatePhoneNumber(strings.signUpScreen.emailAlreadyExists);
      }
    }
  }, [props.userRegistrationFail]);

  const phoneNumberValidationFunc = () => {
    if (phoneNumber == '') {
      setValidatePhoneNumber(strings.signUpScreen.enterPhoneNumber);
    } else if (phoneNumber.length < 10) {
      setValidatePhoneNumber(strings.signUpScreen.enterValidNumber);
    } else if (validateAllSameNumbers(phoneNumber)) {
      setValidatePhoneNumber(strings.signUpScreen.invalidNumber);
    } else if (!mobileValidation(phoneNumber)) {
      setValidatePhoneNumber(strings.signUpScreen.specialCharactersNotAllowed);
    } else {
      setValidatePhoneNumber('');
      return true;
    }
  };

  const validateFields = () => {
    let phoneNumberValidated = phoneNumberValidationFunc();
    if (phoneNumberValidated) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = () => {
    let allFieldsValidated = validateFields();
    if (allFieldsValidated) {
      props.registerUser({
        phoneNumber: phoneNumber,
      });
      setRegisterPressed(true);
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
            <View>
              <View style={{height: '100%', paddingHorizontal: widthScale(25)}}>
                <View style={styles.headerContainer}>
                  <View
                    style={
                      Platform.OS === 'ios' ? styles.headerios : styles.header
                    }>
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Image
                        source={mobileAmbulance}
                        style={styles.logo}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.inputCard}>
                  <View>
                    <View>
                      <View>
                        <PhoneInput
                          placeholder={strings.loginScreen.yourPhoneNumber}
                          value={phoneNumber}
                          fieldName="phoneInput"
                          onChangeText={value => {
                            setPhoneNumber(value);
                          }}
                          error={validatePhoneNumber}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={[styles.termAndConditionsContainer]}>
                    <Text
                      style={
                        styles.termAndConditionsText
                      }>{strings.signUpScreen.agreeToCreateAccount}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL('https://zenzo.in/terms-conditions/');
                      }}>
                      <Text
                        style={
                          styles.termAndConditionsTextBold
                        }>{strings.signUpScreen.TermsofService}</Text>
                    </TouchableOpacity>
                    <Text style={styles.termAndConditionsText}>and </Text>
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL('https://zenzo.in/privacy-policies/');
                      }}>
                      <Text
                        style={
                          styles.termAndConditionsTextBold
                        }>{strings.signUpScreen.PrivacyPolicy}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{marginTop: heightScale(30)}}>
                    <CustomButton
                      loading={props.userRegistrationLoading}
                      onPress={handleSubmit}
                      title={strings.otpScreen.continue}
                      disabled={isSignupButtonDisabled}
                    />
                  </View>
                  <View style={styles.footer}>
                    <Text style={styles.alreadyText}>
                      {strings.loginScreen.alreadyHaveAnAccount}{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate('LoginScreen');
                      }}>
                      <Text style={styles.contactText}>
                        {strings.loginScreen.signIn}
                      </Text>
                    </TouchableOpacity>
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
    marginTop: heightScale(-5),
  },
  inputCard: {
    marginTop: heightScale(0),
  },
  logo: {
    height: heightScale(300),
    width: heightScale(250),
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
    color: colors.primary,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.medium,
  },
  alreadyText: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.black,
  },
  termAndConditionsText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    color: colors.DimGray,
  },
  termAndConditionsTextBold: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    color: colors.primary,
    fontWeight: '600',
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
  termAndConditionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: heightScale(20),
  },
});

const mapStateToProps = ({Auth}) => {
  const {
    userRegistrationLoading,
    userRegistrationSuccess,
    userRegistrationFail,
    userRegistrationFailCode,
  } = Auth;

  return {
    userRegistrationLoading,
    userRegistrationSuccess,
    userRegistrationFail,
    userRegistrationFailCode,
  };
};

const mapDispatchToProps = {
  registerUser,
  resetAuthReducerWithoutLogout,
};
export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
