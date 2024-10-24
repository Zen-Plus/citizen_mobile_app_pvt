import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {colors, textStyles, scaling} from '../library';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapIcon from 'react-native-vector-icons/Feather';
const {widthScale, heightScale, moderateScale} = scaling;

export const TextInput = ({
  style,
  disabled,
  inputStyles,
  isError = false,
  isPhoneNumber = false,
  showPass,
  isPassword = false,
  onEyePress,
  icon = '',
  mapIcon = '',
  errorStyles = {},
  isAddressPresent,
  ...props
}) => (
  <View
    style={[
      styles.container,
      style,
      isError ? {...styles.error, ...errorStyles} : {},
    ]}>
    {icon ? (
      <Icon name={icon} size={moderateScale(20)} color={colors.gray93} />
    ) : null}
    {mapIcon && isAddressPresent ? (
      <MapIcon
        name={mapIcon}
        size={moderateScale(16)}
        color={colors.black}
        style={styles.mapIcon}
      />
    ) : null}
    <RNTextInput
      onSubmitEditing={Keyboard.dismiss}
      style={[styles.textInput,inputStyles]}
      editable={!disabled}
      returnKeyType="done"
      underlineColorAndroid={colors.secondary}
      autoComplete="off"
      {...props}
    />
    {mapIcon && !isAddressPresent ? (
      <MapIcon
        name={mapIcon}
        size={moderateScale(16)}
        color={colors.gray700}
        style={styles.mapIcon}
      />
    ) : null}
    {isPassword && (
      <TouchableOpacity
        activeOpactity={0}
        onPress={onEyePress}
        style={styles.eyeIcon}>
        {!showPass ? (
          <Icon
            name="eye-slash"
            size={moderateScale(20)}
            color={colors.black}
          />
        ) : (
          <Icon name="eye" size={moderateScale(20)} color={colors.black} />
        )}
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: widthScale(250),
    flex: 1,
  },
  textInput: {
    width: '100%',
    padding: 0,
    backgroundColor: colors.white,
    ...textStyles.body,
  },
  countryCode: {
    marginRight: widthScale(3),
    ...textStyles.body,
  },
  eyeIcon: {
    position: 'absolute',
    right: widthScale(10),
  },
  error: {
    borderColor: colors.red,
    borderWidth: widthScale(1),
  },
  mapIcon: {
    paddingLeft: widthScale(2),
    paddingRight: widthScale(4),
  },
});
