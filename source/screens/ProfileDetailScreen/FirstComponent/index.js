import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {Context} from '../../../providers/localization.js';
import Toast from 'react-native-simple-toast';
import {colors, scaling, fonts} from '../../../library';
import {connect} from 'react-redux';
import {
  getProfile,
  updateUserProfile,
} from '../../../redux/actions/app.actions';
import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {TextInput} from '../../../components';
import {
  validateMobileNumber as mobileValidation,
  validateEmail as emailValidation,
  validateAge as ageValidation,
  validateNameWithoutSpecialCharacters,
  validateAllSameNumbers,
} from '../../../utils/validators';
import {Dropdown} from 'react-native-element-dropdown';
import {MapComponent} from '../../../components/MapComponent';
import SaveButton from '../Component/AddMembers/SaveButton.js';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const FirstComponent = props => {
  const strings = React.useContext(Context).getStrings();
  const {ProfileDetails, common, signUpScreen} = strings;
  const isFocused = useIsFocused();
  const [nameError, setNameError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [emergencyMobileError, setEmergencyMobileError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [flatError, setFlatError] = useState('');

  const [showAddressSelectionMap, setShowAddressSelectionMap] = useState(false);

  const [state, setState] = useState({
    name: '',
    mobile: '',
    email: '',
    secondaryMobile: '',
    age: '',
    address: '',
    landmark: '',
    flat: '',
    userId: null,
    latitude: 0,
    longitude: 0,
  });
  const [value, setValue] = useState({});

  useEffect(() => {
    props.getProfile();
  }, [isFocused]);

  useEffect(() => {
    if (props.getProfileSuccess) {
      // TODO set latitude and longitude here
      setState({
        ...state,
        name: props.getProfileSuccess?.data?.firstName,
        mobile: props.getProfileSuccess?.data?.mobile,
        email: props.getProfileSuccess?.data?.email,
        userId: props.getProfileSuccess?.data?.id,
        secondaryMobile: props.getProfileSuccess?.data?.emergencyPhoneNumber,
        age: props.getProfileSuccess?.data?.age,
        address: props.getProfileSuccess?.data?.addressLine1,
        flat: props.getProfileSuccess?.data?.addressLine2,
        landmark: props.getProfileSuccess?.data?.landMark,
      });
    }
  }, []);

  useEffect(() => {
    if (props.getPicklistSuccess) {
      const genderObj = props.getPicklistSuccess?.data?.Gender.find(item => {
        return item?.id === props.getProfileSuccess?.data?.gender;
      });
      setValue(genderObj);
    }
  }, [props.getPicklistSuccess, props.getProfileSuccess]);

  useEffect(() => {
    if (props.updateUserProfileSuccess) {
      Toast.showWithGravity(strings.menuItems.profileSaved, Toast.LONG, Toast.TOP);
      if (props.isMyProfile) {
        props.navigation.goBack();
      } else {
        props.navigation.navigate('Second');
      }
    }
  }, [props.updateUserProfileSuccess, props.updateUserProfileFail]);

  const fullNameValidationFunc = () => {
    if (state.name == '') {
      setNameError(signUpScreen.enterName);
    } else if (state.name.length > 32 || state.name.length < 2) {
      setNameError(signUpScreen.fullNameMaxLength);
    } else if (!validateNameWithoutSpecialCharacters(state.name)) {
      setNameError(signUpScreen.wrongNameFormat);
    } else {
      setNameError('');
      return true;
    }
  };

  const phoneNumberValidationFunc = () => {
    if (state.mobile == '') {
      setMobileError(signUpScreen.enterPhoneNumber);
    } else if (state.mobile.length < 10) {
      setMobileError(signUpScreen.enterValidNumber);
    } else if (validateAllSameNumbers(state.mobile)) {
      setMobileError(signUpScreen.invalidNumber);
    } else if (!mobileValidation(state.mobile)) {
      setMobileError(signUpScreen.specialCharactersNotAllowed);
    } else {
      setMobileError('');
      return true;
    }
  };

  const emailValidationFunc = () => {
    if (state.email && !emailValidation(state.email)) {
      setEmailError(signUpScreen.validEmail);
    } else {
      setEmailError('');
      return true;
    }
  };

  const ageValidationFunc = () => {
    if (state.age == '') {
      setAgeError(signUpScreen.enterAge);
    } else if (!ageValidation(state.age)) {
      setAgeError(signUpScreen.validAge);
    } else {
      setAgeError('');
      return true;
    }
  };

  const emergencyPhoneNumberValidationFunc = () => {
    if (!state.secondaryMobile) {
      return true;
    } else if (state.secondaryMobile?.length < 10) {
      setEmergencyMobileError(signUpScreen.enterValidNumber);
    } else if (validateAllSameNumbers(state.secondaryMobile)) {
      setEmergencyMobileError(signUpScreen.invalidNumber);
    } else if (!mobileValidation(state.secondaryMobile)) {
      setEmergencyMobileError(signUpScreen.specialCharactersNotAllowed);
    } else {
      setEmergencyMobileError('');
      return true;
    }
  };

  const genderValidationFunc = () => {
    if (!value || !value.id) {
      setGenderError(signUpScreen.enterGender);
    } else {
      setGenderError('');
      return true;
    }
  };

  const addressValidationFunc = () => {
    if (!state.address) {
      setAddressError(signUpScreen.validAddress);
    } else {
      setAddressError('');
      return true;
    }
  };

  const flatValidationFunc = () => {
    if (!state.flat) {
      setFlatError(signUpScreen.validFlat);
    } else {
      setFlatError('');
      return true;
    }
  };

  const validateFields = () => {
    let phoneNumberValidated = phoneNumberValidationFunc();
    let fullNameValidated = fullNameValidationFunc();
    let emergencyPhoneNumberValidated = emergencyPhoneNumberValidationFunc();
    let emailValidated = emailValidationFunc();
    let ageValidate = ageValidationFunc();
    let genderValidate = genderValidationFunc();
    let addressValidate = addressValidationFunc();
    let flatValidate = flatValidationFunc();

    if (
      fullNameValidated &&
      phoneNumberValidated &&
      emergencyPhoneNumberValidated &&
      emailValidated &&
      ageValidate &&
      genderValidate &&
      addressValidate &&
      flatValidate
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = () => {
    let allFieldsValidated = validateFields();
    if (allFieldsValidated) {
      props.updateUserProfile({
        userId: state.userId,
        name: state.name,
        email: state.email,
        mobile: state.mobile,
        emergencyPhoneNumber: state.secondaryMobile,
        age: state.age,
        gender: value?.id,
        addressLine1: state.address,
        flatNumber: state.flat,
        landMark: state.landmark,
      });
    }
  };

  const trimmedAddress = state?.address ? state?.address?.slice(0, 30) + '...' : '';

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[colors.white, colors.LightBlue]}>
          <View style={styles.mainView}>
            {showAddressSelectionMap && (
              <MapComponent
                defaultLocation={state}
                onSelectedAddress={selectedLocation => {
                  setShowAddressSelectionMap(false);
                  //address
                  setState({
                    ...state,
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    address: selectedLocation.address,
                  });
                }}
              />
            )}

            {
              <View
                style={
                  props.isMyProfile ? styles.headerView : styles.profileView
                }>
                <Text style={styles.title}>
                  {ProfileDetails.personalDetails}
                </Text>
                <Text style={styles.updateDetails}>
                  {ProfileDetails.updateDetails}
                </Text>

                {!props.isMyProfile && (
                  <View style={styles.barView}>
                    <View style={styles.circleView}>
                      <Text style={styles.numberText}>1</Text>
                    </View>
                    <View style={styles.completeBar} />
                    <View
                      style={[styles.circleView, styles.disabledCircleView]}>
                      <Text
                        style={[styles.numberText, {color: colors.gray600}]}>
                        2
                      </Text>
                    </View>
                    <View style={[styles.completeBar]} />
                    <View
                      style={[styles.circleView, , styles.disabledCircleView]}>
                      <Text
                        style={[styles.numberText, {color: colors.gray600}]}>
                        3
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            }
            <View style={styles.inputView}>

              <View>
                <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                  <Text style={styles.greyTextBold}>
                    {ProfileDetails.fullName}
                  </Text>
                  <Text style={styles.astrik}>*</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    nameError
                      ? {borderColor: colors.red}
                      : {borderColor: colors.gray400},
                  ]}
                  underlineColorAndroid="transparent"
                  placeholder={ProfileDetails.enterfullName}
                  placeholderTextColor={colors.lightGrey}
                  autoCapitalize="none"
                  value={state.name}
                  onChangeText={value => {
                    setState({...state, name: value});
                  }}
                  inputStyles={styles.inputStyles}
                  maxLength={32}
                />
                {nameError ? (
                  <Text style={styles.errorMsg}>{nameError}</Text>
                ) : null}
              </View>
              <View style={{marginTop: heightScale(22)}}>
                <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                  <Text style={styles.greyTextBold}>
                    {ProfileDetails.phoneNumber}
                  </Text>
                  <Text style={styles.astrik}>*</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    mobileError
                      ? {borderColor: colors.red}
                      : {borderColor: colors.gray400},
                  ]}
                  keyboardType="numeric"
                  underlineColorAndroid="transparent"
                  placeholder={ProfileDetails.enterPhoneNumber}
                  placeholderTextColor={colors.lightGrey}
                  autoCapitalize="none"
                  maxLength={10}
                  value={state.mobile}
                  onChangeText={value => {
                    if(value.length > 0 && !!Number(value) == false){
                      return;
                    }
                    setState({...state, mobile: value});
                  }}
                  inputStyles={styles.inputStyles}
                />
                {mobileError ? (
                  <Text style={styles.errorMsg}>{mobileError}</Text>
                ) : null}
              </View>
              <View style={{marginTop: heightScale(22)}}>
                <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                  <Text style={styles.greyTextBold}>
                    {ProfileDetails.emergencyPhoneNumber}
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    emergencyMobileError
                      ? {borderColor: colors.red}
                      : {borderColor: colors.gray400},
                  ]}
                  keyboardType="numeric"
                  underlineColorAndroid="transparent"
                  placeholder={ProfileDetails.enterPhoneNumber}
                  placeholderTextColor={colors.lightGrey}
                  autoCapitalize="none"
                  maxLength={10}
                  value={state.secondaryMobile ? state.secondaryMobile.toString() : ''}
                  onChangeText={value => {
                    if(value.length > 0 && !!Number(value) == false){
                      return;
                    }
                    setState({...state, secondaryMobile: value});
                  }}
                  inputStyles={styles.inputStyles}
                />
                {emergencyMobileError ? (
                  <Text style={styles.errorMsg}>{emergencyMobileError}</Text>
                ) : null}
              </View>
              <View style={{marginTop: heightScale(22)}}>
                <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                  <Text style={styles.greyTextBold}>
                    {ProfileDetails.age + ProfileDetails.inYrs}
                  </Text>
                  <Text style={styles.astrik}>*</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    ageError
                      ? {borderColor: colors.red}
                      : {borderColor: colors.gray400},
                  ]}
                  keyboardType="numeric"
                  underlineColorAndroid="transparent"
                  placeholder={ProfileDetails.enterAge}
                  placeholderTextColor={colors.lightGrey}
                  autoCapitalize="none"
                  value={state.age ? state.age.toString() : ''}
                  onChangeText={value => {
                    if(value.length > 0 && !!Number(value) === false){
                      return;
                    }
                    setState({...state, age: value});
                  }}
                  maxLength={3}
                  inputStyles={styles.inputStyles}
                />
                {ageError ? (
                  <Text style={styles.errorMsg}>{ageError}</Text>
                ) : null}
              </View>
              <View style={{marginTop: heightScale(22)}}>
                <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                  <Text style={styles.greyTextBold}>
                    {ProfileDetails.gender}
                  </Text>
                  <Text style={styles.astrik}>*</Text>
                </View>

                <Dropdown
                  style={[
                    styles.input,
                    genderError
                      ? {borderColor: colors.red}
                      : {borderColor: colors.gray400},
                  ]}
                  renderItem={item => {
                    return (
                      <View style={styles.inputDropdown}>
                        <Text style={styles.greyText}>{item.name}</Text>
                      </View>
                    );
                  }}
                  placeholderStyle={{
                    color: colors.lightGrey,
                    fontSize: normalize(14),
                  }}
                  selectedTextStyle={styles.blackText}
                  inputSearchStyle={styles.inputStyles}
                  containerStyle={{borderRadius: normalize(20)}}
                  data={props.getPicklistSuccess?.data?.Gender}
                  maxHeight={heightScale(300)}
                  labelField="name"
                  valueField="id"
                  placeholder={common.select}
                  value={value?.id}
                  onChange={item => {
                    setValue(item);
                  }}
                />

                {genderError ? (
                  <Text style={styles.errorMsg}>{genderError}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={{marginTop: heightScale(22)}}
                onPress={() => {
                  setShowAddressSelectionMap(true);
                }}>
                <View
                  style={[
                    styles.row1,
                    {
                      marginBottom: heightScale(8),
                      justifyContent: 'space-between',
                    },
                  ]}>
                  <View style={styles.row1}>
                    <Text style={styles.greyTextBold}>
                      {ProfileDetails.address}
                    </Text>
                    <Text style={styles.astrik}>*</Text>
                  </View>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    addressError
                      ? {borderColor: colors.red}
                      : {borderColor: colors.gray400},
                  ]}
                  underlineColorAndroid="transparent"
                  placeholder={common.select}
                  placeholderTextColor={colors.lightGrey}
                  autoCapitalize="none"
                  value={
                    state?.address?.length < 30 ? state?.address : trimmedAddress
                  }
                  inputStyles={[styles.inputStyles, {width: '90%'}]}
                  maxLength={100}
                  disabled={true}
                  mapIcon={'map-pin'}
                  isAddressPresent={state?.address?.length > 0}
                />
                {addressError ? (
                  <Text style={styles.errorMsg}>{addressError}</Text>
                ) : null}
              </TouchableOpacity>

              <View style={{marginTop: heightScale(22)}}>
                <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                  <Text style={styles.greyTextBold}>
                    {ProfileDetails.landmark}
                  </Text>
                </View>
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder={ProfileDetails.enter}
                  placeholderTextColor={colors.lightGrey}
                  autoCapitalize="none"
                  value={state.landmark}
                  onChangeText={value => {
                    setState({...state, landmark: value});
                  }}
                  inputStyles={styles.inputStyles}
                  maxLength={70}
                />
              </View>
              <View style={{marginTop: heightScale(22)}}>
                <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                  <Text style={styles.greyTextBold}>{ProfileDetails.flat}</Text>
                  <Text style={styles.astrik}>*</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    flatError
                      ? {borderColor: colors.red}
                      : {borderColor: colors.gray400},
                  ]}
                  underlineColorAndroid="transparent"
                  placeholder={ProfileDetails.enter}
                  placeholderTextColor={colors.lightGrey}
                  autoCapitalize="none"
                  value={state.flat}
                  onChangeText={value => {
                    setState({...state, flat: value});
                  }}
                  inputStyles={styles.inputStyles}
                  maxLength={70}
                />
                {flatError ? (
                  <Text style={styles.errorMsg}>{flatError}</Text>
                ) : null}
              </View>

              {!props.isMyProfile && (
                <View style={styles.buttonView}>
                  <TouchableOpacity
                    onPress={() => {
                      if (props.isProfileUpdated) {
                        props.navigation.navigate('SecondComponent');
                      } else {
                        props.navigation.navigate('Second');
                      }
                    }}>
                    <View
                      style={[styles.button, {marginRight: widthScale(10)}]}>
                      <Text
                        style={[styles.buttonText, {color: colors.primary}]}>
                        {ProfileDetails.skip}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleSubmit();
                    }}>
                    <View
                      style={[
                        styles.button,
                        {backgroundColor: colors.primary, borderWidth: 0, paddingVertical: heightScale(12)},
                      ]}>
                      <Text style={styles.buttonText}>
                        {ProfileDetails.proceed}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {props.isMyProfile && (
              <SaveButton
                handleSubmit={handleSubmit}
                navigation={props.navigation}
              />
            )}
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainView: {},
  headerView: {paddingTop: heightScale(45), paddingHorizontal: widthScale(25)},
  profileView: {paddingTop: heightScale(20), paddingHorizontal: widthScale(25)},
  title: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(24),
    color: colors.black,
    fontWeight: '700',
  },
  row1: {
    flexDirection: 'row',
  },
  blackTextBold: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(18),
    color: colors.black,
    fontWeight: '700',
  },
  blackText: {
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(14),
    color: colors.black,
  },
  greyText: {
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(12),
    color: colors.secondaryGray,
  },
  greyTextBold: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(12),
    color: colors.steelgray,
    fontWeight: '700',
  },
  barView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: heightScale(25),
  },
  circleView: {
    borderWidth: 2,
    height: normalize(24),
    width: normalize(24),
    borderRadius: normalize(48),
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledCircleView: {
    borderColor: colors.gray600,
    borderWidth: 1,
  },
  numberText: {
    fontSize: normalize(12),
    color: colors.primary,
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
  },
  completeBar: {
    width: widthScale(100),
    height: heightScale(1),
    backgroundColor: colors.gray600,
  },
  inputView: {
    borderTopStartRadius: moderateScale(20),
    borderTopEndRadius: moderateScale(20),
    backgroundColor: colors.white,
    paddingTop: heightScale(42),
    paddingHorizontal: widthScale(25),
    paddingBottom: heightScale(20),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: heightScale(2)},
    shadowOpacity: normalize(2),
    shadowRadius: normalize(4),
    elevation: normalize(4),
    marginTop: heightScale(30),
  },
  astrik: {fontSize: normalize(12), color: colors.black},
  inputStyles: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    lineHeight: heightScale(16),
  },
  input: {
    paddingHorizontal: widthScale(10),
    borderColor: colors.gray400,
    borderWidth: widthScale(1),
    borderRadius: normalize(20),
    paddingVertical: heightScale(8),
    width: '100%',
  },
  inputDropdown: {
    paddingLeft: widthScale(10),
    borderColor: colors.gray400,
    paddingVertical: heightScale(8),
    width: '100%',
  },
  buttonView: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: widthScale(30),
    marginTop: heightScale(30),
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(100),
    paddingVertical: heightScale(10),
    paddingHorizontal: widthScale(45),
    borderColor: colors.primary,
    borderWidth: moderateScale(2),
  },

  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    fontWeight: '700',
  },
  errorMsg: {
    marginTop: heightScale(3),
    color: colors.red,
    marginLeft: widthScale(5),
    width: widthScale(250),
    fontSize: normalize(12),
  },
  icon: {
    alignSelf: 'center',
    marginRight: widthScale(5),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    marginTop: heightScale(10),
  },
  mapText: {
    color: colors.black,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fakeMarkerView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: heightScale(20),
  },
  mapCenterStyle: {
    position: 'absolute',
    bottom: heightScale(115),
    right: widthScale(10),
    width: moderateScale(34),
    height: moderateScale(34),
    backgroundColor: colors.white,
    borderRadius: moderateScale(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLocationView: {
    paddingHorizontal: widthScale(10),
    position: 'absolute',
    bottom: 0,
    height: heightScale(100),
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  textStyleLocation: {
    color: colors.black,
    textAlign: 'center',
    fontSize: normalize(18),
    fontFamily: fonts.calibri.medium,
  },
  textStyle: {
    color: colors.black,
  },
  updateDetails: {
    fontSize: normalize(12),
    fontWeight: '400',
    color: colors.DarkGray,
    fontFamily: fonts.calibri.regular,
    marginTop: heightScale(4),
  },
  mapConfirmButton: {
    alignSelf: 'center',
    backgroundColor: colors.grassGreen,
    color: colors.white,
    width: widthScale(280),
    height: heightScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightScale(20),
    marginBottom: heightScale(10),
    borderRadius: moderateScale(15),
  },
  centerClear: {
    marginTop: Platform.OS === 'ios' ? heightScale(40) : heightScale(20),
  },
  clearCross: {
    height: moderateScale(31),
    width: moderateScale(29),
    borderWidth: moderateScale(1),
    borderLeftWidth: 0,
    borderTopRightRadius: moderateScale(4),
    borderBottomRightRadius: moderateScale(4),
    justifyContent: 'center',
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
  },
});

const mapStateToProps = ({App}) => {
  const {
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    updateUserProfileLoading,
    updateUserProfileSuccess,
    updateUserProfileFail,
    isProfileUpdated,
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
  } = App;
  return {
    updateUserProfileLoading,
    updateUserProfileSuccess,
    updateUserProfileFail,
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    isProfileUpdated,
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
  };
};

const mapDispatchToProps = {
  getProfile,
  updateUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(FirstComponent);
