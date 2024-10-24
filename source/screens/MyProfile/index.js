import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image
} from 'react-native';
import {Context} from '../../providers/localization';
import {colors, scaling, fonts} from '../../library';
import {connect} from 'react-redux';
import Loader from '../../components/loader';
import Header from '../../components/header';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import {
  resetUpdateUserProfile,
  resetupdateMedicalCondition,
  resetaddMembers,
  getProfile,
  getUserData,
} from '../../redux/actions/app.actions';
import {navigations} from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {ScrollView} from 'react-native-gesture-handler';
import ProgressBarComp from '../../components/progressBar';
import {useIsFocused} from '@react-navigation/native';
import { MedicalPlus } from '../../../assets';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const MyProfile = props => {
  const {getStrings} = React.useContext(Context);
  const {myProfile} = getStrings();
  const [percentProgress, setPercentProgress] = useState(0);

  const isFocused = useIsFocused();

  useEffect(() => {
    props.getProfile();
  }, [isFocused]);

  const profileOptions = [
    {
      title: myProfile.personalDetails,
      icon: 'user',
      keyNameForUpdate: 'isCustomer',
      navigateToScreen: 'ProfileDetailScreen',
      resetFunction: props.resetUpdateUserProfile,
    },
    {
      title: myProfile.medicalCondition,
      icon: 'plus-square',
      keyNameForUpdate: 'isMedicalConditionAvailable',
      navigateToScreen: 'SecondComponent',
      resetFunction: props.resetupdateMedicalCondition,
    },
    {
      title: myProfile.familyMemberDetails,
      icon: 'users',
      keyNameForUpdate: 'isMemberAdded',
      navigateToScreen: 'ThirdComponent',
      resetFunction: props.resetaddMembers,
    },
  ];

  useEffect(() => {
    if (props.getProfileSuccess) {
      let count =
        props.getProfileSuccess?.data?.isCustomer +
        props.getProfileSuccess?.data?.isMedicalConditionAvailable +
        props.getProfileSuccess?.data?.isMemberAdded;
      setPercentProgress(count * 33.33);
    }
  }, [props.getProfileSuccess?.data]);

  const trimmedAddress = props.getProfileSuccess?.data?.addressLine1?.substring(0,25) + "..."

  return (
    <View style={styles.mainContainer}>  
      <SafeAreaView />  
      <Header
        screenName={myProfile.profile}
        menu={true}
        leftIconPress={props.navigation.toggleDrawer}
        rightIcon={true}
        notification={true}
        rightIconPress={() =>
          props.navigation.navigate(navigations.Notifications)
        }
      />    
      <LinearGradient colors={[colors.white, colors.LightBlue2]}>
      <ScrollView showsVerticalScrollIndicator = {false}>
        {props.getProfileLoading ? (
          <View style={styles.loaderView}>
            <Loader />
          </View>
        ) : (
          <View style={styles.mainView}>
            <View style={styles.upperView}>
            
              <View style={styles.row1}>
                <Text style={styles.heading}>
                  {props.getProfileSuccess?.data?.firstName}
                </Text>
              </View>
              {props.getProfileSuccess?.data?.addressLine1 &&
              <View style={styles.row2}>
                <Feather
                  name="map-pin"
                  size={moderateScale(16)}
                  color={colors.black}
                  style={styles.icon1}
                />
                <Text style={styles.address}>
                  {props.getProfileSuccess?.data?.addressLine1.length > 25 ? trimmedAddress :
                  props.getProfileSuccess?.data?.addressLine1}
                </Text>
              </View>}            
            </View>
            <View style={styles.lowerView}>
              {Math.ceil(percentProgress) !== 100 ? (
                <ProgressBarComp
                  percentage={Math.ceil(percentProgress)}
                  textStyle={styles.textStyle}
                />
              ) : null}
              {profileOptions.map((item,index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate(item.navigateToScreen, {
                        isMyProfile: true,
                        navigation: props.navigation,
                      });
                      item.resetFunction();
                    }}>
                    <View
                      style={styles.personalDetail}>
                      <View style={styles.row1}>
                        {index !=1 ? <Feather
                          name={item.icon}
                          size={moderateScale(16)}
                          color={colors.steelgray}
                          style={styles.icon}
                        /> : 
                        <Image source={MedicalPlus}style={styles.icon} />
                        }
                        <Text style={styles.blackText}>{item.title}</Text>
                        
                      </View>
                      <View style={styles.row1}>
                      {!props.getProfileSuccess?.data[
                          item.keyNameForUpdate
                        ] ? (
                          <AntDesign
                            name="exclamationcircleo"
                            size={moderateScale(12)}
                            color={colors.red}
                            style={[
                              {
                                marginLeft: widthScale(5),
                                alignContent: 'center',
                                alignSelf: 'flex-end'
                              },
                              styles.icon,
                            ]}
                          />
                        ) : null}
                      <AntDesign
                        name="right"
                        size={moderateScale(15)}
                        color={colors.steelgray}
                        style={styles.icon}
                      />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView> 
        </LinearGradient>
    </View>
   
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainView: {
    paddingHorizontal: widthScale(24),
    height: Dimensions.get("window").height
  },
  upperView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: heightScale(50),
    paddingBottom: heightScale(30),
  },
  loaderView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: heightScale(50),
    paddingBottom: heightScale(30),
  },
  lowerView: {},
  photoView: {
    height: heightScale(100),
    width: widthScale(100),
    borderRadius: normalize(200),
    backgroundColor: colors.primary,
  },
  icon: {alignSelf: 'center', marginRight: widthScale(5)},
  icon1: {alignSelf: 'center'},
  row1: {flexDirection: 'row'},
  row2: {flexDirection: 'row', paddingHorizontal: widthScale(24)},
  address: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.medium,
    color: colors.black,
    textAlign: 'center',
    marginTop: heightScale(2),
  },
  blackText: {
    color: colors.black,
    fontFamily: fonts.calibri.regular,
    fontWeight: '600',
    fontSize: normalize(14),
    marginLeft: widthScale(5),
  },
  blackTextBold: {
    color: colors.black,
    fontFamily: fonts.calibri.bold,
    fontWeight: '700',
    fontSize: normalize(14),
  },
  heading: {
    color: colors.black,
    fontFamily: fonts.calibri.bold,
    fontWeight: '700',
    fontSize: normalize(20),
  },
  update: {
    marginTop: heightScale(15),
    borderWidth: 1,
    borderColor: colors.yellowLight2,
    backgroundColor: colors.yellowLight,
    paddingHorizontal: widthScale(25),
    paddingVertical: heightScale(8),
    borderRadius: normalize(125),
  },
  personalDetail: {
    paddingLeft: widthScale(18),
    paddingRight: widthScale(10),
    paddingVertical: heightScale(12),
    backgroundColor: colors.white,
    borderRadius: normalize(10),
    marginBottom: heightScale(15),
    marginTop: heightScale(18),
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: colors.gray600,
    shadowOpacity: normalize(2),
    shadowRadius: normalize(4),
    elevation: normalize(4),
  },
  updateText: {
    fontSize: normalize(12),
    color: colors.yellowLight2,
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
  },
  prefferedLanguage: {
    fontSize: normalize(16),
    color: colors.greyishBrownTwo,
    fontFamily: fonts.calibri.bold,
    letterSpacing: 0,
    paddingHorizontal: widthScale(16),
    fontWeight: 'bold',
    marginRight: widthScale(16),
    flexWrap: 'wrap',
    marginTop: heightScale(4),
  },
  selectLanguage: {
    fontSize: normalize(16),
    color: colors.greyishBrownTwo,
    fontFamily: fonts.calibri.regular,
    letterSpacing: 0,
    marginTop: heightScale(8),
    paddingHorizontal: widthScale(16),
  },
  langaugeView: {
    flexDirection: 'row',
    height: heightScale(60),
    backgroundColor: colors.white,
    marginTop: heightScale(1),
    alignItems: 'center',
    paddingLeft: widthScale(16),
    justifyContent: 'space-between',
    paddingRight: widthScale(16),
  },
  nameText: {
    marginLeft: widthScale(16),
    fontSize: normalize(16),
    color: colors.greyishBrownTwo,
    fontFamily: fonts.calibri.regular,
    letterSpacing: 0,
  },
  outerView: {
    paddingVertical: heightScale(16),
    paddingHorizontal: widthScale(16),
    flexDirection: 'row',
  },
  textStyle: {
    marginBottom: heightScale(8),
  },
  changePswdView:{
    marginTop: 0,
    marginBottom: heightScale(50)
  }
});

const mapStateToProps = ({App}) => {
  const {
    getAllowedLanguagesSuccess,
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
  } = App;

  return {
    getAllowedLanguagesSuccess,
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
  };
};

const mapDispatchToProps = {
  resetUpdateUserProfile,
  resetupdateMedicalCondition,
  resetaddMembers,
  getProfile,
  getUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
