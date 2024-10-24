import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import Modal from 'react-native-modal';
import {Context} from '../../../../providers/localization';
import CheckBox from 'react-native-check-box';
import {
  resolutionReason,
  endTrip,
  resolutionStatus,
  resetEndTrip,
  MyRequestDetailsReset,
} from '../../../../redux/actions/app.actions';
import {connect} from 'react-redux';

import {Resolution} from '../../../../utils/constants';
import {Button} from '../../../BookingFlow/ModalComponent/Button';
import {createSrPayload} from '../../../BookingFlow/utils';
import Toast from 'react-native-simple-toast';
import Loader from '../../../../components/loader';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const CancelTrip = props => {
  const [states, setStates] = useState({
    value: '',
    resolutionReasonId: null,
    jobStatusRequest: null,
    resolutionStatus: null,
  });
  const [value, setValue] = useState();
  const strings = React.useContext(Context).getStrings();
  const {cancelTrip} = strings;

  useEffect(() => {
    props.resolutionStatus({
      serviceSubCategoryIds: props.myRequestDetailsData?.serviceSubCategoryId,
    });
  }, []);

  useEffect(() => {
    if (props.endTripSuccess) {
      props.changeVisible(false);
      props.resetEndTrip();
      props.MyRequestDetailsReset();
      props.onCancellationSuccessfull();
    }
  }, [props.endTripSuccess]);

  useEffect(() => {
    if (props.endTripFail) {
      console.log('EndTripFail', props.endTripFail);
      Toast.showWithGravity(strings.myRequestScreen.unableToCancelTheRequest, Toast.LONG, Toast.TOP);
    }
  }, [props.endTripFail]);

  useEffect(() => {
    if (props.resolutionStatusSuccess) {
      let filteredStatus = props.resolutionStatusSuccess?.data?.content.filter(
        value => {
          return value.validationCode.includes(Resolution.CODE);
        },
      );

      setStates({
        ...states,
        resolutionStatus: filteredStatus,
      });
    }
  }, [props.resolutionStatusSuccess]);

  useEffect(() => {
    if (states.resolutionStatus != null && states.resolutionStatus.length) {
      setStates({
        ...states,
        jobStatusRequest: {
          reasonId: states.resolutionReasonId?.id,
          reasonName: states.resolutionReasonId?.name,
          remarks: states.value,
          resolutionCode: states.resolutionStatus[0].validationCode,
          resolutionId: states.resolutionStatus[0].id,
          resolutionName: states.resolutionStatus[0].name,
        },
      });
    }
  }, [states.resolutionReasonId, states.value, states.resolutionStatus]);

  useEffect(() => {
    if (props.resolutionReasonSuccess) {
      const tempData = props.resolutionReasonSuccess?.data?.content.map(
        item => {
          return {...item, isChecked: false};
        },
      );

      setValue(tempData);
    }
  }, [props.resolutionReasonSuccess]);

  useEffect(() => {
    if (states.resolutionStatus != null && states.resolutionStatus.length) {
      props.resolutionReason(states.resolutionStatus[0].id, 'CUSTOMER');
    }
  }, [states.resolutionStatus]);

  function handleToggleMyList(id) {
    const myList = [...value];
    const uncheckedList = myList.map(item => {
      return {...item, isChecked: false};
    });
    const cancelReason = uncheckedList.find(a => a.id === id);
    cancelReason.isChecked = true;
    setStates({...states, resolutionReasonId: cancelReason});
    setValue(uncheckedList);
  }
  const payloadCreation = item => {
    const formValues = {
      addonsData: [],
      age: item?.age,
      ageUnit: item?.ageUnit?.id,
      bloodGroup: item?.bloodGroup?.id,
      bookFor: {
        id: item?.bookAmbulanceFor,
        name: item?.bookAmbulanceFor,
      },
      bookingDateTime: item?.bookingDateTime,
      couponCode: item?.couponCode,
      discountCode: null,
      dropAddress: item?.dropLocation,
      dropFlat: item?.dropFlatLocation,
      dropLandmark: item?.dropLandmarkLocation,
      dropLatLong: [item?.dropLocationLatitude, item?.dropLocationLongitude],
      dropType: {id: item?.dropLocationType, name: item?.dropLocationType},
      gender: item?.gender?.id || item?.gender,
      instructions: item?.instruction,
      isPatientCritical: item?.isPatientCritical,
      isPatientOnOxygen: item?.isPatientOnOxygen,
      isPatientOnVentilator: item?.isPatientOnVentilator,
      medicalConditionsObj: item?.victimMedicalConditions,
      medicalCondition: [item?.victimMedicalConditions?.primaryComplaintId],
      negotiationAmount: '',
      numberOfIndividualsWithPatient: item?.individualsWithPatient,
      patientContact: item?.victimPhoneNumber,
      patientName: item?.victimName,
      paymentMode: '',
      pickUpLatLong: [
        item?.pickupLocationLatitude,
        item?.pickupLocationLongitude,
      ],
      pickupAddress: item?.pickupLocation,
      pickupFlat: item?.pickFlatLocation,
      pickupLandmark: item?.pickLandmarkLocation,
      pickupType: {
        id: item?.pickupLocationType,
        name: item?.pickupLocationType,
      },
      relation: item?.callerRelation,
      vehicleDetails: item?.vehicleTypeData,
      vehicleDetailsApiResponse:
        item?.vendorVehicleDetailResource?.vehicleDetail,
      vehicleType: item?.vehicleTypeObj,
      whenAmbulanceRequired: {
        id: item?.bookAmbulanceFor,
        name: item?.bookAmbulanceFor,
      },
    };
    const details = {
      callerEmail: item?.callerEmail,
      callerName: item?.callerName,
      callerPhoneNumber: item?.callerPhoneNumber,
      clientId: item?.clientId,
      code: item?.clientResource?.projectTypeNumber,
      projectTypeNumber: item?.clientResource?.projectTypeNumber,
      validationCode: null,
      locationType: item?.pickupLocationType,
      name: 'Private',
      id: 5,
    };
    const requestType = item?.requestType?.id;

    const tempSrCancelPayload = createSrPayload(
      formValues,
      details,
      requestType,
    );
    let srCancelPayload = {
      aht: tempSrCancelPayload.aht,
      dispatchPriority: 'HIGH',
      isCallerLocation: false,
      isCallerVictim: false,
      isParent: false,
      leadId: null,
      resolutionSrStatus: tempSrCancelPayload.resolutionSrStatus,
      source: tempSrCancelPayload.source,
      type: 'UPDATE',
      requestType: tempSrCancelPayload.requestType,
      victimRequest: tempSrCancelPayload.victimRequest,
      serviceRequest: {
        ...tempSrCancelPayload.serviceRequests[0],
        paymentOption: item?.paymentOption,
        addonsCalculationRequests: [],
      },
      dispatchRequest: {
        aht: tempSrCancelPayload.aht,
        dispatchType: 'ONLINE',
        dropLocationLatitude: item?.dropLocationLatitude,
        dropLocationLongitude: item?.dropLocationLongitude,
        pickupLocationLatitude: item?.pickupLocationLatitude,
        pickupLocationLongitude: item?.pickupLocationLongitude,
        locationType: item?.pickupLocationType,
        dropAddressType: item?.dropLocationType,
        resolutionCode: states.jobStatusRequest.resolutionCode,
        resolutionId: states.jobStatusRequest.resolutionId,
        resolutionName: states.jobStatusRequest.resolutionName,
        resolutionReasonId: states.jobStatusRequest.reasonId,
        resolutionReasonName: states.jobStatusRequest.reasonName,
        resolutionSrStatus: 'CLOSE',
        serviceRequestNumber: item?.serviceRequestNumber,
        jobRequests: [],
      },
    };

    return srCancelPayload;
  };

  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={() => props.changeVisible(false)}
      style={styles.modal}>
      <View style={styles.mainView}>
        {(props.resolutionStatusLoading ||
          props.resolutionReasonLoading ||
          props.endTripLoading) && <Loader />}
        <View style={styles.innerView}>
          <View style={styles.headingView}>
            <Text style={styles.modalTitle}>{cancelTrip.cancelTrip}</Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.cancelMsgView}>
              <Text style={styles.cancelText}>{cancelTrip.charges}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.title}>{cancelTrip.resolutionReason}</Text>
            </View>

            {value?.map((item, index) => {
              return (
                <View
                  style={
                    item.isChecked ? styles.checkedView : styles.uncheckedView
                  }>
                  <CheckBox
                    style={{flex: 1, padding: 10}}
                    isChecked={item.isChecked}
                    onClick={() => {
                      handleToggleMyList(item.id);
                    }}
                    rightTextView={
                      <View>
                        <Text
                          style={
                            item.isChecked
                              ? styles.reasonSelectedText
                              : styles.reasonText
                          }>
                          {item.name}
                        </Text>
                      </View>
                    }
                    checkedCheckBoxColor={colors.primary}
                    unCheckedCheckBoxColor={colors.tripGray}
                  />
                </View>
              );
            })}

            <View style={styles.buttonView}>
              <View style={styles.buttonStyle}>
                <Button
                  disabled={!states.jobStatusRequest ? true : false}
                  style={{backgroundColor: colors.primary}}
                  text={strings.common.yes}
                  textStyle={{color: colors.white}}
                  onPress={() => {
                    let temp = {};
                    if (!states.resolutionReasonId) {
                      Toast.showWithGravity(cancelTrip.selectCancellationReason, Toast.LONG, Toast.TOP);
                    return;
                    }
                    if (props.jobId) {
                      temp = {
                        jobId: props.jobId,
                        jobStatusRequest: states.jobStatusRequest,
                        dropLocation: null,
                        addonsCalculationRequests: [],
                      };
                    } else {
                      let payload = payloadCreation(props.myRequestDetailsData);
                      temp = {
                        ...payload,
                        jobId: props.jobId,
                        srId: props.srId,
                        dispatchMedical: props.myRequestDetailsData?.data
                          ?.isBookForLater
                          ? 'BOOKED_REQUEST'
                          : props.myRequestDetailsData?.data?.negotiatedAmount >
                            0
                          ? 'NEGOTIATION'
                          : 'PENDING',
                      };
                    }

                    props.endTrip(temp);
                  }}
                />
              </View>
              <View style={styles.buttonStyle}>
                <Button
                  style={styles.button}
                  text={strings.common.no}
                  textStyle={{color: colors.primary}}
                  onPress={() => {
                    props.changeVisible(false);
                  }}
                />
              </View>
            </View>
          </ScrollView>
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
    paddingTop: heightScale(20),
  },
  innerView: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    maxHeight: heightScale(350),
  },
  headingView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: heightScale(22),
    marginHorizontal: widthScale(36),
  },

  buttonView: {
    marginVertical: heightScale(22),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthScale(22),
  },

  button: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: normalize(50),
  },

  cancelMsgView: {
    backgroundColor: colors.PaleBlue,
    borderRadius: moderateScale(4),
    marginTop: heightScale(22),
    padding: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  cancelText: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    fontSize: moderateScale(12),
    width: '94%',
    color: colors.Red,
    textAlign: 'center',
  },

  title: {
    marginTop: heightScale(20),
    fontSize: normalize(13),
    color: colors.DarkGray,
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    marginHorizontal: widthScale(22),
  },

  row: {
    flexDirection: 'row',
  },

  buttonStyle: {width: widthScale(125), height: heightScale(45)},

  modalTitle: {
    fontSize: moderateScale(16),
    fontFamily: fonts.calibri.bold,
    textAlign: 'center',
    color: colors.DarkGray,
  },
  checkedView: {
    flexDirection: 'row',
    marginHorizontal: widthScale(18),
    backgroundColor: colors.LightGrey7,
    borderRadius: normalize(20),
    paddingHorizontal: widthScale(6),
  },
  uncheckedView: {
    flexDirection: 'row',
    marginHorizontal: widthScale(18),
    paddingHorizontal: widthScale(6),
  },
  reasonText: {
    color: colors.DimGray2,
    fontFamily: fonts.calibri.regular,
    marginLeft: widthScale(5),
    fontSize: normalize(13),
  },
  reasonSelectedText: {
    color: colors.primary,
    fontFamily: fonts.calibri.semiBold,
    marginLeft: widthScale(5),
    fontSize: normalize(13),
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
  resetEndTrip,
  MyRequestDetailsReset,
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelTrip);
