/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import {Context} from '../../../../providers/localization';
import Table from '../../../../components/table';
const {normalize, widthScale, heightScale, moderateScale} = scaling;

const AmbulanceDetails = ({eventDetailsData}) => {
  const strings = React.useContext(Context).getStrings();

  const TABLEDATA = [
    {
      heading: strings.EventDetails.AmbyNo,
      key: 'vehicleRegistrationNumber',
      headerComponent: item => {
        return (
          <View style={{width: widthScale(80)}}>
            <Text style={styles.headerText} numberOfLines={2}>
              {item ? item : 'NA'}
            </Text>
          </View>
        );
      },
      component: (rowData, keyData, index) => {
        return (
          <View style={{width: widthScale(80)}}>
            <Text style={styles.bodyText} numberOfLines={2}>
              {keyData ? keyData : 'NA'}
            </Text>
          </View>
        );
      },
    },
    {
      heading: strings.profile.type,
      key: 'vehicleTypeObj',
      headerComponent: item => {
        return (
          <View style={{width: widthScale(35)}}>
            <Text
              style={[styles.headerText, {textAlign: 'center'}]}
              numberOfLines={2}>
              {item ? item : 'NA'}
            </Text>
          </View>
        );
      },
      component: (rowData, keyData, index) => {
        return (
          <View style={{width: widthScale(35)}}>
            <Text
              style={[styles.bodyText, {textAlign: 'center'}]}
              numberOfLines={2}>
              {keyData ? keyData?.name : 'NA'}
            </Text>
          </View>
        );
      },
    },
    {
      heading: strings.EventDetails.contactNo,
      key: 'driverMobileNumber',
      headerComponent: item => {
        return (
          <View style={{width: widthScale(80)}}>
            <Text
              style={[styles.headerText, {textAlign: 'center'}]}
              numberOfLines={2}>
              {item ? item : 'NA'}
            </Text>
          </View>
        );
      },
      component: (rowData, keyData, index) => {
        return (
          <View style={{width: widthScale(80)}}>
            <Text
              style={[styles.bodyText, {textAlign: 'center'}]}
              numberOfLines={2}>
              {keyData ? keyData : 'NA'}
            </Text>
          </View>
        );
      },
    },
  ];

  return (
    <View style={styles.mainView}>
      <View style={styles.headingView}>
        <Text style={styles.blackBoldText}>
          {strings.TripDetails.AmbulanceDetails}
        </Text>
      </View>
     
      <Table
        data={eventDetailsData?.eventVehicleAssignedList}
        tabelData={TABLEDATA}
        headerText={styles.headerText}
        ListBody={{
          width: 'auto',
          marginRight: widthScale(0),
        }}
        index={true}
      />
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

  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: heightScale(4),
  },
  blackBoldText: {
    fontFamily: fonts.calibri.semiBold,
    fontSize: normalize(15),
    color: colors.DarkGray,
  },
  headerText: {
    color: colors.DimGray2,
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(12),
  },
  bodyText: {
    color: colors.DarkGray,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(12),
  },
});
export default AmbulanceDetails;
