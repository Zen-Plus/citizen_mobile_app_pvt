import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors, textStyles, fonts} from '../library';
import {PreventDoubleClickWithOpacity} from 'react-native-prevent-double-click';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {scaling} from '../library';

const {normalize, widthScale, heightScale, moderateScale} = scaling;
export const BackArrow = ({onPress, style, disabled, icon, ...props}) => (
  <PreventDoubleClickWithOpacity
    onPress={onPress}
    disabled={disabled}
    {...props}
    activeOpacity={0.8}>
    <View style={[styles.backArrow, style]}>
      <Ionicons
        name="arrow-back"
        size={moderateScale(22)}
        color={colors.white}
        style={[styles.icon, icon]}
      />
    </View>
  </PreventDoubleClickWithOpacity>
);

const styles = StyleSheet.create({
  backArrow: {
    backgroundColor: colors.primary,
    marginTop: heightScale(10),
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: normalize(25),
    justifyContent: 'center',
  },
  icon: {alignSelf: 'center'},
});
