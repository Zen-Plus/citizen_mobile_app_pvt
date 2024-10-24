import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {Context} from '../../../../providers/localization';
import {
  capitalizeFirstLetter,
  openContact,
} from '../../../../components/functions';
import {eventListingTabs} from '../../../../utils/constants';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const Booked = ({
  status,
  vendorName,
  phoneNumber,
  alternateNumber,
  tripStartDate,
  tripStartTime,
  tripEndTime,
  tripEndDate,
  eventDetailsData,
  days,
  hours,
  eta,
  hidePhone,
}) => {
  const strings = React.useContext(Context).getStrings();
  const {events} = strings;

  return (
    <View style={styles.mainView}>
      <View style={styles.firstView}>
        <View style={styles.row}>
          <View style={styles.bookedByRow}>
            <FontAwesome
              name="user-circle"
              size={moderateScale(20)}
              style={{color: colors.Black1}}
            />
            <Text style={styles.bookedByText}>
              {strings.TripDetails.BookedBy}
            </Text>
          </View>
        </View>
        <View style={[styles.row, {marginTop: heightScale(14)}]}>
          <View style={styles.vendorView}>
            <Text style={styles.vendorName}>
              {capitalizeFirstLetter(vendorName)}
            </Text>
          </View>
          {hidePhone === eventListingTabs.ONGOING ? (
            <View style={styles.bookedByRow}>
              <View>
                <Text style={styles.phoneNumber}>
                  {phoneNumber
                    ?.split('')
                    ?.map((element, item) => (item >= 6 ? 'X' : element))
                    ?.join('')}
                </Text>
              </View>

              <Ionicons
                name="call"
                size={moderateScale(20)}
                style={styles.phoneIcon}
                color={colors.grassGreen}
                onPress={() => openContact(phoneNumber)}
              />
              <Entypo
                name="message"
                size={moderateScale(20)}
                style={styles.chatIcon}
                color={colors.mediumLightGray}
              />
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.startedTime}>
        <View>
          <Text style={styles.tripStartedText}>{events.eventDates}</Text>
          <Text
            style={
              styles.timeText
            }>{`${tripStartDate}  | ${tripEndDate}`}</Text>
        </View>
        <View>
          <Text style={styles.tripStartedText}>{events.eventTiming}</Text>
          <Text
            style={styles.timeText}>{`${tripStartTime} | ${tripEndTime}`}</Text>
        </View>
      </View>
      <View style={styles.secondView}>
        <View style={{marginTop: heightScale(5)}}>
          <View style={styles.eventView}>
            <Text style={styles.eventText}>{events.events}</Text>
            <Text style={styles.eventText1}>
              {capitalizeFirstLetter(eventDetailsData?.eventName)}
            </Text>
          </View>
          <View style={styles.eventView}>
            <Text style={styles.eventText}>{events.organisation} </Text>
            <Text style={styles.eventText1}>
              {capitalizeFirstLetter(eventDetailsData?.organizingFirmName)}
            </Text>
          </View>

          <View style={styles.eventView}>
            <Text style={styles.eventText}>{events.duration}</Text>
            <Text style={styles.eventText1}>{`${days} days`}</Text>
          </View>
        </View>
        <View style={styles.eventView}>
          <Text style={styles.eventText}>{events.workingDays}</Text>
          <Text style={styles.eventText1}>
            {eventDetailsData?.workingDaysInWeek}
          </Text>
        </View>
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
    justifyContent: 'space-between',
    marginVertical: heightScale(8),
  },
  bookedByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  firstView: {
    marginTop: heightScale(14),
    paddingHorizontal: widthScale(12),
    backgroundColor: colors.white,
  },
  bookedByText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    marginLeft: widthScale(10),
    color: colors.Black1,
  },
  status: {
    marginLeft: widthScale(7),
    fontSize: normalize(12),
    color: colors.lightGreyish2,
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
  },
  vendorName: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    color: colors.Black1,
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
    justifyContent: 'center',
  },
  seperator: {
    marginTop: heightScale(10),
    borderBottomColor: colors.grayWhite3,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  secondView: {
    marginTop: heightScale(11),
    paddingHorizontal: widthScale(12),
    marginBottom: heightScale(12),
    backgroundColor: colors.white,
  },
  secondViewTitle: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.mediumLightGray,
  },
  secondViewValue: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    fontSize: normalize(10),
    color: colors.black,
    textAlign: 'center',
  },
  eventView: {
    marginTop: heightScale(5),
    flexDirection: 'row',
  },
  eventText: {
    width: '35%',
    color: colors.black,
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(12),
  },
  eventText1: {
    width: '65%',
    color: colors.mediumLightGray,
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(12),
  },
  startedTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: widthScale(10),
    marginTop: heightScale(10),
    backgroundColor: colors.LightGray2,
    paddingVertical: heightScale(10),
  },
  tripStartedText: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.mediumLightGray,
  },
  timeText: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    fontSize: normalize(9),
    color: colors.Black1,
  },
});
export default Booked;
