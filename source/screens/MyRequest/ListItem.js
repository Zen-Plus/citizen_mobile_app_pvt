import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import moment from 'moment';
import {colors, scaling, fonts} from '../../library';
import {
  renderRequestStatus,
  isRequestStatusCancelled,
  getVehicleIcon,
} from '../../components/functions';
import {Context} from '../../providers/localization';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const ListItem = props => {
  const strings = React.useContext(Context).getStrings();
  const {item} = props;

  const getDateAndTime = () => {
    if (item?.leadCreatedAt) {
      return moment(item.leadCreatedAt).format('ddd, D MMM, h:mm A');
    } else if (item?.jobCreatedAt) {
      return moment(item.jobCreatedAt).format('ddd, D MMM, h:mm A');
    } else if (item?.srCreatedAt) {
      return moment(item.srCreatedAt).format('ddd, D MMM, h:mm A');
    } else {
      return strings.common.na;
    }
  };

  return (
    <View style={{paddingHorizontal: widthScale(16)}}>
      <View style={styles.container}>
        {item?.isCorporateRequest && (
          <View style={{marginBottom: heightScale(5)}}>
            <Text style={styles.corporateText}>{strings.homeScreen.corporate}</Text>
          </View>
        )}
        <View style={styles.headerContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={(leadIntegrationDetails?.requestType && leadIntegrationDetails?.vehicleType?.id)
                ? getVehicleIcon(leadIntegrationDetails?.requestType, leadIntegrationDetails?.vehicleType?.id)
                : getVehicleIcon(item?.requestType?.id, item?.vehicleType)
              }
              style={styles.imageStyle}
              resizeMode="contain"
            />
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text
              style={[
                styles.statusText,
                isRequestStatusCancelled(item) && {color: colors.Red},
              ]}>
              {renderRequestStatus(item)}
            </Text>
            <Text
              style={[
                styles.amountText,
                isRequestStatusCancelled(item) && {color: colors.Red},
              ]}>
              {'\u20B9'} {item.totalFare}
            </Text>
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <View>
            <Text style={styles.dateAndTimeText}>{getDateAndTime()}</Text>
          </View>
          <Text style={styles.bodyDetailsText}>
            {`${item?.vehicleTypeObj?.name || strings.common.na}  |  ${
              item?.leadNumber || item?.jobNumber || item?.srNumber
            }`}
          </Text>
        </View>
        <View style={styles.diffView} />
        <View style={styles.footerContainer}>
          <View style={styles.pickupAndDropContainer}>
            <View style={styles.redDot} />
            <View>
              <Text style={styles.pickupAndDropText} numberOfLines={1}>
              {`${leadIntegrationDetails?.incidentAddress 
                ? leadIntegrationDetails?.incidentAddress 
                : `${item?.pickupLocation?.address}${item?.pickupLocation?.flat ? `, 
                ${item?.pickupLocation?.flat}` : ''}${item?.pickupLocation?.landmark ? `, ${item?.pickupLocation?.landmark}` : ''}`
              }`}
              </Text>
            </View>
          </View>
          {!!item?.dropLocation?.address && (
            <>
              <View style={styles.dottedLine} />
              <View
                style={[
                  styles.pickupAndDropContainer,
                  {marginTop: heightScale(7)},
                ]}>
                <View style={styles.blueDot} />
                <View>
                  <Text style={styles.pickupAndDropText} numberOfLines={1}>
                  {`${leadIntegrationDetails?.dropAddress 
                ? leadIntegrationDetails?.dropAddress 
                : `${item?.dropLocation?.address}${item?.dropLocation?.flat ? `, 
                ${item?.dropLocation?.flat}` : ''}${item?.dropLocation?.landmark ? `, ${item?.dropLocation?.landmark}` : ''}`
              }`}
                  </Text>
                </View>
              </View>
            </>
          )}
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
    shadowColor: colors.gray700,
    shadowOffset: {width: 0, height: heightScale(5)},
    shadowOpacity: normalize(5),
    shadowRadius: normalize(5),
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
  footerContainer: {},
  redDot: {
    width: widthScale(7),
    height: heightScale(7),
    borderRadius: moderateScale(100),
    backgroundColor: colors.Red,
    marginRight: widthScale(10),
  },
  blueDot: {
    width: widthScale(7),
    height: heightScale(7),
    borderRadius: moderateScale(100),
    backgroundColor: colors.primary,
    marginRight: widthScale(10),
  },
  pickupAndDropContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthScale(6),
  },
  pickupAndDropText: {
    fontSize: normalize(13),
    fontFamily: fonts.calibri.regular,
    color: colors.DimGray2,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  dottedLine: {
    position: 'absolute',
    top: heightScale(15),
    borderLeftWidth: widthScale(1),
    height: heightScale(12),
    left: widthScale(8.6),
    borderStyle: 'dotted',
  },
  dateAndTimeText: {
    fontSize: normalize(16),
    fontFamily: fonts.calibri.semiBold,
    color: colors.DarkGray,
  },
  corporateText: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.semiBold,
    color: colors.primary,
  },
});

export default ListItem;
