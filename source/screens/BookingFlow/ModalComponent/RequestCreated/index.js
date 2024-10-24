import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import CustomButton from '../../../../components/CustomButton';
import {Context} from '../../../../providers/localization';
import {
  ConfirmingBookingImage,
  requestTypeConstant,
} from '../../../../utils/constants';
import {BackArrow} from '../../../../components/BackArrow';
import {navigations} from '../../../../constants';

const {normalize, widthScale, heightScale} = scaling;

const RequestCreated = props => {
  const {onPress, data, bookingCategory} = props;
  const strings = useContext(Context).getStrings();

  return (
    <View style={styles.modal}>
      <ScrollView style={styles.primaryContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.titleView}>
            <Text style={styles.headingStyle}>
              {strings.requestCreated.yourRequestHaveBeenReceived}
            </Text>
            <Text style={styles.subHeadingStyle}>
              {strings.requestCreated.ourTeamWillReachOutToYouSoon}
            </Text>
          </View>

          <View style={{marginVertical: heightScale(10)}}>
            <Text style={styles.dataStyle}>{data}</Text>
          </View>

          <Image
            source={ConfirmingBookingImage[bookingCategory]}
            style={styles.imageStyle}
            resizeMode="contain"
          />

          {bookingCategory === requestTypeConstant.airAmbulance ||
          bookingCategory === requestTypeConstant.trainAmbulance ? (
            <View
              style={[
                styles.buttonTopContainer,
                {flexDirection: 'row', width: '100%'},
              ]}>
              <BackArrow
                onPress={() => {
                  props.navigation.reset({
                    index: 0,
                    routes: [{name: navigations.HomeScreen}],
                  });
                }}
              />
              <View
                style={{
                  width: '100%',
                  marginLeft: widthScale(10),
                  marginTop: heightScale(8),
                }}>
                <CustomButton
                  onPress={onPress}
                  title={strings.groundAmbulance.viewDetails}
                  titleTextStyles={{fontSize: normalize(14)}}
                  containerStyles={{width: '80%'}}
                  leftIconContainerStyles={{flex: 0}}
                  rightIconContainerStyles={{flex: 0}}
                />
              </View>
            </View>
          ) : (
            <View style={styles.buttonTopContainer}>
              <CustomButton
                onPress={onPress}
                title={strings.requestCreated.goBackToHomePage}
                titleTextStyles={{fontSize: normalize(14)}}
                containerStyles={{flex: 0}}
                leftIconContainerStyles={{flex: 0}}
                rightIconContainerStyles={{flex: 0}}
              />
            </View>
          )}
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
  innerContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingTop: heightScale(20),
    paddingBottom: heightScale(25),
    borderTopRightRadius: normalize(20),
    borderTopLeftRadius: normalize(20),
  },
  headingStyle: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(14),
    textAlign: 'center',
    color: colors.DarkGray,
  },
  subHeadingStyle: {
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(13),
    textAlign: 'center',
    color: colors.DimGray2,
  },
  dataStyle: {
    fontFamily: fonts.calibri.semiBold,
    fontSize: normalize(14),
    textAlign: 'center',
    color: colors.DarkGray,
  },
  imageStyle: {
    width: widthScale(280),
    height: heightScale(96),
  },
  buttonTopContainer: {
    width: '100%',
    paddingHorizontal: widthScale(20),
    marginTop: heightScale(20),
  },
  titleView: {
    alignItems: 'center',
  },
});

export default RequestCreated;
