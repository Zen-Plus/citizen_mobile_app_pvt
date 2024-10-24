import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import {Context} from '../../../../providers/localization';
import {
  iconName,
  serviceRequestStatus,
  requestTypeConstant,
} from '../../../../utils/constants';
import {openContact} from '../../../../components/functions';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const AmbulanceDetails = ({
  providerName,
  driverName,
  alternateNumber,
  ambyNo,
  ambyModal,
  ambyType,
  otp,
  pickupValue,
  dropValue,
  totalDistance,
  navigation,
  tripDetailsData,
  doctor,
}) => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails, myTrips, requestHeading} = strings;
  const OTP = otp ? otp?.toString().split('') : null;
  return (
    <View style={styles.mainView}>
      <View style={styles.firstView}>
        <View style={styles.row}>
          <View style={styles.bookedByRow}>
            <FontAwesome5
              name={
                iconName?.AmbulanceDetails[tripDetailsData?.requestType?.id]
              }
              size={moderateScale(18)}
              style={{color: colors.Black1}}
            />
            <Text style={styles.bookedByText}>
              {
                requestHeading[tripDetailsData?.requestType?.id]
                  ?.AmbulanceDetails
              }
            </Text>
          </View>
        </View>
        {otp ? (
          <View style={{marginTop: heightScale(14)}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.tripOTPText}>{TripDetails.tripOTP}</Text>
              <View style={{flexDirection: 'row', marginLeft: widthScale(5)}}>
                {OTP.map(item => (
                  <View style={styles.otpTextBox}>
                    <Text style={styles.otpText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : null}
        {tripDetailsData?.requestType?.id ===
        requestTypeConstant.doctorAtHome ? null : (
          <View style={{marginTop: heightScale(14)}}>
            <View style={styles.vendorView}>
              <Text style={styles.driverTitle}>{TripDetails.Provider}</Text>
              <Text style={styles.vendorName}>
                {providerName ? providerName : strings.common.na}
              </Text>
            </View>
          </View>
        )}

        <View
          style={[
            styles.row,
            {marginTop: heightScale(14), marginBottom: heightScale(9)},
          ]}>
          <View style={styles.vendorView}>
            {tripDetailsData?.clientResource?.clientName ? (
              <View>
                <Text style={styles.driverTitle}>{myTrips.client}</Text>
                <Text
                  style={[styles.vendorName, {marginBottom: heightScale(14)}]}>
                  {tripDetailsData?.clientResource?.clientName}
                </Text>
              </View>
            ) : null}
            <Text style={styles.driverTitle}>
              {requestHeading[tripDetailsData?.requestType?.id]?.driver}
            </Text>
            <Text style={styles.vendorName}>
              {driverName ? driverName : strings.common.na}
            </Text>
          </View>

          <View>
            <View style={styles.driverView}>
              {tripDetailsData?.srStatus ===
              serviceRequestStatus?.CLOSE ? null : alternateNumber ? (
                <>
                  <IconIonicons
                    name="call"
                    size={moderateScale(20)}
                    style={styles.phoneIcon}
                    color={colors.grassGreen}
                    onPress={() => openContact(alternateNumber)}
                  />
                  <Entypo
                    name="message"
                    size={moderateScale(20)}
                    style={styles.chatIcon}
                    color={colors.tripGray}
                  />
                </>
              ) : null}
            </View>
          </View>
        </View>
      </View>
      {ambyNo && ambyModal && ambyType ? (
        <View style={styles.secondView}>
          <View style={styles.ambyView}>
            <View>
              <Text style={styles.secondViewTitle}>
                {requestHeading[tripDetailsData?.requestType?.id]?.AmbyNo}
              </Text>
              <Text style={styles.secondViewValue}>{ambyNo}</Text>
            </View>
            {tripDetailsData?.requestType?.id !==
            requestTypeConstant.doctorAtHome ? (
              <View>
                <Text style={styles.secondViewTitle}>{myTrips.AmbyModal}</Text>
                <Text style={styles.secondViewValue}>{ambyModal}</Text>
              </View>
            ) : null}

            <View>
              <Text style={styles.secondViewTitle}>
                {requestHeading[tripDetailsData?.requestType?.id].AmbyType}
              </Text>
              <Text style={styles.secondViewValue}>{ambyType}</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.white,
    width: '100%',
    borderRadius: moderateScale(5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookedByRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  tripOTPText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    color: colors.Black1,
  },
  otpText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    color: colors.white,
  },
  otpTextBox: {
    backgroundColor: colors.primary,
    height: heightScale(20),
    width: widthScale(18),
    marginLeft: widthScale(3),
    alignItems: 'center',
    justifyContent: 'center',
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
    color: colors.Black1,
  },
  alternateNumberText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    color: colors.tripGray,
  },
  phoneNumber: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    color: colors.justBlack,
  },
  phoneIcon: {
    marginLeft: widthScale(10),
  },
  chatIcon: {
    marginLeft: widthScale(10),
  },
  vendorView: {
    justifyContent: 'center',
  },
  seperator: {
    marginTop: heightScale(26),
    borderBottomColor: colors.grayWhite3,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  secondView: {
    paddingHorizontal: widthScale(12),
    marginBottom: heightScale(13),
  },
  secondViewTitle: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.gray700,
  },
  secondViewValue: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.justBlack,
  },
  providerNameText: {
    marginTop: heightScale(3),
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    color: colors.Black1,
    textAlign: 'center',
  },
  providerNameValue: {
    marginTop: heightScale(3),
    marginLeft: widthScale(6),
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    color: colors.gray700,
    textAlign: 'center',
  },
  driverTitle: {
    color: colors.gray700,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
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
    color: colors.Gainsboro,
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
    color: colors.tripGray,
    fontWeight: '600',
    fontFamily: fonts.calibri.medium,
    marginBottom: heightScale(9),
    fontSize: normalize(10),
    flex: 1,
  },
  dropText: {
    color: colors.tripGray,
    fontWeight: '600',
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(10),
  },
  dropDetailsText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    color: colors.Gainsboro,
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
});
export default AmbulanceDetails;
