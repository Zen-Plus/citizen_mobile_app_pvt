import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import {TextInput} from '../../components';
import {Context} from '../../providers/localization.js';
import {allAddons} from '../../redux/actions/app.actions';
import {connect} from 'react-redux';
import {colors, scaling, fonts} from '../../library';
import {PreventDoubleClickWithOpacity} from 'react-native-prevent-double-click';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox'; 
import AddOnsModal from '../../components/AddOnsModal'
import {grandTotalAmount} from './getGrandTotal'
import {blackAndWhiteAmbulance} from '../../../assets';
import {preferedModeOfPayment} from '../../utils/constants';
import CheckBox from 'react-native-check-box';
import {isNullOrUndefined} from '../../utils/validators'

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const AmbulenceBookingAddonsScreen = props => {
  const {setValues, handleConfirmBookingPress, formValues, bookingCategory} = props;
  const isDoctor = bookingCategory === 'DOCTOR_AT_HOME'

  const [applyDiscount, setApplyDiscount] = useState({
    isDiscount: false,
    discountCode: ''
  });
  const [validateCheckbox, setValidateCheckbox] = useState('');
  const [termConditionCheckbox, setTermCondCheckBox] = useState(false);
  const [openAddOnsModal, setOpenAddonsModal] = useState(false);
  const [updatedWithQuantities, setUpdatedWithQuantities] = useState([]);
  const [newAddons, setNewAddons] = useState([]);
  const [isMendatoryAddonsAdded, setIsMendatoryAddonsAdded] = useState(null);
  const [states, setStates] = useState({
    addOnsList: [],
    total: 0,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const strings = React.useContext(Context).getStrings();
  const {AmbulenceAddOns, groundAmbulance} = strings;

  let total = 0;

  useEffect(() => {
    setValues('discountCode', applyDiscount.discountCode);
  }, [applyDiscount.discountCode]);

  useEffect(() => {
    setValues('addonsData', states.addOnsList);
  }, [states.addOnsList]);

  useEffect(() => {
    let tempNewAddons = newAddons;
    let tempOldAddons = states.addOnsList;
    const updated = new Set(tempNewAddons.map(el => el.itemCode));

    const arrayFiltered = tempOldAddons.filter(el => updated.has(el.itemCode));
    let updatedWithQuantities = [];
    tempNewAddons.map(value => {
      let flag = 0;
      tempOldAddons.map((addOnsList, index, array) => {
        if (addOnsList.itemCode === value.itemCode) {
          flag = 1;
          return 0;
        }
      });
      if (flag == 0) {
        updatedWithQuantities.push(value);
      }
    });
    let result = [...arrayFiltered, ...updatedWithQuantities];
    let finalfinal = [];
    newAddons.map(newValue => {
      result.map(resValue => {
        if (newValue.itemCode === resValue.itemCode) {
          finalfinal.push(newValue);
        }
      });
    });

    setStates({...states, addOnsList: finalfinal});
  }, [newAddons]);

  useEffect(() => {
    if (!isDoctor) {
      props.allAddons({vehicleType: props.details.vehicleType});
    }
  }, []);

  function getGrandTotalAmount() {
    const tempTotal = grandTotalAmount(props.details?.vehiclePrice, states.addOnsList, props.details?.gst);
    setTotalAmount(tempTotal);
    return tempTotal;
  }

  useEffect(() => {
    getGrandTotalAmount();
  }, [states.addOnsList]);

  useEffect(() => {
    if (props.allAddonsSuccess) {
      let updatedWithQuantities = [];

      props.allAddonsSuccess.data.map(value => {
        let flag = 0;
        states.addOnsList.map((addOnsList, index, array) => {
          if (addOnsList.itemCode === value.code) {
            flag = 1;
            updatedWithQuantities.push({
              ...value,
              quantity: addOnsList.quantity,
            });
            return 0;
          }
        });
        if (flag == 0) {
          updatedWithQuantities.push({...value, quantity: ''});
        }
      });
      setUpdatedWithQuantities(updatedWithQuantities);
    }
  }, [props.allAddonsSuccess, states.addOnsList]);


  useEffect(() => {
    if (props.allAddonsFail) {
      console.log('Fail ? :', props.allAddonsFail);
    }
  }, [props.allAddonsFail]);

  const deleteValue = value => {
    let filteredList = states.addOnsList?.filter((currentVal, index, array) => {
      return index != value;
    });
    setStates({...states, addOnsList: filteredList});
  };

  const checkBoxValidation = () => {
    if (!termConditionCheckbox) {
      setValidateCheckbox(strings.signUpScreen.agreeTermsConditions);
    } else {
      setValidateCheckbox('');
      return true;
    }
  };


  const showPaymentCardDetails = (value, index) => {
    total = total + value?.totalPrice?.toFixed(2);
    return (
      <View style={styles.paymentDetailsCard}>
        <View style={styles.priceTypeTitle}>
          <Text 
            style={styles.priceTypeTitleText} 
            ellipsizeMode="tail"
            numberOfLines={2}>
            {`${value?.itemDescription}`}
            {value.isAddonMandatory ? (
              <Text style={styles.astrik}>*</Text>
            ) : null}
            <Text> - {value.quantity}</Text>
          </Text>
          {!value.isAddonMandatory ? (
                <View style={styles.deleteMainView}>
                  <FontAwesome
                    name="trash-o"
                    color={colors.lightRed4}
                    size={moderateScale(12)}
                    onPress={() => deleteValue(index)}
                  />
                </View>
          ) : null}
        </View>
        <View style={styles.priceBreakdownContainer}>
          <View>
            <Text style={styles.priceBreakdownTitle}>
              {AmbulenceAddOns.cost} {'\u20B9'}
            </Text>
            <Text style={styles.priceBreakdownText}>
            {value?.priceExcludingGst?.toFixed(2)}
            </Text>
          </View>
          <View>
            <Text style={styles.priceBreakdownTitle}>
              {AmbulenceAddOns.discount} {'\u20B9'}
            </Text>
            <Text style={styles.priceBreakdownText}>
            {`${
                Number(value?.discountPercentage.toFixed(2)) > 0
                  ? `-${value?.discountPercentage.toFixed(2)}`
                  : 'NA'
              }`}
            </Text>
          </View>
          <View>
            <Text style={styles.priceBreakdownTitle}>
              {AmbulenceAddOns.gst} {'\u20B9'}
            </Text>
            <Text style={styles.priceBreakdownText}>
            {(
              value?.sgstAmount +
              value?.igstAmount +
              value?.cgstAmount
            ).toFixed(2)}
            </Text>
          </View>
          <View>
            <Text style={styles.priceBreakdownTitle}>
            {AmbulenceAddOns.payable} {'\u20B9'}
            </Text>
            <Text style={styles.priceBreakdownText}>
            {value?.totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  const showBaseFareDetails = () => {
    return (
      <View style={styles.paymentDetailsCard}>
        <View style={styles.priceTypeTitle}>
          <Text 
            style={styles.priceTypeTitleText} 
            ellipsizeMode="tail"
            numberOfLines={2}>
            {AmbulenceAddOns.baseFare}
          </Text>
        </View>
        <View style={styles.priceBreakdownContainer}>
          <View>
            <Text style={styles.priceBreakdownTitle}>
              {AmbulenceAddOns.cost} {'\u20B9'}
            </Text>
            <Text style={styles.priceBreakdownText}>
            {` ${
                [null, undefined].includes(props.details?.vehiclePrice)
                ? 'NA'
                : (props.details.vehiclePrice).toFixed(2)
            }`}
            </Text>
          </View>
          <View>
            <Text style={styles.priceBreakdownTitle}>
            {AmbulenceAddOns?.discount} {'\u20B9'}
            </Text>
            <Text style={styles.priceBreakdownText}>
              NA
            </Text>
          </View>
          <View>
            <Text style={styles.priceBreakdownTitle}>
              {AmbulenceAddOns.gst} {'\u20B9'}
            </Text>
            <Text style={styles.priceBreakdownText}>
            {[null, undefined].includes(props.details?.vehiclePrice)
              ? 'NA'
              : (props.details?.gst).toFixed(2)}
            </Text>
          </View>
          <View>
            <Text style={styles.priceBreakdownTitle}>
            {AmbulenceAddOns.payable} {'\u20B9'}
            </Text>
            <Text style={styles.priceBreakdownText}>
              {(props?.details?.vehiclePrice + props?.details?.gst).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  const validateMendatoryAddons = () => {
    let isError;
    props.allAddonsSuccess.data.forEach((value)=> {
      if(value.acknowledgement) {
        if (!states.addOnsList?.length) {
          isError = true;
        } else {
         let mendotaryAddons = states.addOnsList.find((addOns)=> addOns.itemCode === value.code)
         if (mendotaryAddons) {
          isError = isNullOrUndefined(mendotaryAddons.quantity)
         } else {
          isError = true
         }
        }
      }
    })
    return isError;
  }

  const onPressConfirmBooking = () => {
    let isMendatoryAddons = !isDoctor ? validateMendatoryAddons() : false
    let isTermConditionValidated = checkBoxValidation();
    if (isTermConditionValidated) {
      if (!isMendatoryAddons) {
        setIsMendatoryAddonsAdded(true)
        handleConfirmBookingPress();
      } else {
        setIsMendatoryAddonsAdded(false)
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.container}>
        <AddOnsModal
          newAddons={addedAddons => {
            setNewAddons(addedAddons);
          }}
          details={props?.details}
          list={updatedWithQuantities}
          isVisible={openAddOnsModal}
          changeVisible={() => {
            setOpenAddonsModal(false);
          }}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.container2}>
            <View style={styles.ambulanceContainer}>
              <Text style={styles.pageTitle}>
                {groundAmbulance[bookingCategory]?.bookingDetails}
              </Text>
              <View style={styles.ambulanceDetailContainer}>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    {isDoctor ?
                    <FontAwesome name="stethoscope" size={18} color={colors.BlackDark} />
                    : <Image
                      source={blackAndWhiteAmbulance}
                      style={{height: heightScale(24), width: widthScale(26)}}
                      resizeMode="contain"
                    />}
                  </View>
                  <View style={styles.ambulanceDetailsTextContainer}>
                      <Text style={styles.ambulanceTypeText}>
                      {props.details?.vehicleName}
                      </Text>
                      {isDoctor? 
                      <Text style={styles.featureHeadingText}>
                        {AmbulenceAddOns.instructions}
                      </Text> : null
                      }
                      <Text style={styles.ambulanceTypeSubText}>
                        {props.details?.vehicleDescription}
                      </Text>
                      <Text style={styles.featureHeadingText}>
                        {groundAmbulance[bookingCategory]?.feature}
                      </Text>
                      <Text style={styles.featureDetailsText}>
                        {props.details?.features ? props.details?.features : 'NA'}
                      </Text>
                      {!isDoctor ?
                      <>
                        <Text style={styles.featureHeadingText}>
                          {AmbulenceAddOns.totalDistance}
                        </Text>
                        <Text style={styles.featureDetailsText}>
                          {props.details?.distance
                            ? Number(props.details?.distance) / 1000
                            : 0
                          } KM
                      </Text>
                      </> : null}
                  </View>
                </View>
                <View>
                   <Text style={styles.ambulenceWholePriceText}>{'\u20B9'} {(props.details?.vehiclePrice + props.details?.gst).toFixed(2)}</Text>
                </View>
              </View>
              {!isDoctor ? 
              <TouchableOpacity onPress={() => {setOpenAddonsModal(true)}}>
                <View style={styles.chooseAddOnsButton}>
                  <Icon name="plus-outline" size={18} color={colors.yellowLight2} />
                  <Text style={styles.chooseAddOnsButtonText}>
                    {AmbulenceAddOns.chooseAddOns}
                  </Text>
                </View>
              </TouchableOpacity> : null}
              <View style={styles.paymentDetailContainer}>
                <View style={styles.paymentDetailsHeading}>
                    <FontAwesome5
                      name="money-bill"
                      color={colors.primary}
                      style={styles.fairIcon} />
                    <Text style={styles.paymentDetailsHeadingText}>
                      {AmbulenceAddOns.paymentDetails}
                    </Text>
                </View>
                <View>
                {showBaseFareDetails()}
                {states.addOnsList.map((value, index, arr) => {
                return (
                  showPaymentCardDetails(value, index)
                )})}
                </View>
                <View style={styles.grandTotalContainer}>
                  <Text style={styles.grandTotalText}>{AmbulenceAddOns.grandTotal}</Text>
                  <Text style={styles.grandTotal}>{`₹ ${(totalAmount).toFixed(2)}`}</Text>
                </View>
              <View style={styles.blockView}>
              <View>
                <Text style={styles.textStyle2}>
                  {AmbulenceAddOns.preferedModeOfPayment}
                </Text>
              </View>
              <View style={[styles.toggleContainer]}>
                {preferedModeOfPayment.map(item => (
                  <TouchableOpacity
                    style={[
                      styles.toggleDataStyle,
                      {width: '45%'},
                      formValues.paymentMode === item.id && {
                        backgroundColor: '#41a06233',
                      },
                    ]}
                    onPress={() => {
                      setValues('paymentMode', item.id);
                    }}>
                    <Text
                      style={[
                        styles.toggleTextStyle,
                        formValues.paymentMode === item.id && {
                          color: colors.darkGreen,
                          fontWeight: '700',
                        },
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
                <View style={styles.checkBoxInputContainer}>
                  <CircleCheckBox
                    checked={applyDiscount.isDiscount}
                    onToggle={(checked)=> setApplyDiscount({...applyDiscount, isDiscount: checked })}
                    outerSize={15}
                    innerSize={8}
                    outerColor={colors.darkGreen2}
                    innerColor={colors.darkGreen2}
                    labelPosition={LABEL_POSITION.RIGHT}
                    label={AmbulenceAddOns.applyDiscount}
                    styleLabel={[styles.checkboxLabel, {color: colors.darkGreen2}]}
                  />
                  <View>
                    <View style={styles.discountInputCodeContainer}>
                      <TextInput
                        style={styles.textInputContainer}
                        underlineColorAndroid="transparent"
                        placeholderTextColor={colors.gray400}
                        autoCapitalize="words"
                        value={applyDiscount.discountCode}
                        onChangeText={value => {setApplyDiscount({...applyDiscount, discountCode: value })}}
                        inputStyles={styles.inputStyles}
                      />
                      <TouchableOpacity>
                        <View style={styles.applyDiscountButton}>
                          <Text style={styles.buttonText}>{AmbulenceAddOns.apply}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <CheckBox
                    style={styles.checkBoxContainer}
                    onClick={() => {
                      setTermCondCheckBox(!termConditionCheckbox);
                    }}
                    checkBoxColor={colors.lightGrey}
                    isChecked={termConditionCheckbox}
                    rightTextView={
                      <View style={styles.row}>
                        <Text
                          style={
                            styles.checkboxText
                          }>{` I accept all the `}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate('TermsAndConditions');
                          }}>
                          <Text
                            style={
                              styles.checkboxTextBold
                            }>{`Terms & Conditions`}</Text>
                        </TouchableOpacity>
                      </View>
                    }
                  />
                  {validateCheckbox ? (
                    <Text style={styles.errorMsg}>{validateCheckbox}</Text>
                  ) : null}
                {isMendatoryAddonsAdded === false ? <Text style={styles.mendatoryErrorsText}>{AmbulenceAddOns.mendatoryAddonsError}</Text> : null}
                  <PreventDoubleClickWithOpacity
                    activeOpacity={0.8}
                    style={styles.button}
                    onPress={onPressConfirmBooking}>
                    <Text style={styles.buttonText}>
                      {AmbulenceAddOns.confirmBooking}
                    </Text>
                  </PreventDoubleClickWithOpacity>
              </View>
            </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container2: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  ambulanceContainer: {
    height: '100%',
    paddingHorizontal: widthScale(16),
    paddingTop: heightScale(20),
  },
  ambulanceDetailContainer: {
    flexDirection: 'row',
    marginTop: heightScale(24),
    width: widthScale(217),
    justifyContent: 'space-between',
  },
  ambulanceDetailsTextContainer: {
    marginLeft: widthScale(19),
    flexWrap: 'nowrap',
  },
  pageTitle: {
    fontWeight: 'normal',
    fontSize: normalize(14),
    fontFamily: fonts.calibri.bold,
    color: colors.black,
    fontWeight: 'bold',
  },
  ambulanceTypeText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.bold,
    color: colors.black,
    fontWeight: 'bold',
  },
  ambulanceTypeSubText: {
    fontWeight: 'normal',
    fontSize: normalize(9),
    fontFamily: fonts.calibri.medium,
    color: colors.mediumLightGray,
    marginTop: heightScale(2),
    width: widthScale(180),
    flexWrap: 'nowrap',
  },
  ambulenceWholePriceText: {
    fontWeight: 'bold',
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    color: colors.primary,
    marginLeft: heightScale(3),
  },
  featureHeadingText: {
    fontWeight: '600',
    fontSize: normalize(9),
    fontFamily: fonts.calibri.medium,
    color: colors.black,
    marginTop: heightScale(10),
  },
  featureDetailsText: {
    fontWeight: '600',
    fontSize: normalize(9),
    fontFamily: fonts.calibri.medium,
    color: colors.mediumLightGray,
    marginTop: heightScale(5),
  },
  fairIcon: {
    height: heightScale(11),
    width: widthScale(19),
    marginTop: heightScale(3),
  },
  paymentDetailsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: heightScale(23),
  },
  paymentDetailsHeadingText: {
    fontWeight: 'bold',
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    color: colors.black,
  },
  paymentDetailsCard: {
    backgroundColor: colors.white,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(4),
    borderColor: colors.gray93,
    paddingVertical: heightScale(12),
    paddingHorizontal: widthScale(12),
    marginTop: heightScale(12),
  },
  priceTypeTitle: {
    flexDirection: 'row',
    justifyContent: "space-between"
  },
  priceTypeTitleText: {
    fontWeight: 'bold',
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    color: colors.black,
  },
  priceBreakdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: heightScale(12),
  },
  priceBreakdownText: {
    fontWeight: 'normal',
    fontSize: normalize(10),
    fontFamily: fonts.calibri.bold,
    color: colors.black,
    textAlign: 'center',
  },
  priceBreakdownTitle: {
    color: colors.mediumLightGray,
    fontWeight: 'normal',
    fontSize: normalize(10),
    fontFamily: fonts.calibri.bold,
  },
  grandTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: widthScale(10),
    marginTop: heightScale(10),
  },
  checkBoxContainer: {marginTop: heightScale(21)},
  applyDiscountButton: {
    height: heightScale(35),
    width: widthScale(70),
    backgroundColor: colors.darkGreen2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    height: heightScale(35),
    paddingLeft: widthScale(10),
    borderColor: colors.gray400,
    color: colors.black,
    borderWidth: 1,
    marginRight: widthScale(20),
    marginLeft: widthScale(15),
    width: widthScale(170),
  },
  inputStyles: {
    fontSize: normalize(15),
    lineHeight: normalize(15),
  },
  discountInputCodeContainer: {
    flexDirection: 'row',
    marginTop: heightScale(14),
  },
  checkBoxInputContainer: {
    marginTop: heightScale(30),
  },
  button: {
    backgroundColor: colors.darkGreen2,
    color: colors.white,
    alignItems: 'center',
    paddingVertical: heightScale(12),
    marginTop: heightScale(30),
    borderRadius: moderateScale(100),
    width: '100%',
    marginBottom: heightScale(30),
  },
  buttonText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    color: colors.gray97,
    fontWeight: '600',
  },
  needToNegotiate: {
    color: colors.black,
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(10),
    fontWeight: 'normal',
    marginTop: heightScale(10),
    paddingLeft: widthScale(15),
  },
  checkboxLabel: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  chooseAddOnsButton: {
    height: heightScale(33),
    backgroundColor: colors.yellowLight3,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(10),
    paddingLeft: widthScale(16),
    marginTop: heightScale(27),
  },
  chooseAddOnsButtonText: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(12),
    fontWeight: 'bold',
    color: colors.yellowLight2,
    paddingLeft: widthScale(10),
  },
  astrik: {
    color: colors.lightRed3,
  },
  grandTotalText: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(12),
    fontWeight: '700',
    color: colors.black,
  },
  textStyle2: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.greyishBrownTwo,
    fontWeight: '700',
  },
  toggleContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleDataStyle: {
    width: '28%',
    alignItems: 'center',
    marginTop: heightScale(12),
    paddingVertical: heightScale(10),
    borderWidth: widthScale(1),
    borderColor: colors.whiteSmoke,
    borderRadius: moderateScale(10),
  },
  toggleTextStyle: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    color: colors.greyishBrownTwo,
    fontWeight: '400',
  },
  blockView: {
    marginTop: heightScale(20),
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(12),
    borderRadius: normalize(6),
    borderWidth: widthScale(1),
    borderColor: '#EFEFEF',
  },
  mendatoryErrorsText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    color: colors.red,
    fontWeight: '400',
    marginTop: heightScale(12),
  },
  errorMsg: {
    marginTop: heightScale(3),
    color: colors.red,
    marginLeft: widthScale(5),
    width: widthScale(250),
    fontSize: normalize(12),
  },
  checkBoxContainer: {marginTop: heightScale(21)},
  checkboxText: {
    color: colors.black,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(12),
  },
  checkboxTextBold: {
    color: colors.black,
    fontFamily: fonts.calibri.medium,
    textDecorationLine: 'underline',
    fontSize: normalize(12),
  },
  row: {
    flexDirection: 'row',
  }
});

const mapDispatchToProps = {
  allAddons,
};

const mapStateToProps = ({App}) => {
  const {
    allAddonsLoading,
    allAddonsSuccess,
    allAddonsFail,
    gstValue,
  } = App;
  return {
    allAddonsLoading,
    allAddonsSuccess,
    allAddonsFail,
    gstValue,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AmbulenceBookingAddonsScreen);
