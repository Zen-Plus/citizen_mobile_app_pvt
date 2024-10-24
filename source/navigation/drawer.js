import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import {colors, scaling, fonts} from '../library';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Context} from '../providers/localization';
import DeviceInfo from 'react-native-device-info';
import {navigations} from '../constants';
import {connect} from 'react-redux';
import {resetAuthReducer} from '../redux/actions/auth.actions';
import {clearAsyncStorage} from '../utils/asyncStorage';
import Modal from 'react-native-modal';
import Config from 'react-native-config';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const version = DeviceInfo.getVersion();

const CustomDrawerContent = props => {
  const strings = React.useContext(Context).getStrings();
  const {sideMenu, handOverPopup, common, myProfile} = strings;

  const data = [
    {
      screenName: sideMenu.Home,
      iconSize: 17,
      iconName: 'home',
      navigation: navigations.HomeScreen,
      iconLibrary: 'IconSimple',
    },
    {
      screenName: sideMenu.myProfile,
      iconSize: 19,
      iconName: 'person',
      navigation: navigations.MyProfile,
      logout: true,
      iconLibrary: 'IconMaterialIcon',
    },
    {
      screenName: sideMenu.myRequest,
      iconSize: 19,
      iconName: 'language',
      navigation: navigations.MyRequest,
      iconLibrary: 'IconMaterialIcon',
    },
    {
      screenName: sideMenu.myEvents,
      iconSize: 19,
      iconName: 'language',
      navigation: navigations.Events,
      iconLibrary: 'IconMaterialIcon',
    },
    {
      screenName: sideMenu.nearby,
      navigation: navigations.NearBy,
      iconSize: 17,
      iconName: 'home',
      iconLibrary: 'IconSimple',
    },
    {
      screenName: sideMenu.changeLanguage,
      iconSize: 19,
      iconName: 'language',
      navigation: navigations.ChangeLanguage,
      iconLibrary: 'IconMaterialIcon',
    },

    {
      screenName: sideMenu.TermsAndConditions,
      iconSize: 18,
      iconName: 'doc',
      navigation: null,
      TermsAndConditions: true,
      iconLibrary: 'IconSimple',
    },
    {
      screenName: sideMenu.PrivacyPolicy,
      iconSize: 18,
      iconName: 'doc',
      navigation: null,
      PrivacyPolicy: true,
      iconLibrary: 'IconSimple',
    },
    {
      screenName: sideMenu.Logout,
      iconSize: 19,
      iconName: 'power-settings-new',
      navigation: null,
      logout: true,
      iconLibrary: 'IconMaterialIcon',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [logoutPrompt, setLogoutPrompt] = useState(false);
  const [percentProgress, setPercentProgress] = useState(0);
  const {state} = props;
  const {routes, index} = state;

  useEffect(() => {
    if (index >= data.length) {
      return;
    }
    if (index === data.length - 1) {
      setActiveIndex(0);
    } else {
      setActiveIndex(activeIndex || index);
    }
  }, [index]);

  const handleLogout = async () => {
    setLogoutPrompt(false);
    clearAsyncStorage(() => {
      props.resetAuthReducer();
    });
  };

  const icon = (item, index) => {
    switch (item.iconLibrary) {
      case 'IconSimple':
        return (
          <IconSimple
            name={item.iconName}
            size={item.iconSize}
            style={styles.icon}
          />
        );
      case 'IconMaterial':
        return (
          <IconMaterial
            name={item.iconName}
            size={item.iconSize}
            style={styles.icon}
          />
        );
      case 'IconMaterialIcon':
        return (
          <IconMaterialIcon
            name={item.iconName}
            size={item.iconSize}
            style={styles.icon}
          />
        );
      case 'IconFontisto':
        return (
          <IconFontisto
            name={item.iconName}
            size={item.iconSize}
            style={styles.icon}
          />
        );
      default:
        break;
    }
  };

  useEffect(() => {
    if (props.getProfileSuccess) {
      let count =
        props.getProfileSuccess?.data?.isCustomer +
        props.getProfileSuccess?.data?.isMedicalConditionAvailable +
        props.getProfileSuccess?.data?.isMemberAdded;
      setPercentProgress(Math.ceil(count * 33.33));
    }
  }, [props.getProfileSuccess?.data]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.contentContainerStyle}>
      <Modal
        isVisible={logoutPrompt}
        onBackdropPress={() => setLogoutPrompt(false)}
        onBackButtonPress={() => setLogoutPrompt(false)}
        backdropTransitionOutTiming={0}>
        <View style={styles.container}>
          <Text style={styles.heading}>{handOverPopup.changeShift}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalButton}
              onPress={() => handleLogout()}>
              <Text style={[styles.buttonText, {color: colors.primary}]}>
                {sideMenu.Logout}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.modalButton,
                {
                  borderWidth: 0,
                  backgroundColor: colors.primary,
                  marginLeft: widthScale(16),
                },
              ]}
              onPress={() => {
                setLogoutPrompt(false);
              }}>
              <Text style={[styles.buttonText, {color: colors.white}]}>
                {common.abort}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View>
        <TouchableOpacity style={styles.profileItem} activeOpacity={0.8}>
          <View>
            <Text style={styles.hello}>{myProfile.hello}</Text>
            <Text style={styles.name}>{props.userName}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.line}></View>
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          return (
            <View>
              <TouchableOpacity
                style={
                  index === activeIndex
                    ? styles.mainItemActive
                    : styles.mainItem
                }
                activeOpacity={0.8}
                onPress={() => {
                  if (item.navigation) {
                    setActiveIndex(index);
                    props.navigation.navigate(item.navigation, {
                      fromDrawer: 'true',
                    });
                  } else if (item.logout) {
                    setLogoutPrompt(true);
                  } else if (item.TermsAndConditions) {
                    Linking.openURL(Config.TERMS_AND_CONDITION_URL);
                  } else if (item.PrivacyPolicy) {
                    Linking.openURL(Config.PRIVACY_POLICY_URL);
                  }
                }}>
                <Text style={styles.screenName}>{item.screenName}</Text>

                {item.screenName === sideMenu.myProfile && percentProgress !== 100 && (
                  <View style={styles.update}>
                    <Text style={styles.updateText}>{myProfile.Update}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <View style={styles.versionContainer}>
        <Text style={{color: colors.greyishBrownTwo}}>
          {Config.APP_TYPE} v{version}
        </Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    justifyContent: 'space-between',
    flex: 1,
  },
  line: {
    backgroundColor: colors.white,
    height: heightScale(1),
    marginBottom: heightScale(0),
  },
  name: {
    fontSize: normalize(24),
    fontFamily: fonts.calibri.bold,
    color: colors.DarkGray,
    letterSpacing: 0,
    fontWeight: 'bold',
    width: widthScale(200),
    fontWeight: 'bold',
  },

  profileItem: {
    flexDirection: 'row',
    marginLeft: widthScale(30),
    marginTop: heightScale(18),
    marginBottom: heightScale(18),
    justifyContent: 'space-between',
  },
  mainItemActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.PaleBlue,
  },
  mainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginLeft: widthScale(18),
  },

  screenName: {
    marginLeft: widthScale(30),
    fontSize: normalize(18),
    fontFamily: fonts.calibri.regular,
    color: colors.black,
    letterSpacing: 0,
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: heightScale(20),
    marginTop: heightScale(10),
  },
  container: {
    //height: heightScale(195),
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

  buttonsContainer: {
    marginTop: heightScale(28),
    flexDirection: 'row',
    marginBottom: heightScale(28),
  },
  modalButton: {
    backgroundColor: colors.white,
    color: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    width: widthScale(120),
    height: heightScale(36),
    borderRadius: moderateScale(5),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  update: {
    marginLeft: widthScale(15),
    borderWidth: 1,
    borderColor: colors.yellowLight2,
    backgroundColor: colors.yellowLight,
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(4),
    borderRadius: normalize(125),
  },
  updateText: {
    fontSize: normalize(12),
    color: colors.yellowLight2,
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
  },
  hello: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.DarkGray,
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {userName, userMobile, getProfileSuccess} = App;
  const {} = Auth;

  return {
    userName,
    userMobile,
    getProfileSuccess,
  };
};

const mapDispatchToProps = {
  resetAuthReducer,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomDrawerContent);
