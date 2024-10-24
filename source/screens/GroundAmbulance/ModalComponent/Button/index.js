import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {scaling, fonts} from '../../../../library';

const {normalize, moderateScale} = scaling;

export const Button = props => {
  const {style, textStyle, text, onPress, disabled} = props;
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={[styles.containerStyle, style]}>
        <Text style={[styles.textStyle, textStyle]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    borderWidth: 2,
    alignItems: 'center',
  },
  containerStyle: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(100),
  },
  textStyle: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
  },
});
