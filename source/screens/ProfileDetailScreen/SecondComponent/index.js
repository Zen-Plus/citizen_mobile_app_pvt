import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Context} from '../../../providers/localization.js';
import Toast from 'react-native-simple-toast';
import {colors, scaling, fonts} from '../../../library';
import {connect} from 'react-redux';
import Config from 'react-native-config';
import {
  getMedicalCondition,
  updateMedicalCondition,
  getProfile,
  profileUpdate,
  getUserMedical,
} from '../../../redux/actions/app.actions';
import Loader from '../../../components/loader';
import LinearGradient from 'react-native-linear-gradient';
import {Dropdown} from 'react-native-element-dropdown';
import CustomDropdown from '../../../components/CustomDropdown.js';
import SaveButton from '../Component/AddMembers/SaveButton.js';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const SecondComponent = props => {
  const {isMyProfile} = props.route.params ? props.route.params : false;
  const strings = React.useContext(Context).getStrings();
  const {ProfileDetails, common, signUpScreen, TripDetails} = strings;
  const [customerId, setCustomerId] = useState();
  const [bloodValue, setBloodValue] = useState(null);
  const [medicalValue, setMedicalValue] = useState(null);
  const [bloodGroupError, setBloodGroupError] = useState('');
  const [medicalError, setMedicalError] = useState('');
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    props.getProfile();
    props.getMedicalCondition({
      subCategoryIds: Config.SUB_CATEGORY_IDS_GROUND_AMBULANCE,
      isPicklist: true,
    });
  }, []);

  useEffect(() => {
    if (props.getProfileSuccess) {
      setLoader(false);
      setCustomerId(props.getProfileSuccess?.data?.id);
      props.getUserMedical(props.getProfileSuccess?.data?.id);
    }
    const bloodObj = props.getPicklistSuccess?.data?.BloodGroup.find(item => {
      return item?.id === props.getProfileSuccess?.data?.bloodGroup;
    });
    setBloodValue(bloodObj);
  }, [props.getProfileSuccess]);

  useEffect(() => {
    if (props.getUserMedicalSuccess) {
      let medicalCondition = props.getUserMedicalSuccess?.data.map(values => {
        return values.primaryComplaint?.id;
      });
      setMedicalValue(medicalCondition);
    }
  }, [props.getUserMedicalSuccess]);

  useEffect(() => {
    if (props.updateMedicalCondionSuccess) {
      Toast.showWithGravity(strings.menuItems.medicalSaved, Toast.LONG, Toast.TOP);
      if (isMyProfile) {
        props.navigation.goBack();
      } else {
        props.navigation.navigate('Third', {
          navigation: props.navigation,
        });
      }
    }
  }, [props.updateMedicalCondionSuccess, props.updateMedicalCondionFail]);

  const bloodGroupValidationFunc = () => {
    if (!bloodValue?.id) {
      setBloodGroupError(signUpScreen.enterBloodGroup);
    } else {
      setBloodGroupError('');
      return true;
    }
  };

  const medicalValidationFunc = () => {
    if (!medicalValue.length) {
      setMedicalError(signUpScreen.enterMedicalCondition);
    } else {
      setMedicalError('');
      return true;
    }
  };
  const validateFields = () => {
    let genderValidate = bloodGroupValidationFunc();
    let medicalValidate = medicalValidationFunc();

    if (genderValidate && 
      medicalValidate) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = () => {
    let allFieldsValidated = validateFields();
    if (allFieldsValidated) {
      props.updateMedicalCondition({
        customerId: customerId,
        bloodGroup: bloodValue?.id,
        medicalConditionIds: medicalValue,
      });
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView />
      {props.getMedicalConditionLoading ||
        props.getUserMedicalLoading ||
        props.getPicklistLoading ||
        props.updateMedicalCondionLoading ||
        props.getProfileLoading ||
        loader ? (
            <Loader />
        ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient colors={[colors.white, colors.LightBlue]}>
            <View style={styles.mainView}>
              {
                <View
                  style={
                    !props.isMyProfile ? styles.headerView : styles.profileView
                  }>
                  <Text style={styles.title}>
                    {ProfileDetails.medicalDetails}
                  </Text>
                  <Text style={styles.updateDetails}>
                    {ProfileDetails.updateDetails}
                  </Text>

                  {!isMyProfile && (
                    <View style={styles.barView}>
                      <View
                        style={[
                          styles.filledCircleView,
                          {backgroundColor: colors.primary},
                        ]}>
                        <Text
                          style={[styles.numberText, {color: colors.white}]}>
                          1
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.completeBar,
                          {backgroundColor: colors.primary},
                        ]}
                      />
                      <View style={[styles.circleView]}>
                        <Text style={[styles.numberText]}>2</Text>
                      </View>
                      <View style={[styles.completeBar]} />
                      <View
                        style={[
                          styles.circleView,
                          ,
                          styles.disabledCircleView,
                        ]}>
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
                      {ProfileDetails.bloodGroup+'*'}
                    </Text>
                  </View>
                  <Dropdown
                    style={[
                      styles.input,
                      bloodGroupError
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
                    data={props.getPicklistSuccess?.data?.BloodGroup}
                    maxHeight={heightScale(300)}
                    labelField="name"
                    valueField="id"
                    placeholder={common.select}
                    value={bloodValue?.id}
                    onChange={item => {
                      setBloodValue(item);
                    }}
                  />
                  {bloodGroupError ? (
                    <Text style={styles.errorMsg}>{bloodGroupError}</Text>
                  ) : null}

                  <View
                    style={{
                      marginTop: heightScale(22),
                    }}>
                    <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                      <Text style={styles.greyTextBold}>
                        {TripDetails.MedicalCondition + '*'}
                      </Text>
                    </View>

                    <CustomDropdown
                      dropdownStyles={
                        medicalError
                          ? {borderColor: colors.red,borderWidth:1.2}
                          : {borderColor: colors.gray700}
                      }
                      multiSelect
                      data={props.getMedicalConditionSuccess?.data?.content}
                      value={medicalValue}
                      onChange={item => {
                        setMedicalValue(item);
                        setMedicalError('')
                      }}
                    />

                    {medicalError ? (
                      <Text style={styles.errorMsg}>{medicalError}</Text>
                    ) : null}
                  </View>
                </View>

                {!isMyProfile && (
                  <View style={styles.buttonView}>
                    <TouchableOpacity
                      onPress={() => {
                        if (props.isProfileUpdated) {
                          props.navigation.navigate('ThirdComponent', {
                            navigation: props.navigation,
                          });
                        } else {
                          props.navigation.navigate('Third', {
                            navigation: props.navigation,
                          });
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
              {isMyProfile && (
                <SaveButton
                  handleSubmit={handleSubmit}
                  navigation={props.navigation}
                />
              )}
            </View>
          </LinearGradient>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainView: {minHeight: Dimensions.get('window').height / 1.04},
  headerView: {paddingTop: heightScale(45), paddingHorizontal: widthScale(25)},
  profileView: {paddingTop: heightScale(20), paddingHorizontal: widthScale(25)},
  title: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(24),
    color: colors.black,
    fontWeight: '700',
  },
  updateDetails: {
    fontSize: normalize(12),
    fontWeight: '400',
    color: colors.DarkGray,
    fontFamily: fonts.calibri.regular,
    marginTop: heightScale(4),
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
    borderRadius: normalize(100),
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledCircleView: {
    height: normalize(24),
    width: normalize(24),
    borderRadius: 100,
    backgroundColor: colors.primary,
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
    flex:1, 
    justifyContent: 'space-between'
  },
  inputStyles: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.medium,
    color: colors.black,
  },
  input: {
    paddingHorizontal: widthScale(10),
    borderColor: colors.gray400,
    borderWidth: widthScale(1),
    borderRadius: normalize(20),
    paddingVertical: heightScale(4),
    width: '100%',
  },
  multiSelectInput: {
    paddingHorizontal: widthScale(10),
    borderColor: colors.black,
    borderWidth: widthScale(1),
    borderRadius: normalize(20),
    paddingVertical: heightScale(2),
    marginRight: widthScale(3),
    marginVertical: heightScale(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonView: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 0,
    paddingHorizontal: widthScale(30),
    marginTop: heightScale(40),
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(100),
    paddingVertical: heightScale(10),
    paddingHorizontal: widthScale(45),
    borderColor: colors.primary,
    borderWidth: moderateScale(2),
  },
  saveBtnView: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  errorMsg: {
    marginTop: heightScale(3),
    color: colors.red,
    marginLeft: widthScale(5),
    width: widthScale(250),
    fontSize: normalize(12),
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    fontWeight: '700',
  },
  inputDropdown: {
    paddingHorizontal: widthScale(10),
    borderColor: colors.gray400,
    paddingVertical: heightScale(8),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = ({App}) => {
  const {
    getMedicalConditionLoading,
    getMedicalConditionFail,
    getMedicalConditionSuccess,
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    updateMedicalCondionLoading,
    updateMedicalCondionSuccess,
    updateMedicalCondionFail,
    isProfileUpdated,
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
    getUserMedicalLoading,
    getUserMedicalFail,
    getUserMedicalSuccess,
  } = App;
  return {
    updateMedicalCondionLoading,
    updateMedicalCondionSuccess,
    updateMedicalCondionFail,
    getMedicalConditionLoading,
    getMedicalConditionFail,
    getMedicalConditionSuccess,
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    isProfileUpdated,
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
    getUserMedicalLoading,
    getUserMedicalFail,
    getUserMedicalSuccess,
  };
};

const mapDispatchToProps = {
  getMedicalCondition,
  getProfile,
  updateMedicalCondition,
  profileUpdate,
  getUserMedical,
};

export default connect(mapStateToProps, mapDispatchToProps)(SecondComponent);
