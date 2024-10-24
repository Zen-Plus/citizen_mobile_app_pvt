import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, scaling, fonts} from '../library';
import {connect} from 'react-redux';
import {Context} from '../providers/localization';
import {PreventDoubleClickWithOpacity} from 'react-native-prevent-double-click';
import Toast from 'react-native-simple-toast';
import {
  getPaymentDetails,
  createTransaction,
  transactionDetails,
  resetTransactionDetails,
  resetCreateTransaction,
} from '../redux/actions/app.actions';
import {transactionStatus} from '../utils/constants';
import Config from 'react-native-config';
import RazorpayCheckout from 'react-native-razorpay';
import {useIsFocused} from '@react-navigation/native';
import CustomButton from './CustomButton';
import {WebView} from 'react-native-webview';
import Modal from "react-native-modal";
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

let transactionUuid = null;
let selectedGateway = null;

const PayNow = props => {
  const paymentGatewaysArr = JSON.parse(Config.PAYMENT_GATEWAYS);
  const isFocused = useIsFocused();
  const strings = React.useContext(Context).getStrings();

  const [paymentDetails, setPaymentDetails] = useState({
    totalAmount: 0,
    bookingId: '',
  });
  const [ccavenueUrl, setCcavenueUrl] = useState(null);
  const [gatewaySelectionVisible, setGatewaySelectionVisible] = useState(false);

  const showTransactionMessages = status => {
    if (status === transactionStatus.PENDING) {
      return strings.paymentStatus.transactionPending;
    }
    if (status === transactionStatus.SUCCESS) {
      return strings.paymentStatus.transactionSuccessfull;
    }
    if (status === transactionStatus.INVALID_UUID) {
      return strings.paymentStatus.notFound;
    }
    if (status === transactionStatus.NOT_FETCHED) {
      return strings.paymentStatus.referenceDetailsNotFound;
    }
  };

  useEffect(() => {
    if (!isFocused) {
      props.resetCreateTransaction();
      props.resetTransactionDetails();
    }
  }, [isFocused]);

  useEffect(() => {
    props.getPaymentDetails({
      srId: props.srId,
    });
  }, []);

  console.log(
    'requestPaymentDetailsSuccess...',
    props.requestPaymentDetailsSuccess,
  );

  useEffect(() => {
    if (props?.requestPaymentDetailsSuccess) {
      let tempData = {...paymentDetails};
      (tempData.bookingId = props.requestPaymentDetailsSuccess?.data?.id),
        (tempData.totalAmount =
          props.requestPaymentDetailsSuccess?.data?.totalAmount);
      setPaymentDetails(tempData);
    }
  }, [props?.requestPaymentDetailsSuccess]);

  useEffect(() => {
    if (props?.requestCreateTransactionSuccess) {
      if (selectedGateway === 'RAZORPAY') {
        openRazorPayPaymentGateway(props?.requestCreateTransactionSuccess?.data);
      } else if (selectedGateway === 'CCAVENUE') {
        setCcavenueUrl(props.requestCreateTransactionSuccess?.data?.paymentUrl);
        transactionUuid = props.requestCreateTransactionSuccess?.data?.transactionUuid;
      }
    }
  }, [props?.requestCreateTransactionSuccess]);

  useEffect(() => {
    if (props?.requestCreateTransactionFail) {
      Toast.showWithGravity(showTransactionMessages(transactionStatus.NOT_FETCHED), Toast.LONG, Toast.TOP);
      props.resetCreateTransaction();
    }
  }, [props?.requestCreateTransactionFail]);

  useEffect(() => {
    if (props.requestTransactionDetailSuccess) {
      if (
        props.requestTransactionDetailSuccess.data.paymentTransactionStatus ===
        transactionStatus.FAILED
      ) {
        Toast.showWithGravity(`ONLINE_TRANSACTION_FAILED`, Toast.LONG, Toast.TOP);
      } else {
        props.onTransactionSuccessfull();
        Toast.showWithGravity(
          showTransactionMessages(
            props.requestTransactionDetailSuccess.data.paymentTransactionStatus,
          ),
          Toast.LONG,
          Toast.TOP,
        );
        props.resetCreateTransaction();
        props.resetTransactionDetails();
      }
    }
  }, [props.requestTransactionDetailSuccess]);

  useEffect(() => {
    if (props.requestTransactionDetailFail) {
      Toast.showWithGravity(showTransactionMessages(transactionStatus.NOT_FETCHED), Toast.LONG, Toast.TOP);
      props.resetCreateTransaction();
      props.resetTransactionDetails();
    }
  }, [props.requestTransactionDetailFail]);

  const openRazorPayPaymentGateway = values => {
    var options = {
      amount: values.amount * 100,
      currency: 'INR',
      name: 'ZENPLUS Pvt. Ltd.',
      order_id: values.pgOrderNumber,
      key: Config.RAZOR_PAY_KEY,
      prefill: {
        name: values?.bookingPayment?.callerName || '',
        email: values?.bookingPayment?.callerEmail || '',
        contact: values?.bookingPayment?.callerMobileNumber || '',
      },
      theme: {color: colors.primary},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        props.transactionDetails({transactionUuid: values?.transactionUuid});
      })
      .catch(error => {
        // handle failure
        props.resetCreateTransaction();
        Toast.showWithGravity('ONLINE_TRANSACTION_FAILED', Toast.LONG, Toast.TOP);
      });
  };

  const onClickPayNow = (paymentGateway) => {
    selectedGateway = paymentGateway;

    const payload = {
      amount:
        paymentDetails?.totalAmount - props?.amountReceived ||
        props?.amountRecieved,
      bookingPaymentId: paymentDetails?.bookingId,
      paymentCollectedBy: 'ZIQITZA',
      paymentGatewayType: paymentGateway,
      paymentMode: 'PAYMENT_GATEWAY',
      transactionMode: 'ONLINE',
    };

    if (paymentGateway === 'CCAVENUE') {
      payload.currency = 'INR';
      payload.language = 'en';
      payload.cancelUrl = Config.CCAVENUE_CANCEL_REDIRECT_URL;
      payload.redirectUrl = Config.CCAVENUE_CANCEL_REDIRECT_URL;
    }

    props.createTransaction(payload, true);
  };

  return (
    <View style={styles.main}>
      {(paymentDetails?.totalAmount - props.amountReceived).toFixed(2) > 0 ? (
        <CustomButton
          title={strings.TripDetails.payNow}
          onPress={() => {
            setGatewaySelectionVisible(true);
            transactionUuid = null;
            selectedGateway = null;
          }}
        />
      ) : null}
      {gatewaySelectionVisible && (
        <Modal isVisible={gatewaySelectionVisible}>
          <View style={{backgroundColor: colors.white}}>
            <View style={{alignItems: 'flex-end', marginTop: heightScale(5), marginRight: widthScale(5)}}>
              <IconMaterial
                name={'close'}
                size={32}
                onPress={() => { setGatewaySelectionVisible(false); }}
                color={colors.black}
              />
            </View>
            <View style={{paddingBottom: heightScale(12), paddingHorizontal: widthScale(7)}}>
              {paymentGatewaysArr.map((ele) => (
                <CustomButton
                  title={strings.common[ele.label]}
                  containerStyles={{flex: 0, marginTop: heightScale(12)}}
                  leftIconContainerStyles={{flex: 0}}
                  rightIconContainerStyles={{flex: 0}}
                  onPress={() => {
                    setGatewaySelectionVisible(false);
                    onClickPayNow(ele.code);
                  }}
                />
              ))}
            </View>
          </View>
        </Modal>
      )}
      {!!ccavenueUrl && (
        <Modal isVisible={!!ccavenueUrl}>
          <View
            style={{height: '100%', width: '100%', backgroundColor: colors.white}}
          >
            <View
              style={{alignItems: 'flex-end', marginTop: heightScale(5), marginRight: widthScale(5)}}
            >
              <IconMaterial
                name={'close'}
                size={32}
                onPress={() => { setCcavenueUrl(null); }}
                color={colors.black}
              />
            </View>
            <WebView
              source={{uri: ccavenueUrl}}
              onNavigationStateChange={(ele) => {
                if (ele.url?.includes(Config.CCAVENUE_CANCEL_REDIRECT_URL)) {
                  setCcavenueUrl(null);
                  props.transactionDetails({transactionUuid: transactionUuid});
                }
              }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  payNowView: {
    backgroundColor: colors.darkGreen1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightScale(8),
    marginHorizontal: widthScale(25),
    borderRadius: moderateScale(50),
    marginBottom: heightScale(10),
    marginTop: heightScale(10),
  },
  payNowText: {
    fontSize: normalize(12),
    color: colors.white,
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
  },
  main: {
    marginTop: heightScale(15),
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {
    requestCreateTransactionFail,
    requestCreateTransactionLoading,
    requestCreateTransactionSuccess,
    requestPaymentDetailsFail,
    requestPaymentDetailsLoading,
    requestPaymentDetailsSuccess,
    requestTransactionDetailFail,
    requestTransactionDetailLoading,
    requestTransactionDetailSuccess,
  } = App;
  return {
    requestCreateTransactionFail,
    requestCreateTransactionLoading,
    requestCreateTransactionSuccess,
    requestPaymentDetailsFail,
    requestPaymentDetailsLoading,
    requestPaymentDetailsSuccess,
    requestTransactionDetailFail,
    requestTransactionDetailLoading,
    requestTransactionDetailSuccess,
  };
};

const mapDispatchToProps = {
  getPaymentDetails,
  createTransaction,
  transactionDetails,
  resetTransactionDetails,
  resetCreateTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PayNow);
