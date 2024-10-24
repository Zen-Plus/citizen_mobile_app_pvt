import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Context} from '../providers/localization';
import {colors, scaling, fonts} from '../library';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {tripDetails} from '../utils/constants';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const PaymentDetails = props => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails, sideMenu} = strings;

  const data = props?.data?.filter(value => {
    return value?.tripPriceItemType === tripDetails.addOns;
  });
  const baseFareData = props?.data?.filter(value => {
    return value?.tripPriceItemType === tripDetails.tripBase;
  });
  const extraData = props?.data?.filter(value => {
    return value?.tripPriceItemType === tripDetails.extra;
  });

  const cancellation = props?.data?.filter(value => {
    return value?.tripPriceItemType === tripDetails.cancellation;
  });

  const amountReceived = props?.transactionData?.amountRecieved || props?.transactionData?.amountReceived
  return (
    <View style={styles.main}>
      <View style={styles.paymentDetails}>
        <Text style={styles.blackBoldText}>{TripDetails.paymentDetails}</Text>
        <TouchableOpacity
          onPress={() => {
            props.setViewDetailVisible(true);
          }}>
          <Text style={styles.viewDetails}>{TripDetails.viewDetails}</Text>
        </TouchableOpacity>
      </View>
      {/* {props?.data ? (
        props?.data?.cancellationCharges ? (
          <View style={styles.textView}>
            <Text style={styles.blackText}>{TripDetails.cancellation}</Text>
            <View style={styles.row}>
              <Text style={styles.blackText}>
                {'\u20B9'}{' '}
                {props?.data?.cancellationCharges?.toLocaleString('en-US')}
              </Text>
            </View>
          </View>
        ) : null
      ) : null} */}
      <View style={styles.textView}>
        <Text style={styles.blackText}>{TripDetails.total}</Text>
        <View style={styles.row}>
          <Text style={styles.blackText}>
            {'\u20B9'}{' '}
            {props?.totalPrice
              ? props?.totalPrice?.toFixed(2)?.toLocaleString('en-US')
              : 0}
          </Text>
        </View>
      </View>
      {cancellation?.length > 0 ? (
        <View style={styles.textView}>
          <Text style={styles.redText}>{TripDetails.cancellation}</Text>

          <View style={styles.row}>
            <Text style={styles.redText}>
              {'\u20B9'} {cancellation[0].totalPrice?.toFixed(2)}
            </Text>
          </View>
        </View>
      ) : null}
      <View style={styles.textView}>
        <Text style={styles.blackText}>{TripDetails.amountReceived}</Text>
        {amountReceived && amountReceived > 0 ? (
          <View style={styles.row}>
            <Text style={styles.blackText}>
              {'\u20B9'}{' '}
              {props.writeoff?.amount > 0 ? Number(amountReceived - props.writeoff?.amount).toFixed(2) : props?.transactionData?.amountReceived?.toFixed(2)}
            </Text>
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={styles.blackText}>0</Text>
          </View>
        )}
      </View>

      <View style={styles.horizontalLine}></View>
      {props.writeoff?.amount > 0 ? (
        <View style={styles.textView}>
          <Text style={styles.blackText}>{TripDetails.writeoff}</Text>
          <View style={styles.row}>
            <Text style={styles.blackText}>
              {'\u20B9'} {props.writeoff?.amount?.toFixed(2)}
            </Text>
          </View>
        </View>
      ) : null}
      {props?.transactionData?.refundedAmount ? (
        <View style={styles.textView}>
          <Text style={styles.blackText}>{TripDetails.refundedAmount}</Text>
          <View style={styles.row}>
            <Text style={styles.blackText}>
              {'\u20B9'} {props?.transactionData?.refundedAmount?.toFixed(2)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.textView}>
          <Text style={styles.blackText}>
            {props?.totalPrice -
              (amountReceived ||
                0) >=
            0
              ? TripDetails.amountPayable
              : TripDetails.initiateRefund}
          </Text>
          <View style={styles.row}>
            <Text style={styles.blackText}>
              {'\u20B9'}{' '}
              {Math.abs(
                (props?.totalPrice ||
                  props?.transactionData?.totalAmount ||
                  0) -
                  (amountReceived ||
                    0),
              )?.toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: colors.LightGrey7,
    paddingHorizontal: widthScale(18),
    paddingVertical: heightScale(15),
  },
  blackBoldText: {
    fontFamily: fonts.calibri.semiBold,
    fontSize: normalize(15),
    color: colors.DarkGray,
  },
  blackText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    color: colors.DarkGray,
  },
  redText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    color: colors.red,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  textView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: heightScale(12),
  },
  horizontalLine: {
    borderBottomColor: colors.LightGrey7,
    borderBottomWidth: 1,
    marginTop: heightScale(12),
  },
  viewDetails: {
    fontFamily: fonts.calibri.semiBold,
    fontSize: normalize(15),
    color: colors.primary,
  },
  paymentDetails: {flexDirection: 'row', justifyContent: 'space-between'},
});

export default PaymentDetails;
