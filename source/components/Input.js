import React, {forwardRef} from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
import {colors, scaling, fonts} from '../library';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const Input = (props, ref) => {
  const {
    isSecondaryButton = false,
    label,
    labelStyle,
    inputContainerStyle,
    containerStyle,
    allowFontScaling = false,
    inputBoxStyle,
    placeholder,
    placeholderTextColor = isSecondaryButton ? colors.DimGray2 : colors.gray400,
    onChangeText,
    fieldName,
    value,
    keyboardType,
    maxLength,
    returnKeyType,
    editable,
    autoComplete = 'off',
    selectionColor = colors.primary,
    secureTextEntry = false,
    onBlur,
    onFocus,
    error,
    inputErrorStyle,
    errorTextStyle,
    rightIcon,
    rightIconContainerStyle,
    multiline = false,
    numberOfLines = 1,
    autoCapitalize,
  } = props;

  return (
    <View style={{...styles.container, ...containerStyle}}>
      {!!label && (
        <Text
          style={[
            styles.label,
            isSecondaryButton && styles.labelSecondary,
            labelStyle,
          ]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isSecondaryButton && styles.inputContainerSecondary,
          inputContainerStyle,
          error && {...styles.errorStyle, ...inputErrorStyle},
        ]}>
        <TextInput
          autoCapitalize={autoCapitalize}
          ref={ref}
          allowFontScaling={allowFontScaling}
          style={[
            styles.inputBox,
            isSecondaryButton && styles.inputBoxSecondary,
            inputBoxStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={text => onChangeText(text, fieldName)}
          value={value}
          keyboardType={keyboardType}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          editable={editable}
          autoComplete={autoComplete}
          selectionColor={selectionColor}
          secureTextEntry={secureTextEntry}
          onBlur={onBlur}
          onFocus={onFocus}
          multiline={multiline}
          numberOfLines={numberOfLines}
          blurOnSubmit={true}
        />
        {!!rightIcon && (
          <View
            style={{...styles.rightIconContainer, ...rightIconContainerStyle}}>
            {rightIcon}
          </View>
        )}
      </View>
      {!!error && (
        <Text style={{...styles.errorText, ...errorTextStyle}}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: colors.black,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.bold,
    marginBottom: heightScale(4),
  },
  labelSecondary: {
    color: colors.Charcoal2,
    fontFamily: fonts.calibri.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: widthScale(1),
    borderColor: colors.white,
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(12),
    paddingVertical: heightScale(8),
    borderRadius: moderateScale(12),
  },
  inputContainerSecondary: {
    borderColor: colors.LightGrey7,
    borderRadius: moderateScale(100),
  },
  errorStyle: {
    borderColor: colors.Red,
  },
  inputBox: {
    flex: 5,
    color: colors.black,
    fontSize: normalize(16),
    fontFamily: fonts.calibri.regular,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  inputBoxSecondary: {
    color: colors.DarkGray,
    fontFamily: fonts.calibri.semiBold,
  },
  errorText: {
    color: colors.Red,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    marginTop: heightScale(2),
  },
  rightIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default forwardRef(Input);
