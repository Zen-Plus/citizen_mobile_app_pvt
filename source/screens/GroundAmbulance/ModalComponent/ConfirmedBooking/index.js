import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import {Tick} from '../../../../../assets';
import Modal from 'react-native-modal';
import {Button} from '../Button';
import {Context} from '../../../../providers/localization';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

export const ConfirmedBooking = props => {
  const strings = useContext(Context).getStrings();
  const {
    driverDetails,
    title,
    referenceNumber,
    buttonText,
    leadId,
    onPress,
    isVisible,
    bookingCategory,
  } = props;
  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7} style={styles.modal}>
      <View style={styles.primaryContainer}>
        <View style={styles.innerContainer}>
          <Image style={styles.tickImageStyle} source={Tick} resizeMode="contain" />
          {title &&<View style={styles.titleContainer}>
            <Text style={styles.titleTextStyle}>{title}</Text>
          </View>}
          <View style={styles.referenceTextViewStyle}>
            <Text style={styles.referenceTextStyle}>
              {`${strings.groundAmbulance.yourBookingReference}${referenceNumber}`}
            </Text>
            {!!leadId && (
              <Text style={styles.referenceTextStyle}>
                {`${strings.groundAmbulance.yourLeadId}${leadId}`}
              </Text>
            )}
          </View>
          {!!Object.keys(driverDetails).length && (
            <View style={styles.driverDetailsContainer}>
              <View style={styles.driverInnerContainer}>
                <View style={styles.driverViewStyle}>
                  <View style={styles.driverKeyViewStyle}>
                    <Text style={styles.driverKeyTextStyle}>
                      {strings.groundAmbulance[bookingCategory]?.category}
                    </Text>
                    <Text style={styles.driverKeyTextStyle}>:</Text>
                  </View>
                  <View style={styles.driverValueContainer}>
                    <Text style={styles.driverValueTextStyle}>
                      {driverDetails.name}
                    </Text>
                  </View>
                </View>
                <View style={styles.driverViewStyle}>
                  <View style={styles.driverKeyViewStyle}>
                    <Text style={styles.driverKeyTextStyle}>
                      {strings.groundAmbulance.contactNumber}
                    </Text>
                    <Text style={styles.driverKeyTextStyle}>:</Text>
                  </View>
                  <View style={styles.driverValueContainer}>
                    <Text style={styles.driverValueTextStyle}>
                      {driverDetails.no}
                    </Text>
                  </View>
                </View>
                <View style={styles.driverViewStyle}>
                  <View style={styles.driverKeyViewStyle}>
                    <Text style={styles.driverKeyTextStyle}>
                      {strings.jobs.jobId}
                    </Text>
                    <Text>:</Text>
                  </View>
                  <View style={styles.driverValueContainer}>
                    <Text style={styles.driverValueTextStyle}>
                      {driverDetails.id}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={styles.buttonViewStyle}>
            <Button
              style={{backgroundColor: colors.darkGreen}}
              text={buttonText}
              onPress={onPress}
              textStyle={{color: colors.white}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    borderWidth: 2,
    alignItems: 'center',
  },
  primaryContainer: {width: '100%', paddingHorizontal: widthScale(25)},
  innerContainer: {
    borderRadius: moderateScale(20),
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
  },
  tickImageStyle: {
    height: heightScale(52),
    width: widthScale(52),
    marginTop: heightScale(25),
  },
  titleContainer: {
    marginTop: heightScale(6),
    width: '100%',
    alignItems: 'center',
  },
  titleTextStyle: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    color: colors.black,
  },
  referenceTextViewStyle: {
    marginTop: heightScale(24),
    width: '100%',
    alignItems: 'center',
  },
  referenceTextStyle: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(12),
    color: colors.steelgray,
  },
  driverDetailsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: heightScale(11),
  },
  driverInnerContainer: {justifyContent: 'space-around'},
  driverViewStyle: {
    flexDirection: 'row',
    marginVertical: heightScale(3),
  },
  driverKeyViewStyle: {
    flexDirection: 'row',
    width: widthScale(74),
    justifyContent: 'space-between',
    paddingHorizontal: widthScale(5),
  },
  driverKeyTextStyle: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(12),
    color: colors.steelgray,
  },
  driverValueContainer: {alignItems: 'flex-start'},
  driverValueTextStyle: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(12),
    color: colors.darkGreen,
  },
  buttonViewStyle: {
    height: heightScale(45),
    width: widthScale(219),
    marginTop: heightScale(56.38),
    marginBottom: heightScale(31),
  },
});
