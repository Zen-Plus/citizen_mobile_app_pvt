/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import {Context} from '../../../../providers/localization';
import Icon from 'react-native-vector-icons/EvilIcons';
import {
  capitalizeFirstLetter,
  openContact,
} from '../../../../components/functions';
import {eventListingTabs} from '../../../../utils/constants';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const TripDetails = ({alternateNumber, eventDetailsData, supportNumber}) => {
  const strings = React.useContext(Context).getStrings();
  const {events, myTrips} = strings;

  const renderItem = ({item}) => {
    return (
      <View style={styles.vehicleView}>
        <View style={styles.firstColoumnView}>
          <Text
            style={
              styles.vehicleText
            }>{` ${item?.vehicleRegistrationNumber}`}</Text>
        </View>
        <View style={styles.secoundColoumnView}>
          <Text style={styles.alsText}>{item?.vehicleType}</Text>
        </View>

        <View style={styles.thirdColoumnView}>
          <IconIonicons
            name="call-outline"
            size={moderateScale(15)}
            style={styles.phoneIcon}
            color={colors.black}
            onPress={() => openContact(item?.driverMobileNumber)}
          />
          <Text style={styles.mobileNoText}>
            {item?.driverMobileNumber
              ?.split('')
              ?.map((element, item) => (item >= 6 ? 'X' : element))
              ?.join('')}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.mainView}>
      <View style={styles.firstView}>
        <View style={styles.row}>
          <View style={[styles.row1, {alignItems: 'center'}]}>
            <FontAwesome5
              name="route"
              size={moderateScale(20)}
              style={{color: colors.Black1}}
            />
            <Text style={styles.tripDetailsText}>
              {strings.TripDetails.TripDetails}
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.bookedByRow}>
            <Text style={styles.providerNameText}>
              {strings.TripDetails.Provider}
            </Text>
            <Text style={styles.providerNameValue}>
              {eventDetailsData?.eventVehicleAssignedList[0]?.vendorName}
            </Text>
          </View>
        </View>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={styles.vendorView}>
            <Text style={styles.driverTitle}>{events.customerCareAgent}</Text>
            <Text style={styles.vendorName}>
              {capitalizeFirstLetter(eventDetailsData?.eventContactName)}
            </Text>
          </View>
          {eventDetailsData?.status?.id === eventListingTabs.ONGOING ? (
            <View style={{marginRight: widthScale(10)}}>
              <View style={styles.driverView}>
                <IconIonicons
                  name="call"
                  size={moderateScale(20)}
                  style={styles.phoneIcon}
                  color={colors.grassGreen}
                  onPress={() => openContact(supportNumber)}
                />
                <Entypo
                  name="message"
                  size={moderateScale(20)}
                  style={styles.chatIcon}
                  color={colors.mediumLightGray}
                />
              </View>
            </View>
          ) : null}
        </View>
        <View style={styles.seperator} />
        <View style={styles.locationsView}>
          <Icon
            name={'location'}
            size={moderateScale(15)}
            style={styles.money}
          />
          <Text style={styles.LocationText}>{events.location}</Text>
        </View>
        <Text style={styles.eventLocationText}>
          {` ${eventDetailsData?.eventLocation?.address}`}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: widthScale(10),
            marginTop: heightScale(8),
          }}>
          <View>
            <Text style={styles.ambyTypeText}>{myTrips.AmbyType}</Text>
            <Text style={styles.ambyInputText}>
              {eventDetailsData?.vehicleType}
            </Text>
          </View>
          <View>
            <Text style={styles.ambyTypeText}>{myTrips.AmbyNo}</Text>
            <Text style={styles.ambyInputText}>
              {' '}
              {eventDetailsData?.vehicleCount}
            </Text>
          </View>
        </View>
        <View style={styles.ambulanceAssignedView}>
          <Text style={styles.ambulanceAssignedText}>
            {events.ambulanceAssigned}
          </Text>
        </View>
        {eventDetailsData?.eventVehicleAssignedList.length > 0 ? (
          <View
            contentContainerStyle={styles.contentContainerStyle}
            style={styles.containerStyle}>
            {eventDetailsData?.eventVehicleAssignedList?.map(item => {
              return renderItem({item});
            })}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    borderRadius: moderateScale(5),
  },
  row: {
    flexDirection: 'row',
  },
  bookedByRow: {
    marginTop: heightScale(14),
  },
  firstView: {
    marginTop: heightScale(14),
    paddingHorizontal: widthScale(12),
  },
  bookedByText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    marginLeft: widthScale(10),
    color: colors.Black1,
  },
  status: {
    fontSize: normalize(12),
    color: colors.lightGreyish2,
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
  },
  vendorName: {
    fontSize: normalize(11),
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    color: colors.justBlack,
  },
  alternateNumberText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    color: colors.mediumLightGray,
  },
  phoneNumber: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    color: colors.grayWhite5,
  },
  phoneIcon: {
    marginLeft: widthScale(10),
  },
  chatIcon: {
    marginLeft: widthScale(10),
  },
  vendorView: {
    marginTop: heightScale(7),
    justifyContent: 'center',
    width: '40%',
    marginRight: widthScale(10),
  },
  seperator: {
    marginTop: heightScale(26),
    marginBottom: heightScale(8),
    borderBottomColor: colors.mediumLightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  secondView: {
    marginTop: heightScale(9),
    paddingHorizontal: widthScale(12),
    marginBottom: heightScale(13),
  },
  secondViewTitle: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.mediumLightGray,
  },
  secondViewValue: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.BlackDark,
  },
  providerNameText: {
    marginTop: heightScale(3),
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    color: colors.mediumLightGray,
  },
  providerNameValue: {
    marginTop: heightScale(3),
    fontSize: normalize(11),
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    color: colors.black,
  },
  driverTitle: {
    color: colors.mediumLightGray,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    marginTop: heightScale(5),
  },
  driverView: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
  },
  ambyView: {
    borderWidth: moderateScale(1),
    borderColor: colors.grayWhite,
    padding: widthScale(9),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thirdView: {
    paddingHorizontal: heightScale(13),
    marginBottom: heightScale(15),
    flex: 1,
  },
  row1: {
    flexDirection: 'row',
  },
  tripDetailsText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    marginLeft: widthScale(10),
    color: colors.Black1,
  },
  liveTrackingButton: {
    height: moderateScale(22),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(3),
    borderColor: colors.grayWhite,
  },
  trackText: {
    color: colors.justBlack,
    fontWeight: '400',
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    marginLeft: widthScale(6),
    marginRight: widthScale(6),
  },
  fourthView: {
    paddingHorizontal: widthScale(12),
    flexDirection: 'row',
    marginBottom: heightScale(10),
  },
  dropView: {
    marginLeft: widthScale(6),
  },
  pickupDetailsText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    color: colors.BlackDark,
    marginBottom: heightScale(9),
  },
  dropDetailsView: {
    marginLeft: widthScale(13),
    marginRight: widthScale(50),
  },
  pickupDropView: {
    borderWidth: moderateScale(1),
    borderColor: colors.grayWhite,
    padding: widthScale(9),
    flexDirection: 'column',
    width: '100%',
  },
  verticalLine: {
    height: heightScale(13),
    borderColor: colors.Black1,
    width: moderateScale(1),
    borderWidth: moderateScale(0.5),
    marginLeft: widthScale(5),
    flex: 1,
  },
  squareBox: {
    marginLeft: widthScale(3),
    color: colors.Black1,
  },
  pickupText: {
    color: colors.mediumLightGray,
    fontWeight: '600',
    fontFamily: fonts.calibri.medium,
    marginBottom: heightScale(9),
    fontSize: normalize(10),
    flex: 1,
  },
  dropText: {
    color: colors.BlackDark,
    fontWeight: '600',
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(10),
  },
  dropDetailsText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    color: colors.BlackDark,
  },
  totalDistanceText: {
    marginTop: heightScale(10),
    color: colors.Black1,
    fontWeight: '600',
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    textDecorationLine: 'underline',
    marginLeft: widthScale(60),
  },
  locationsView: {
    flexDirection: 'row',
    marginTop: heightScale(10),
    width: '100%',
  },
  eventLocationText: {
    fontFamily: fonts.calibri.bold,
    fontWeight: '600',
    fontSize: normalize(11),
    color: colors.black,
    marginLeft: widthScale(3),
    width: '85%',
    marginTop: heightScale(5),
  },
  LocationText: {
    fontFamily: fonts.calibri.bold,
    fontWeight: '600',
    fontSize: normalize(11),
    color: colors.mediumLightGray,
  },
  money: {
    marginTop: heightScale(1),
    justifyContent: 'center',
    color: colors.justBlack,
  },
  ambyTypeText: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.mediumLightGray,
  },
  ambyInputText: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.black,
  },
  ambulanceAssignedView: {
    marginTop: heightScale(10),
  },
  ambulanceAssignedText: {
    fontFamily: fonts.calibri.bold,
    fontWeight: '700',
    fontSize: normalize(12),
    color: colors.black,
  },
  containerStyle: {
    borderWidth: 0.5,
    borderColor: colors.gray400,
    borderRadius: moderateScale(3),
    marginTop: heightScale(10),
    backgroundColor: colors.white,
    marginBottom: heightScale(10),
  },
  vehicleText: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.BlackDark,
  },
  vehicleView: {
    marginLeft: widthScale(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mobileNoText: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.BlackDark,
    marginLeft: widthScale(5),
  },
  alsText: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.BlackDark,
    marginLeft: widthScale(15),
  },
  firstColoumnView: {
    paddingVertical: heightScale(5),
    borderRightWidth: 0.5,
    paddingHorizontal: widthScale(5),
    width: widthScale(80),
    borderRightColor: colors.grey,
  },
  secoundColoumnView: {
    paddingVertical: heightScale(5),
    borderRightWidth: 0.5,
    paddingHorizontal: widthScale(5),
    width: widthScale(60),
    borderRightColor: colors.grey,
  },
  thirdColoumnView: {
    paddingVertical: heightScale(5),
    paddingHorizontal: widthScale(5),
    width: '100%',
    flexDirection: 'row',
  },
});
export default TripDetails;
