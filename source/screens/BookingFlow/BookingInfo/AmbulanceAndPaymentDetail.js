import React, {useEffect, useState, useMemo, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
} from 'react-native';
import {colors, scaling, fonts} from '../../../library';
import {
  preferedModeOfPayment,
  validateAlphaNumWithoutSpaceMinFive,
} from '../utils';
import {
  getTypeOfDoctors,
  validateCoupon,
  resetValidateCoupon,
} from '../../../redux/actions/app.actions';
import {connect} from 'react-redux';
import {getTripBasePrice as getTripBasePriceApi} from '../../../redux/api/app.api';
import {isNullOrUndefined} from '../../../utils/validators';
import Loader from '../../../components/loader';
import Toast from 'react-native-simple-toast';
import {requestTypeConstant} from '../../../utils/constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomButton from '../../../components/CustomButton';
import CouponView from './CouponView';
import AmbulanceAndPaymentOption from './AmbulanceAndPaymentOption';
import {AlarmIcon, CardIcon, DiscountIcon} from '../../../../assets';
import {Context} from '../../../providers/localization';
const {normalize} = scaling;

const MODAL_TYPE = {
  AMBULANCE: 'ambulance',
  COUPON: 'coupon',
  PAYMENT: 'payment',
};

function AmbulanceAndPaymentDetail(props) {
  const [vehicleType, setVehicleType] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [appliedCouponAmount, setAppliedCouponAmount] = useState(null);
  const [loader, setLoader] = useState(false);
  const [couponMessage, setCouponMessage] = useState({
    errorText: '',
    errorColor: '',
  });
  const strings = useContext(Context).getStrings();

  const {bottom} = useSafeAreaInsets();
  const bookingType = props.route.params.type;

  useEffect(() => {
    props.getTypeOfDoctors(bookingType);
  }, [bookingType]);

  useEffect(() => {
    if (props.getTypeOfDoctorsSuccess?.data) {
      const tempVehicle = props.getTypeOfDoctorsSuccess?.data.map(item => {
        return {
          id: item.vehicleType.id,
          name: item.vehicleType.name,
          description: item.description,
        };
      });
      if (
        bookingType === requestTypeConstant.petVeterinaryAmbulance &&
        !props.formValues?.vehicleType?.id
      ) {
        props.setValues('vehicleType', {
          id: tempVehicle[0]?.id,
          name: tempVehicle[0]?.name,
        });
      }
      setVehicleType(tempVehicle);
    }
  }, [props.getTypeOfDoctorsSuccess?.data]);

  useEffect(() => {
    if (!isNullOrUndefined(appliedCouponAmount)) {
      const payloadObj = {
        addonsCode: null,
        allowanceAmount: null,
        discountPercentage: 0,
        isDeleted: false,
        quantity: null,
        areaCode: props.formValues.vehicleDetailsApiResponse?.areaCode,
        areaType: props.formValues.vehicleDetailsApiResponse?.areaType,
        tripDurationMinutes: Number(
          (
            props.formValues.vehicleDetailsApiResponse?.distance?.duration / 60
          ).toFixed(3),
        ),
        tripKm:
          props.formValues.vehicleDetailsApiResponse?.distance?.distance / 1000,
        tripPriceItemType: 'TRIP_BASE',
        vehicleType: props.formValues?.vehicleType.id,
        id: null,
        couponCode: coupon,
      };
      setLoader(true);
      getTripBasePriceApi(payloadObj)
        .then(res => {
          const data = res && res.data && res.data.data;
          props.setValues('couponCode', coupon);
          props.setTotalPrice({
            vehiclePrice: props.totalPrice.vehiclePrice - appliedCouponAmount,
            gst: data.cgstAmount + data.igstAmount + data.sgstAmount,
          });
          setLoader(false);
        })
        .catch(() => {
          setLoader(false);
          Toast.showWithGravity(strings.common.somethingWentWrong, Toast.LONG, Toast.TOP);
        });
    }
  }, [appliedCouponAmount]);

  useEffect(() => {
    if (props.validateCouponSuccess) {
      const _data = props.validateCouponSuccess?.data;
      setAppliedCouponAmount(_data);
      setCouponMessage({
        errorText: coupon + ' ' + strings.bookingFlow.appliedSuccessfullly,
        errorColor: 'Green-Text',
      });
    }
  }, [props.validateCouponSuccess]);

  useEffect(() => {
    props.resetValidateCoupon();
    setCoupon('');
    setAppliedCouponAmount(null);
    setCouponMessage({
      errorText: '',
      errorColor: '',
    });
  }, [
    props.formValues.pickUpLatLong,
    props.formValues.dropLatLong,
    props?.formValues?.vehicleType,
  ]);

  useEffect(() => {
    if (props.validateCouponFail) {
      const _message =
        props.validateCouponFail?.errors?.response?.data?.apierror?.message ||
        '';
      let _errorText = '';
      if (_message.includes('CouponNotActivate')) {
        _errorText = coupon + ' ' + strings.bookingFlow.isExpired;
      } else if (_message.includes('CouponAlreadyTaken')) {
        _errorText = coupon + ' ' + strings.bookingFlow.hasAlreadyBeenUser;
      } else if (_message.includes('CouponNotApplicable')) {
        _errorText = strings.bookingFlow.invalid + ' ' + coupon;
      } else if (_message.includes('CouponCodeNotFound')) {
        _errorText = coupon + ' ' + strings.bookingFlow.notFound;
      } else {
        Toast.showWithGravity(strings.common.somethingWentWrong, Toast.LONG, Toast.TOP);
      }

      if (_errorText) {
        setCouponMessage({
          errorText: _errorText,
          errorColor: 'Error',
        });
      }
    }
  }, [props.validateCouponFail]);

  const [modalType, setModalType] = useState(null);

  const OPTION_BUTTONS = useMemo(() => {
    const paymentKeyValue = [...preferedModeOfPayment].reduce((prev, item) => {
      return {...prev, [item.id]: item};
    }, {});

    return [
      {
        icon: AlarmIcon,
        buttonTitle:
          props.formValues?.vehicleType?.name ??
          (bookingType === 'DOCTOR_AT_HOME' ? strings.bookingFlow.selectDoctor : strings.bookingFlow.select),
        onPress: () => setModalType(MODAL_TYPE.AMBULANCE),
      },
      {
        icon: CardIcon,
        buttonTitle:
          paymentKeyValue[props?.formValues?.paymentMode]?.name ?? strings.bookingFlow.select,
        onPress: () => setModalType(MODAL_TYPE.PAYMENT),
      },
      {
        icon: DiscountIcon,
        buttonTitle: strings.bookingFlow.coupon,
        onPress: () => setModalType(MODAL_TYPE.COUPON),
      },
    ];
  }, [
    props.formValues?.vehicleType?.id,
    props?.formValues?.paymentMode,
    preferedModeOfPayment,
  ]);

  const onChangeAmbulanceType = item => {
    props.setValues('vehicleType', {id: item.id, name: item.name});
  };

  const onChangePaymentType = item => {
    props.setValues('paymentMode', item.id);
  };

  const modalData = useMemo(() => {
    return {
      [MODAL_TYPE.AMBULANCE]: {
        data: vehicleType,
        headerTitle: strings.groundAmbulance[bookingType].vehicleType,
        component: (
          <AmbulanceAndPaymentOption
            data={vehicleType}
            value={props.formValues?.vehicleType?.id}
            onChange={onChangeAmbulanceType}
            isInfoItem={bookingType === requestTypeConstant.doctorAtHome}
          />
        ),
      },
      [MODAL_TYPE.COUPON]: {
        headerTitle: strings.bookingFlow.couponTitle,
        component: (
          <CouponView
            coupon={coupon}
            appliedCouponAmount={appliedCouponAmount}
            setCoupon={setCoupon}
            handleRemoveButtonClick={() => handleRemoveButtonClick()}
            handleApplyButtonClick={() => handleApplyButtonClick()}
            vehiclePrice={!props?.totalPrice?.vehiclePrice}
            couponMessage={couponMessage}
          />
        ),
      },
      [MODAL_TYPE.PAYMENT]: {
        data: preferedModeOfPayment,
        headerTitle: strings.bookingFlow.paymentMethod,
        component: (
          <AmbulanceAndPaymentOption
            data={preferedModeOfPayment}
            value={props?.formValues?.paymentMode}
            onChange={onChangePaymentType}
          />
        ),
      },
    };
  }, [
    modalType,
    vehicleType,
    preferedModeOfPayment,
    coupon,
    appliedCouponAmount,
    setCoupon,
    handleRemoveButtonClick,
    handleApplyButtonClick,
    props.totalPrice.vehiclePrice,
    props?.formValues?.paymentMode,
    props.formValues?.vehicleType,
    onChangeAmbulanceType,
    onChangePaymentType,
    couponMessage,
    bookingType,
    requestTypeConstant,
  ]);

  const renderOptionButton = (item, index) => {
    return (
      <TouchableOpacity
        onPress={item.onPress}
        style={[
          styles.renderOptionItem,
          index < OPTION_BUTTONS.length - 1
            ? {borderRightWidth: 1, borderColor: colors.Black6}
            : {},
        ]}>
        <Image source={item.icon} style={styles.tabIcon} />
        <Text style={styles.tabText}>{item.buttonTitle}</Text>
      </TouchableOpacity>
    );
  };

  const handleApplyButtonClick = () => {
    if (validateAlphaNumWithoutSpaceMinFive(coupon)) {
      const data = {
        baseFairExcludingGst:
          props.formValues.vehicleDetailsApiResponse.vehicleTypeData[0]
            .vehiclePrice,
        callerNumber: props.getProfileSuccess?.data?.mobile,
        couponCode: coupon,
      };
      props.validateCoupon(data);
    } else {
      setCouponMessage({
        errorText: strings.bookingFlow.enterValidData,
        errorColor: 'Error',
      });
    }
  };

  const handleRemoveButtonClick = () => {
    setCoupon('');
    setAppliedCouponAmount(null);
    setCouponMessage({
      errorText: '',
      errorColor: '',
    });
    props.resetValidateCoupon();
    props.setTotalPrice({
      vehiclePrice:
        props.formValues.vehicleDetailsApiResponse.vehicleTypeData[0]
          .vehiclePrice,
      gst: props.formValues.vehicleDetailsApiResponse.vehicleTypeData[0].gst,
    });
    props.setValues('couponCode', '');
  };

  return (
    <View style={{width: '100%'}}>
      {(loader || props.validateCouponLoading) && <Loader />}

      <View style={styles.optionContainer}>
        {OPTION_BUTTONS.map(renderOptionButton)}
      </View>
      <Modal
        visible={Boolean(modalType)}
        transparent={true}
        style={styles.modal}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <View style={styles.modalBackground}>
            <View style={[styles.modalInner, {paddingBottom: bottom + 20}]}>
              <Text style={styles.modalHeading}>
                {modalData[modalType]?.headerTitle}
              </Text>
              {modalData[modalType]?.component}
              <CustomButton
                onPress={() => {
                  setModalType(null);
                }}
                title={strings.bookingFlow.done}
                titleTextStyles={{fontSize: normalize(16)}}
                containerStyles={{flex: 0, marginTop: 31}}
                leftIconContainerStyles={{flex: 0}}
                rightIconContainerStyles={{flex: 0}}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabIcon: {marginRight: 8},
  renderOptionItem: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.Black5,
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 10,
    elevation: 12,
    backgroundColor: colors.white,
    bottom: 0,
    padding: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {flex: 1},
  tabText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.DarkGray,
    fontFamily: fonts.calibri.medium,
  },
  modalInner: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalHeading: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
    fontFamily: fonts.calibri.medium,
  },
});

const mapStateToProps = ({App}) => {
  const {
    getTypeOfDoctorsLoading,
    getTypeOfDoctorsFail,
    getTypeOfDoctorsSuccess,
    getProfileSuccess,
    validateCouponLoading,
    validateCouponSuccess,
    validateCouponFail,
  } = App;
  return {
    getTypeOfDoctorsLoading,
    getTypeOfDoctorsFail,
    getTypeOfDoctorsSuccess,
    getProfileSuccess,
    validateCouponLoading,
    validateCouponSuccess,
    validateCouponFail,
  };
};

const mapDispatchToProps = {
  getTypeOfDoctors,
  validateCoupon,
  resetValidateCoupon,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AmbulanceAndPaymentDetail);
