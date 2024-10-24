import React, {useContext, useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors, scaling, fonts} from '../library';
import {Context} from '../providers/localization';
import {ChatDots, FeatherIcons, Star} from '../../assets';
import {RNImage} from './image';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const DriverDetails = props => {
  const strings = useContext(Context).getStrings();
  const {driverDetails, TripDetails} = strings;

  const {
    details,
    image1,
    image2,
    onPressViewTripDetails,
    onPressChat,
    navigation,
    requestType,
  } = props;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerSubContainer}>
          <Text style={styles.labelText}>{strings.LiveTracking[requestType]?.ambOrDoc}</Text>
          <Text style={styles.valueText}>{details?.type || 'NA'}</Text>
        </View>
        <View style={styles.diffLine} />
        <View style={styles.headerSubContainer}>
          <Text style={styles.labelText}>{driverDetails.paymentMode}</Text>
          <Text style={styles.valueText}>{details?.paymentMode || 'NA'}</Text>
        </View>
        <View style={styles.diffLine} />
        <View style={styles.headerSubContainer}>
          <Text style={styles.labelText}>{driverDetails.otp}</Text>
          <Text style={styles.valueText}>{details?.otp || 'NA'}</Text>
        </View>
      </View>
      <View style={styles.bodyContainer}>
        <View style={[styles.row, {width: '64%'}]}>
          <View>
            <View style={styles.row}>
              <View style={styles.image1Container}>
                <Image
                  source={image1}
                  style={{height: heightScale(55), width: widthScale(55)}}
                  resizeMode={'contain'}
                />
              </View>
              <View style={styles.image2Container}>
                {details?.documentUuid ? (
                  <RNImage
                    uuid={details?.documentUuid}
                    style={{
                      height: normalize(45),
                      width: normalize(45),
                      borderRadius: normalize(90),
                      borderWidth: 1,
                      borderColor: colors.white,
                    }}
                  />
                ) : (
                  <Image
                    source={image2}
                    style={{height: heightScale(45), width: widthScale(45)}}
                    resizeMode={'contain'}
                  />
                )}
              </View>
            </View>
            {!!details?.customerRating && (
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: heightScale(2), alignSelf: 'center'}}>
                <Image
                  style={{width: widthScale(16), height: heightScale(16)}}
                  source={Star}
                />
                <Text
                  style={{
                    color: colors.DarkGray,
                    includeFontPadding: false,
                    textAlignVertical: 'center',
                    marginLeft: widthScale(2),
                    fontSize: normalize(14),
                    fontFamily: fonts.calibri.medium,
                  }}
                >
                  {details?.customerRating}
                </Text>
              </View>
            )}
          </View>
          <View style={{marginLeft: widthScale(4), width: '51%'}}>
            <Text style={styles.vehicleRegistrationNumberText}>
              {details?.vehicleRegistrationNumber || 'NA'}
            </Text>
            <Text style={styles.driverNameAndJobNumberText}>
              {details?.driverName || 'NA'}
            </Text>
            <Text style={styles.driverNameAndJobNumberText}>
              {details?.jobNumber || 'NA'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onPressViewTripDetails} activeOpacity={0.8}>
          <Text style={styles.viewTripDetailsText}>
            {driverDetails.viewTripDetails}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={onPressChat}
        style={styles.chatContainer}
        activeOpacity={0.8}>
        <View style={styles.chatBody}>
          <View style={[styles.row, {alignItems: 'center'}]}>
            <View style={styles.chatIconsContainer}>
              <Image
                source={ChatDots}
                style={{height: heightScale(22), width: widthScale(22)}}
              />
            </View>
            <View style={{marginLeft: widthScale(5)}}>
              <Text style={styles.chatText}>{TripDetails.sendMessage}</Text>
            </View>
          </View>
          <View style={styles.chatIconsContainer}>
            <Image
              source={FeatherIcons}
              style={{height: heightScale(22), width: widthScale(22)}}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  headerSubContainer: {
    alignItems: 'center',
  },
  diffLine: {
    height: '100%',
    borderLeftWidth: widthScale(1),
    borderLeftColor: colors.gray400,
  },
  labelText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    color: colors.Charcoal2,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  valueText: {
    fontSize: normalize(16),
    fontFamily: fonts.calibri.semiBold,
    color: colors.DarkGray,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  bodyContainer: {
    flexDirection: 'row',
    marginTop: heightScale(16),
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  image1Container: {
    height: heightScale(60),
    width: widthScale(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  image2Container: {
    height: heightScale(50),
    width: widthScale(50),
    marginLeft: widthScale(-16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleRegistrationNumberText: {
    fontSize: normalize(16),
    fontFamily: fonts.calibri.medium,
    color: colors.black,
  },
  driverNameAndJobNumberText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    color: colors.DimGray3,
  },
  viewTripDetailsText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.semiBold,
    color: colors.primary,
  },
  chatContainer: {
    marginTop: heightScale(14),
    backgroundColor: colors.white,
    borderRadius: moderateScale(100),
    elevation: normalize(4),
    shadowColor: colors.gray700,
    shadowOffset: {width: 0, height: heightScale(2)},
    shadowOpacity: normalize(2),
    shadowRadius: normalize(2),
  },
  chatBody: {
    paddingHorizontal: widthScale(15),
    paddingVertical: heightScale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatIconsContainer: {
    height: heightScale(25),
    width: widthScale(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatText: {
    fontSize: normalize(13),
    fontFamily: fonts.calibri.regular,
    color: colors.DarkGray,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

export default DriverDetails;
