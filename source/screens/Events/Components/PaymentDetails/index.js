import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Context} from '../../../../providers/localization';
import {colors, scaling, fonts} from '../../../../library';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {tripDetails} from '../../../../constants';
import Table from '../../../../components/table';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const formatDateAndTime = data => {
  const strings = React.useContext(Context).getStrings();
  return (
    <View style={styles.ListBody}>
      <Text style={styles.bodyText}>
        {data ? moment(data).format('DD/MM/YY | HH:mm:ss') : strings.common.na}
      </Text>
    </View>
  );
};
const naCheck = data => {
  return (
    <View style={styles.ListBody}>
      <Text style={styles.bodyText}>{data ? data : strings.common.na}</Text>
    </View>
  );
};
const rightAlign = data => {
  return (
    <View style={[styles.rightAlign]}>
      <Text style={styles.bodyText}>
        {data ? parseFloat(data).toFixed(2) : strings.common.na}
      </Text>
    </View>
  );
};
const leftAlign = data => {
  return (
    <View style={[styles.leftAlign]}>
      <Text style={styles.bodyText} numberOfLines={2}>
        {data ? data : strings.common.na}
      </Text>
    </View>
  );
};

const TransactionHistory = data => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails} = strings;
  const [icon, setIcon] = useState('caretdown');
  const [collasable, setCollapsable] = useState(false);
  useEffect(() => {
    if (collasable) {
      setIcon('caretup');
    } else {
      setIcon('caretdown');
    }
  }, [collasable]);

  const TABLEDATA = [
    {
      heading: TripDetails.refId,
      key: 'referenceNumber',
      component: (rowData, keyData, index) => {
        return leftAlign(keyData);
      },
    },
    {
      heading: TripDetails.amount,
      key: 'amount',
      component: (rowData, keyData, index) => {
        return rightAlign(keyData);
      },
    },
    {
      heading: TripDetails.paymentMode,
      key: 'transactionMode',
      component: (rowData, keyData, index) => {
        return naCheck(keyData?.name);
      },
    },
    {
      heading: TripDetails.transMode,
      key: 'paymentMode',
      component: (rowData, keyData, index) => {
        return naCheck(keyData?.name);
      },
    },
    {
      heading: TripDetails.transDateTime,
      key: 'transactionCompletedAt',
      component: (rowData, keyData, index) => {
        return formatDateAndTime(keyData);
      },
    },
  ];

  return (
    <View style={{paddingRight: widthScale(10)}}>
      <TouchableOpacity
        onPress={() => {
          setCollapsable(!collasable);
        }}>
        <View style={styles.transactionHistory}>
          <Text style={styles.transactionHistoryText}>
            {TripDetails.transactionHistory}
          </Text>
          <AntDesign name={icon} />
        </View>
      </TouchableOpacity>
      {collasable ? (
        <Table
          data={data}
          tabelData={TABLEDATA}
          backgroundColor={colors.red}
          ListHeaderContainer={styles.ListHeaderContainer}
          headerText={styles.headerText}
          bodyText={styles.bodyText}
          ListContainer={styles.ListContainer}
          ListBody={styles.ListBody}
          index={true}
        />
      ) : null}
    </View>
  );
};

const DisplayItem = ({item}) => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails} = strings;
  return (
    <View>
      <View style={styles.valueView}>
        <View style={styles.innerView}>
          <View style={styles.valueView}>
            <Text style={styles.costText}> {TripDetails.cost}</Text>
            <IconFontAwesome
              name={'rupee'}
              size={moderateScale(10)}
              style={styles.rupee}
            />
          </View>
          <Text style={styles.gstValueText}>
            {(item?.priceExcludingGst + item?.discountAmount)?.toLocaleString(
              'en-US',
            )}
          </Text>
        </View>
        <View style={styles.innerView}>
          <View style={styles.valueView}>
            <View style={styles.valueView}>
              <Text style={styles.gstText}>{TripDetails.discount}</Text>
              <IconFontAwesome
                name={'rupee'}
                size={moderateScale(10)}
                style={styles.rupee}
              />
            </View>
          </View>
          {item?.discountAmount > 0 ? (
            <Text style={styles.gstValueText}>
              {item?.discountAmount?.toLocaleString('en-US')}
            </Text>
          ) : (
            <Text style={styles.gstValueText}>{TripDetails.na}</Text>
          )}
        </View>
        <View style={styles.innerView}>
          <View style={styles.valueView}>
            <Text style={styles.gstText}> {TripDetails.gst}</Text>
            <IconFontAwesome
              name={'rupee'}
              size={moderateScale(10)}
              style={styles.rupee1}
            />
          </View>
          <Text style={styles.gstValueText}>
            {(item?.totalPrice - item?.priceExcludingGst)?.toLocaleString(
              'en-US',
            )}
          </Text>
        </View>
        <View style={styles.innerView}>
          <View style={styles.valueView}>
            <Text style={styles.gstText}>{TripDetails.payable}</Text>
            <IconFontAwesome
              name={'rupee'}
              size={moderateScale(10)}
              style={styles.rupee1}
            />
          </View>
          <Text style={styles.gstValueText}>
            {item?.totalPrice?.toLocaleString('en-US')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const PaymentDetails = props => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails} = strings;

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
  return (
    <View style={styles.main}>
      <View style={styles.paymentDetailsView}>
        <IconFontAwesome
          name={'money'}
          size={moderateScale(15)}
          style={styles.money}
        />
        <Text style={styles.paymentDetailsText}>
          {TripDetails.paymentDetails}
        </Text>
      </View>
      {props?.paymentOptios ? (
        <View style={styles.paymentModeView}>
          <Text style={styles.paymentModeText}>{TripDetails.paymentMode}</Text>
          <Text style={styles.modeText}>
            {props?.paymentOptios ? props?.paymentOptios : strings.common.na}
          </Text>
        </View>
      ) : null}

      <View style={styles.baseFareTitleView}>
        <View>
          <Text style={styles.basefareText}> {TripDetails.baseFare}</Text>
        </View>
        {baseFareData?.length > 0 ? (
          <View style={styles.costgstView}>
            {baseFareData?.map(item => {
              return (
                <View style={styles.valueMainView}>
                  <DisplayItem item={item} />
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
      {data?.length > 0 ? (
        <View style={{marginTop: heightScale(20)}}>
          {typeof data !== undefined
            ? data?.map(item => {
                return (
                  <View style={styles.addOns}>
                    <View>
                      <View style={styles.addonsMainView}>
                        <View style={styles.addonsTitleView}>
                          <Text style={styles.addOnsText}>
                            {item?.itemDescription}
                          </Text>
                          {item.isAddonMandatory ? (
                            <Text style={styles.astrik}>* </Text>
                          ) : null}
                          <Text style={styles.valueText}>
                            - {item?.quantity}
                          </Text>
                        </View>
                        <View style={styles.addonsReusableView}>
                          <DisplayItem item={item} />
                        </View>
                      </View>
                      <View style={styles.addonsUnderlineView}></View>
                    </View>
                  </View>
                );
              })
            : null}
        </View>
      ) : null}

      <View style={styles.baseFareView}>
        {extraData?.map(item => {
          return (
            <View>
              <View>
                <Text style={styles.consumableText}>
                  {TripDetails.consumables}
                </Text>
              </View>
              <View style={styles.consumableView}>
                <View style={styles.valueMainView}>
                  <DisplayItem item={item} />
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.totalView}>
        <View>
          <Text style={styles.totalText}>{TripDetails.total}</Text>
        </View>
        <View style={styles.totalValueView}>
          <IconFontAwesome
            name={'rupee'}
            size={moderateScale(12)}
            style={styles.totalRupee}
          />
          <Text style={styles.totalValueText}>
            {props?.totalprice?.toLocaleString('en-US')}
          </Text>
        </View>
      </View>
      <View style={styles.totalView}>
        <View>
          <Text style={styles.amountReceivedText}>
            {TripDetails.amountReceived}
          </Text>
        </View>
        {props?.amountRecieved > 0 ? (
          <View style={styles.totalValueView}>
            <IconFontAwesome
              name={'rupee'}
              size={moderateScale(12)}
              style={styles.totalRupee1}
            />
            <Text style={styles.totalValueText1}>
              {props?.amountRecieved?.toLocaleString('en-US')}
            </Text>
          </View>
        ) : (
          <View style={styles.totalValueView}>
            <Text>-</Text>
          </View>
        )}
      </View>
      {cancellation?.length > 0 ? (
        <View style={styles.amountPayableView}>
          <View>
            <Text style={[styles.amountReceivedText, {color: colors.red}]}>
              {TripDetails.cancellation}
            </Text>
          </View>
          <View style={styles.totalValueView}>
            <IconFontAwesome
              name={'rupee'}
              size={moderateScale(12)}
              style={[styles.amountPayableRupee, {color: colors.red}]}
            />

            <Text style={[styles.amountPayableValueText, {color: colors.red}]}>
              {cancellation[0].totalPrice}
            </Text>
          </View>
        </View>
      ) : null}
      <View style={styles.underline}></View>
      <View style={styles.amountPayableView}>
        <View>
          <Text style={styles.amountPayableText}>
            {props?.totalprice - props?.amountRecieved >= 0
              ? TripDetails.amountPayable
              : TripDetails.initiateRefund}
          </Text>
        </View>
        <View style={styles.totalValueView}>
          <IconFontAwesome
            name={'rupee'}
            size={moderateScale(12)}
            style={styles.amountPayableRupee}
          />

          <Text style={styles.amountPayableValueText}>
            {Math.abs(
              props?.totalprice - props?.amountRecieved,
            )?.toLocaleString('en-US')}
          </Text>
        </View>
      </View>
      {props?.paymentCollectedHistoryList?.length > 0 ? (
        <View>{TransactionHistory(props?.paymentCollectedHistoryList)}</View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
    width: moderateScale(312),
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
    borderColor: colors.grayWhite,
    padding: widthScale(9),
    backgroundColor: colors.White1,
  },
  paymentDetailsView: {
    flexDirection: 'row',
    marginLeft: widthScale(9),
    marginTop: heightScale(14),
  },
  paymentModeView: {
    marginLeft: widthScale(9),
    marginTop: heightScale(14),
  },
  money: {
    color: colors.grassGreen,
    marginTop: heightScale(1),
    marginRight: widthScale(10),
  },
  baseFareTitleView: {
    marginTop: heightScale(17),
    marginHorizontal: widthScale(10),
    paddingHorizontal: widthScale(10),
    paddingVertical: heightScale(3),
    shadowColor: colors.tripGray,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  paymentDetailsText: {
    marginLeft: widthScale(1),
    color: colors.black,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    fontWeight: '700',
  },
  paymentModeText: {
    color: colors.justBlack,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
  },
  modeText: {
    color: colors.grassGreen,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
  },
  paymentText: {
    color: colors.grassGreen,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
  },
  costgstView: {
    flexDirection: 'row',
    marginTop: heightScale(7),
  },
  rupee: {
    marginTop: heightScale(2),
    color: colors.mediumLightGray,
  },
  costText: {
    marginRight: widthScale(2),
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    color: colors.mediumLightGray,
  },
  gstText: {
    marginRight: widthScale(2),
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    color: colors.mediumLightGray,
  },
  rupee1: {
    marginTop: heightScale(2),
    color: colors.mediumLightGray,
  },
  baseFareView: {
    justifyContent: 'space-between',
    marginHorizontal: widthScale(8),
    marginVertical: heightScale(8),
    backgroundColor: colors.grayWhite2,
  },
  valueView: {
    flexDirection: 'row',
  },
  basefareText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    color: colors.Black1,
  },
  gstValueText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    color: colors.Black1,
    marginLeft: widthScale(2),
    marginTop: heightScale(2),
  },
  underline: {
    borderBottomColor: colors.grey,
    borderBottomWidth: moderateScale(1),
    marginHorizontal: widthScale(10),
    marginTop: heightScale(11),
  },
  addOns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthScale(8),
    backgroundColor: colors.grayWhite2,
  },
  addOnsText: {
    color: colors.justBlack,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    marginRight: widthScale(5),
  },
  valueText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    fontWeight: '600',
    color: colors.justBlack,
  },
  consumableText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    color: colors.justBlack,
    marginTop: heightScale(8),
    marginLeft: widthScale(10),
  },
  totalValueView: {
    flexDirection: 'row',
  },
  totalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthScale(12),
    marginTop: heightScale(10),
    paddingRight: widthScale(10),
  },
  cancelView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthScale(12),
    marginTop: heightScale(10),
  },
  totalText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    fontWeight: '700',
    color: colors.black,
  },
  cancelText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    color: colors.lightRed3,
  },
  totalValueText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    color: colors.black,
  },
  cancelValueText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    color: colors.lightRed3,
  },
  totalRupee: {
    marginRight: widthScale(4),
    marginTop: heightScale(2),
    color: colors.Black1,
  },
  totalValueText1: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    color: colors.grassGreen,
  },
  totalRupee1: {
    marginRight: widthScale(4),
    marginTop: heightScale(2),
    color: colors.grassGreen,
  },
  amountReceivedText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    fontWeight: '600',
    color: colors.black,
  },
  amountPayableText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    color: colors.grassGreen,
  },
  amountPayableValueText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    color: colors.grassGreen,
  },
  amountPayableRupee: {
    marginRight: widthScale(4),
    marginTop: heightScale(2),
    color: colors.grassGreen,
  },
  amountCancelRupee: {
    marginRight: widthScale(4),
    marginTop: heightScale(2),
    color: colors.lightRed3,
  },
  amountPayableView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthScale(12),
    marginTop: heightScale(10),
    marginBottom: heightScale(12),
    paddingRight: widthScale(10),
  },
  innerView: {width: widthScale(60)},
  valueMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueInnerView: {
    flexDirection: 'row',
  },
  addonsTitleView: {
    flexDirection: 'row',
    marginTop: heightScale(10),
    width: widthScale(220),
  },
  addonsMainView: {
    marginHorizontal: widthScale(10),
    marginBottom: heightScale(10),
  },
  addonsUnderlineView: {
    borderBottomColor: colors.grey,
    borderBottomWidth: moderateScale(1),
    marginRight: widthScale(20),
  },
  consumableView: {
    marginHorizontal: widthScale(10),
    marginVertical: heightScale(8),
  },
  addonsReusableView: {
    marginTop: heightScale(8),
  },
  astrik: {
    color: colors.lightRed3,
  },
  transactionHistory: {
    backgroundColor: colors.gray97,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthScale(10),
    paddingVertical: heightScale(8),
    marginRight: widthScale(8),
    borderRadius: moderateScale(3),
  },
  transactionHistoryText: {
    fontSize: normalize(11),
    color: colors.mediumLightGray,
    fontWeight: '700',
  },
  ListHeaderContainer: {
    backgroundColor: colors.white,
    paddingTop: heightScale(11),
    paddingBottom: heightScale(7),
  },
  headerText: {
    fontSize: normalize(11),
    color: colors.mediumLightGray,
    fontWeight: '400',
  },
  bodyText: {
    fontSize: normalize(11),
    color: colors.black,
    fontWeight: '400',
  },
  ListContainer: {
    alignItems: 'center',
    paddingVertical: heightScale(2),
  },
  ListBody: {
    alignItems: 'center',
    paddingVertical: heightScale(1),
    marginRight: widthScale(0),
    width: widthScale(115),
  },
  rightAlign: {
    alignSelf: 'flex-end',
    paddingRight: widthScale(20),
  },
  leftAlign: {
    alignSelf: 'flex-start',
  },
});

export default PaymentDetails;
