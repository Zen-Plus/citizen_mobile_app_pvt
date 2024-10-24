import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import {Context} from '../../../../providers/localization';
import {profilePlaceholder, FeatherIcons} from '../../../../../assets';
import {RNImage} from '../../../../components';
import {getVehicleIcon} from '../../../../components/functions';
import {requestTypeConstant} from '../../../../utils/constants';

const {normalize, widthScale, heightScale} = scaling;

const DriverDetails = ({
  myRequestDetailsData,
  navigation,
  jobNumber,
  jobId,
  chatCount,
  requestType
}) => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails} = strings;
  const OTP = myRequestDetailsData?.otp
    ? myRequestDetailsData?.otp?.toString().split('')
    : null;

  console.log('chatCount...', chatCount);

  return (
    <View style={styles.mainView}>
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <View style={{marginRight: widthScale(10), width: '60%'}}>
          <Text style={styles.vehicleNumber}>
            {myRequestDetailsData?.vehicleRegistrationNumber}
          </Text>
          <Text style={styles.driverName}>
            {(myRequestDetailsData?.requestType?.id === requestTypeConstant.airAmbulance) ? myRequestDetailsData?.flightName : myRequestDetailsData?.driverName}
          </Text>
          <Text style={styles.vehicleType}>
            {myRequestDetailsData?.vehicleTypeData?.vehicleName}
          </Text>
        </View>
        <View style={styles.row}>
          <Image
            source={getVehicleIcon(myRequestDetailsData?.requestType?.id, myRequestDetailsData?.vehicleType)}
            style={{
              width: normalize(60),
              height: normalize(60),
              borderWidth: normalize(2),
              borderColor: colors.white,
              borderRadius: normalize(50),
            }}
          />
          {(myRequestDetailsData?.requestType?.id !== requestTypeConstant.airAmbulance) && (
            <>
              {myRequestDetailsData?.document?.documentUuid ? (
                <RNImage
                  uuid={myRequestDetailsData?.document?.documentUuid}
                  style={styles.profileImage}
                />
              ) : (
                <Image source={profilePlaceholder} style={styles.profileImage} />
              )}
            </>
          )}
        </View>
      </View>
      {myRequestDetailsData?.otp &&
      (myRequestDetailsData?.tripStatus?.id === 'DISPATCH' ||
        myRequestDetailsData?.tripStatus?.id === 'JOB_START') ? (
        <View style={styles.otpView}>
          <Text style={styles.otpTextStyle}>{TripDetails.tripOTP}</Text>
          {OTP?.map(item => (
            <View style={styles.otpTextBox}>
              <Text style={styles.otpText}>{item}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {myRequestDetailsData?.tripStatus?.id === 'DISPATCH' ||
      myRequestDetailsData?.tripStatus?.id === 'JOB_START' ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ChatScreen', {
              tripId: jobNumber,
              jobId: jobId,
              navigation: navigation,
            })
          }>
          <View style={styles.chat}>
            <Text style={styles.chatText}>{TripDetails.sendMessage}</Text>
            <Image
              source={FeatherIcons}
              style={{height: heightScale(22), width: widthScale(22)}}
            />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    paddingHorizontal: widthScale(22),
    backgroundColor: colors.primary,
    paddingVertical: heightScale(20),
  },
  vehicleNumber: {
    color: colors.white,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(18),
  },
  driverName: {
    color: colors.LightSlateGray,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(16),
  },
  vehicleType: {
    color: colors.LightSlateGray,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(13),
  },
  row: {
    flexDirection: 'row',
  },
  otpTextBox: {
    backgroundColor: colors.PaleBlue,
    borderRadius: normalize(20),
    marginHorizontal: widthScale(4),
    height: normalize(24),
    width: normalize(24),
    padding: normalize(3),
    alignItems: 'center',
  },
  otpTextStyle: {
    color: colors.white,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(14),
    marginRight: widthScale(8),
  },
  otpText: {
    color: colors.primary,
    fontFamily: fonts.calibri.semiBold,
    fontSize: normalize(12),
  },
  otpView: {
    marginTop: heightScale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  chat: {
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(18),
    paddingVertical: heightScale(8),
    borderRadius: normalize(20),
    marginTop: heightScale(18),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatText: {
    color: colors.DarkGray,
    fontSize: normalize(13),
    fontFamily: fonts.calibri.medium,
  },
  sendIcon: {
    transform: [{rotateZ: '315deg'}],
    marginBottom: heightScale(0),
  },
  profileImage: {
    width: normalize(60),
    height: normalize(60),
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: normalize(50),
    position: 'relative',
    right: widthScale(12),
  },
});
export default DriverDetails;
