import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {colors, scaling, fonts} from '../../../library';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextInput} from '../../../components';
import {MapComponent} from '../../../components/MapComponent';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

function PickAddress({
  label,
  placeholder,
  address = '',
  lat = 0,
  long = 0,
  onSelectAddress,
  clearAddress,
  readonly,
  isDrop,
}) {
  const [openMapClick, setOpenMapClick] = useState(false);
  return (
    <View style={{width: '75%', paddingLeft: 12}}>
      <Text style={styles.title}>{label}</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            width: '100%',
            zIndex: 100,
          }}
          onPress={() => {
            setOpenMapClick(true);
          }}
          disabled={readonly}>
          <View style={{height: 30, width: '100%'}} pointerEvents="none">
            <TextInput
              value={address.length ? address.substring(0, 27) + '...' : ''}
              numberOfLines={1}
              placeholder={placeholder}
              placeholderTextColor={colors.gray400}
              isError=""
              underlineColorAndroid="transparent"
              style={styles.tiStyle}
              inputStyles={styles.tiInputStyles}
              disabled={true}
            />
          </View>
        </TouchableOpacity>
        {!readonly && (
          <TouchableOpacity onPress={clearAddress}>
            <Icon
              name="close-outline"
              size={moderateScale(16)}
              color={colors.Gainsboro}
              style={{position: 'absolute', right: 0}}
            />
          </TouchableOpacity>
        )}
      </View>
      {openMapClick && (
        <MapComponent
          defaultLocation={{
            address: address,
            latitude: lat,
            longitude: long,
          }}
          onSelectedAddress={selectedLocation => {
            setOpenMapClick(false);
            onSelectAddress(selectedLocation);
          }}
          isDrop={isDrop}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  verticalLine: {
    height: heightScale(13),
    borderColor: colors.Black1,
    width: moderateScale(1),
    borderWidth: moderateScale(0.5),
    marginLeft: widthScale(5),
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
  title: {
    fontSize: normalize(12),
    fontWeight: '400',
    fontFamily: fonts.calibri.medium,
    color: colors.Gray,
  },
  tiInputStyles: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    fontSize: normalize(13),
    lineHeight: normalize(16),
    color: colors.DarkGray,
  },
  tiStyle: {
    width: '100%',
    borderBottomWidth: widthScale(0),
  },
});

export default PickAddress;
