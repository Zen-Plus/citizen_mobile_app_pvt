import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import {Context} from '../../../../providers/localization';
import {paymentOption} from '../../../../utils/constants';
import moment from 'moment';
import CustomButton from '../../../../components/CustomButton';
import {navigations} from '../../../../constants';
import {openContact} from '../../../../components/functions';
import {requestTypeConstant} from '../../../../utils/constants';

const {normalize, widthScale, heightScale} = scaling;

const RideDetails = ({
  myRequestDetailsData,
  jobNumber,
  navigation,
  resolutionStatus,
  setCancelModalVisible,
}) => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails, jobDetails} = strings;

  const getDateTimeValue = () => {
    if (
      myRequestDetailsData?.requestType?.id ===
        requestTypeConstant.airAmbulance ||
      myRequestDetailsData?.requestType?.id ===
        requestTypeConstant.trainAmbulance
    ) {
      if (myRequestDetailsData?.departureDateTime) {
        return moment(myRequestDetailsData?.departureDateTime).format(
          ' DD,MMMM,YYYY hh:mm A',
        );
      }
      return moment(myRequestDetailsData?.srCreatedAt).format(
        ' DD,MMMM,YYYY hh:mm A',
      );
    } else {
      if (myRequestDetailsData?.tripStartDateTime) {
        return moment(myRequestDetailsData?.tripStartDateTime).format(
          ' DD,MMMM,YYYY hh:mm A',
        );
      }
      return moment(myRequestDetailsData?.srCreatedAt).format(
        ' DD,MMMM,YYYY hh:mm A',
      );
    }
  };
  
  return (
    <View style={styles.mainView}>
      <View style={styles.row}>
        <Feather
          size={18}
          color={colors.Gray}
          name={'calendar'}
          style={{marginTop: heightScale(3)}}
        />
        <View style={styles.tripStartDateTime}>
          <Text style={styles.dateTime}>{strings.tickets.Date}</Text>
          <Text style={styles.dateTimeValue}>{getDateTimeValue()}</Text>
          <View style={styles.horizontalLine} />
        </View>
      </View>
      {myRequestDetailsData?.vendorName ? (
        <View style={styles.row}>
          <Octicons
            size={18}
            color={colors.Gray}
            name={'person'}
            style={{marginTop: heightScale(3)}}
          />
          <View style={styles.tripStartDateTime}>
            <Text style={styles.dateTime}>{TripDetails.provider}</Text>
            <Text style={styles.dateTimeValue}>
              {myRequestDetailsData?.vendorName
                ? myRequestDetailsData?.vendorName
                : 'NA'}
            </Text>
            <View style={styles.horizontalLine} />
          </View>
        </View>
      ) : null}

      {myRequestDetailsData?.flightNumber &&
        myRequestDetailsData?.pnrNumber && (
          <View style={styles.row}>
            <Feather
              size={18}
              color={colors.Gray}
              name={'briefcase'}
              style={{marginTop: heightScale(3)}}
            />
            <View style={styles.tripStartDateTime}>
              <Text style={styles.dateTime}>
                {myRequestDetailsData?.requestType?.id ===
                requestTypeConstant.trainAmbulance
                  ? TripDetails.trainNameAndPNRNo
                  : TripDetails.flightNameAndPNRNo}
              </Text>
              <Text style={styles.dateTimeValue}>
                {`${myRequestDetailsData?.flightNumber} | ${myRequestDetailsData?.pnrNumber}`}
              </Text>
              <View style={styles.horizontalLine} />
            </View>
          </View>
        )}

      <View style={styles.row}>
        <View style={styles.addressIcons}>
          <Octicons size={12} color={colors.red} name={'dot-fill'} />
          {!!myRequestDetailsData?.dropMapLocation && (
            <>
              <View style={styles.dottedVerticalLine} />
              <Octicons size={12} color={colors.primary} name={'dot-fill'} />
            </>
          )}
        </View>
        <View>
          <View>
            <Text style={styles.grayText}>
              {!!myRequestDetailsData?.dropMapLocation
                ? TripDetails.from
                : jobDetails.emergencyLocation}
            </Text>
            <Text style={styles.blackText}>{`${
              myRequestDetailsData?.pickMapLocation
                ? myRequestDetailsData?.pickMapLocation
                : ''
            } ${
              myRequestDetailsData?.pickFlatLocation
                ? myRequestDetailsData?.pickFlatLocation
                : ''
            } ${
              myRequestDetailsData?.pickLandmarkLocation
                ? myRequestDetailsData?.pickLandmarkLocation
                : ''
            }`}</Text>
          </View>
          {!!myRequestDetailsData?.dropMapLocation && (
            <>
              <View style={styles.horizontalLine} />
              <View>
                <Text style={styles.grayText}>{TripDetails.to}</Text>
                <Text style={styles.blackText}>{`${
                  myRequestDetailsData?.dropMapLocation
                    ? myRequestDetailsData?.dropMapLocation
                    : ''
                } ${
                  myRequestDetailsData?.dropFlatLocation
                    ? myRequestDetailsData?.dropFlatLocation
                    : ''
                } ${
                  myRequestDetailsData?.dropLandmarkLocation
                    ? myRequestDetailsData?.dropLandmarkLocation
                    : ''
                }`}</Text>
              </View>
            </>
          )}
        </View>
      </View>
      {(myRequestDetailsData?.tripStatus?.id === paymentOption.JOBSTART ||
        myRequestDetailsData?.tripStatus?.id === paymentOption.DISPATCH) &&
      myRequestDetailsData?.requestType?.id !==
        requestTypeConstant.airAmbulance &&
      myRequestDetailsData?.requestType?.id !==
        requestTypeConstant.trainAmbulance ? (
        <View style={styles.trackButton}>
          <CustomButton
            title={TripDetails.trackLocation}
            onPress={() => {
              navigation.navigate(navigations.LiveTracking, {
                jobNumber: jobNumber,
                vehicalRegistrationNumber:
                  myRequestDetailsData?.vehicleRegistrationNumber,
                parkingLocation: {
                  latitude:
                    myRequestDetailsData?.vendorVehicleDetailResource
                      ?.vehicleDetail?.parkingBayLat,
                  longitude:
                    myRequestDetailsData?.vendorVehicleDetailResource
                      ?.vehicleDetail?.parkingBayLong,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
                patientLocation: {
                  latitude: myRequestDetailsData?.pickupLocationLatitude,
                  longitude: myRequestDetailsData?.pickupLocationLongitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
                requestType: myRequestDetailsData?.requestType?.id,
                details: myRequestDetailsData || {},
              });
            }}
          />
        </View>
      ) : null}

      {myRequestDetailsData?.tripStatus?.id === paymentOption.TRIPCOMPLETE &&
      !myRequestDetailsData?.resolutionCode?.includes('C_CANCEL') &&
      myRequestDetailsData?.requestType?.id !==
        requestTypeConstant.airAmbulance &&
      myRequestDetailsData?.requestType?.id !==
        requestTypeConstant.trainAmbulance ? (
        <View style={styles.trackButton}>
          <CustomButton
            title={TripDetails.tripReplay}
            onPress={() => {
              navigation.navigate(navigations.TripReplay, {
                tripReplayUuid: myRequestDetailsData?.tripReplayUuid,
              });
            }}
          />
        </View>
      ) : null}
      {true ? (
        <View style={styles.buttonView}>
          {(myRequestDetailsData?.tripStatus?.id === paymentOption.JOBSTART ||
            myRequestDetailsData?.tripStatus?.id === paymentOption.DISPATCH ||
            myRequestDetailsData?.srStatus === 'OPEN') &&
          myRequestDetailsData?.requestType?.id !==
            requestTypeConstant.airAmbulance &&
          myRequestDetailsData?.requestType?.id !==
            requestTypeConstant.trainAmbulance ? (
            <TouchableOpacity
              onPress={() => {
                resolutionStatus({
                  serviceSubCategoryIds:
                    myRequestDetailsData?.serviceSubCategoryId,
                });
                setCancelModalVisible(true);
              }}
              style={{flex: 1}}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>
                  {TripDetails.requestCancellation}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
          <View style={{width: widthScale(10)}} />
          {myRequestDetailsData?.tripStatus?.id === paymentOption.JOBSTART ||
          myRequestDetailsData?.tripStatus?.id === paymentOption.DISPATCH ? (
            <TouchableOpacity
              onPress={() => {
                openContact(
                  myRequestDetailsData?.requestType?.id ===
                    requestTypeConstant.airAmbulance ||
                    myRequestDetailsData?.requestType?.id ===
                      requestTypeConstant.trainAmbulance
                    ? myRequestDetailsData?.vendorNumber
                    : myRequestDetailsData?.driverMobileNumber,
                );
              }}
              style={{flex: 1}}>
              <View style={styles.button}>
                <Feather
                  size={16}
                  color={colors.primary}
                  name={'phone-call'}
                  style={{marginRight: widthScale(5)}}
                />
                <Text style={styles.buttonText}>{TripDetails.call} </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    paddingHorizontal: widthScale(18),
    backgroundColor: colors.white,
    paddingVertical: heightScale(20),
    borderWidth: 1,
    borderColor: colors.LightGrey7,
    borderRadius: normalize(20),
  },
  row: {flexDirection: 'row'},
  horizontalLine: {
    borderBottomColor: colors.LightGrey7,
    borderBottomWidth: 1,
    marginVertical: heightScale(12),
  },

  tripStartDateTime: {
    flex: 1,
  },
  dateTime: {
    marginLeft: widthScale(9),
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    color: colors.Gray,
  },
  dateTimeValue: {
    marginLeft: widthScale(8),
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(14),
    color: colors.DarkGray,
  },
  grayText: {
    marginLeft: widthScale(2),
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    color: colors.Gray,
  },
  blackText: {
    marginLeft: widthScale(2),
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(14),
    color: colors.DarkGray,
  },
  dottedVerticalLine: {
    borderStyle: 'dotted',
    borderLeftWidth: 3,
    flex: 1,
    borderColor: colors.DarkGray2,
  },
  addressIcons: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: heightScale(14),
    marginRight: widthScale(10),
  },
  trackButton: {marginTop: heightScale(20)},
  button: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: normalize(8),
    borderRadius: normalize(50),
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: 'auto',
    flex: 1,
  },

  buttonText: {
    fontSize: normalize(13),
    color: colors.primary,
    fontFamily: fonts.calibri.medium,
    textAlign: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: heightScale(20),
  },
  containerStyles: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  titleTextStyles: {fontSize: normalize(12), color: colors.primary},
});
export default RideDetails;
