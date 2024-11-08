import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Config from 'react-native-config';
import {StompEventTypes, withStomp} from 'react-stompjs';
import {colors, scaling, fonts} from '../../../library';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DottedVertical from '../DottedVerticalLine';
import PickAddress from '../PickAddress';
import AmbulanceAndPaymentDetail from './AmbulanceAndPaymentDetail';
import {BackArrow} from '../../../components/BackArrow';
import CustomButton from '../../../components/CustomButton';
import PatientDetails from './PatientDetails';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {RequestTypeKeys, requestTypeConstant} from '../../../utils/constants';
import {
  projectConfigAction,
  srCreationApi,
  resetSrCreationApi,
  resetGetMembersApi,
  addRequest,
  resetAddRequest,
  resolutionStatus,
  resetValidateCoupon,
  MyRequestDetailsReset,
  airAmbulanceMasterData,
} from '../../../redux/actions/app.actions';
import IntercityModal from '../../HomeScreen/ModalComponent/InterCityModal';
import {
  bookFor,
  createSrPayload,
  whenAmbulanceRequired,
  genderData,
} from '../utils';
import FollowUp from '../../BookingFlow/ModalComponent/FollowUp';
import ConfirmingBooking from '../../BookingFlow/ModalComponent/ConfirmingBooking';
import {Context} from '../../../providers/localization';
import {BookLaterModal} from '../Modal/BookLaterComponent';
import {searchAmbulanceApi} from '../../../redux/api/app.api';
import {navigations} from '../../../constants';
import RequestCreated from '../../BookingFlow/ModalComponent/RequestCreated';
import {MyRequestDetails} from '../../../redux/actions/app.actions';
import Loader from '../../../components/loader';
import NoAmbulanceFound from '../Modal/NoAmbulanceFound';
import Input from '../../../components/Input';
import SelectAirport from '../Component/SelectAirport';
import {requestTypeConstantValues} from '../../../utils/constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {callFollowUpRequired as callFollowUpRequiredApi} from '../../../redux/api/app.api';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const Fields = {
  AmbulanceDetails: 'AmbulanceDetails',
  PatientDetails: 'PatientDetails',
};

function BookingInfo(props) {
  const {type, vehicleType, srDetails = {}, corporateBookingData = {}} = props?.route?.params;
  const strings = useContext(Context).getStrings();
  const {groundAmbulance} = strings;

  let rootSubscribed = useRef(null).current;
  let serviceRequestNumber = useRef(null);
  let serviceRequestId = useRef(null);
  let isPrimaryVendor = useRef(null);
  let timer = useRef(null);
  let totalTimeInMinutes = useRef(null);
  const {bottom} = useSafeAreaInsets();

  const [isDetailsVisible, setDetailsVisible] = useState(true);
  const [displayField, setDisplayFields] = useState(Fields[0]);
  const [isBookLaterModalOpen, setBookLaterModalOpen] = useState(false);
  const [isPickDropSame, setIsPickDropSame] = useState(null);
  const [isPickDropNotFilled, setPickupDropNotFilled] = useState(true);
  const [dateTimeError, setDateTimeError] = useState(false);

  const [airportListingData, setAirportListingData] = useState({content: []});
  const [followUpData, setFollowUpData] = useState({
    isVisible: false,
    serviceRequestId: '',
  });
  const [confirmingBookingData, setConfirmingBookingData] = useState({
    isVisible: false,
    data: {},
  });
  const [totalPrice, setTotalPrice] = useState({vehiclePrice: '', gst: ''});
  const [loader, setLoader] = useState(false);
  const [requestCreatedData, setRequestCreatedData] = useState({
    isVisible: false,
    data: '',
  });
  const [bookingConfirmedData, setBookingConfirmedData] = useState({
    isVisible: false,
  });
  const [noAmbulanceFound, setNoAmbulanceFound] = useState({
    isVisible: false,
    data: {},
  });
  const [intercityModalVisible, setIntercityModal] = useState(false);
  const [airPortListData, setAirportListData] = useState({
    searchText: '',
    pageNo: 0,
    pageSize: 50,
  });
  const [selectedPickupAirport, setSelectedPickupAirport] = useState();
  const [selectedDropAirport, setSelectedDropAirport] = useState();
  const [startDateOpen, setDateOpen] = useState(false);

  //used only for dev to check locations
  const [locationData, setLocationData] = useState(null);

  const {stompContext} = props;
  const intercityKm = JSON.parse(
    props.configurationSuccess?.data[0]?.metadata,
  )?.intercityKm;

  let airAmbulanceTat, ambulanceTat;
  const laterBookingTat = props.globalConfigurationSuccess?.data.filter(
    item => {
      return item?.globalConfigTypeResource?.id == 'LATER_BOOKING_TAT';
    },
  );
  if (laterBookingTat && laterBookingTat.length) {
    const temporaryTime =
      typeof laterBookingTat[0]?.data == 'string'
        ? JSON.parse(laterBookingTat[0]?.data)
        : laterBookingTat[0]?.data;
    ambulanceTat = moment().add(temporaryTime?.timeInMinutes, 'm').valueOf();
    airAmbulanceTat = moment()
      .add(temporaryTime?.airAmbulanceTimeInMinutes, 'm')
      .valueOf();
  } else {
    ambulanceTat = moment().valueOf();
    airAmbulanceTat = moment().valueOf();
  }
  useEffect(() => {
    props.airAmbulanceMasterData({
      pageNo: airPortListData.pageNo,
      pageSize: airPortListData.pageSize,
      searchText: airPortListData.searchText,
      masterDataType: RequestTypeKeys[type],
    });
  }, [airPortListData, airPortListData.searchText]);

  useEffect(() => {
    const _projectConfigData = {
      clientId: Config.CLIENT_ID,
      projectTypeNumber: Config.PROJECT_TYPE_NUMBER,
    };
    props.projectConfigAction(_projectConfigData);
  }, []);

  useEffect(() => {
    if (props.airAmbulanceMasterDataSuccess) {
      let tempData = {...props.airAmbulanceMasterDataSuccess?.data};
      if (airPortListData.pageNo > 0) {
        let requestListingObject = {...airportListingData};
        requestListingObject.content = [
          ...requestListingObject?.content,
          ...tempData?.content,
        ];
        setAirportListingData(requestListingObject);
      } else {
        setAirportListingData(tempData);
      }
    }
  }, [props.airAmbulanceMasterDataSuccess]);

  const onSelectedAddress = (type, selectedAddress) => {
    if (type === 'FROM') {
      props.setValues('pickupAddress', selectedAddress.address);
      props.setValues('pickUpLatLong', [
        selectedAddress.latitude,
        selectedAddress.longitude,
      ]);
    } else {
      props.setValues('dropAddress', selectedAddress.address);
      props.setValues('dropLatLong', [
        selectedAddress.latitude,
        selectedAddress.longitude,
      ]);
    }
  };

  const onSelectAirPort = (type, selectedAirport) => {
    if (selectedAirport) {
      if (type === 'FROM') {
        setSelectedPickupAirport(selectedAirport);
        props.setValues('pickupAddress', selectedAirport?.name);
        props.setValues('pickupFlat', selectedAirport?.fullAddress);
        props.setValues('pickUpLatLong', [
          selectedAirport?.latitude,
          selectedAirport?.longitude,
        ]);
        setAirportListData({
          pageNo: 0,
          pageSize: 50,
          searchText: '',
        });
      } else {
        setSelectedDropAirport(selectedAirport);
        props.setValues('dropAddress', selectedAirport?.name);
        props.setValues('dropFlat', selectedAirport?.fullAddress);
        props.setValues('dropLatLong', [
          selectedAirport?.latitude,
          selectedAirport?.longitude,
        ]);
        setAirportListData({
          pageNo: 0,
          pageSize: 50,
          searchText: '',
        });
      }
    }
  };

  const clearAddress = type => {
    if (type === 'FROM') {
      props.setValues('pickupAddress', '');
      props.setValues('pickUpLatLong', [0, 0]);
    } else {
      props.setValues('dropAddress', '');
      props.setValues('dropLatLong', [0, 0]);
    }
  };

  function isPickupAndDropLocationSame(pickupLatLng, dropLatLng) {
    if (
      String(pickupLatLng[0]) === String(dropLatLng[0]) &&
      String(pickupLatLng[1]) === String(dropLatLng[1])
    ) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (
      isPickupAndDropLocationSame(
        props.formValues.pickUpLatLong,
        props.formValues.dropLatLong,
      ) &&
      props.formValues.pickUpLatLong[0]
    ) {
      setIsPickDropSame(true);
    } else {
      setIsPickDropSame(false);
    }
  }, [props.formValues.pickUpLatLong, props.formValues.dropLatLong]);

  useEffect(() => {
    if (
      props.formValues.pickupAddress === '' ||
      props.formValues.dropAddress === ''
    ) {
      setPickupDropNotFilled(true);
    } else {
      setPickupDropNotFilled(false);
    }
  }, [props.formValues.pickupAddress, props.formValues.dropAddress]);

  const loadMoreAirPortData = () => {
    if (
      airPortListData.pageNo + 1 <
      props.airAmbulanceMasterDataSuccess?.data?.totalPages
    ) {
      setAirportListData({
        ...airPortListData,
        pageNo: airPortListData.pageNo + 1,
      });
    }
  };

  const handleSearchAmbulancePress = () => {
    if (
      (type === requestTypeConstant.GroundAmbulance ||
        type === requestTypeConstant.petVeterinaryAmbulance) &&
      props.formValues.pickUpLatLong.length == 2 &&
      props.formValues.dropLatLong.length == 2 &&
      props.formValues.vehicleType
    ) {
      const objectToSend = {
        pickupLat: props.formValues.pickUpLatLong[0],
        pickupLong: props.formValues.pickUpLatLong[1],
        dropLat: props.formValues.dropLatLong[0],
        dropLong: props.formValues.dropLatLong[1],
        bookingCategory: type,
        vehicleType: props.formValues?.vehicleType?.id,
      };
      setLoader(true);
      //Directly generate lead
      handleSOSSubmit();
      // searchAmbulanceApi(objectToSend)
      //   .then(res => {
      //     const tempData = res.data?.data || {};
      //     props.setValues('vehicleDetailsApiResponse', tempData);
      //     if (tempData?.distance?.distance / 1000 > intercityKm) {
      //       setIntercityModal(true);
      //     }
      //     setLocationData(res.data.data);
      //     setTotalPrice({
      //       vehiclePrice: tempData?.vehicleTypeData[0].vehiclePrice,
      //       gst: tempData?.vehicleTypeData[0].gst,
      //     });
      //     const tempVehicleData =
      //       (tempData.vehicleTypeData &&
      //         tempData.vehicleTypeData.length && {
      //           ...tempData.vehicleTypeData[0],
      //           ...tempData.distance,
      //           areaType: tempData.areaType,
      //           areaCode: tempData.areaCode,
      //         }) ||
      //       {};
      //     props.setValues('vehicleDetails', tempVehicleData);
      //     setLoader(false);
      //   })
      //   .catch(e => {
      //     setLoader(false);
      //     const _code = e?.response?.data?.apierror?.code;
      //     if (_code === 'ZQTZA0053' || _code === 'ZQTZA0054') {
      //       handleSOSSubmit();
      //     }
      //   });
    } else if (
      type === requestTypeConstant.doctorAtHome &&
      props.formValues.pickUpLatLong.length == 2 &&
      props.formValues.vehicleType
    ) {
      const objectToSend = {
        pickupLat: props.formValues.pickUpLatLong[0],
        pickupLong: props.formValues.pickUpLatLong[1],
        bookingCategory: type,
        vehicleType: props.formValues?.vehicleType?.id,
      };
      setLoader(true);
      searchAmbulanceApi(objectToSend)
        .then(res => {
          const tempData = res.data?.data || {};
          props.setValues('vehicleDetailsApiResponse', tempData);
          if (tempData?.distance?.distance / 1000 > intercityKm) {
            setIntercityModal(true);
          }
          setTotalPrice({
            vehiclePrice: tempData?.vehicleTypeData[0].vehiclePrice,
            gst: tempData?.vehicleTypeData[0].gst,
          });
          const tempVehicleData =
            (tempData.vehicleTypeData &&
              tempData.vehicleTypeData.length && {
                ...tempData.vehicleTypeData[0],
                ...tempData.distance,
                areaType: tempData.areaType,
                areaCode: tempData.areaCode,
              }) ||
            {};
          props.setValues('vehicleDetails', tempVehicleData);
          setLoader(false);
        })
        .catch(e => {
          setLoader(false);
          console.log(
            e?.response?.data?.apierror?.code,
            'vehicleSearchapi response',
          );
          const _code = e?.response?.data?.apierror?.code;
          if (_code === 'ZQTZA0053' || _code === 'ZQTZA0054') {
            handleSOSSubmit();
          }
        });
    }
  };

  useEffect(() => {
    if (props.addRequestSuccess) {
      props.resetAddRequest();
      setNoAmbulanceFound({
        isVisible: true,
        data: {
          isRequestAlreadyCreated: true,
        },
      });
    }
  }, [props.addRequestSuccess]);

  useEffect(() => {
    if (props.addRequestFail) {
      const errMsg =
        props.addRequestFail?.errors?.response?.data?.apierror?.code || '';
      if (errMsg) {
        if (errMsg === 'ZQTZA0037') {
          setNoAmbulanceFound({
            isVisible: true,
            data: {
              isRequestAlreadyCreated: true,
            },
          });
        } else {
          Toast.showWithGravity(strings.common.somethingWentWrong , Toast.LONG, Toast.TOP);
        }
        props.resetAddRequest();
      }
    }
  }, [props.addRequestFail]);

  const handleSOSSubmit = () => {
    const profileData = props.getProfileSuccess?.data || {};
    props.addRequest({
      challanNo: `CustomerApp${moment().format('DDMMYYYY')}`,
      contactno: profileData?.mobile,
      callerName: profileData?.firstName,
      latitude: props.formValues.pickUpLatLong[0],
      longitude: props.formValues.pickUpLatLong[1],
      citizenId: profileData?.id,
      incidentAddress: props.formValues.pickupAddress,
      for: 'Self',
      remarks: `Request for ${requestTypeConstantValues[type]}`,
      age: profileData?.age,
      requestType: type,
    });
  };

  useEffect(() => {
    if (
      (type === requestTypeConstant.GroundAmbulance ||
        type === requestTypeConstant.petVeterinaryAmbulance) &&
      props.formValues.pickUpLatLong[0] &&
      props.formValues.dropLatLong[0] &&
      !isPickupAndDropLocationSame(
        props.formValues.pickUpLatLong,
        props.formValues.dropLatLong,
      ) &&
      type !== requestTypeConstant.airAmbulance &&
      type !== requestTypeConstant.trainAmbulance
    ) {
      props.resetValidateCoupon();
      handleSearchAmbulancePress();
    } else if (
      type === requestTypeConstant.doctorAtHome &&
      props.formValues.pickUpLatLong[0] &&
      props?.formValues?.vehicleType?.id
    ) {
      props.resetValidateCoupon();
      handleSearchAmbulancePress();
    }
  }, [
    props.formValues.pickUpLatLong,
    props.formValues.dropLatLong,
    props?.formValues?.vehicleType,
    isPickDropSame,
  ]);

  const handleConfirmBookingPress = () => {
    const data = props.projectConfigSuccess?.data || {};
    const bookingCategory = type;
    const tempEmergencyService =
      (data.projectPreferenceResources &&
        data.projectPreferenceResources.length &&
        data.projectPreferenceResources[0]) ||
      {};
    const _emergencyService = tempEmergencyService.emergencyService || {};
    const profileData = props.getProfileSuccess?.data || {};

    const _details = {
      ..._emergencyService,
      clientId: data.client?.id,
      projectTypeNumber: data.projectTypeNumber,
      callerPhoneNumber: profileData.mobile,
      callerName: profileData.name,
      callerEmail: profileData.email,
    };

    const _requestPayload = createSrPayload(
      props.formValues,
      _details,
      bookingCategory,
      corporateBookingData,
    );
    console.log(_requestPayload, '_requestPayload');
    props.srCreationApi(_requestPayload);
  };

  const establishSocketIOConnection = () => {
    stompContext.newStompClient(`${Config.BOOKING_SOCKET_URL}`);
  };

  const callFollowUp = srId => {
    setLoader(true);
    callFollowUpRequiredApi({
      isFollowUpRequired: true,
      serviceRequestId: srId,
    })
      .then(res => {
        const _data = res?.data?.data;
        setLoader(false);
        setRequestCreatedData({
          isVisible: true,
          data: _data,
        });
      })
      .catch(err => {
        Toast.showWithGravity(
          strings.common.somethingWentWrong,
          Toast.LONG,
          Toast.TOP,
        );
        setLoader(false);
      });
  };

  useEffect(() => {
    return () => {
      props.resetValidateCoupon();
    };
  });

  useEffect(() => {
    if (
      (type === requestTypeConstant.airAmbulance ||
        type === requestTypeConstant.trainAmbulance) &&
      props.getProfileSuccess?.data
    ) {
      const objectToChange = {
        patientName: props.getProfileSuccess?.data?.name || '',
        age: props.getProfileSuccess?.data?.age?.toString() || '',
        gender: props.getProfileSuccess?.data?.gender || genderData[0].id,
        bloodGroup: props.getProfileSuccess?.data?.bloodGroup || null,
        patientContact: props.getProfileSuccess?.data?.mobile || '',
        medicalConditionsObj: [
          {
            _index: 6,
            code: null,
            id: 24,
            locationType: null,
            name: 'Other',
            validationCode: 'OTHER',
          },
        ],
      };
      props.setFormValues(preVal => ({
        ...preVal,
        ...objectToChange,
      }));
    }
  }, []);

  useEffect(() => {
    if (props.srCreationSuccess) {
      const {data} = props.srCreationSuccess;
      serviceRequestNumber.current = data?.serviceRequestNumber;
      serviceRequestId.current = data?.id;
      isPrimaryVendor.current = data?.isPrimaryVendor;
      timer.current = data?.timer;
      totalTimeInMinutes.current = data?.totalTimeInMinutes;
      setDetailsVisible(false);
      if (data.vendorCountInArea) {
        establishSocketIOConnection();
      } else if (data.vendorCountInArea === 0) {
        setFollowUpData({
          isVisible: true,
          serviceRequestId: data.id,
        });
      } else if (data.vendorCountInArea === null) {
        setRequestCreatedData({
          isVisible: true,
          data: data?.serviceRequestNumber,
        });
      }
    }
    if (props.srCreationFail) {
      console.log('srCreationFail=====>>>>', props.srCreationFail);
    }
  }, [props.srCreationSuccess, props.srCreationFail]);

  useEffect(() => {
    stompContext.addStompEventListener(StompEventTypes.Connect, res => {
      console.log('===> Connect', res);
      setConfirmingBookingData({
        isVisible: true,
        data: {
          isPrimaryVendorEnable: isPrimaryVendor.current,
          timer: timer.current,
          totalTimeInMinutes: totalTimeInMinutes.current,
          srId: serviceRequestId.current,
        },
      });
      rootSubscribed = stompContext
        .getStompClient()
        .subscribe(`/service-requests/${serviceRequestNumber.current}`, res => {
          if (res && res.body) {
            stompContext.removeStompEventListener(StompEventTypes.Connect);
            stompContext.removeStompEventListener(StompEventTypes.Error);
            stompContext.removeStompEventListener(
              StompEventTypes.WebSocketError,
            );
            stompContext.removeStompEventListener(StompEventTypes.Disconnect);
            stompContext.removeStompEventListener(
              StompEventTypes.WebSocketClose,
            );
            stompContext.removeStompClient();

            setConfirmingBookingData({isVisible: false, data: {}});
            const detailsObj = JSON.parse(res.body);

            if (
              detailsObj.jobNumber !== null &&
              detailsObj.vehicleRegistrationNumber !== null
            ) {
              props.MyRequestDetails({
                srId: serviceRequestId.current,
              });
              setBookingConfirmedData({isVisible: true});
            } else {
              // setFollowUpData({
                // isVisible: true,
                // serviceRequestId: serviceRequestId.current,
              // });
            }
            rootSubscribed?.unsubscribe();
          }
        });
    });
    stompContext.addStompEventListener(StompEventTypes.Error, res => {
      console.log('===> Error', res);
    });
    stompContext.addStompEventListener(StompEventTypes.WebSocketError, res => {
      console.log('===> WebSocketError', res);
    });
    stompContext.addStompEventListener(StompEventTypes.Disconnect, res => {
      console.log('===> Disconnect', res);
    });
    stompContext.addStompEventListener(StompEventTypes.WebSocketClose, res => {
      console.log('===> WebSocketClose', res);
    });

    return () => {
      stompContext.removeStompEventListener(StompEventTypes.Connect);
      stompContext.removeStompEventListener(StompEventTypes.Error);
      stompContext.removeStompEventListener(StompEventTypes.WebSocketError);
      stompContext.removeStompEventListener(StompEventTypes.Disconnect);
      stompContext.removeStompEventListener(StompEventTypes.WebSocketClose);
      stompContext.removeStompClient();
      rootSubscribed?.unsubscribe();
      props.resetSrCreationApi();
    };
  }, []);

  useEffect(() => {
    if (
      props.myRequestDetailsSuccess &&
      type !== requestTypeConstant.airAmbulance &&
      type !== requestTypeConstant.trainAmbulance
    ) {
      const {data} = props.myRequestDetailsSuccess;
      props.navigation.navigate(navigations.LiveTracking, {
        jobNumber: data.vendorVehicleDetailResource?.vehicleStatus?.jobNumber,
        vehicalRegistrationNumber: data?.vehicleRegistrationNumber,
        parkingLocation: {
          latitude:
            data?.vendorVehicleDetailResource?.vehicleDetail?.parkingBayLat,
          longitude:
            data?.vendorVehicleDetailResource?.vehicleDetail?.parkingBayLong,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        patientLocation: {
          latitude: data?.pickupLocationLatitude,
          longitude: data?.pickupLocationLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        requestType: data?.requestType?.id,
        details: data || {},
        isMenuIcon: true,
      });
      props.MyRequestDetailsReset();
    }
  }, [props.myRequestDetailsSuccess]);

  useEffect(() => {
    if (Object.keys(srDetails).length) {
      serviceRequestNumber.current = srDetails.serviceRequestNumber;
      serviceRequestId.current = srDetails.id;
      isPrimaryVendor.current = srDetails.isPrimaryVendor;
      timer.current = srDetails.timer;
      totalTimeInMinutes.current = srDetails.totalTimeInMinutes;
      setDetailsVisible(false);
      establishSocketIOConnection();
    }
  }, [srDetails]);

  const handleBookLater = (item, dateTime) => {
    props.setValues('whenAmbulanceRequired', item);
    getTheDate(dateTime);
    setBookLaterModalOpen(false);
  };

  const getTheDate = date => {
    props.setFormValues(preVal => ({
      ...preVal,
      ['bookingDateTime']: date,
    }));
  };

  const confirmBookingButtonDisabled = () => {
    if (
      type === requestTypeConstant.GroundAmbulance ||
      type === requestTypeConstant.petVeterinaryAmbulance
    ) {
      if (
        isPickDropSame ||
        isPickDropNotFilled ||
        !props?.formValues?.vehicleType
      ) {
        return true;
      }
    }

    if (type === requestTypeConstant.doctorAtHome) {
      if (
        props?.formValues?.pickupAddress === '' ||
        !props?.formValues?.vehicleType
      ) {
        return true;
      }
    }

    if (
      type === requestTypeConstant.airAmbulance ||
      type === requestTypeConstant.trainAmbulance
    ) {
      if (isPickDropSame || isPickDropNotFilled) {
        return true;
      }
    }

    if (
      type === requestTypeConstant.airAmbulance ||
      type === requestTypeConstant.trainAmbulance
    ) {
      const {bookingDateTime, numberOfIndividualsWithPatient} =
        props.formValues;
      let isDetailField =
        bookingDateTime !== '' && numberOfIndividualsWithPatient !== '';
      return !isDetailField;
    }

    if (
      type !== requestTypeConstant.petVeterinaryAmbulance &&
      displayField === Fields.PatientDetails
    ) {
      const {patientName, age, medicalCondition} = props.formValues;
      let isDetailField =
        patientName !== '' && age !== '' && medicalCondition.length;
      return !isDetailField;
    } else if (
      type === requestTypeConstant.petVeterinaryAmbulance &&
      displayField === Fields.PatientDetails
    ) {
      const {
        patientName,
        age,
        medicalCondition,
        travellerMobile,
        travellerName,
        animalCategory,
        animalBreed,
      } = props.formValues;

      if (props.formValues.bookFor.id === bookFor[0].id) {
        let isDetailField =
          patientName !== '' &&
          medicalCondition.length &&
          animalCategory &&
          animalBreed &&
          Object.keys(animalCategory)?.length &&
          Object.keys(animalBreed)?.length;
        return !isDetailField;
      } else {
        let isDetailField =
          travellerName !== '' &&
          travellerMobile !== '' &&
          medicalCondition.length &&
          animalCategory &&
          animalBreed &&
          Object.keys(animalCategory)?.length &&
          Object.keys(animalBreed)?.length;
        return !isDetailField;
      }
    } else {
      return false;
    }
  };

  const confirmButton = () => {
    return (
      <View style={[styles.bottomLocationView]}>
        <View style={styles.footerButtonContainer}>
          <View
            style={{
              marginRight: widthScale(20),
              ...styles.footerSubButtonContainerContainer,
            }}>
            <BackArrow
              onPress={() => {
                displayField === Fields.PatientDetails
                  ? setDisplayFields(Fields.AmbulanceDetails)
                  : props.navigation.goBack();
              }}
              style={{marginTop: 0}}
            />
          </View>
          <View
            style={{
              flex: 1,
              ...styles.footerSubButtonContainerContainer,
            }}>
            <CustomButton
              disabled={confirmBookingButtonDisabled()}
              loading={loader || props.srCreationLoading}
              onPress={() => {
                handleConfirmClick();
              }}
              title={
                displayField === Fields.PatientDetails
                  ? groundAmbulance[type].bookAmbulance
                  : groundAmbulance[type].confirm
              }
              titleTextStyles={{
                fontSize: normalize(16),
              }}
              containerStyles={{flex: 0}}
              leftIconContainerStyles={{flex: 0}}
              rightIconContainerStyles={{flex: 0}}
            />
          </View>
        </View>
      </View>
    );
  };

  const totalPriceWithGST =
    totalPrice.vehiclePrice || totalPrice.gst
      ? totalPrice.vehiclePrice + totalPrice.gst
      : null;

  const handleConfirmClick = () => {
    if (
      type === requestTypeConstant.airAmbulance ||
      type === requestTypeConstant.trainAmbulance
    ) {
      setDateTimeError(false);
      handleConfirmBookingPress();
    } else {
      if (displayField === Fields.PatientDetails) {
        handleConfirmBookingPress();
      } else {
        setDisplayFields(Fields.PatientDetails);
      }
    }
  };

  const tat =
    type === requestTypeConstant.airAmbulance ||
    type === requestTypeConstant.trainAmbulance
      ? airAmbulanceTat
      : ambulanceTat;

  return (
    <>
      <View
        style={[
          {backgroundColor: colors.white},
          {marginTop: heightScale(-20)},
          displayField === Fields.PatientDetails && {flex: 1},
        ]}>
        <View
          style={{
            backgroundColor: colors.white,
            borderTopLeftRadius: moderateScale(20),
            borderTopRightRadius: moderateScale(20),
            paddingBottom: bottom + Platform.OS === 'ios' ? 10 : 20,
          }}>
          {isBookLaterModalOpen && (
            <BookLaterModal
              ambulanceTat={tat}
              bookFor={props.formValues.whenAmbulanceRequired}
              isVisible={isBookLaterModalOpen}
              setBookLaterModalOpen={setBookLaterModalOpen}
              onConfirm={handleBookLater}
              getTheDate={getTheDate}
              bookForLaterDateAndTime={new Date(tat)}
              requestType={type}
            />
          )}

          {isDetailsVisible && (
            <View
              style={{
                marginVertical: heightScale(5),
              }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always">
                <View
                  style={{
                    marginHorizontal: widthScale(20),
                  }}>
                  {type !== requestTypeConstant.airAmbulance &&
                  type !== requestTypeConstant.trainAmbulance ? (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      {type !== requestTypeConstant.doctorAtHome ? (
                        <DottedVertical />
                      ) : (
                        <View style={styles.redDot} />
                      )}
                      <View style={{flex: 1, paddingVertical: heightScale(6)}}>
                        <PickAddress
                          label={
                            type === requestTypeConstant.doctorAtHome
                              ? strings.bookingFlow.address
                              : strings.bookingFlow.from
                          }
                          placeholder={strings.bookingFlow.selectFromAddress}
                          lat={props.formValues.pickUpLatLong[0]}
                          long={props.formValues.pickUpLatLong[1]}
                          address={props.formValues.pickupAddress}
                          onSelectAddress={selectedLocation =>
                            onSelectedAddress('FROM', selectedLocation)
                          }
                          clearAddress={() => clearAddress('FROM')}
                        />
                        {type !== requestTypeConstant.doctorAtHome && (
                          <>
                            <View style={styles.horizontalLines} />
                            <PickAddress
                              label={strings.TripDetails.to}
                              placeholder={
                                strings.bookingFlow.selectDropLocation
                              }
                              lat={props.formValues.dropLatLong[0]}
                              long={props.formValues.dropLatLong[1]}
                              address={props.formValues.dropAddress}
                              onSelectAddress={selectedLocation =>
                                onSelectedAddress('TO', selectedLocation)
                              }
                              clearAddress={() => clearAddress('TO')}
                              isDrop={true}
                            />
                          </>
                        )}
                      </View>
                      {type !== requestTypeConstant.airAmbulance &&
                      type !== requestTypeConstant.trainAmbulance ? (
                        <View
                          style={{
                            position: 'absolute',
                            right: 3,
                            top:
                              type === requestTypeConstant.doctorAtHome
                                ? 8
                                : 18,
                            zIndex: 2,
                            height:
                              type === requestTypeConstant.doctorAtHome
                                ? 60
                                : 80,
                            width: 55,
                            backgroundColor: colors.white,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 14,
                            elevation: 8,
                            shadowColor: '#171717',
                            shadowOffset: {width: -2, height: 4},
                            shadowOpacity: 0.2,
                            shadowRadius: 3,
                          }}>
                          <TouchableOpacity
                            onPress={() => setBookLaterModalOpen(true)}
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <View>
                              <MaterialIcons
                                name="access-alarms"
                                size={moderateScale(16)}
                                color={colors.SlateGray}
                              />
                            </View>
                            <Text style={styles.title}>
                              {props.formValues.whenAmbulanceRequired.name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        overflow: 'visible',
                      }}>
                      <DottedVertical
                        style={{
                          marginTop: heightScale(30),
                          marginRight: widthScale(10),
                        }}
                      />

                      <View style={{flex: 1, paddingVertical: heightScale(6)}}>
                        <View style={{marginBottom: heightScale(8)}}>
                          <SelectAirport
                            label={`${strings.groundAmbulance[type].fromLabel}*`}
                            placeholder={strings.bookingFlow.select}
                            data={airportListingData?.content}
                            searchText={airPortListData.searchText}
                            loader={props.airAmbulanceMasterDataLoading}
                            setSearchText={val => {
                              setAirportListingData({content: []});
                              setAirportListData({
                                ...airPortListData,
                                searchText: val,
                                pageNo: 0,
                              });
                            }}
                            selectedAirport={selectedPickupAirport}
                            setSelectedAirport={selectedValue =>
                              onSelectAirPort('FROM', selectedValue)
                            }
                            loadMore={loadMoreAirPortData}
                            type={type}
                          />
                        </View>
                        <View style={styles.horizontalLines} />
                        <View style={{marginTop: heightScale(8)}}>
                          <SelectAirport
                            label={`${strings.groundAmbulance[type].toLabel}*`}
                            placeholder={strings.bookingFlow.select}
                            data={airportListingData?.content}
                            searchText={airPortListData.searchText}
                            setSearchText={val => {
                              setAirportListingData({content: []});
                              setAirportListData({
                                ...airPortListData,
                                searchText: val,
                                pageNo: 0,
                              });
                            }}
                            selectedAirport={selectedDropAirport}
                            setSelectedAirport={selectedValue =>
                              onSelectAirPort('TO', selectedValue)
                            }
                            loadMore={loadMoreAirPortData}
                            type={type}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>
                {/* {Config.APP_TYPE === 'DEV' &&
                  locationData?.distance?.distance && (
                    <Text>
                      Location distance: {locationData?.distance?.distance} -
                      Intercity limit: {intercityKm}
                    </Text>
                  )} */}

                {isPickDropSame ? (
                  <Text style={styles.pickDropWarningText}>
                    {strings.bookingFlow.pickAndDropSame}
                  </Text>
                ) : null}
                {type !== requestTypeConstant.airAmbulance &&
                type !== requestTypeConstant.trainAmbulance ? (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 7,
                        backgroundColor: colors.PaleBlue,
                        borderRadius: moderateScale(100),
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        marginTop: 10,
                        marginHorizontal: 20,
                      }}>
                      <Text style={styles.totalPriceText}>
                        {strings.bookingFlow.totalPrice}
                      </Text>
                      <Text style={styles.totalPrice}>
                        {'\u20B9'}{' '}
                        {[null, undefined].includes(totalPriceWithGST)
                          ? strings.bookingFlow.na
                          : parseFloat(totalPriceWithGST).toFixed(2)}
                      </Text>
                    </View>
                    <View
                      style={{flexDirection: 'row', justifyContent: 'center'}}>
                      {displayField === Fields.PatientDetails ? (
                        <Modal
                          visible={true}
                          transparent={true}
                          style={styles.modal}>
                          <KeyboardAvoidingView
                            style={styles.keyboardAvoidingView}
                            behavior={Platform.OS === 'ios' ? 'padding' : null}>
                            <View style={styles.modalBackground}>
                              <View style={[styles.modalInner]}>
                                <PatientDetails {...props} />
                                <View
                                  style={{
                                    paddingBottom: bottom + 10,
                                  }}>
                                  {confirmButton()}
                                </View>
                              </View>
                            </View>
                          </KeyboardAvoidingView>
                        </Modal>
                      ) : (
                        <AmbulanceAndPaymentDetail
                          totalPrice={totalPrice}
                          setTotalPrice={setTotalPrice}
                          {...props}
                        />
                      )}
                    </View>
                  </>
                ) : (
                  <View
                    style={{
                      marginHorizontal: 20,
                    }}>
                    <Text style={styles.title}>
                      {`${strings.myRequestScreen.pickupDateTime}*`}
                    </Text>
                    <View style={{marginBottom: heightScale(16)}}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          styles.input,
                          dateTimeError ? {borderColor: 'red'} : null,
                        ]}
                        onPress={() => {
                          setBookLaterModalOpen(true);
                        }}>
                        <Text
                          style={[
                            styles.dateTextStyle,
                            props.formValues.bookingDateTime && {
                              fontFamily: fonts.calibri.semiBold,
                            },
                          ]}>
                          {props.formValues.bookingDateTime
                            ? moment(props.formValues.bookingDateTime).format(
                                'MMM D, YYYY, hh:mm a',
                              )
                            : strings.bookingFlow.select}
                        </Text>
                      </TouchableOpacity>
                      {dateTimeError ? (
                        <Text style={styles.dateError}>
                          strings.bookingFlow.enterValidDate
                        </Text>
                      ) : null}
                    </View>
                    <DateTimePickerModal
                      isVisible={startDateOpen}
                      mode="datetime"
                      date={new Date()}
                      title={strings.bookingFlow.startDate}
                      onConfirm={date => {
                        props.setValues(
                          'whenAmbulanceRequired',
                          whenAmbulanceRequired[1],
                        );
                        props.setValues('bookingDateTime', date);
                        setDateOpen(false);
                      }}
                      onCancel={() => {
                        setDateOpen(false);
                      }}
                      minimumDate={airAmbulanceTat}
                    />
                    <Text style={styles.title}>
                      {`${strings.myRequestScreen.noOfInviduals}*`}
                    </Text>
                    <Input
                      isSecondaryButton={true}
                      placeholder={strings.common.enter}
                      inputBoxStyle={
                        props.formValues.numberOfIndividualsWithPatient
                          ? styles.inputTextStyle
                          : styles.placeholderText
                      }
                      keyboardType={'number-pad'}
                      returnKeyType="done"
                      value={props.formValues.numberOfIndividualsWithPatient}
                      onChangeText={val => {
                        props.setValues(
                          'numberOfIndividualsWithPatient',
                          val.replace(/[^0-9]/g, ''),
                        );
                      }}
                    />
                    <View style={{marginTop: heightScale(10)}}>
                      <Text style={styles.title}>
                        {strings.bookingFlow.instructions}
                      </Text>
                      <View style={{marginTop: 4}}>
                        <Input
                          isSecondaryButton={true}
                          placeholder={strings.bookingFlow.instructionsPlaceholder}
                          inputBoxStyle={
                            props.formValues.instructions
                              ? styles.inputTextStyle
                              : styles.placeholderText
                          }
                          multiline
                          value={props.formValues.instructions}
                          onChangeText={val => {
                            props.setValues('instructions', val);
                          }}
                          inputContainerStyle={{
                            height: 90,
                            borderRadius: 16,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                )}
                {displayField !== Fields.PatientDetails && confirmButton()}
              </ScrollView>
            </View>
          )}
          {!isDetailsVisible &&
            !(
              followUpData.isVisible ||
              requestCreatedData.isVisible ||
              noAmbulanceFound.isVisible ||
              confirmingBookingData.isVisible ||
              bookingConfirmedData?.isVisible
            ) && (
              <View style={styles.hiddenDetailContainer}>
                <ActivityIndicator color={colors.black} size="large" />
              </View>
            )}
          <Modal
            visible={
              followUpData.isVisible ||
              requestCreatedData.isVisible ||
              noAmbulanceFound.isVisible ||
              confirmingBookingData.isVisible ||
              bookingConfirmedData?.isVisible
            }
            transparent={true}
            style={styles.errorModal}>
            <KeyboardAvoidingView
              style={styles.keyboardAvoidingView}
              behavior={Platform.OS === 'ios' ? 'padding' : null}>
              <View style={[styles.errorModalBackground]}>
                <View style={[styles.errorModalInner]}>
                  {followUpData.isVisible && (
                    <FollowUp
                      isVisible={followUpData.isVisible}
                      serviceRequestId={followUpData.serviceRequestId}
                      onPress={(data, isFollowUpRequired) => {
                        if (isFollowUpRequired) {
                          setFollowUpData({
                            isVisible: false,
                            serviceRequestId: '',
                          });
                          setRequestCreatedData({
                            isVisible: true,
                            data: data,
                          });
                        } else {
                          props.navigation.reset({
                            index: 0,
                            routes: [{name: navigations.HomeScreen}],
                          });
                        }
                      }}
                      bookingCategory={type}
                    />
                  )}
                  {requestCreatedData.isVisible && (
                    <RequestCreated
                      onPress={() => {
                        if (
                          type === requestTypeConstant.airAmbulance ||
                          type === requestTypeConstant.trainAmbulance
                        ) {
                          props.navigation.goBack();
                          props.navigation.navigate(
                            navigations.MyrequestDetails,
                            {
                              srId: props.srCreationSuccess?.data?.id,
                              jobId: null,
                              jobNumber: null,
                              requestType: type,
                              justBooked: true,
                            },
                          );
                        } else {
                          setRequestCreatedData({
                            isVisible: false,
                            data: '',
                          });
                          props.navigation.reset({
                            index: 0,
                            routes: [{name: navigations.HomeScreen}],
                          });
                        }
                      }}
                      data={requestCreatedData.data}
                      bookingCategory={type}
                      {...props}
                    />
                  )}
                  {noAmbulanceFound.isVisible && (
                    <NoAmbulanceFound
                      onPress={() => {
                        setNoAmbulanceFound({
                          isVisible: false,
                          data: '',
                        });
                        props.navigation.reset({
                          index: 0,
                          routes: [{name: navigations.HomeScreen}],
                        });
                      }}
                      data={noAmbulanceFound.data}
                      bookingCategory={type}
                    />
                  )}

                  {confirmingBookingData.isVisible && (
                    <ConfirmingBooking
                      isVisible={confirmingBookingData.isVisible}
                      onPress={data => {
                        setConfirmingBookingData({
                          isVisible: false,
                          data: {},
                        });
                        setFollowUpData({
                          isVisible: true,
                          serviceRequestId: serviceRequestId.current,
                        });
                      }}
                      bookingCategory={type}
                      details={confirmingBookingData.data}
                      navigation={props.navigation}
                    />
                  )}
                  {bookingConfirmedData?.isVisible && (
                    <View style={styles.bookingConfirmedViewStyle}>
                      {props.myRequestDetailsLoading && <Loader />}
                    </View>
                  )}
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
          {intercityModalVisible && (
            <IntercityModal
              isIntercityVisible={intercityModalVisible}
              supportNumber={props.supportNumber}
              setIsIntercityVisible={value => {
                setIntercityModal(value);
                props.navigation.reset({
                  index: 0,
                  routes: [{name: navigations.HomeScreen}],
                });
              }}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  horizontalLines: {
    borderColor: colors.DarkGray2,
    borderBottomWidth: moderateScale(1),
    height: heightScale(0.5),
    marginRight: widthScale(14),
    marginBottom: heightScale(2),
  },
  bottomLocationView: {
    paddingTop: heightScale(12),
    backgroundColor: colors.white,
  },
  footerButtonContainer: {
    flexDirection: 'row',
    marginHorizontal: widthScale(20),
  },
  footerSubButtonContainerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickDropWarningText: {
    color: 'red',
    fontSize: normalize(12),
    fontWeight: '400',
    fontFamily: fonts.calibri.regular,
    marginHorizontal: 20,
  },
  totalPriceText: {
    color: colors.Charcoal2,
    fontSize: normalize(13),
    fontFamily: fonts.calibri.regular,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  totalPrice: {
    color: colors.Charcoal2,
    fontSize: normalize(17),
    lineHeight: normalize(25),

    fontFamily: fonts.calibri.semiBold,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  title: {
    color: colors.Charcoal2,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
  },
  dateError: {
    color: colors.red,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
  },
  bookingConfirmedViewStyle: {
    flex: 1,
  },
  bookingConfirmedScrollStyle: {
    paddingTop: heightScale(20),
    paddingHorizontal: widthScale(15),
  },
  horizontalLines2: {
    borderColor: colors.DarkGray2,
    borderBottomWidth: moderateScale(1),
    width: '90%',
    marginLeft: widthScale(4),
    marginVertical: heightScale(5),
  },
  totalFareView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.PaleBlue,
    borderRadius: moderateScale(100),
    marginTop: heightScale(20),
    paddingVertical: heightScale(8),
    paddingHorizontal: widthScale(12),
  },
  buttonContainerView: {
    marginTop: heightScale(20),
    marginBottom: heightScale(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainerStyle: {
    flex: 0,
    backgroundColor: colors.white,
    borderWidth: widthScale(1),
    borderColor: colors.primary,
    paddingHorizontal: widthScale(4),
  },
  buttonTextStyle: {
    fontSize: normalize(13),
    color: colors.primary,
  },
  redDot: {
    height: normalize(8),
    width: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: colors.Red,
    alignSelf: 'center',
  },
  emergencyLocView: {
    flex: 1,
    paddingVertical: heightScale(6),
    flexDirection: 'row',
  },
  airAmbulanceTitle: {
    fontSize: normalize(12),
    fontWeight: '400',
    fontFamily: fonts.calibri.medium,
    color: colors.Gray,
  },
  input: {
    paddingVertical: heightScale(8),
    marginTop: heightScale(4),
    paddingHorizontal: widthScale(12),
    borderColor: colors.LightGrey7,
    borderWidth: widthScale(1),
    borderRadius: moderateScale(100),
  },
  dateTextStyle: {
    fontSize: normalize(14),
    color: colors.DarkGray,
    fontFamily: fonts.calibri.regular,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  inputTextStyle: {
    fontFamily: fonts.calibri.semiBold,
    fontSize: normalize(14),
    fontWeight: '600',
    color: colors.DarkGray,
  },
  placeholderText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    fontWeight: '400',
    color: colors.DimGray2,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {flex: 1},
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.Black5,
  },
  modalInner: {
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    // maxHeight: '80%',
  },

  errorModal: {
    flex: 1,
  },
  errorModalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.Black5,
  },
  errorModalInner: {
    backgroundColor: colors.white,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    maxHeight: '80%',
  },
  hiddenDetailContainer: {
    paddingTop: 30,
  },
});

const mapStateToProps = ({App}) => {
  const {
    getProfileSuccess,
    getMembersSuccess,
    projectConfigLoading,
    projectConfigSuccess,
    srCreationLoading,
    srCreationSuccess,
    srCreationFail,
    myRequestDetailsLoading,
    myRequestDetailsSuccess,
    myRequestDetailsFail,
    addRequestSuccess,
    addRequestFail,
    configurationSuccess,
    supportNumber,
    airAmbulanceMasterDataSuccess,
    airAmbulanceMasterDataFail,
    airAmbulanceMasterDataLoading,
    globalConfigurationSuccess,
  } = App;
  return {
    getProfileSuccess,
    getMembersSuccess,
    projectConfigLoading,
    projectConfigSuccess,
    srCreationLoading,
    srCreationSuccess,
    srCreationFail,
    myRequestDetailsLoading,
    myRequestDetailsSuccess,
    myRequestDetailsFail,
    addRequestSuccess,
    addRequestFail,
    configurationSuccess,
    supportNumber,
    airAmbulanceMasterDataSuccess,
    airAmbulanceMasterDataFail,
    airAmbulanceMasterDataLoading,
    globalConfigurationSuccess,
  };
};

const mapDispatchToProps = {
  projectConfigAction,
  srCreationApi,
  resetSrCreationApi,
  resetGetMembersApi,
  MyRequestDetails,
  addRequest,
  resetAddRequest,
  resolutionStatus,
  resetValidateCoupon,
  MyRequestDetailsReset,
  airAmbulanceMasterData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStomp(BookingInfo));
