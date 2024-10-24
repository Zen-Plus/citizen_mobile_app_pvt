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
import {Context} from '../../../../providers/localization.js';
import {colors, scaling, fonts} from '../../../../library';
import {connect} from 'react-redux';
import {
  getProfile,
  editProfile,
  getPickist,
  updateFamilyMember,
  resetUpdateMemberData,
  getMembers,
  getMedicalCondition,
  updateMedicalCondition,
  getUserMedical,
} from '../../../../redux/actions/app.actions';
import LinearGradient from 'react-native-linear-gradient';
import {TextInput} from '../../../../components';
import {
  validateMobileNumber as mobileValidation,
  validateEmail as emailValidation,
  validateAge as ageValidation,
  validateNameWithoutSpecialCharacters,
  validateAllSameNumbers,
} from '../../../../utils/validators';
import {Dropdown} from 'react-native-element-dropdown';
import {MapComponent} from '../../../../components/MapComponent';
import SaveButton from './SaveButton.js';
import CustomDropdown from '../../../../components/CustomDropdown.js';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const AddMembers = props => {
  const {
    addingMember,
    navigation,
    genderData,
    relationData,
    bloodData,
    itemData,
    customerId,
    isMyProfile
  } = props.route.params;

  const strings = React.useContext(Context).getStrings();
  const {ProfileDetails, common, signUpScreen} = strings;
  const [nameError, setNameError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [relationError, setRelationError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [flatError, setFlatError] = useState('');
  const [medicalValue, setMedicalValue] = useState(null);

  const [showAddressSelectionMap, setShowAddressSelectionMap] = useState(false);

  const [state, setState] = useState({
    name: itemData?.firstName ? itemData?.firstName : '',
    mobile: itemData?.mobileNumber ? itemData?.mobileNumber : '',
    email: itemData?.email ? itemData?.email : '',
    secondaryMobile: itemData?.emergencyMobile ? itemData?.emergencyMobile : '',
    age: itemData?.age ? itemData?.age.toString() : '',
    address: itemData?.address?.addressLine1
      ? itemData?.address?.addressLine1
      : '',
    landmark: itemData?.address?.addressLine3
      ? itemData?.address?.addressLine3
      : '',
    flat: itemData?.address?.addressLine2
      ? itemData?.address?.addressLine2
      : '',
    gender: itemData?.gender ? itemData?.gender : '',
    bloodGroup: itemData?.bloodGroup ? itemData?.bloodGroup : '',
    relation: itemData?.relationWithUser?.name
      ? itemData?.relationWithUser?.name
      : '',
    relationWithUser: itemData?.relationWithUser
      ? itemData?.relationWithUser
      : '',
    medical: '',
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    props.getMedicalCondition();
  }, []);

  useEffect(() => {
    if (itemData?.id) {
      props.getUserMedical(customerId, itemData?.id);
    }
  }, []);

  useEffect(() => {
    if (props.getUserMedicalSuccess && itemData) {
      let medicalCondition = props.getUserMedicalSuccess?.data.map(values => {
        return values.primaryComplaint?.id;
      });
      setMedicalValue(medicalCondition);
    }
  }, [props.getUserMedicalSuccess]);

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

  const genderValidationFunc = () => {
    if (!state.gender) {
      setGenderError(signUpScreen.enterGender);
    } else {
      setGenderError('');
      return true;
    }
  };
  const relationValidationFunc = () => {
    if (!state?.relationWithUser?.name) {
      setRelationError(signUpScreen.enterRelation);
    } else {
      setRelationError('');
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
    let ageValidate = ageValidationFunc();
    let genderValidate = genderValidationFunc();
    let relationValidate = relationValidationFunc();
    let addressValidate = addressValidationFunc();
    let flatValidate = flatValidationFunc();

    if (
      fullNameValidated &&
      phoneNumberValidated &&
      ageValidate &&
      genderValidate &&
      addressValidate &&
      flatValidate &&
      relationValidate
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = () => {
    let allFieldsValidated = validateFields();
    if (allFieldsValidated) {
      if (itemData?.id) {
        const data = {
          customerId: customerId,
          memberId: itemData?.id,
          bloodGroup: state.bloodGroup.id,
          addressRequest: {
            addressLine1: state.address,
            flatNumber: state.flat,
            landmark: state.landmark,
          },
          age: state.age,
          firstName: state.name,
          gender: state.gender?.id,
          isActive: 'ACTIVE',
          phoneNumber: state.mobile,
          relation: state.relationWithUser?.id,
          isDeleted: false,
        };
        props.updateFamilyMember(data);
        props.updateMedicalCondition({
          customerId: customerId,
          bloodGroup: state.bloodGroup.id,
          medicalConditionIds: medicalValue,
          memberId: itemData?.id,
        });
      } else {
        addingMember({
          firstName: state.name,
          lastName: 'string',
          phoneNumber: state.mobile,
          age: state.age,
          gender: state.gender.id,
          relation: state.relation,
          relationWithUser: state.relationWithUser,
          bloodGroup: state.bloodGroup.id,
          addressRequest: {
            addressLine1: state.address,
            flatNumber: state.flat,
            landmark: state.landmark,
          },
        });
        navigation.pop();
      }
    }
  };

  useEffect(() => {
    if (props.updateFamilyMemberSuccess && props.updateMedicalCondionSuccess) {
      props.resetUpdateMemberData();
      navigation.pop();
    }
  }, [props.updateFamilyMemberSuccess, props.updateMedicalCondionSuccess]);

  const trimmedAddress = state.address ? state.address?.substring(0,30) + '...' : '';

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
                  !props.isMyProfile ? styles.headerView : styles.profileView
                }>
                <Text style={styles.title}>{ProfileDetails.familyDetails}</Text>
                <Text style={styles.updateDetails}>
                  {ProfileDetails.updateFamilyDetails}
                </Text>

                {!isMyProfile && (
                  <View style={styles.barView}>
                    <View
                      style={[
                        styles.circleView,
                        {backgroundColor: colors.primary},
                      ]}>
                      <Text style={[styles.numberText, {color: colors.white}]}>
                        1
                      </Text>
                    </View>
                    <View style={styles.completeBar} />
                    <View
                      style={[
                        styles.circleView,
                        {backgroundColor: colors.primary},
                      ]}>
                      <Text style={[styles.numberText, {color: colors.white}]}>
                        2
                      </Text>
                    </View>
                    <View style={[styles.completeBar]} />
                    <View style={[styles.circleView]}>
                      <Text style={[styles.numberText]}>3</Text>
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
                  placeholder={ProfileDetails.enter}
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
                  placeholder={ProfileDetails.enter}
                  placeholderTextColor={colors.lightGrey}
                  autoCapitalize="none"
                  maxLength={10}
                  value={state.mobile}
                  onChangeText={value => {
                    if(value.length>0 && !!Number(value) === false){
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

              <View style={{marginTop: heightScale(22), zIndex: 2}}>
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
                  placeholder={ProfileDetails.enter}
                  placeholderTextColor={colors.lightGrey}
                  autoCapitalize="none"
                  value={state.age}
                  onChangeText={value => {
                    if(value.length>0 && !!Number(value) === false){
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
                    {ProfileDetails.bloodGroup}
                  </Text>
                </View>

                <Dropdown
                  style={styles.input}
                  renderItem={item => {
                    return (
                      <View style={styles.inputDropdown}>
                        <Text style={styles.greyText}>{item.name}</Text>
                      </View>
                    );
                  }}
                  placeholderStyle={{
                    fontSize: normalize(14),
                    fontFamily: fonts.calibri.medium,
                    color: colors.lightGrey,
                  }}
                  selectedTextStyle={styles.blackText}
                  inputSearchStyle={styles.inputStyles}
                  data={bloodData}
                  maxHeight={heightScale(300)}
                  labelField="name"
                  valueField="id"
                  placeholder={common.select}
                  value={state.bloodGroup.id}
                  onChange={item => {
                    setState({...state, bloodGroup: item});
                  }}
                />
              </View>
              {/* Add medical component */}
              {itemData ? (
                <View
                  style={{
                    marginTop: heightScale(22),
                  }}>
                  <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                    <Text style={styles.greyTextBold}>
                      {ProfileDetails.medicalCondition}
                    </Text>
                  </View>
                  <CustomDropdown
                    multiSelect
                    data={props.getMedicalConditionSuccess?.data?.content}
                    value={medicalValue}
                    onChange={item => {
                      setMedicalValue(item);
                    }}
                  />
                </View>
              ) : null}
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
                    fontSize: normalize(14),
                    fontFamily: fonts.calibri.medium,
                    color: colors.lightGrey,
                  }}
                  selectedTextStyle={styles.blackText}
                  inputSearchStyle={styles.inputStyles}
                  data={genderData}
                  maxHeight={heightScale(300)}
                  labelField="name"
                  valueField="id"
                  placeholder={common.select}
                  value={state.gender.id}
                  onChange={item => {
                    setState({...state, gender: item});
                  }}
                />
                {genderError ? (
                  <Text style={styles.errorMsg}>{genderError}</Text>
                ) : null}
              </View>

              <View style={{marginTop: heightScale(22)}}>
                <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                  <Text style={styles.greyTextBold}>
                    {ProfileDetails.relation}
                  </Text>
                  <Text style={styles.astrik}>*</Text>
                </View>

                <Dropdown
                  style={[
                    styles.input,
                    relationError
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
                    fontSize: normalize(14),
                    fontFamily: fonts.calibri.medium,
                    color: colors.lightGrey,
                  }}
                  selectedTextStyle={styles.blackText}
                  inputSearchStyle={styles.inputStyles}
                  data={relationData}
                  maxHeight={heightScale(300)}
                  labelField="name"
                  valueField="id"
                  placeholder={common.select}
                  value={state.relationWithUser.id}
                  onChange={item => {
                    setState({
                      ...state,
                      relationWithUser: item,
                      relation: item?.id,
                    });
                  }}
                />
                {relationError ? (
                  <Text style={styles.errorMsg}>{relationError}</Text>
                ) : null}
              </View>
              <View style={{marginTop: heightScale(22)}}>
                <View style={styles.row1}>
                  <Text style={styles.greyTextBold}>
                    {ProfileDetails.address}
                  </Text>
                  <Text style={styles.astrik}>*</Text>
                </View>
                <TouchableOpacity
                  style={{marginTop: heightScale(8)}}
                  onPress={() => {
                    setShowAddressSelectionMap(true);
                  }}>
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
                    value={state?.address?.length < 30 ? state?.address : trimmedAddress}
                    inputStyles={[styles.inputStyles, {width: '90%'}]}
                    maxLength={100}
                    disabled={true}
                    mapIcon={'map-pin'}
                  isAddressPresent={state.address.length > 0}
                  />
                </TouchableOpacity>

                {addressError ? (
                  <Text style={styles.errorMsg}>{addressError}</Text>
                ) : null}
              </View>
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
            </View>
            
            <SaveButton  handleSubmit = {handleSubmit} navigation = {props.navigation}/>
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
  updateDetails: {
    fontSize: normalize(12),
    fontWeight: '400',
    color: colors.DarkGray,
    fontFamily: fonts.calibri.regular,
    marginTop: heightScale(4),
  },
  barView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: heightScale(15),
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
    textAlign: 'center',
  },
  completeBar: {
    width: widthScale(100),
    height: heightScale(1),
    backgroundColor: colors.primary,
  },
  inputView: {
    borderTopStartRadius: moderateScale(20),
    borderTopEndRadius: moderateScale(20),
    backgroundColor: colors.white,
    paddingTop: heightScale(42),
    paddingHorizontal: widthScale(25),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: heightScale(2)},
    shadowOpacity: normalize(2),
    shadowRadius: normalize(4),
    elevation: normalize(4),
    marginTop: heightScale(35),
  },
  astrik: {fontSize: normalize(12), color: colors.black},
  inputStyles: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.medium,
    color: colors.black,
    lineHeight: heightScale(14),
  },
  input: {
    paddingHorizontal: widthScale(10),
    borderColor: colors.gray400,
    borderWidth: widthScale(1),
    borderRadius: normalize(20),
    paddingVertical: heightScale(8),
    width: '100%',
  },
  buttonView: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: widthScale(30),
    paddingBottom: heightScale(21),
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
  icon: {alignSelf: 'center', marginLeft: widthScale(5)},
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
  inputDropdown: {
    paddingLeft: widthScale(10),
    borderColor: colors.gray400,
    paddingVertical: heightScale(8),
    width: '100%',
  },
  multiSelectInput: {
    paddingHorizontal: widthScale(10),
    borderColor: colors.gray400,
    borderWidth: widthScale(1),
    borderRadius: normalize(5),
    paddingVertical: heightScale(8),
    marginRight: widthScale(3),
    marginBottom: heightScale(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  multiSelectInputDropdown: {
    paddingHorizontal: widthScale(10),
    borderColor: colors.gray400,
    paddingVertical: heightScale(8),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerSubButtonContainerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLocationView: {
    padding: heightScale(25),
    backgroundColor: colors.white,
  },
  footerButtonContainer: {
    flexDirection: 'row',
  },
  footerSubButtonContainerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = ({App}) => {
  const {
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    editProfileLoading,
    editProfileSuccess,
    editProfileFail,
    updateFamilyMemberLoading,
    updateFamilyMemberSuccess,
    updateFamilyMemberFail,
    getMedicalConditionSuccess,
    getMedicalConditionFail,
    updateMedicalCondionSuccess,
    getUserMedicalSuccess,
  } = App;
  return {
    editProfileLoading,
    editProfileSuccess,
    editProfileFail,
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    updateFamilyMemberLoading,
    updateFamilyMemberSuccess,
    updateFamilyMemberFail,
    getMedicalConditionSuccess,
    getMedicalConditionFail,
    updateMedicalCondionSuccess,
    getUserMedicalSuccess,
  };
};

const mapDispatchToProps = {
  getProfile,
  editProfile,
  getPickist,
  updateFamilyMember,
  resetUpdateMemberData,
  getMembers,
  getMedicalCondition,
  updateMedicalCondition,
  getUserMedical,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMembers);
