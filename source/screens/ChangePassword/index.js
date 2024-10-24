import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {Context} from '../../providers/localization.js';
import {colors, scaling, fonts} from '../../library';
import Input from '../../components/Input.js';
import {changePass, resetAuthReducer} from '../../redux/actions/auth.actions';
import {connect} from 'react-redux';
import base64 from 'react-native-base64';
import Header from '../../components/header';
import {validatePassword as passwordValidation} from '../../utils/validators';
import LinearGradient from 'react-native-linear-gradient';
import PasswordChangedSuccessful from '../ForgotPassword/ResetPassword/changedPasswordSuccesful';
import {clearAsyncStorage} from '../../utils/asyncStorage';
import Icon from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../components/CustomButton.js';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const ChangePassword = props => {
 
  const strings = React.useContext(Context).getStrings();
  const isFocused = useIsFocused();

  const [changePasswordFields, setChangePasswordFields] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    oldPasswordValidation: '',
    newPasswordValidation: '',
    confirmPasswordValidation: '',
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });
  const [showPasswordChangedPage, setShowPasswordChangedPage] = useState(false);

  useEffect(() => {
    setChangePasswordFields({
      ...changePasswordFields,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      oldPasswordValidation: '',
      newPasswordValidation: '',
      confirmPasswordValidation: '',
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    });
  }, [isFocused]);

  useEffect(() => {
    if (props.changePassFail) {
      const errMsg =
        props.changePassFail?.errors?.response?.data?.apierror?.code || '';
      if (errMsg) {
        if (errMsg === 'ZQTZA0003') {
          Toast.showWithGravity(strings.changePasswordScreen.fieldsEmpty, Toast.LONG, Toast.TOP);
        } else if (errMsg === 'ZQTZA0039') {
          Toast.showWithGravity(strings.changePasswordScreen.phoneNotRegistered, Toast.LONG, Toast.TOP);
        } else if (errMsg === 'ZQTZA0001') {
          Toast.showWithGravity(strings.changePasswordScreen.oldPassIncorrect, Toast.LONG, Toast.TOP);
        } else if (errMsg === 'ZQTZA0002') {
          Toast.showWithGravity(strings.changePasswordScreen.incorrectPasswordFormat, Toast.LONG, Toast.TOP);
        }
      }
    }
  }, [props.changePassFail]);

  useEffect(() => {
    if (props.changePassSuccess) {
      setChangePasswordFields({
        ...changePasswordFields,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        oldPasswordValidation: '',
        newPasswordValidation: '',
        confirmPasswordValidation: '',
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });
      setShowPasswordChangedPage(true);
      Toast.showWithGravity(strings.changePasswordScreen.success, Toast.LONG, Toast.TOP);
    }
  }, [props.changePassSuccess]);

  const validateOldPassword = () => {
    if (!changePasswordFields.oldPassword) {
      return strings.changePasswordScreen.pleaseEnterYourOldPassword;
    } else {
      return '';
    }
  };

  const validateNewPassword = () => {
    if (!changePasswordFields.newPassword) {
      return strings.signUpScreen.enterPass;
    } else if (!passwordValidation(changePasswordFields.newPassword)) {
      return strings.signUpScreen.enterValidPass;
    } else {
      return '';
    }
  };

  const validateConfirmPassword = () => {
    if (!changePasswordFields.confirmPassword) {
      return strings.signUpScreen.enterConfirmPass;
    } else if (
      changePasswordFields.newPassword !== changePasswordFields.confirmPassword
    ) {
      return strings.signUpScreen.confirmPassDiff;
    } else {
      return '';
    }
  };

  const validate = () => {
    let errCount = 0;
    const oldPasswordError = validateOldPassword();
    const newPasswordError = validateNewPassword();
    const confirmPasswordError = validateConfirmPassword();

    if (oldPasswordError || newPasswordError || confirmPasswordError) {
      errCount = 1;
    }

    setChangePasswordFields({
      ...changePasswordFields,
      oldPasswordValidation: oldPasswordError,
      newPasswordValidation: newPasswordError,
      confirmPasswordValidation: confirmPasswordError,
    });

    return errCount;
  };

  const handleSubmit = () => {
    const errCount = validate();
    if (errCount === 0) {
      props.changePass(
        {
          newPassword: base64.encode(changePasswordFields.confirmPassword),
          oldPassword: base64.encode(changePasswordFields.oldPassword),
        },
        props.userMobile,
      );
    }
  };

  const handleBackToLogin = () => {
    // setShowPasswordChangedPage(false);
    clearAsyncStorage(() => {
      props.resetAuthReducer();
    });
  };

  useEffect(() => {
    if (showPasswordChangedPage) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => backHandler.remove()
    }
  }, [showPasswordChangedPage])

  if (showPasswordChangedPage) {
    return <PasswordChangedSuccessful handleBackToLogin={handleBackToLogin} />;
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.container}>
        <View style={[styles.viewContainer, {paddingBottom: heightScale(20)}]}>
          <SafeAreaView />
          <Header
            screenName={strings.changePasswordScreen.changePassword}
            menu={true}
            leftIconPress={props.navigation.toggleDrawer}
          />
          <LinearGradient colors={[colors.white, colors.primary]}>
            <View style={{height: '100%'}}>
              <View style={styles.headerContainer}>
                <View
                  style={
                    Platform.OS === 'ios' ? styles.headerios : styles.header
                  }>
                  <View style={{marginTop: heightScale(20)}}>
                    <Text style={styles.passInstructionHeading}>
                      {strings.resetPass.createPass}
                    </Text>
                    <View style={{flexDirection: 'row', marginRight: widthScale(30)}}>
                      <Icon
                        name="square-sharp"
                        size={moderateScale(5)}
                        color={colors.steelgray}
                        style={styles.bulletPointIcon}
                      />
                      <Text style={styles.passInstructions}>
                        {strings.resetPass.passValidation}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', marginRight: widthScale(30)}}>
                      <Icon
                        name="square-sharp"
                        size={moderateScale(5)}
                        color={colors.steelgray}
                        style={styles.bulletPointIcon}
                      />
                      <Text style={styles.passInstructions}>
                        {strings.resetPass.passLetterValidation}
                        <Text style={styles.passInstructions}>
                          {strings.resetPass.passNumericValidation}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.inputCard}>
              <View style={{flexDirection: 'row', marginTop: heightScale(6)}}>
                  <Text style={styles.inputHeader}>
                    {strings.changePasswordScreen.oldPassword}
                  </Text>
                <Text style={styles.astrik}>*</Text>
              </View>

                <Input
                  isSecondaryButton={true}
                  inputBoxStyle={styles.inputTextStyle}
                  error={changePasswordFields.oldPasswordValidation}
                  secureTextEntry={!changePasswordFields.showOldPassword}
                  placeholder={
                    strings.changePasswordScreen.oldPasswordPlaceholder
                  }
                  value={changePasswordFields.oldPassword}
                  placeholderTextColor={colors.gray400}
                  onChangeText={value => {
                    setChangePasswordFields({
                      ...changePasswordFields,
                      oldPassword: value,
                    });
                  }}
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => {
                        setChangePasswordFields({
                         ...changePasswordFields,
                      showOldPassword: !changePasswordFields.showOldPassword,
                    })
                      }}>
                      {!changePasswordFields.showOldPassword ? (
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
                <View style={{flexDirection: 'row', marginTop: heightScale(12)}}>
                  <Text
                    style={styles.inputHeader}>
                      {strings.changePasswordScreen.newPassword}
                  </Text>
                  <Text style={styles.astrik}>*</Text>
                </View>

                <Input
                  isSecondaryButton={true}
                  inputBoxStyle={styles.inputTextStyle}
                  error={changePasswordFields.newPasswordValidation}
                  placeholder={
                    strings.changePasswordScreen.newPasswordPlaceholder
                  }
                  secureTextEntry={!changePasswordFields.showNewPassword}
                  placeholderTextColor={colors.gray400}
                  autoCapitalize="none"
                  value={changePasswordFields.newPassword}
                  onChangeText={value => {
                    setChangePasswordFields({
                      ...changePasswordFields,
                      newPassword: value,
                    });
                  }}
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => {
                        setChangePasswordFields({
                          ...changePasswordFields,
                          showNewPassword: !changePasswordFields.showNewPassword,
                        });
                      }}>
                      {!changePasswordFields.showNewPassword ? (
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

                <View style={{flexDirection: 'row', marginTop: heightScale(12)}}>
                  <Text
                  style={styles.inputHeader}>
                  {strings.changePasswordScreen.confirmPassword}
                </Text>
                <Text style={styles.astrik}>*</Text>
                </View>

                <Input
                  isSecondaryButton={true}
                  inputBoxStyle={styles.inputTextStyle}
                  error={changePasswordFields.confirmPasswordValidation}
                  placeholder={
                    strings.changePasswordScreen.confirmPasswordPlaceholder
                  }
                  secureTextEntry={!changePasswordFields.showConfirmPassword}
                  placeholderTextColor={colors.gray400}
                  autoCapitalize="none"
                  value={changePasswordFields.confirmPassword}
                  onChangeText={value => {
                    setChangePasswordFields({
                      ...changePasswordFields,
                      confirmPassword: value,
                    });
                  }}
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => {
                        setChangePasswordFields({
                          ...changePasswordFields,
                          showConfirmPassword:
                            !changePasswordFields.showConfirmPassword,
                      })
                      }}>
                      {!changePasswordFields.showConfirmPassword ? (
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
                <View style={styles.button}>
                <CustomButton 
                  title={strings.changePasswordScreen.changePassword}
                  onPress={handleSubmit}
                  loading={props.changePassLoading}
                />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  viewContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    paddingLeft: widthScale(25),
  },
  inputTextStyle: {
    color: colors.black,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
  },
  inputCard: {
    flexGrow: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: heightScale(16),
    paddingHorizontal: widthScale(25),
    justifyContent: 'space-between',
    paddingTop: heightScale(16),
  },
  contentTop: {
    marginTop: heightScale(15),
    marginHorizontal: widthScale(16),
    // alignSelf: "center",
  },
  row: {
    flexDirection: 'row',
  },
  astrik: {fontSize: normalize(12), color: colors.black},
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  inputPassword: {
    paddingLeft: widthScale(10),
    borderColor: colors.gray400,
    borderWidth: 1,
    width: '100%',
  },
  inputHeader: {
    color: colors.steelgray,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    fontWeight: 'bold',
    marginBottom: widthScale(0),
  },
  inputStyles: {
    fontSize: normalize(15),
    lineHeight: normalize(15),
  },
  input: {
    width: widthScale(288),
    paddingLeft: widthScale(10),
    borderRadius: moderateScale(5),
    borderColor: colors.lightGrey2,
    borderWidth: 1,
  },
  textAlert: {
    color: colors.red,
    fontSize: normalize(12),
    marginTop: heightScale(3),
    marginBottom: heightScale(16),
  },
  button: {
    marginTop: heightScale(20),
    marginBottom: Platform.OS === 'ios' ? heightScale(80) : heightScale(50),
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  eyeStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: widthScale(1),
    borderLeftWidth: widthScale(0),
    borderColor: colors.gray400,
    width: widthScale(40),
  },
  errorMsg: {
    marginTop: heightScale(3),
    color: colors.red,
    marginLeft: widthScale(3),
    width: widthScale(250),
    fontSize: normalize(12),
  },
  title: {
    fontWeight: 'normal',
    marginTop: heightScale(26),
    fontSize: normalize(28),
    fontFamily: fonts.calibri.bold,
    color: colors.black,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  passInstructionHeading: {
    color: colors.steelgray,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.bold,
    fontWeight: 'bold',
    marginBottom: heightScale(8),
  },
  passInstructions: {
    color: colors.steelgray,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    marginBottom: heightScale(8),
  },
  bulletPointIcon: {
    marginTop: heightScale(4),
    marginRight: widthScale(4),
  },
});

const mapStateToProps = ({Auth, App}) => {
  const {changePassLoading, changePassSuccess, changePassFail} = Auth;

  const {userMobile} = App;

  return {
    changePassLoading,
    changePassSuccess,
    changePassFail,

    userMobile,
  };
};

const mapDispatchToProps = {
  changePass,
  resetAuthReducer,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
