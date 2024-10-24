import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import {Context} from '../../../../providers/localization';
import {
  resolutionReason,
  endTrip,
  resolutionStatus,
} from '../../../../redux/actions/app.actions';
import {connect} from 'react-redux';
import {tripDetails, requestTypeConstant} from '../../../../utils/constants';

const {normalize, widthScale, heightScale} = scaling;

const ViewDetail = props => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails} = strings;
  const {myRequestDetailsData, changeVisible, isVisible} = props;

  console.log(myRequestDetailsData , props.writeoff?.amount, Number(amountReceived - props.writeoff?.amount).toFixed(2), 'myRequestDetailsDataViewDetail');

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

  const DisplayItem = ({item}) => {
    return (
      <View>
        <Text style={styles.blackText}>
          {item.itemName}
          {item.quantity ? `  -${item.quantity}` : null}
        </Text>
        <View style={styles.row1}>
          {myRequestDetailsData?.requestType?.id ===
            requestTypeConstant.airAmbulance &&
          item.tripPriceItemType !== tripDetails.tripBase ? null : (
            <View>
              <Text style={styles.greyText}> {TripDetails.cost}</Text>
              <View style={styles.row}>
                <Text style={styles.blackText}>
                  {'\u20B9'}
                  {(
                    item?.priceExcludingGst +
                    (item?.discountAmount || item?.couponAmount)
                  )
                    ?.toFixed(2)
                    ?.toLocaleString('en-US')}
                </Text>
              </View>
            </View>
          )}
          {myRequestDetailsData?.number ||
          myRequestDetailsData?.requestType?.id ===
            requestTypeConstant.airAmbulance ? null : (
            <View>
              <Text style={styles.greyText}>{TripDetails.discount}</Text>
              <View style={styles.row}>
                <Text style={styles.blackText}>-</Text>
                <Text style={styles.blackText}>
                  {'\u20B9'}
                  {item?.discountAmount
                    ? item?.discountAmount?.toFixed(2)?.toLocaleString('en-US')
                    : item?.couponAmount?.toFixed(2)?.toLocaleString('en-US')}
                </Text>
              </View>
            </View>
          )}

          {myRequestDetailsData?.requestType?.id ===
            requestTypeConstant.airAmbulance &&
          item.tripPriceItemType !== tripDetails.tripBase ? null : (
            <View>
              <Text style={styles.greyText}>{TripDetails.payable}</Text>
              <View style={[styles.row, {alignSelf: 'flex-end'}]}>
                <Text style={styles.blackText}>
                  {'\u20B9'}
                  {item?.totalPrice?.toFixed(2)?.toLocaleString('en-US')}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const amountReceived = myRequestDetailsData?.amountReceived || myRequestDetailsData?.amountRecieved

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => changeVisible(false)}
      style={styles.modal}>
      <View style={styles.mainView}>
        <View style={styles.innerView}>
          <View style={styles.title}>
            <Text style={styles.blackBoldText}>
              {TripDetails.paymentDetails}
            </Text>
            <AntDesign
              name="close"
              size={normalize(20)}
              color={colors.Gray}
              onPress={() => changeVisible(false)}
            />
          </View>
          <View>
            <ScrollView>
              {baseFareData?.length > 0 && !myRequestDetailsData?.number ? (
                <View style={{paddingTop: heightScale(2)}}>
                  {baseFareData?.map(item => {
                    return (
                      <View style={styles.boxStyle}>
                        <DisplayItem item={item} />
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {data?.length > 0 ? (
                <View>
                  {typeof data !== undefined
                    ? data?.map(item => {
                        return (
                          <View style={styles.boxStyle}>
                            <DisplayItem item={item} />
                          </View>
                        );
                      })
                    : null}
                </View>
              ) : null}

              {extraData?.map(item => {
                return (
                  <View style={styles.boxStyle}>
                    <DisplayItem item={item} />
                  </View>
                );
              })}
              <View style={{marginHorizontal: widthScale(15)}}>
                <View style={styles.textView}>
                  <Text style={styles.blackText}>{TripDetails.total}</Text>
                  <View style={styles.row}>
                    <Text style={styles.blackText}>
                      {'\u20B9'}
                      {myRequestDetailsData?.totalPrice ||
                      myRequestDetailsData?.totalAmount
                        ? myRequestDetailsData?.totalPrice?.toFixed(2) ||
                          myRequestDetailsData?.totalAmount?.toFixed(2)
                        : 0}
                    </Text>
                  </View>
                </View>
                {cancellation?.length > 0 ? (
                  <View style={styles.textView}>
                    <Text style={styles.redText}>
                      {TripDetails.cancellation}
                    </Text>

                    <View style={styles.row}>
                      <Text style={styles.redText}>
                        {'\u20B9'}
                        {cancellation[0].totalPrice?.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ) : null}
                <View style={styles.textView}>
                  <Text style={styles.blackText}>
                    {TripDetails.amountReceived}
                  </Text>
                  {amountReceived && amountReceived > 0 ? (
                    <View style={styles.row}>
                      <Text style={[styles.blackText, {color: colors.Green2}]}>
                        {'\u20B9'}
                        {props.writeoff?.amount> 0 ?  Number(amountReceived - props.writeoff?.amount).toFixed(2) : (
                          amountReceived
                        ).toFixed(2)}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.row}>
                      <Text style={[styles.blackText, {color: colors.Green2}]}>
                        0
                      </Text>
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
                {myRequestDetailsData?.refundedAmount ? (
                  <View style={styles.textView}>
                    <Text style={styles.blackText}>
                      {TripDetails.refundedAmount}
                    </Text>
                    <View style={styles.row}>
                      <Text style={styles.blackText}>
                        {'\u20B9'}{' '}
                        {myRequestDetailsData?.refundedAmount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.textView}>
                    <Text style={styles.blackText}>
                      {(myRequestDetailsData?.totalPrice ||
                        myRequestDetailsData?.totalAmount ||
                        0) -
                        (amountReceived ||
                          0) >=
                      0
                        ? TripDetails.amountPayable
                        : TripDetails.initiateRefund}
                    </Text>

                    <View style={styles.row}>
                      <Text style={styles.blackText}>
                        {'\u20B9'}
                        {Math.abs(
                          (myRequestDetailsData?.totalPrice ||
                            myRequestDetailsData?.totalAmount ||
                            0) -
                            (amountReceived ||
                              0),
                        ).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  mainView: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  innerView: {
    backgroundColor: colors.white,
    paddingTop: heightScale(34),
    paddingBottom: heightScale(70),
    borderTopRightRadius: normalize(20),
    borderTopLeftRadius: normalize(20),
    maxHeight: '75%',
  },

  crossView: {
    position: 'absolute',
    right: widthScale(1),
    top: heightScale(10),
  },
  blackBoldText: {
    fontFamily: fonts.calibri.semiBold,
    fontSize: normalize(15),
    color: colors.DarkGray,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: heightScale(20),
    marginHorizontal: widthScale(15),
  },
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
  blackText: {
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(13),
    color: colors.black,
  },
  greyText: {
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(12),
    color: colors.secondaryGray,
  },
  boxStyle: {
    marginBottom: heightScale(16),
    padding: normalize(14),
    backgroundColor: colors.white,
    borderRadius: normalize(10),
    shadowOffset: {width: widthScale(10), height: heightScale(10)},
    shadowColor: colors.DimGray2,
    shadowOpacity: 0.5,
    elevation: heightScale(5),
    marginHorizontal: widthScale(15),
  },
  redText: {
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(13),
    color: colors.red,
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {
    resolutionStatusLoading,
    resolutionStatusSuccess,
    resolutionStatusFail,
    resolutionReasonLoading,
    resolutionReasonSuccess,
    resolutionReasonFail,
    endTripLoading,
    endTripSuccess,
    endTripFail,
  } = App;
  return {
    endTripLoading,
    endTripSuccess,
    endTripFail,
    resolutionStatusLoading,
    resolutionStatusSuccess,
    resolutionStatusFail,
    resolutionReasonLoading,
    resolutionReasonSuccess,
    resolutionReasonFail,
  };
};

const mapDispatchToProps = {
  resolutionReason,
  endTrip,
  resolutionStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewDetail);
