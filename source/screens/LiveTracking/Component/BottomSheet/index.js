import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {scaling, colors, fonts} from '../../../../library';
import {Context} from '../../../../providers/localization';
import DottedVertical from '../../../BookingFlow/DottedVerticalLine';
import PickAddress from '../../../BookingFlow/PickAddress';
import DriverDetails from '../../../../components/DriverDetails';
import {navigations} from '../../../../constants';
import {profilePlaceholder} from '../../../../../assets';
import {getVehicleIcon} from '../../../../components/functions';
import CustomButton from '../../../../components/CustomButton';
import Feather from 'react-native-vector-icons/Feather';
import {openContact} from '../../../../components/functions';
import CancelTrip from '../../../MyrequestDetails/Components/CancelTrip';
import {
  resetEndTrip,
  MyRequestDetailsReset,
} from '../../../../redux/actions/app.actions';
import {connect} from 'react-redux';
import {requestTypeConstant} from '../../../../utils/constants';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const BottomSheet = props => {
  const strings = React.useContext(Context).getStrings();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const {details, isMenuIcon, requestType} = props?.route?.params;

  return (
    <View style={styles.bookingConfirmedViewStyle}>
      <ScrollView style={styles.bookingConfirmedScrollStyle}>
        <View>
          <CancelTrip
            isVisible={cancelModalVisible}
            srId={details.id}
            jobId={details.jobId}
            myRequestDetailsData={details}
            changeVisible={() => {
              setCancelModalVisible(false);
            }}
            onCancellationSuccessfull={() => {
              props.resetEndTrip();
              props.MyRequestDetailsReset();
              props.navigation.navigate(navigations.HomeScreen);
            }}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {requestType !== requestTypeConstant.doctorAtHome ? (
              <DottedVertical />
            ) : (
              <View style={styles.redDot} />
            )}
            <View style={{flex: 1}}>
              <PickAddress
                label={strings.groundAmbulance[requestType].fromLabel}
                placeholder={strings.bookingFlow.selectFromAddress}
                lat={details.pickupLocationLatitude}
                long={details.pickupLocationLongitude}
                address={details.pickupLocation}
                readonly
              />
              {requestType !== requestTypeConstant.doctorAtHome && (
                <>
                  <View style={styles.horizontalLines2} />
                  <PickAddress
                    label={strings.TripDetails.to}
                    placeholder={strings.bookingFlow.selectDropLocation}
                    lat={details.dropLocationLatitude}
                    long={details.dropLocationLongitude}
                    address={details.dropLocation}
                    readonly
                  />
                </>
              )}
            </View>
          </View>
        </View>
        <View style={{marginTop: heightScale(20)}}>
          <DriverDetails
            requestType={requestType}
            details={{
              documentUuid: details?.document?.documentUuid,
              type: details.vehicleTypeData?.vehicleName,
              paymentMode: details?.paymentOption,
              otp: details?.otp,
              vehicleRegistrationNumber: details.vehicleRegistrationNumber,
              driverName: details?.driverName,
              jobNumber: details?.jobNumber,
            }}
            image1={getVehicleIcon(
              requestType,
              details.vehicleTypeData?.vehicleType,
            )}
            image2={profilePlaceholder}
            onPressViewTripDetails={() => {
              props.navigation.navigate(navigations.MyrequestDetails, {
                requestType: requestType,
                srId: details.id,
                jobId: details.jobId,
                jobNumber:
                  details.vendorVehicleDetailResource?.vehicleStatus?.jobNumber,
              });
            }}
            onPressChat={() => {
              props.navigation.navigate('ChatScreen', {
                tripId:
                  details.vendorVehicleDetailResource?.vehicleStatus?.jobNumber,
                jobId: details.jobId,
                navigation: props.navigation,
              });
            }}
          />
        </View>
        <View>
          <View style={styles.totalFareView}>
            <Text style={styles.totalPriceText}>
              {strings.myTrips.totalFare}
            </Text>
            <Text style={styles.totalPrice}>
              {[null, undefined].includes(details.totalPrice)
                ? '0'
                : `${'\u20B9'} ${details.totalPrice}`}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainerView}>
          <View style={{width: '48%'}}>
            <CustomButton
              onPress={() => {
                setCancelModalVisible(true);
              }}
              titleTextStyles={{
                ...styles.buttonTextStyle,
                fontSize: normalize(12),
              }}
              containerStyles={{
                ...styles.buttonContainerStyle,
                paddingTop: heightScale(9),
              }}
              title={strings.TripDetails.requestCancellation}
              leftIconContainerStyles={{flex: 0}}
              rightIconContainerStyles={{flex: 0}}
            />
          </View>
          <View style={{width: '48%'}}>
            <CustomButton
              onPress={() => {
                openContact(details.driverMobileNumber);
              }}
              titleTextStyles={styles.buttonTextStyle}
              containerStyles={styles.buttonContainerStyle}
              title={strings.LiveTracking[requestType]?.callDriver}
              leftIcon={
                <Feather name="phone-call" size={18} color={colors.primary} />
              }
              titleContainerStyles={{
                flex: 7,
                alignItems: 'flex-start',
                paddingLeft: widthScale(5),
              }}
              leftIconContainerStyles={{
                flex: 3,
                alignItems: 'flex-end',
                paddingRight: widthScale(5),
              }}
              rightIconContainerStyles={{flex: 0}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bookingConfirmedViewStyle: {
    flex: 1,
  },
  bookingConfirmedScrollStyle: {
    paddingTop: heightScale(20),
    paddingHorizontal: widthScale(15),
  },
  horizontalLines2: {
    borderColor: colors.DarkGray2,
    borderBottomWidth: moderateScale(1),
    width: '90%',
    marginLeft: widthScale(4),
    marginVertical: heightScale(5),
  },
  totalFareView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.PaleBlue,
    borderRadius: moderateScale(100),
    marginTop: heightScale(20),
    paddingVertical: heightScale(8),
    paddingHorizontal: widthScale(12),
  },
  totalPriceText: {
    color: colors.Charcoal2,
    fontSize: normalize(13),
    fontFamily: fonts.calibri.regular,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  totalPrice: {
    color: colors.Charcoal2,
    fontSize: normalize(17),
    fontFamily: fonts.calibri.semiBold,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  buttonContainerView: {
    marginTop: heightScale(20),
    marginBottom: heightScale(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonTextStyle: {
    fontSize: normalize(13),
    color: colors.primary,
  },
  buttonContainerStyle: {
    flex: 0,
    backgroundColor: colors.white,
    borderWidth: widthScale(1),
    borderColor: colors.primary,
    paddingHorizontal: widthScale(4),
  },
  redDot: {
    height: normalize(8),
    width: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: colors.Red,
    alignSelf: 'center',
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {} = App;
  return {};
};

const mapDispatchToProps = {
  resetEndTrip,
  MyRequestDetailsReset,
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomSheet);
