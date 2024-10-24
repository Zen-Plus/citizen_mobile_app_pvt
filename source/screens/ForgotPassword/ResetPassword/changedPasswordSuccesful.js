import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import {Context} from '../../../providers/localization.js';
import {colors, scaling, fonts} from '../../../library';
import {PasswordChangedSuccessful} from '../../../../assets'
import {PreventDoubleClickWithOpacity} from 'react-native-prevent-double-click';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const PasswordChanged = ({handleBackToLogin}) => {
    const strings = React.useContext(Context).getStrings();

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Image source={PasswordChangedSuccessful} style={styles.logo} resizeMode="contain" />
        <Text style={styles.passwordChangedText}>
          {strings.forgotPasswordScreen.passwordChanged}
        </Text>
        <Text style={styles.passwordChangedSuccefully}>
          {strings.forgotPasswordScreen.passwordChangedSuccefully}
        </Text>
      </View>
        <PreventDoubleClickWithOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={handleBackToLogin}>
          <Text style={styles.buttonText}>
            {strings.forgotPasswordScreen.backToLogin}
          </Text>
        </PreventDoubleClickWithOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(26),
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  logo: {
    height: heightScale(80),
    width: widthScale(79)
  },
  passwordChangedText: {
    fontWeight: 'normal',
    marginTop: heightScale(26),
    fontSize: normalize(28),
    fontFamily: fonts.calibri.bold,
    color: colors.black,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  passwordChangedSuccefully: {
    fontWeight: 'normal',
    marginTop: heightScale(18),
    fontSize: normalize(16),
    fontFamily: fonts.calibri.regular,
    color: colors.mediumLightGray,
    alignItems: 'center',
    width: widthScale(194),
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    color: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: heightScale(15),
    marginTop: heightScale(40),
    borderRadius: moderateScale(100),
    marginBottom: heightScale(60),
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
});

export default PasswordChanged
