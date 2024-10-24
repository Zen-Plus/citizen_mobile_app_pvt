import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import {Context} from '../../../../providers/localization';
import {FeatherIcons} from '../../../../../assets';
import {capitalizeFirstLetter} from '../../../../components/functions';
import {TripDetailsImage} from '../../../../utils/constants';

const {normalize, widthScale, heightScale} = scaling;

const DriverDetails = ({
  eventDetailsData,
  navigation,
  eventNumber,
  eventId,
  chatCount,
}) => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails} = strings;
  const vehicleType = eventDetailsData?.vehicleType
    ? eventDetailsData?.vehicleType?.toString().split(',')
    : null;
  console.log('chatCount===>', chatCount);
  return (
    <View style={styles.mainView}>
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <View>
          <Text style={styles.vehicleNumber} numberOfLines={1}>
            {capitalizeFirstLetter(eventDetailsData?.eventName)}
          </Text>
          <Text style={styles.driverName}>
            {capitalizeFirstLetter(eventDetailsData?.caller?.callerName)}
          </Text>
          <Text style={styles.vehicleType}>
            {vehicleType[0]}
            {eventDetailsData?.vehicleCount > 1
              ? `, +${eventDetailsData?.vehicleCount - 1}`
              : null}
          </Text>
        </View>
        {console.log('eventDetailsData...', JSON.stringify(eventDetailsData))}
        <View style={styles.row}>
          <Image
            source={
              TripDetailsImage[
                eventDetailsData?.eventVehicleTypeList[0]?.vehicleType
              ]
            }
            style={{
              width: normalize(60),
              height: normalize(60),
              borderWidth: 1,
              borderColor: colors.white,
              borderRadius: normalize(50),
            }}
          />
        </View>
      </View>

      {eventDetailsData?.status?.id === 'DISPATCHED' ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ChatScreen', {
              tripId: eventNumber,
              eventId: eventId,
              navigation: navigation,
            })
          }>
          <View style={styles.chat}>
            <Text style={styles.chatText}>{TripDetails.sendMessage}</Text>
            <Image
              source={FeatherIcons}
              style={{height: heightScale(22), width: widthScale(22)}}
            />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    paddingHorizontal: widthScale(22),
    backgroundColor: colors.primary,
    paddingVertical: heightScale(20),
  },
  vehicleNumber: {
    color: colors.white,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(18),
    width: widthScale(200),
  },
  driverName: {
    color: colors.LightSlateGray,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(16),
  },
  vehicleType: {
    color: colors.LightSlateGray,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(13),
  },
  row: {
    flexDirection: 'row',
  },

  chat: {
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(18),
    paddingVertical: heightScale(8),
    borderRadius: normalize(20),
    marginTop: heightScale(18),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatText: {
    color: colors.DarkGray,
    fontSize: normalize(13),
    fontFamily: fonts.calibri.medium,
  },
});
export default DriverDetails;
