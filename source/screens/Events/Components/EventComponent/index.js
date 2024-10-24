import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import moment from 'moment';
import {colors, scaling, fonts} from '../../../../library';
import {Context} from '../../../../providers/localization';
import {
  isRequestStatusCancelled,
} from '../../../../components/functions';
import {TripDetailsImage} from '../../../../utils/constants';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const EventComponent = props => {
  const strings = React.useContext(Context).getStrings();

  const {item, index} = props;

  const getDateAndTime = () => {
    if (item?.createdAt) {
      return moment(item.createdAt).format('ddd, D MMM, h:mm A');
    } else if (item?.srCreatedAt) {
      return moment(item.srCreatedAt).format('ddd, D MMM, h:mm A');
    } else {
      return strings.common.na;
    }
  };
  const vehicleType = item?.vehicleType
    ? item?.vehicleType?.toString().split(',')
    : null;
  const vehicleTypeValue = item?.vehicleTypeValue
    ? item?.vehicleTypeValue?.toString().split(',')
    : null;
  return (
    <View style={{paddingHorizontal: widthScale(16)}}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.imageContainer}>
            {vehicleType ? (
              <Image
                source={TripDetailsImage[vehicleType[0]]}
                style={styles.imageStyle}
                resizeMode="contain"
              />
            ) : null}
          </View>

          <View style={{alignItems: 'flex-end'}}>
            <Text
              style={[
                styles.statusText,
                isRequestStatusCancelled(item) && {color: colors.Red},
              ]}>
              {item?.status?.id === 'CANCELLED' && !item?.vendorNumber
                ? strings.ambulanceAction.OPENCANCELLED
                : strings.ambulanceAction[item?.status?.id]}
            </Text>
            <Text
              style={[
                styles.amountText,
                isRequestStatusCancelled(item) && {color: colors.Red},
              ]}>
              {'\u20B9'} {item.totalAmount ? item.totalAmount?.toFixed(2) : 0}
            </Text>
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <View>
            <Text style={styles.dateAndTimeText}>{getDateAndTime()}</Text>
          </View>
          <Text style={styles.bodyDetailsText}>
            {vehicleTypeValue ? vehicleTypeValue[0] : strings.common.na}
            {item?.vehicleCount > 1 ? `, +${item?.vehicleCount - 1}` : null}
            {` |  ${item?.eventNumber || item?.srNumber || item?.jobNumber}`}
          </Text>
        </View>
        <View style={styles.diffView} />
        <View style={styles.footerContainer}>
          <View style={styles.redDot} />
          <Text style={styles.pickupAndDropText} numberOfLines={1}>
            {`${
              item?.eventLocation?.address
                ? `${item?.eventLocation?.address}`
                : strings.common.na
            }${
              item?.eventLocation?.flat ? `, ${item?.eventLocation?.flat}` : ''
            }${
              item?.eventLocation?.landmark
                ? `, ${item?.eventLocation?.landmark}`
                : ''
            }`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: heightScale(10),
    paddingVertical: heightScale(8),
    paddingHorizontal: widthScale(12),
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    elevation: normalize(5),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    height: heightScale(45),
    width: widthScale(45),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    height: heightScale(40),
    width: widthScale(40),
  },
  statusText: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.medium,
    color: colors.primary,
  },
  amountText: {
    fontSize: normalize(16),
    fontFamily: fonts.calibri.semiBold,
    color: colors.primary,
  },
  bodyContainer: {
    marginTop: heightScale(5),
  },
  bodyDetailsText: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.DarkGray,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  diffView: {
    marginVertical: heightScale(8),
    borderTopColor: colors.LightGrey7,
    borderTopWidth: widthScale(1),
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthScale(6),
  },
  redDot: {
    width: widthScale(7),
    height: heightScale(7),
    borderRadius: moderateScale(100),
    backgroundColor: colors.Red,
    marginRight: widthScale(10),
  },

  pickupAndDropText: {
    fontSize: normalize(13),
    fontFamily: fonts.calibri.regular,
    color: colors.DimGray2,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },

  dateAndTimeText: {
    fontSize: normalize(16),
    fontFamily: fonts.calibri.semiBold,
    color: colors.DarkGray,
  },
});

export default EventComponent;
