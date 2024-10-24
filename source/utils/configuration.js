import React, {useEffect, useState} from 'react';
import {
  View,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  BackHandler,
} from 'react-native';
import {Context} from '../providers/localization.js';
import {connect} from 'react-redux';
import {
  configuration,
  validateVersion,
  getDeviceType,
} from '../redux/actions/app.actions';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import {colors, scaling, fonts} from '../library';
import Splash from '../screens/Splash';
import SplashScreen from 'react-native-splash-screen';
import Config from 'react-native-config';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const Configuration = props => {
  const osType = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
  const [versionError, setVersionError] = useState('');

  const strings = React.useContext(Context).getStrings();
  const {configuration, QRScanner} = strings;
  const [showSplash, setShowSplash] = useState(false);
  const [showFailError, setShowFailError] = useState(false);

  const showScreen = async () => {
    setShowSplash(false);
    props.validateVersion({isVersionValid: true});
  };

  useEffect(() => {
    props.configuration(osType);
  }, []);
  useEffect(() => {
    if (versionError === 'LESS_THAN_RECOMMENDED') {
      console.log('Less than minimum recommended version');
    } else if (versionError === 'VERSION_EXPIRED') {
      console.log('Version expired');
    }
  }, [versionError]);

  useEffect(() => {
    if (props.configurationSuccess) {
      setShowFailError(false);
      console.log(props.configurationSuccess);
      let filteredArray = props.configurationSuccess.data.filter(item => {
        return (
          item.appName === Config.APP_NAME_ENUM_FOR_API &&
          item.appPlatform.toLowerCase() === Platform.OS
        );
      });
      if (
        DeviceInfo.getVersion() <
        (filteredArray && filteredArray[0].minUsableVersion)
      ) {
        setVersionError('VERSION_EXPIRED');
      } else if (
        DeviceInfo.getVersion() <
        (filteredArray && filteredArray[0].minRecommendedVersion)
      ) {
        setVersionError('LESS_THAN_RECOMMENDED');
      } else {
        setVersionError('');
        showScreen();
      }
      setTimeout(() => {
        SplashScreen.hide();
      }, 300);
    }
  }, [props.configurationSuccess]);

  useEffect(() => {
    if (props.configurationFail) {
      setShowFailError(true);
      setTimeout(() => {
        SplashScreen.hide();
      }, 300);
    }
  }, [props.configurationFail]);

  const handleCancel = () => {
    setVersionError('');
    showScreen();
  };

  const openStore = () => {
    let storeLink = Config.APP_CENTER_LINK;

    Linking.canOpenURL(storeLink)
      .then(() => {
        Linking.openURL(storeLink);
      })
      .catch();
  };
  return (
    <View>
      {showSplash && <Splash />}
      <Modal isVisible={versionError}>
        {versionError === 'LESS_THAN_RECOMMENDED' ? (
          <View style={styles.container}>
            <Text style={styles.heading}>{configuration.newVersion}</Text>
            <Text style={styles.description}>
              {configuration.newVersionDescription}
            </Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalButton}
                onPress={() => handleCancel()}>
                <Text style={[styles.buttonText, {color: colors.primary}]}>
                  {configuration.notNow}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={props.userinfoLoading}
                activeOpacity={0.8}
                style={[
                  styles.modalButton,
                  {
                    borderWidth: 0,
                    backgroundColor: colors.primary,
                    marginLeft: widthScale(16),
                  },
                ]}
                onPress={() => openStore()}>
                <Text style={[styles.buttonText, {color: colors.white}]}>
                  {configuration.updateNow}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : versionError === 'VERSION_EXPIRED' ? (
          <View style={styles.container}>
            <Text style={styles.heading}>{configuration.versionExpired}</Text>
            <Text style={styles.description}>{configuration.pleaseUpdate}</Text>
            <View
              style={[
                styles.buttonsContainer,
                {flexDirection: 'column', alignItems: 'center'},
              ]}>
              <TouchableOpacity
                disabled={props.userinfoLoading}
                activeOpacity={0.8}
                style={[
                  styles.modalButton,
                  {
                    borderWidth: 0,
                    backgroundColor: colors.primary,
                    marginLeft: widthScale(16),
                  },
                ]}
                onPress={() => openStore()}>
                <Text style={[styles.buttonText, {color: colors.white}]}>
                  {configuration.update}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </Modal>
      <Modal isVisible={showFailError} style={styles.modal}>
        <View style={styles.container}>
          <Text style={styles.description}>{configuration.error}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalButton}
              onPress={() => props.configuration(osType)}>
              <Text style={[styles.buttonText, {color: colors.primary}]}>
                {configuration.retry}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={props.userinfoLoading}
              activeOpacity={0.8}
              style={[
                styles.modalButton,
                {
                  borderWidth: 0,
                  backgroundColor: colors.primary,
                  marginLeft: widthScale(16),
                },
              ]}
              onPress={() => BackHandler.exitApp()}>
              <Text style={[styles.buttonText, {color: colors.white}]}>
                {QRScanner.OK}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  buttonsContainer: {
    marginTop: heightScale(28),
    flexDirection: 'row',
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
});

const mapStateToProps = ({App}) => {
  const {configurationLoading, configurationSuccess, configurationFail} = App;
  return {
    configurationLoading,
    configurationSuccess,
    configurationFail,
  };
};

const mapDispatchToProps = {
  configuration,
  validateVersion,
  getDeviceType,
};

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
