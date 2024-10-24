import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import {colors, scaling, fonts, textStyles} from '../library';
import {ProgressBar} from 'react-native-paper';
import {Context} from '../providers/localization';
const {normalize, widthScale, heightScale, moderateScale} = scaling;

const ProgressBarComp = ({percentage,textStyle,progressLineStyle,mainViewStyle}) => {
  const {getStrings} = React.useContext(Context);
  const {myProfile, sideMenu} = getStrings();
  const percent = isNaN(percentage) ? 0 : percentage / 100;
  return (
    <>
    <View style={[styles.mainView, mainViewStyle]}>
      <ProgressBar
        progress={percent}
        color={colors.primary}
        style={[styles.progressBarView,progressLineStyle]}
      />
    </View>

    <Text style={styles.percentageText}>{percentage}% Profile Complete</Text>
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarView: {
    borderRadius: normalize(20),
    height: heightScale(4),
    width: Dimensions.get('window').width / 1.2,
  },
  percentageText: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    fontSize: normalize(11),
    color: colors.primary,
    marginTop: heightScale(5)
  },
  blackTextBold: {
    color: colors.black,
    fontFamily: fonts.calibri.bold,
    fontWeight: '700',
    fontSize: normalize(14),
    marginBottom: widthScale(4),
  },
});

export default ProgressBarComp;
