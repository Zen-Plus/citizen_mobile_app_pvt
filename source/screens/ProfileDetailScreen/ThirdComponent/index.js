import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import {Context} from '../../../providers/localization.js';
import Toast from 'react-native-simple-toast';
import {colors, scaling, fonts} from '../../../library';
import {connect} from 'react-redux';
import Loader from '../../../components/loader.js';
import {
  getProfile,
  addMembers,
  profileUpdate,
  getMembers,
  updateFamilyMember,
  resetUpdateMemberData,
} from '../../../redux/actions/app.actions';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigations} from '../../../constants/index.js';
import SaveButton from '../Component/AddMembers/SaveButton.js';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const ThirdComponent = props => {
  const {isMyProfile} = props.route.params ? props.route.params : false;
  const strings = React.useContext(Context).getStrings();
  const {ProfileDetails} = strings;
  const [customerId, setCustomerId] = useState();
  const [members, setMembers] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    props.getProfile();
  }, []);

  useEffect(() => {
    if (props.getProfileSuccess) {
      setLoader(false);
      setCustomerId(props.getProfileSuccess?.data?.id);
      props.getMembers(props.getProfileSuccess?.data?.id);
    }
  }, [props.getProfileSuccess]);

  useEffect(() => {
    if (props.getMembersSuccess) {
      setMembers(props.getMembersSuccess?.data);
    }
  }, [props.getMembersSuccess]);
  useEffect(() => {
    if (props.addMembersSuccess) {
      Toast.showWithGravity(strings.menuItems.memberSaved, Toast.LONG, Toast.TOP);
      if (isMyProfile) {
        props.navigation.goBack();
      } else {
        props.navigation.navigate(navigations.Home);
      }
      props.profileUpdate(true);
    }
  }, [props.addMembersSuccess, props.addMembersFail]);
  const newMember = states => {
    const newAddedMember = [...members];
    newAddedMember.push(states);
    setMembers(newAddedMember);
  };
  const addingMember = states => {
    newMember(states);
  };

  const removeFamilyMemberData = ({item, index}) => {
    if (item?.id) {
      const data = {
        customerId: customerId,
        memberId: item?.id,
        addressRequest: {
          addressLine1: item?.address?.addressLine1,
          flatNumber: item?.address?.addressLine2,
          landmark: item?.address?.addressLine3,
        },
        age: item?.age,
        bloodGroup: item?.bloodGroup?.id,
        firstName: item?.firstName,
        gender: item?.gender?.id,
        isActive: 'ACTIVE',
        isDeleted: true,
        phoneNumber: item?.mobileNumber,
        relation: item?.relationWithUser?.id,
      };
      props.updateFamilyMember(data);
      setLoader(true);
    } else {
      var memb = members.slice(0, -1);
      setMembers(memb);
    }
  };
  useEffect(() => {
    props.resetUpdateMemberData();
    props.getMembers(props.getProfileSuccess?.data?.id);
    setLoader(false);
  }, [props.updateFamilyMemberSuccess]);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate(navigations.AddMembers, {
            addingMember: addingMember,
            isMyProfile: isMyProfile,
            genderData: props.getPicklistSuccess?.data?.Gender,
            relationData: props.getPicklistSuccess?.data?.Relation,
            bloodData: props.getPicklistSuccess?.data?.BloodGroup,
            navigation: props.navigation,
            itemData: item,
            customerId: customerId,
          });
        }}>
        <View style={styles.members}>
          <Text
            style={
              styles.greyText
            }>{`${item.firstName}, ${item.relationWithUser?.name}`}</Text>

          <TouchableOpacity
            onPress={() => {
              removeFamilyMemberData({item, index});
            }}>
            <View>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={moderateScale(18)}
                color={colors.red}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSubmit = () => {
    let data = members.filter(item => {
      return !item?.id;
    });
    props.addMembers(data, customerId);
  };
  return (
    <View style={styles.container}>
      <SafeAreaView />
      {props.getProfileLoading ||
      props.addMembersLoading ||
      props.getPicklistLoading ||
      props.getMembersLoading ||
      props.updateFamilyMemberLoading ||
      loader ? (
        <View style={styles.loaderView}>
          <Loader />
        </View>
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
                    {ProfileDetails.familyDetails}
                  </Text>
                  <Text style={styles.updateDetails}>
                    {ProfileDetails.updateFamilyDetails}
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
                      <View style={styles.completeBar} />
                      <View
                        style={[
                          styles.filledCircleView,
                          {backgroundColor: colors.primary},
                        ]}>
                        <Text
                          style={[styles.numberText, {color: colors.white}]}>
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
                <TouchableOpacity
                  onPress={() => {
                    if (isMyProfile) {
                      props.navigation.navigate(navigations.AddMembers, {
                        addingMember: addingMember,
                        genderData: props.getPicklistSuccess?.data?.Gender,
                        relationData: props.getPicklistSuccess?.data?.Relation,
                        bloodData: props.getPicklistSuccess?.data?.BloodGroup,
                        navigation: props.navigation,
                        isMyProfile: isMyProfile,
                      });
                    } else {
                      props.navigation.navigate(navigations.Members, {
                        addingMember: addingMember,
                        genderData: props.getPicklistSuccess?.data?.Gender,
                        relationData: props.getPicklistSuccess?.data?.Relation,
                        bloodData: props.getPicklistSuccess?.data?.BloodGroup,
                        navigation: props.navigation,
                      });
                    }
                  }}>
                  <View style={styles.addMembers}>
                    <Icon
                      name="add"
                      size={moderateScale(22)}
                      color={colors.primary}
                      style={styles.icon}
                    />
                    <Text style={styles.AddFamilyMemberText}>
                      {ProfileDetails.addMemberInfo}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.contentStyle}>
                <FlatList
                  data={members}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                />
                </View>
                

                {!isMyProfile && (
                  <View style={styles.buttonView}>
                    <TouchableOpacity
                      onPress={() => {
                        props.profileUpdate(true);
                        if (props.isProfileUpdated) {
                          props.navigation.navigate('HomeScreen');
                        } else {
                          props.navigation.navigate(navigations.Home);
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
                          {backgroundColor: colors.primary,  borderWidth: 0, paddingVertical: heightScale(12)},
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
  mainView: {height: Dimensions.get('window').height / 1.04},
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
    fontSize: normalize(14),
    color: colors.gray700,
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
    backgroundColor: colors.primary,
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
    marginTop: heightScale(35),
    flex:1

  },
  astrik: {fontSize: normalize(12), color: colors.black},
  inputStyles: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.medium,
    color: colors.black,
  },
  input: {
    paddingLeft: widthScale(10),
    borderColor: colors.gray400,
    borderWidth: widthScale(1),
    borderRadius: normalize(5),
    paddingVertical: heightScale(8),
    width: '100%',
  },
  buttonView: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingHorizontal: widthScale(20),
    position: 'absolute',
    bottom: heightScale(15),
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
  addMembers: {
    borderColor: colors.primary,
    borderRadius: normalize(25),
    borderWidth: 1,
    paddingVertical: heightScale(12),
    paddingHorizontal: widthScale(30),
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  members: {
    borderColor: 'transparent',
    borderWidth: 1,
    height: heightScale(45),
    paddingHorizontal: widthScale(16),
    marginTop: heightScale(20),
    marginBottom: heightScale(5),
    marginHorizontal: widthScale(4),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    shadowColor: colors.gray700,
    shadowOpacity: normalize(2),
    shadowRadius: normalize(4),
    elevation: normalize(4),
    backgroundColor: colors.white,
    borderRadius: normalize(8),
  },
  icon: {alignSelf: 'center', marginLeft: widthScale(5)},
  loaderView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  AddFamilyMemberText: {
    color: colors.primary,
    textAlign: 'center',
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(14),
    fontWeight: '600',
    marginHorizontal: widthScale(4),
  },
  contentStyle:{
    height: heightScale(170),
  }
});

const mapStateToProps = ({App}) => {
  const {
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    addMembersLoading,
    addMembersSuccess,
    addMembersFail,
    isProfileUpdated,
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
    getMembersLoading,
    getMembersSuccess,
    getMembersFail,
    updateFamilyMemberLoading,
    updateFamilyMemberSuccess,
    updateFamilyMemberFail,
  } = App;
  return {
    addMembersLoading,
    addMembersSuccess,
    addMembersFail,
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    isProfileUpdated,
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
    getMembersLoading,
    getMembersSuccess,
    getMembersFail,
    updateFamilyMemberLoading,
    updateFamilyMemberSuccess,
    updateFamilyMemberFail,
  };
};

const mapDispatchToProps = {
  getProfile,
  addMembers,
  profileUpdate,
  getMembers,
  updateFamilyMember,
  resetUpdateMemberData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ThirdComponent);
