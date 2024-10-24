import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Context} from '../../providers/localization.js';
import {colors, scaling, fonts} from '../../library';
import Icon from 'react-native-vector-icons/FontAwesome5';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const DoctorCard = ({
  tripId,
  pickupLocation,
  selectedTab,
  totalFare,
  remainingTime,
  tripStatus,
  medicalCondition,
  date,
  time,
}) => {
  const strings = React.useContext(Context).getStrings();

  const statusPresent = {
    DISPATCH: {
      color: colors.purple1,
      title: strings.myRequestScreen.ambulanceDispatched,
    },
    JOB_START: {
      color: colors.primary,
      title: strings.myRequestScreen.jobStarted,
    },
    ON_SCENE: {
      color: colors.primary,
      title: strings.myRequestScreen.jobOngoing,
    },
  };

  const renderTripStatus = () => {
    if (statusPresent[tripStatus]) {
      return (
        <>
          <View
            style={[
              styles.dot,
              {backgroundColor: statusPresent[tripStatus]?.color},
            ]}
          />
          <Text
            style={[
              styles.ambulenceTypeText,
              {color: statusPresent[tripStatus]?.color},
            ]}>
            {statusPresent[tripStatus]?.title}
          </Text>
        </>
      );
    }
  };

  const renderRemainingTime = () => {
    if (remainingTime) {
      return (
        <Text style={styles.remainingTypeView}>
          {strings.myRequestScreen.runningTime} {remainingTime}
        </Text>
      );
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.title}>{strings.doctorAtHome.doctorAtHome}</Text>
      </View>
      <View style={styles.ambulenceDetailsContainer}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.componentWidth}>
            <Text style={styles.tripIdText}>
              {strings.jobs.jobId} #{tripId}
            </Text>
          </View>
          <View style={styles.componentWidth}>
            <View style={styles.ambulenceDetailType}>
              {selectedTab === 3
                ? renderRemainingTime()
                : selectedTab === 1
                ? renderTripStatus()
                : null}
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: heightScale(8)}}>
          <View>
            <Text style={styles.medicalText}>
              {strings.doctorAtHome.medicalCondition}
            </Text>
          </View>
          <View style={{marginLeft: widthScale(10)}}>
            <Text style={styles.medicalConditionText}>{medicalCondition}</Text>
          </View>
        </View>
      </View>
      <View style={styles.addressDetailsContainer}>
        <View style={styles.firstView}>
          <Text style={styles.ambulanceAddressType}>
            {strings.AddRequestScreen.Address}
          </Text>
          <Text style={styles.textAddress}>{pickupLocation}</Text>
        </View>
        <View style={styles.secoundView}>
          <Text style={styles.ambulanceAddressType}>
            {strings.doctorAtHome.date}
          </Text>
          <Text style={styles.addressText}>{date}</Text>
        </View>
        <View style={styles.secoundView}>
          <Text style={styles.ambulanceAddressType}>
            {' '}
            {strings.doctorAtHome.time}
          </Text>
          <Text style={styles.addressText}>{time}</Text>
        </View>

        <View style={styles.fairContainer}>
          <View style={styles.fareIconTextContainer}>
            <Icon
              name="money-bill"
              color={colors.black}
              style={styles.fairIcon}
            />
            <Text style={styles.fareTextTitle}>
              {selectedTab === 3
                ? strings.myRequestScreen.totalFare
                : strings.myRequestScreen.estimatedFare}
            </Text>
          </View>
          <Text style={styles.totalFareValue}>
            {'\u20B9'} {totalFare}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
    elevation: 20,
    shadowColor: 'rgba(221, 221, 221, 0.19)',
    borderWidth: 1,
    borderColor: colors.whiteSmoke,
    overflow: 'hidden',
    marginBottom: heightScale(10),
  },
  cardTitleContainer: {
    backgroundColor: colors.light,
    paddingVertical: heightScale(8),
    paddingLeft: widthScale(14),
  },
  title: {
    fontWeight: 'normal',
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    fontWeight: '700',
    color: colors.Black1,
  },
  ambulenceDetailsContainer: {
    backgroundColor: colors.gray97,
    padding: moderateScale(15),
    justifyContent: 'flex-start',
  },
  tripIdText: {
    fontWeight: 'bold',
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    fontWeight: '700',
    color: colors.black,
  },
  ambulenceTypeText: {
    fontWeight: 'normal',
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    fontWeight: '700',
    paddingLeft: widthScale(5),
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 8,
  },
  ambulenceDetailType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressDetailsContainer: {
    padding: moderateScale(15),
  },
  fairContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(47, 153, 20, 0.1)',
    marginTop: heightScale(9),
    paddingVertical: heightScale(6),
    width: '100%',
    borderRadius: moderateScale(4),
    justifyContent: 'space-between'
  },
  fairIcon: {
    height: heightScale(7.5),
    width: widthScale(13),
    marginLeft: widthScale(5),
  },
  fareIconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareTextTitle: {
    fontWeight: 'normal',
    fontSize: normalize(9),
    fontFamily: fonts.calibri.bold,
    fontWeight: '700',
    color: colors.black,
    paddingLeft: widthScale(5),
  },
  ambulanceAddressType: {
    fontWeight: '600',
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    color: colors.mediumLightGray,
    width: '20%',
  },
  remainingTypeView: {
    fontWeight: '600',
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    color: colors.mediumLightGray,
  },
  medicalText: {
    fontWeight: '600',
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    color: colors.mediumLightGray,
  },
  addressDetailsText: {
    fontWeight: 'bold',
    fontSize: normalize(10),
    fontFamily: fonts.calibri.bold,
    color: colors.black,
  },
  totalFareValue: {
    fontWeight: 'normal',
    fontSize: normalize(9),
    fontFamily: fonts.calibri.regular,
    color: colors.black,
    marginRight: widthScale(10),
  },
  componentWidth: {
    width: '48%',
    flexWrap: 'nowrap',
  },
  medicalConditionText: {
    fontWeight: '600',
    fontSize: normalize(11),
    fontFamily: fonts.calibri.medium,
    color: colors.Black2,
  },
  addressText: {
    fontWeight: '600',
    fontSize: normalize(11),
    fontFamily: fonts.calibri.medium,
    color: colors.Black2,
  },
  textAddress: {
    fontWeight: '600',
    fontSize: normalize(11),
    fontFamily: fonts.calibri.medium,
    color: colors.Black2,
    width: '80%',
  },
  firstView: {flexDirection: 'row'},
  secoundView: {flexDirection: 'row', marginTop: heightScale(9)},
});

export default DoctorCard;
