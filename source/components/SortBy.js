import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Context} from '../providers/localization';
import {colors, scaling, fonts} from '../library';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
const {normalize, widthScale, heightScale, moderateScale} = scaling;
const SortBy = ({data, ...props}) => {
  const strings = React.useContext(Context).getStrings();
  const {myTrips} = strings;
  const [value, setValue] = useState('1');
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={[styles.textItem, props.textItem]}>{item.name}</Text>
      </View>
    );
  };
  const leftIcon = () => {
    return (
      <View style={[styles.leftIconView, props.margin]}>
        <IconFontAwesome
          name={'sort-amount-down'}
          size={moderateScale(12)}
          style={{color: colors.Black1}}
        />
      </View>
    );
  };
  const RightIcon = () => {
    if (!props.sortByDays || !props.onSelect) {
      return (
        <View style={styles.rightIconView}>
          <AntDesign
            name={'down'}
            size={moderateScale(13)}
            style={{color: colors.Black1}}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (props.selectedValue) {
      setValue(null);
      props.sortByDays(null);
    }
    if (props.value) {
      setValue(props.value.toString());
      props.sortByDays(props.value.toString());
    }
  }, [props.selectedValue, props.value]);

  return (
    <View style={[styles.mainView, props.mainView]}>
      <Dropdown
        style={[styles.dropdownStyle, props.width]}
        data={data}
        labelField="name"
        valueField="id"
        value={value}
        placeholderStyle={[
          styles.placeholderMonthStyle,
          props.placeholderMonthStyle,
        ]}
        selectedTextStyle={[styles.selectedTextStyle, props.selectedTextStyle]}
        renderItem={renderItem}
        onChange={item => {
          setValue(item.id);
          if (props.sortByDays) {
            props.sortByDays(item.days);
          }
        }}
        renderLeftIcon={props.leftIcon ? leftIcon : null}
        renderRightIcon={props.select ? RightIcon : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  placeholderStyle: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    fontWeight: 'bold',
  },
  selectedTextStyle: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    fontWeight: 'bold',
    color: colors.justBlack,
    marginLeft: widthScale(5),
  },
  textItem: {
    flex: 1,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    color: colors.justBlack,
    fontWeight: 'normal',
  },
  item: {
    padding: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftIconView: {marginLeft: widthScale(22)},
  rightIconView: {marginRight: widthScale(8)},
  mainView: {
    backgroundColor: colors.grayWhite4,
    borderRadius: moderateScale(4),
    borderColor: colors.gray400,
    borderWidth: 0.5,
    paddingRight: widthScale(10),
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: heightScale(2)},
    shadowOpacity: normalize(1),
    shadowRadius: normalize(4),
    elevation: normalize(4),
    marginTop: heightScale(6),
    backgroundColor: colors.white,
    marginHorizontal: widthScale(1),
  },
  dropdownStyle: {
    width: widthScale(119),
    height: heightScale(30),
  },
  placeholderMonthStyle: {
    flex: 1,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    fontWeight: 'bold',
    color: colors.justBlack,
  },
});
export default SortBy;
