import React, {forwardRef, useRef} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors, scaling, fonts} from '../library';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from '../../assets'

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const CustomDropdown = (props, ref) => {
  const {
    data,
    placeholder = 'Select',
    placeholderStyle,
    dropdownStyles,
    multiSelect,
    onChange,
    value,
    containerStyle,
    inputDropdownStyle,
    inputDropdownText,
    inputSelectedDropdownStyle,
    inputSelectedDropdownText,
    markedColor = colors.primary,
    unmarkedColor = colors.DimGray2,
    selectedIconColor = colors.black,
    disable,
    renderLeftIcon,
    renderRightIcon,
    leftIcon,
    rightIcon,
    leftIconContainerStyles,
    rightIconContainerStyles,
    onChangeText,
    containerStyles,
  } = props;
  const refDrop = useRef(null)
  const multiSelectSubmitButton = multiSelect && data && data.length ? [...data, {name: "Submit", id: "Submit"}] : data

  return (
    <View style={[styles.container, containerStyles]}>
      {multiSelect ? (
        <MultiSelect
          ref={refDrop}
          activeColor={colors.white}
          data={multiSelectSubmitButton}
          disable={disable}
          labelField="name"
          valueField="id"
          placeholder={placeholder}
          placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
          style={[styles.dropdownStyles, dropdownStyles]}
          onChange={onChange}
          onChangeText={onChangeText}
          value={value}
          containerStyle={[styles.containerStyle, containerStyle]}
          dropdownPosition="bottom"
          renderItem={(item, select) => {
            return (
              <View>
                {item.id === 'Submit' ? 
                <View style={{alignItems: 'flex-end'}}>
                  <TouchableOpacity onPress={value && value.length ? () => refDrop?.current?.close() : ()=> {}}>
                    <Text style={{color: value && value.length ? colors.primary : colors.tripGray, fontSize: normalize(14), fontWeight: '600', fontFamily: fonts.calibri.semiBold, marginBottom: heightScale(12)}}>Submit</Text>
                  </TouchableOpacity>
                </View> :
              <View style={[styles.inputDropdownMultiSelect, inputDropdownStyle]}>
                {select ? (
                  <MaterialCommunityIcons
                    color={markedColor}
                    name="checkbox-marked"
                    size={22}
                    style={styles.inputDropDownIcon}
                  />
                ) : (
                  <MaterialCommunityIcons
                    color={unmarkedColor}
                    name="checkbox-blank-outline"
                    size={22}
                    style={styles.inputDropDownIcon}
                  />
                )}

                <Text
                  style={[
                    styles.inputDropdownText,
                    inputDropdownText,
                    select
                      ? {fontWeight: 'bold', fontSize: normalize(14)}
                      : {fontWeight: 'normal'},
                  ]}>
                  {item.name}
                </Text>
              </View>}
              </View>
            );
          }}
          iconStyle={styles.iconStyle}
          renderSelectedItem={(item, unSelect) => (
            <View>
              {value ? (
                <TouchableOpacity
                  onPress={() => {
                    unSelect && unSelect(item);
                  }}>
                  <View
                    style={[
                      styles.inputSelectedDropdown,
                      inputSelectedDropdownStyle,
                    ]}>
                    <Text
                      style={[
                        styles.inputSelectedDropdownText,
                        inputSelectedDropdownText,
                      ]}>
                      {item.name}
                    </Text>
                    <Entypo color={selectedIconColor} name="cross" size={20} />
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        />
      ) : (
        <Dropdown
          ref={ref}
          data={data}
          disable={disable}
          renderLeftIcon={renderLeftIcon}
          renderRightIcon={renderRightIcon}
          activeColor={colors.white}
          labelField="name"
          valueField="id"
          selectedTextProps={{
            style: {
              fontFamily: fonts.calibri.semiBold,
              fontWeight: '600',
              color: colors.DarkGray,
              fontSize: normalize(12),
            },
          }}
          placeholder={placeholder}
          placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
          style={[styles.dropdownStyles, dropdownStyles]}
          onChange={onChange}
          onChangeText={onChangeText}
          value={value}
          containerStyle={[styles.containerStyle, containerStyle]}
          renderItem={(item, select) => {
            return (
              <View style={[styles.inputDropdown, inputDropdownStyle]}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={[
                      styles.leftIconContainerStyles,
                      leftIconContainerStyles,
                    ]}>
                    {item.icon ? 
                      <Image
                        source={item.icon}
                        style={{height: heightScale(item.height), width: widthScale(item.width)}}
                        resizeMode='contain'
                      />
                      : null}
                  </View>
                  <Text
                    style={[
                      styles.inputDropdownText,
                      inputDropdownText,
                      select
                        ? {fontWeight: 'bold', fontSize: normalize(14)}
                        : {fontWeight: 'normal'},
                    ]}>
                    {item.name}
                  </Text>
                </View>
                <View
                  style={[
                    styles.rightIconContainerStyles,
                    rightIconContainerStyles,
                  ]}>
                  {!!rightIcon && rightIcon}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  placeholderStyle: {
    color: colors.DimGray2,
    fontSize: normalize(14),
  },
  dropdownStyles: {
    borderWidth: 0.5,
    borderColor: colors.LightGrey7,
    borderRadius: normalize(20),
    paddingHorizontal: widthScale(14),
    paddingVertical: heightScale(4),
  },
  inputDropdown: {
    marginBottom: heightScale(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputDropdownMultiSelect: {
    marginBottom: heightScale(14),
    flexDirection: 'row',
  },
  containerStyle: {
    paddingHorizontal: normalize(16),
    paddingTop: normalize(16),
    borderRadius: normalize(20),
  },
  inputDropdownText: {
    color: colors.DimGray2,
    fontSize: normalize(13),
    fontFamily: fonts.calibri.regular,
    marginTop: heightScale(2),
  },
  inputDropDownIcon: {alignSelf: 'center', marginRight: widthScale(10)},
  iconStyle: {
    width: normalize(20),
    height: normalize(20),
  },
  inputSelectedDropdown: {
    borderWidth: 0.5,
    flexDirection: 'row',
    paddingHorizontal: widthScale(10),
    paddingVertical: heightScale(4),
    borderRadius: normalize(20),
    marginTop: heightScale(10),
    marginRight: widthScale(10),
  },
  inputSelectedDropdownText: {
    fontFamily: fonts.calibri.regular,
    marginRight: widthScale(3),
    color: colors.DarkGray,
    fontSize: normalize(12),
  },
  leftIconContainerStyles: {
    alignSelf: 'center',
    marginRight: widthScale(4),
  },
  rightIconContainerStyles: {
    alignSelf: 'center',
    marginLeft: widthScale(4),
    justifyContent: 'flex-end',
  },
});

export default forwardRef(CustomDropdown);
