import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Context} from '../../providers/localization.js';
import {colors, scaling, fonts} from '../../library';
import Icon from 'react-native-vector-icons/FontAwesome5';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const Card = ({
  tripId,
  ambyType,
  pickupLocation,
  dropLocation,
  createdAt,
  selectedTab,
  totalFare,
  remainingTime,
  tripStatus,
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
        <Text style={styles.ambulanceAddressType}>
          {strings.myRequestScreen.runningTime} {remainingTime}
        </Text>
      );
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.title}>
          {strings.myRequestScreen.groundAmbulance}
        </Text>
      </View>
      <View style={styles.ambulenceDetailsContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.componentWidth}>
            <Text style={styles.tripIdText}>
              {strings.myRequestScreen.tripId} #{tripId}
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
          <View style={styles.componentWidth}>
            <Text style={styles.ambulanceAddressType}>
              {date} | {time}
            </Text>
          </View>
          <View style={styles.componentWidth}>
            <Text style={styles.ambulanceAddressType}>
              {strings.myRequestScreen.ambyType}: {ambyType}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.addressDetailsContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.componentWidth}>
            <Text style={styles.ambulanceAddressType}>
              {strings.myRequestScreen.Pickup}
            </Text>
            <Text style={styles.addressDetailsText}>{pickupLocation}</Text>
          </View>
          <View style={styles.componentWidth}>
            <Text style={styles.ambulanceAddressType}>
              {strings.myRequestScreen.Drop}
            </Text>
            <Text style={styles.addressDetailsText}>{dropLocation}</Text>
          </View>
        </View>
        <View>
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
    backgroundColor: colors.yellowLight,
    paddingVertical: heightScale(8),
    paddingLeft: widthScale(14),
  },
  title: {
    fontWeight: 'normal',
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    fontWeight: '700',
    color: colors.yellowLight2,
  },
  ambulenceDetailsContainer: {
    backgroundColor: colors.gray97,
    padding: moderateScale(15),
    alignItems: 'center',
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
    paddingHorizontal: widthScale(8),
    borderRadius: moderateScale(4),
    justifyContent: 'space-between',
  },
  fairIcon: {
    height: heightScale(7.5),
    width: widthScale(13),
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
    marginLeft: widthScale(23),
  },
  componentWidth: {
    width: '48%',
    flexWrap: 'nowrap',
  },
});

export default Card;
