import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {colors, scaling, fonts} from '../../../../library';
import LinearGradient from 'react-native-linear-gradient';
import {Context} from '../../../../providers/localization';
import {ConfirmingBookingImage} from '../../utils';
import moment from 'moment';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const ConfirmingBooking = props => {
  const strings = useContext(Context).getStrings();
  const {onPress, bookingCategory} = props;
  const [widthValue, setWidthValue] = useState(0);
  let timeInMiliseconds = useRef(0);
  const timeout = useRef(null);

  useEffect(() => {
    const vehicleAssignmentTat = props.globalConfigurationSuccess?.data.find(
      item => item?.globalConfigTypeResource?.id == 'VEHICLE_ASSIGNMENT_TAT',
    );
    const _ambulanceBookingTime = JSON.parse(vehicleAssignmentTat?.data);
    const fixedTimeinMinute = props.details.isPrimaryVendorEnable
      ? _ambulanceBookingTime.totalVendorResponseTimeInMinutes
      : _ambulanceBookingTime.normalVendorTimeInMinutes;
    const _timeInSeconds = moment(props.details.timer)
      .add(fixedTimeinMinute, 'minutes')
      .diff(moment(), 'seconds');
    const _timeInMiliseconds = _timeInSeconds * 10;
    timeInMiliseconds.current = _timeInMiliseconds;

    return () => {
      clearInterval(timeout?.current);
    };
  }, []);

  useEffect(() => {
    timeout.current = setInterval(() => {
      setWidthValue(preVal => preVal + 1);
    }, timeInMiliseconds.current);
  }, []);

  useEffect(() => {
    if (widthValue === 100) {
      clearInterval(timeout?.current);
      onPress();
    }
  }, [widthValue]);

  return (
    <View style={styles.modal}>
      <ScrollView style={styles.primaryContainer}>
        <View style={styles.innerContainer1}>
          <View>
            <Text style={styles.headingTextStyle}>
              {strings.groundAmbulance[bookingCategory].searchingNearYou}
            </Text>
          </View>
          <Image
            source={ConfirmingBookingImage[bookingCategory]}
            style={styles.imageStyle}
            resizeMode="contain"
          />
          <View style={styles.progressBarViewStyle}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={[colors.primary, colors.primary]}
              style={[
                styles.progressBarInnerView,
                {width: widthScale(260) * 0.01 * widthValue},
              ]}
            />
          </View>
          <View>
            <Text style={styles.pleaseWait}>
              {strings.groundAmbulance[bookingCategory].pleaseWait}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  primaryContainer: {},
  innerContainer1: {
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingTop: heightScale(10),
    paddingBottom: heightScale(30),
    paddingHorizontal: widthScale(22),
    borderTopRightRadius: normalize(20),
    borderTopLeftRadius: normalize(20),
  },
  headingTextStyle: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    textAlign: 'center',
    color: colors.DarkGray,
  },
  imageStyle: {
    width: widthScale(280),
    height: heightScale(96),
    marginTop: heightScale(10),
  },
  progressBarViewStyle: {
    height: heightScale(8),
    width: widthScale(260),
    borderRadius: moderateScale(20),
    marginTop: heightScale(16),
    backgroundColor: colors.gray93,
    marginBottom: heightScale(19),
  },
  progressBarInnerView: {
    height: heightScale(8),
    borderRadius: moderateScale(20),
  },
  buttonViewStyle: {
    height: heightScale(45),
    width: widthScale(219),
    marginTop: heightScale(56.38),
    marginBottom: heightScale(31),
  },
  pleaseWait: {
    fontFamily: fonts.calibri.medium,
    color: colors.Charcoal2,
    fontSize: normalize(13),
    textAlign: 'center',
  },
});

const mapStateToProps = ({App}) => {
  const {globalConfigurationSuccess} = App;

  return {
    globalConfigurationSuccess,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmingBooking);
