import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {colors, scaling, fonts} from '../library';
import Feather from 'react-native-vector-icons/Feather';
import {Context} from '../providers/localization';
import {liveTracking} from '../../assets';
import {Button} from './button';
const {normalize, widthScale, moderateScale} = scaling;

const LiveTrackingComp = ({liveLocation, onPressTrackRide}) => {
  const {getStrings} = React.useContext(Context);
  const {homeScreen} = getStrings();
  return (
    <View style={styles.trackingView}>
      <Image
        source={liveTracking}
        resizeMode={'contain'}
        style={styles.trackImg}
      />
      <View style={styles.overlayText}>
        <View style={styles.innerOverlayView}>
          <View style={styles.row}>
            <Feather
              name="map-pin"
              size={moderateScale(10)}
              color={colors.justBlack}
              style={styles.icon1}
            />
            <Text style={styles.arriveText}>{homeScreen.arrivingAtPickUp}</Text>
          </View>
          <Text style={styles.locationText}>{liveLocation}</Text>
        </View>
        <Button
          title={homeScreen.trackYourRide}
          style={styles.nearByButton}
          titleStyle={styles.titleStyle}
          onPress={onPressTrackRide}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trackingView: {
    paddingHorizontal: normalize(10),
    marginTop: normalize(33),
    borderRadius: normalize(10),
    height: normalize(160),
    alignItems: 'center',
  },
  trackImg: {
    width: '100%',
    height: normalize(160),
  },
  overlayText: {
    position: 'absolute',
    top: 0,
    right: normalize(20),
    height: normalize(160),
    width: widthScale(130),
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerOverlayView: {
    borderWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arriveText: {
    fontSize: normalize(12),
    fontWeight: '700',
    fontFamily: fonts.calibri.medium,
    color: colors.darkGreen1,
    marginLeft: normalize(5),
  },
  locationText: {
    fontSize: normalize(10),
    fontWeight: '600',
    fontFamily: fonts.calibri.medium,
    color: colors.justBlack,
  },
  nearByButton: {
    borderWidth: 1.2,
    borderColor: colors.darkGreen,
    borderRadius: normalize(20),
    width: normalize(106),
    height: normalize(36),
    minHeight: normalize(36),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: normalize(24),
  },
  titleStyle: {
    fontSize: normalize(10),
    fontWeight: '800',
    fontFamily: fonts.calibri.bold,
    color: colors.justBlack,
  },
});

export default LiveTrackingComp;
