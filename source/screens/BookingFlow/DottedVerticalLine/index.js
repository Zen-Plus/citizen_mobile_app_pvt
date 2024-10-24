import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors, scaling} from '../../../library';
const {widthScale, heightScale, moderateScale} = scaling;

function PickAddress(props) {
  return (
    <View style={[{marginVertical: 22}, props.style]}>
      <View style={styles.redDot} />
      <View style={styles.verticalLine}></View>
      <View style={styles.blueDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  verticalLine: {
    height: heightScale(13),
    borderColor: colors.DarkGray2,
    borderLeftWidth: moderateScale(2),
    marginLeft: widthScale(2),
    borderStyle: 'dotted',
    flex: 1,
  },
  redDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.Red,
  },
  blueDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.SlateBlue,
  },
});

export default PickAddress;
