import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import {Context} from '../../../../providers/localization';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const EventDetails = ({eventDetailsData, tripStartedDateTime}) => {
  const strings = React.useContext(Context).getStrings();
  return (
    <View style={styles.mainView}>
      <View>
        <Text style={styles.grayText}>{strings.events.eventName}</Text>
        <Text style={styles.blackText}>{eventDetailsData?.eventName}</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View>
        <Text style={styles.grayText}>{strings.events.OrganisationName}</Text>
        <Text style={styles.blackText}>
          {eventDetailsData?.organizingFirmName}
        </Text>
      </View>
      <View style={styles.horizontalLine} />
      <View>
        <Text style={styles.grayText}>{strings.events.duration}</Text>
        <Text
          style={styles.blackText}>{`${tripStartedDateTime?.days} ${strings.events.days}`}</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View>
        <Text style={styles.grayText}>{strings.events.workingHours}</Text>
        <Text
          style={
            styles.blackText
          }>{`${tripStartedDateTime?.hours} ${strings.events.hours}`}</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View>
        <Text style={styles.grayText}>{strings.events.workingDays}</Text>
        <Text style={styles.blackText}>
          {eventDetailsData?.workingDaysInWeek
            ? eventDetailsData?.workingDaysInWeek
            : strings.common.na}
        </Text>
      </View>
      <View style={styles.horizontalLine} />
      <View>
        <Text style={styles.grayText}>{strings.TripDetails.instruction}</Text>
        <Text style={styles.blackText}>
          {eventDetailsData?.instructions
            ? eventDetailsData?.instructions
            : strings.common.na}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: colors.LightGrey7,
    paddingHorizontal: widthScale(18),
    paddingVertical: heightScale(15),
  },
  row: {
    flexDirection: 'row',
  },
  horizontalLine: {
    borderBottomColor: colors.LightGrey7,
    borderBottomWidth: 1,
    marginVertical: heightScale(12),
  },
  grayText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(13),
    color: colors.Gray,
  },
  blackText: {
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(14),
    color: colors.DarkGray,
  },
});
export default EventDetails;
