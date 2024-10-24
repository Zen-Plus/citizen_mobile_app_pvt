import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, scaling, fonts} from '../library';
import {leadStatus, leadStatusValue} from '../utils/constants';
import moment from 'moment';
import {Context} from '../providers/localization';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const RequestDataRender = props => {
  const strings = React.useContext(Context).getStrings();
  return (
    <View style={styles.requestData}>
      <View style={styles.row}>
        {props.status === leadStatus.CANCEL_BY_CALLER ||
        props.status === leadStatus.CANCEL ? (
          <View style={styles.acceptedStatus}>
            <Text style={[styles.rightNameStyle, {width: '100%'}]}>
              {props.status}
            </Text>
          </View>
        ) : props.status === leadStatus.REQUEST_MADE ? (
          <View
            style={[
              styles.acceptedStatus,
              {backgroundColor: colors.lightGreen},
            ]}>
            <Text style={[styles.rightNameStyle, {width: '100%'}]}>
              {leadStatusValue.REQUEST_MADE}
            </Text>
          </View>
        ) : props.status === leadStatus.IN_PROCESS ? (
          <View
            style={[
              styles.acceptedStatus,
              {backgroundColor: colors.lightGreen},
            ]}>
            <Text style={[styles.rightNameStyle, {width: '100%'}]}>
              {leadStatusValue.IN_PROCESS}
            </Text>
          </View>
        ) : props.status === leadStatus.CANCELLED ? (
          <View style={styles.acceptedStatus}>
            <Text style={[styles.rightNameStyle, {width: '100%'}]}>
              {leadStatusValue.CANCELLED}
            </Text>
          </View>
        ) : props.status === leadStatus.CLOSED ? (
          <View style={styles.acceptedStatus}>
            <Text style={[styles.rightNameStyle, {width: '100%'}]}>
              {leadStatusValue.CLOSED}
            </Text>
          </View>
        ) : props.status === leadStatus.COMPLETED ? (
          <View style={styles.acceptedStatus}>
            <Text style={[styles.rightNameStyle, {width: '100%'}]}>
              {leadStatusValue.COMPLETED}
            </Text>
          </View>
        ) : props.status === leadStatus.ERV_DISPATCHED ? (
          <View
            style={[styles.acceptedStatus, {backgroundColor: colors.green}]}>
            <Text style={[styles.rightNameStyle, {width: '100%'}]}>
              {leadStatusValue.ERV_DISPATCHED}
            </Text>
          </View>
        ) : null}
      </View>
      <View>
        {props.status === leadStatus.REQUEST_MADE ||
        props.status === leadStatus.CANCELLED ||
        props.status === leadStatus.CANCEL ||
        props.status === leadStatus.CANCEL_BY_CALLER ? (
          <View style={styles.row}>
            <Text style={styles.leftNameStyle}>{`Lead No. : `}</Text>
            <Text style={styles.rightNameStyle}>{props.requestNumber}</Text>
          </View>
        ) : props.status === leadStatus.IN_PROCESS ||
          props.status === leadStatus.CLOSED ? (
          <View style={styles.row}>
            <Text style={styles.leftNameStyle}>{`Lead No. :`}</Text>
            <Text style={styles.rightNameStyle}>{props.requestNumber}</Text>
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={styles.leftNameStyle}>{`Job No. :`}</Text>
            <Text style={styles.rightNameStyle}>{props.requestNumber}</Text>
          </View>
        )}
      </View>
      <View style={styles.row}>
        <Text style={styles.leftNameStyle}>Patient Name:</Text>
        <Text style={styles.rightNameStyle}>{props.name}</Text>
      </View>

      <View style={[styles.row, {marginBottom: heightScale(5)}]}>
        <Text style={styles.leftNameStyle}>Request Date:</Text>
        <Text style={styles.rightNameStyle}>{`${moment(props.date).format(
          'DD MMM YYYY , hh:mm a',
        )}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  requestData: {
    padding: normalize(2),
    alignSelf: 'center',
    backgroundColor: colors.white,
    elevation: 5,
    shadowOffset: {width: -2, height: 4},
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    color: colors.white,
    width: widthScale(250),
    // height: heightScale(30),
    marginTop: heightScale(0),
    marginBottom: heightScale(10),
  },

  leftNameStyle: {
    color: colors.black,
    width: '40%',
    fontFamily: fonts.calibri.bold,
  },
  rightNameStyle: {
    width: '60%',
    fontFamily: fonts.calibri.regular,
    // marginLeft: '5%',
    color: colors.black,
  },
  leadNumberStyle: {
    alignItems: 'center',
    marginTop: heightScale(5),
  },
  acceptedStatus: {
    borderWidth: widthScale(1),
    // width: '50%',
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
    borderColor: colors.gray600,
    backgroundColor: colors.gray600,
    borderRadius: moderateScale(10),
  },
  row: {
    marginTop: heightScale(10),
    marginHorizontal: widthScale(10),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
export default RequestDataRender;
