import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Context} from '../../../providers/localization';
import {colors, scaling, fonts} from '../../../library';
import {
  icNearbyHospital as _icNearbyHospital,
  nearbyBlood as _nearbyBlood,
} from '../../../../assets';

const {normalize, widthScale, heightScale} = scaling;

const Card = props => {
  const strings = React.useContext(Context).getStrings();
  const {nearBy} = strings;

  return (
    <View style={[styles.row, styles.container]}>
      <View style={{}}>
        {props.value == 2 ? (
          <View style={styles.iconView}>
            <Image
              source={_nearbyBlood}
              style={{
                height: heightScale(36),
                width: widthScale(36),
              }}
              resizeMode='contain'
            />
          </View>
        ) : (
          <View style={styles.iconView}>
            <Image
              source={_icNearbyHospital}
              style={{
                height: heightScale(36),
                width: widthScale(36),
              }}
              resizeMode='contain'
            />
          </View>
        )}
      </View>

      <View style={{flex: 1, marginLeft: widthScale(8)}}>
        <View>
          <Text style={styles.valueTextStyle}>{props.name}</Text>
        </View>
        <View style={styles.addressView}>
          <Text style={styles.addressTextStyle}>{props.address}</Text>
        </View>
        {props.distance ? (
          <View style={[{marginTop: heightScale(8)}]}>
            <View>
              <Text style={styles.addressTextStyle}>{`${(
                props.distance / 1000
              ).toFixed(2)} ${nearBy.km} `}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: heightScale(12),
    paddingHorizontal: widthScale(12),
    backgroundColor: colors.white,
    elevation: normalize(5),
    shadowOffset: {width: -2, height: 4},
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.2,
    shadowRadius: normalize(3),
    borderRadius: normalize(3),
  },
  row: {
    flexDirection: 'row',
  },
  keyTextStyle: {
    color: colors.greyishBrownTwo,
    fontSize: normalize(13),
    fontFamily: fonts.calibri.regular,
  },
  valueTextStyle: {
    color: colors.Black1,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.semiBold,
    fontWeight: '600',
  },
  addressTextStyle: {
    color: colors.DimGray2,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
  },
  bloodView: {
    height: 18,
    width: 18,
    backgroundColor: colors.lightRed5,
    borderRadius: 10,
    marginTop: heightScale(2),
  },
  hospitalView: {
    height: 18,
    width: 18,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginTop: heightScale(2),
  },
  iconView: {
    height: heightScale(40),
    width: widthScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bllodIcon: {
    color: colors.white,
    textAlign: 'center',
    marginTop: heightScale(1),
  },
  hospitalIcon: {
    color: colors.white,
    textAlign: 'center',
    marginTop: heightScale(1),
  },
});

export default Card;
