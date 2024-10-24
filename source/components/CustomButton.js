import React from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {PreventDoubleClickWithOpacity} from 'react-native-prevent-double-click';
import {colors, scaling, fonts} from '../library';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const CustomButton = props => {
  const {
    onPress,
    disabled,
    leftIcon,
    rightIcon,
    leftIconContainerStyles,
    rightIconContainerStyles,
    containerStyles,
    title,
    titleContainerStyles,
    titleTextStyles,
    loading,
    loaderColor = colors.white,
    loaderSize = 35,
    disabledButtonStyles,
  } = props;

  return (
    <PreventDoubleClickWithOpacity
      onPress={onPress}
      disabled={disabled || loading}>
      <View
        style={[
          styles.container,
          containerStyles,
          (disabled || loading) && {
            ...styles.disabledButton,
            ...disabledButtonStyles,
          },
        ]}>
        <View
          style={{flex: 2, ...styles.subContainer, ...leftIconContainerStyles}}>
          {!!leftIcon && leftIcon}
        </View>

        <View
          style={{flex: 7, ...styles.subContainer, ...titleContainerStyles}}>
          {loading ? (
            <ActivityIndicator color={loaderColor} size={loaderSize} />
          ) : (
            <Text style={{...styles.titleText, ...titleTextStyles}}>
              {title}
            </Text>
          )}
        </View>

        <View
          style={{
            flex: 2,
            ...styles.subContainer,
            ...rightIconContainerStyles,
          }}>
          {!!rightIcon && rightIcon}
        </View>
      </View>
    </PreventDoubleClickWithOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingVertical: heightScale(8),
    paddingHorizontal: widthScale(12),
    borderRadius: moderateScale(100),
    backgroundColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.Gainsboro,
  },
  subContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: colors.white,
    fontSize: normalize(17),
    fontFamily: fonts.calibri.medium,
  },
});

export default CustomButton;
