import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Context} from '../../../../providers/localization';
import {openContact} from '../../../../components/functions';

const {normalize, widthScale, heightScale} = scaling;

const RideDetails = ({
  eventDetailsData,
  eventNumber,
  navigation,
  tripStartedDateTime,
}) => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails} = strings;

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
          <Text style={styles.dateTime}>{strings.events.eventDates}</Text>
          <Text style={styles.dateTimeValue}>
            {`${tripStartedDateTime?.tripStartedDate} - ${tripStartedDateTime?.tripEndDate}`}
          </Text>
        </View>
      </View>
      <View>
        <View style={styles.horizontalLine} />
        <View style={styles.row}>
          <MaterialCommunityIcons
            size={18}
            color={colors.Gray}
            name={'clock-time-four-outline'}
            style={{marginTop: heightScale(3)}}
          />
          <View style={styles.tripStartDateTime}>
            <Text style={styles.dateTime}>{strings.events.eventTiming}</Text>
            <Text style={styles.dateTimeValue}>
              {`${tripStartedDateTime?.tripStartedTime} - ${tripStartedDateTime?.tripEndTime}`}
            </Text>
          </View>
        </View>
      </View>
      {eventDetailsData?.eventVehicleAssignedList[0]?.vendorName ? (
        <View>
          <View style={styles.horizontalLine} />
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
                {eventDetailsData?.eventVehicleAssignedList[0]?.vendorName
                  ? eventDetailsData?.eventVehicleAssignedList[0]?.vendorName
                  : strings.common.na}
              </Text>
            </View>
          </View>
        </View>
      ) : null}
      {eventDetailsData?.eventLocation?.address ? (
        <View>
          <View style={styles.horizontalLine} />
          <View style={styles.row}>
            <Octicons
              size={12}
              color={colors.red}
              name={'dot-fill'}
              style={{marginTop: heightScale(3)}}
            />
            <View style={styles.tripStartDateTime}>
              <Text style={styles.dateTime}>
                {strings.events.eventLocation}
              </Text>
              <Text style={styles.dateTimeValue}>
                {`${
                  eventDetailsData?.eventLocation?.address
                    ? eventDetailsData?.eventLocation?.address
                    : ''
                } ${
                  eventDetailsData?.eventLocation?.flat
                    ? eventDetailsData?.eventLocation?.flat
                    : ''
                } ${
                  eventDetailsData?.eventLocation?.landmark
                    ? eventDetailsData?.eventLocation?.landmark
                    : ''
                }`}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {true ? (
        <View style={styles.buttonView}>
          <View style={{width: widthScale(10)}} />
          {eventDetailsData?.status?.id === 'DISPATCHED' ? (
            <TouchableOpacity
              onPress={() => {
                openContact(
                  eventDetailsData?.eventVehicleAssignedList[0]
                    ?.vendorMobileNumber,
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
    paddingTop: heightScale(20),
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
    width: widthScale(240),
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
    marginBottom: heightScale(22),
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
