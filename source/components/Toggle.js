import React from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import {colors, scaling, fonts} from '../library';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const Toggle = (props) => {
  const {
    selectedValue = {},
    onChange = () => {},
    toggleData = [],
    containerStyles,
    containerErrorStyles,
    itemViewStyles,
    itemTextStyles,
    selectedItemViewStyles,
    selectedItemTextStyles,
    label,
    labelStyle,
    error,
    errorStyle,
    disabled = false,
  } = props;

  return (
    <View>
      {!!label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          containerStyles,
          error && {...styles.containerError, ...containerErrorStyles},
        ]}
      >
        {toggleData.map((item) => (
          <TouchableOpacity
            onPress={() => { onChange(item); }}
            style={[
              styles.itemView,
              itemViewStyles,
              (selectedValue.id === item.id) && {
                ...styles.selectedItemView, ...selectedItemViewStyles,
              },
            ]}
            disabled={disabled}
          >
            <Text
              style={[
                styles.itemText,
                itemTextStyles,
                (selectedValue.id === item.id) && {
                  ...styles.selectedItemText, ...selectedItemTextStyles
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {!!error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    borderWidth: widthScale(1),
    borderColor: colors.PaleBlue,
    backgroundColor: colors.PaleBlue,
    borderRadius: moderateScale(100),
    paddingBottom: heightScale(3),
    paddingHorizontal: widthScale(5),
  },
  containerError: {
    borderColor: colors.Red,
  },
  itemView: {
    flexBasis: `${100/3}%`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightScale(8),
    paddingHorizontal: widthScale(5),
    marginTop: heightScale(3),
  },
  selectedItemView: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(100),
    elevation: normalize(2),
  },
  itemText: {
    color: colors.DimGray2,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  selectedItemText: {
    color: colors.DarkGray,
    fontFamily: fonts.calibri.semiBold,
  },
  label: {
    color: colors.Charcoal2,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.medium,
    marginBottom: heightScale(4),
  },
  error: {
    color: colors.Red,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    marginTop: heightScale(2),
  },
});

export default Toggle;
