import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import Config from 'react-native-config';
import {StompEventTypes, withStomp} from 'react-stompjs';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {colors, scaling, fonts} from '../../library';
import {Context} from '../../providers/localization';
import {navigations} from '../../constants';
import Header from '../../components/header';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import CheckBox from '@react-native-community/checkbox';
import {
  tabNames,
  bookFor,
  whenAmbulanceRequired,
  createSrPayload,
  initialFormValues,
  initialFormError,
} from './utils';
import {TextInput} from '../../components';
import BookingInfo from './BookingInfo';
import ChooseAmbulanceType from './ChooseAmbulanceType';
import AmbulenceAddons from '../AmbulenceAddons';
import {connect} from 'react-redux';
import {
  getMedicalCondition,
  getTypeOfDoctors,
  srCreationApi,
  resetSrCreationApi,
  getMembers,
  resetGetMembersApi,
  projectConfigAction,
} from '../../redux/actions/app.actions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Loader from '../../components/loader';
import {ConfirmedBooking} from './ModalComponent/ConfirmedBooking';
import FollowUp from './ModalComponent/FollowUp';
import {ConfirmingBooking} from './ModalComponent/ConfirmingBooking';
import StatusSection from '../../components/StatusSection';

const {widthScale, heightScale, normalize, moderateScale} = scaling;

const GroundAmbulance = props => {
  const bookingCategory = props?.route?.params?.type;
  let rootSubscribed = useRef(null).current;
  let serviceRequestNumber = useRef(null);
  let serviceRequestId = useRef(null);
  let objectToChange = useRef(null);
  const {stompContext} = props;

  const strings = useContext(Context).getStrings();
  const {groundAmbulance, common, ProfileDetails, doctorAtHome} = strings;

  const [searchText, setSearchText] = useState('');
  const [selectedRelative, setSelectedRelative] = useState();

  const [tabName, setTabName] = useState(tabNames.PATIENT_INFO);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormError);
  const [isChecked, setIsChecked] = useState(false);

  const [confirmedBookingData, setConfirmedBookingData] = useState({
    isVisible: false,
    referenceNumber: '',
    driverDetails: {},
    title: '',
    buttonText: '',
    leadId: '',
  });
  const [followUpData, setFollowUpData] = useState({
    isVisible: false,
    serviceRequestId: '',
  });
  const [confirmingBookingData, setConfirmingBookingData] = useState({
    isVisible: false,
  });

  const setValues = (key, data) => {
    setFormValues(preVal => ({
      ...preVal,
      [key]: data,
    }));
  };

  const checkValidator = () => {
    let finaltime;
    let isAnyError = false;
    const errorObj = {};
    const temporaryData = props.globalConfigurationSuccess?.data.filter(
      item => {
        return item?.globalConfigTypeResource?.id == 'LATER_BOOKING_TAT';
      },
    );
    if (temporaryData.length) {
      const temporaryTime =
        typeof temporaryData[0]?.data == 'string'
          ? JSON.parse(temporaryData[0]?.data)
          : temporaryData[0]?.data;
      finaltime = moment().add(temporaryTime?.timeInMinutes, 'm').valueOf();
    } else {
      finaltime = moment().valueOf();
    }
    if (tabName === tabNames.PATIENT_INFO) {
      if (!formValues.vehicleType && bookingCategory === 'DOCTOR_AT_HOME') {
        errorObj.vehicleType = strings.crewSection.emptyField;
      } else {
        errorObj.vehicleType = '';
      }
      if (
        formValues.whenAmbulanceRequired === whenAmbulanceRequired[1] &&
        formValues.bookingDateTime.length === 0
      ) {
        errorObj.dateTimeError = strings.crewSection.emptyField;
      } else if (
        finaltime > formValues.bookingDateTime &&
        formValues.whenAmbulanceRequired === whenAmbulanceRequired[1]
      ) {
        errorObj.dateTimeError = strings.groundAmbulance.validDate;
      } else {
        errorObj.dateTimeError = '';
      }

      if (!formValues.patientName) {
        errorObj.patientName = strings.crewSection.emptyField;
      } else {
        errorObj.patientName = '';
      }

      if (!formValues.patientContact) {
        errorObj.patientContact = strings.crewSection.emptyField;
      } else {
        errorObj.patientContact = '';
      }

      if (!formValues.age) {
        errorObj.age = strings.crewSection.emptyField;
      } else {
        errorObj.age = '';
      }

      if (!formValues.gender) {
        errorObj.gender = strings.crewSection.emptyField;
      } else {
        errorObj.gender = '';
      }

      if (formValues.bookFor.id === bookFor[1].id && !formValues.relation) {
        errorObj.relation = strings.crewSection.emptyField;
      } else {
        errorObj.relation = '';
      }

      if (!formValues.medicalCondition.length) {
        errorObj.medicalCondition = strings.crewSection.emptyField;
      } else {
        errorObj.medicalCondition = '';
      }

      if (
        !formValues.numberOfIndividualsWithPatient &&
        bookingCategory === 'GROUND_AMBULANCE'
      ) {
        errorObj.numberOfIndividualsWithPatient =
          strings.crewSection.emptyField;
      } else {
        errorObj.numberOfIndividualsWithPatient = '';
      }
    } else if (tabName === tabNames.BOOKING_INFO) {
      if (!formValues.pickupAddress) {
        errorObj.pickupAddress = strings.crewSection.emptyField;
      } else {
        errorObj.pickupAddress = '';
      }
      if (!formValues.pickupFlat) {
        errorObj.pickupFlat = strings.crewSection.emptyField;
      } else {
        errorObj.pickupFlat = '';
      }

      if (!formValues.dropAddress && bookingCategory === 'GROUND_AMBULANCE') {
        errorObj.dropAddress = strings.crewSection.emptyField;
      } else {
        errorObj.dropAddress = '';
      }

      if (!formValues.dropFlat && bookingCategory === 'GROUND_AMBULANCE') {
        errorObj.dropFlat = strings.crewSection.emptyField;
      } else {
        errorObj.dropFlat = '';
      }
    } else if (tabName === tabNames.CHOOSE_AMBULANCE) {
    } else if (tabName === tabNames.PAYMENT_DETAILS) {
    }

    setFormErrors(preVal => ({
      ...preVal,
      ...errorObj,
    }));
    Object.keys(errorObj).forEach(item => {
      if (errorObj[item]) {
        isAnyError = true;
      }
    });

    return isAnyError;
  };

  const handleBackButtonPress = () => {
    Alert.alert(
      groundAmbulance.areYouSureYouWantToCancel,
      groundAmbulance.cancelledRequestsWillNotBeSaved,
      [
        {
          text: common.abort,
          onPress: () => {},
        },
        {
          text: common.ok,
          onPress: () => {
            props.navigation.goBack();
          },
        },
      ],
    );

    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
    };
  }, []);

  useEffect(() => {
    if (formValues?.medicalCondition?.length) {
      const medicalCondition = formValues?.medicalCondition?.map(id => {
        return props?.getMedicalConditionSuccess?.data?.content?.find(
          obj => obj.id === id,
        );
      });
      setValues('medicalConditionsObj', medicalCondition);
    }
  }, [formValues.medicalCondition]);

  const handleNextPress = () => {
    if (!checkValidator()) {
      setTabName(tabNames.BOOKING_INFO);
    }
  };

  const handleConfirmBookingPress = () => {
    const data = props.projectConfigSuccess?.data || {};
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
      formValues,
      _details,
      bookingCategory,
    );
    props.srCreationApi(_requestPayload);
  };

  const establishSocketIOConnection = () => {
    stompContext.newStompClient(`${Config.BOOKING_SOCKET_URL}`);
  };

  useEffect(() => {
    if (props.srCreationSuccess) {
      const {data} = props.srCreationSuccess;
      serviceRequestNumber.current = data?.serviceRequestNumber;
      serviceRequestId.current = data?.id;
      if (data.vendorCountInArea) {
        establishSocketIOConnection();
      } else if (data.vendorCountInArea === 0) {
        setFollowUpData({
          isVisible: true,
          serviceRequestId: data?.id,
        });
      } else if (data.vendorCountInArea === null) {
        setConfirmedBookingData({
          isVisible: true,
          referenceNumber: data?.serviceRequestNumber,
          driverDetails: {},
          title: groundAmbulance.requestCreated,
          buttonText: groundAmbulance.okay,
          leadId: '',
        });
      }
    }
  }, [props.srCreationSuccess]);

  useEffect(() => {
    const _projectConfigData = {
      clientId: Config.CLIENT_ID,
      projectTypeNumber: Config.PROJECT_TYPE_NUMBER,
    };
    props.projectConfigAction(_projectConfigData);
    props.getMedicalCondition({
      subCategoryIds:
        bookingCategory === 'GROUND_AMBULANCE'
          ? Config.SUB_CATEGORY_IDS_GROUND_AMBULANCE
          : Config.SUB_CATEGORY_IDS_DOCTOR_AT_HOME,
      isPicklist: true,
    });
    if (bookingCategory === 'DOCTOR_AT_HOME') {
      props.getTypeOfDoctors('DOCTOR_AT_HOME');
    }
  }, []);
  const getTheDate = date => {
    setFormValues(preVal => ({
      ...preVal,
      ['bookingDateTime']: date,
    }));
  };
  useEffect(() => {
    if (
      props.getProfileSuccess &&
      props.getPicklistSuccess?.data &&
      formValues.bookFor === bookFor[0]
    ) {
      const bloodGroupObject =
        props.getPicklistSuccess?.data?.BloodGroup?.filter(item => {
          return item.id == props.getProfileSuccess?.data?.bloodGroup;
        });
      const genderGroupObjectArray =
        props.getPicklistSuccess?.data?.Gender?.filter(item => {
          return item.id == props.getProfileSuccess?.data?.gender;
        });
      const objectToChange = {
        patientName: props.getProfileSuccess?.data?.name || '',
        patientContact: props.getProfileSuccess?.data?.mobile || '',
        bloodGroup: (bloodGroupObject.length && bloodGroupObject[0]) || '',
        age: props.getProfileSuccess?.data?.age?.toString() || '',
        gender:
          (genderGroupObjectArray.length && genderGroupObjectArray[0]) || '',
      };
      setFormValues(preVal => ({
        ...preVal,
        ...objectToChange,
      }));
    } else {
      let {bookFor, ...temporaryObject} = initialFormValues;
      setSelectedRelative('');
      setFormValues(preVal => ({
        ...preVal,
        ...temporaryObject,
      }));
      setFormErrors(initialFormError);
    }
    if (!props.getMembersSuccess && formValues.bookFor === bookFor[1]) {
      props.getMembers(props.getProfileSuccess?.data?.id || '');
    }
  }, [props.getProfileSuccess, formValues.bookFor, props.getMembersSuccess]);

  useEffect(() => {
    if (formValues.bookFor === bookFor[1]) {
      if (selectedRelative) {
        const tempObj = selectedRelative;

        objectToChange.current = {
          patientName: tempObj?.firstName,
          patientContact: isChecked
            ? props.getProfileSuccess?.data?.mobile
            : tempObj?.mobileNumber || '',
          relation: tempObj?.relationWithUser || '',
          bloodGroup: tempObj?.bloodGroup || '',
          age: tempObj?.age.toString() || '',
          gender: tempObj?.gender || '',
        };
      } else {
        objectToChange.current = {
          patientName: searchText,
          patientContact: '',
          relation: '',
          bloodGroup: '',
          age: '',
          gender: '',
        };
      }
      setFormValues(preVal => ({
        ...preVal,
        ...objectToChange.current,
      }));
    }
  }, [selectedRelative, searchText, isChecked]);

  useEffect(() => {
    stompContext.addStompEventListener(StompEventTypes.Connect, res => {
      console.log('===> Connect', res);
      setConfirmingBookingData({isVisible: true});
      rootSubscribed = stompContext
        .getStompClient()
        .subscribe(`/service-requests/${serviceRequestNumber.current}`, res => {
          if (res && res.body) {
            setConfirmingBookingData({isVisible: false});
            const detailsObj = JSON.parse(res.body);

            if (
              detailsObj.jobNumber !== null &&
              detailsObj.vehicleRegistrationNumber !== null
            ) {
              setConfirmedBookingData({
                isVisible: true,
                referenceNumber: serviceRequestNumber.current,
                driverDetails: {
                  name: detailsObj.driverName,
                  no: detailsObj.driverPhoneNumber,
                  id: detailsObj.jobNumber,
                },
                title: groundAmbulance.ambulanceBooked,
                buttonText: groundAmbulance.okay,
                leadId: '',
              });
            } else {
              setFollowUpData({
                isVisible: true,
                serviceRequestId: serviceRequestId.current,
              });
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
      props.resetGetMembersApi();
      props.resetSrCreationApi();
    };
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />

      <Header
        screenName={groundAmbulance[bookingCategory]?.heading}
        leftIconPress={handleBackButtonPress}
        backArrow={true}
        rightIcon={true}
        rightIconPress={() => {
          props.navigation.navigate(navigations.Notifications);
        }}
      />

      {(props.srCreationLoading || props.projectConfigLoading) && <Loader />}

      <View style={styles.bodyContainer}>
        <View>
          <ScrollView
            style={styles.tabView}
            horizontal
            showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  borderBottomWidth:
                    tabName === tabNames.PATIENT_INFO ? widthScale(4) : 0,
                },
              ]}
              onPress={() => {
                setTabName(tabNames.PATIENT_INFO);
              }}>
              <Text style={styles.textStyle}>
                {groundAmbulance.patientInfo}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  borderBottomWidth:
                    tabName === tabNames.BOOKING_INFO ? widthScale(4) : 0,
                },
              ]}
              onPress={() => {
                if (tabName !== tabNames.PATIENT_INFO) {
                  setTabName(tabNames.BOOKING_INFO);
                }
              }}>
              <Text style={styles.textStyle}>
                {groundAmbulance.bookingInfo}
              </Text>
            </TouchableOpacity>
            {bookingCategory === 'GROUND_AMBULANCE' && (
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  {
                    borderBottomWidth:
                      tabName === tabNames.CHOOSE_AMBULANCE ? widthScale(4) : 0,
                  },
                ]}
                onPress={() => {
                  if (tabName === tabNames.PAYMENT_DETAILS) {
                    setTabName(tabNames.CHOOSE_AMBULANCE);
                  }
                }}>
                <Text style={styles.textStyle}>Choose Ambulance</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  borderBottomWidth:
                    tabName === tabNames.PAYMENT_DETAILS ? widthScale(4) : 0,
                },
              ]}
              onPress={() => {}}>
              <Text style={styles.textStyle}>Payment Details</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {tabName === tabNames.PATIENT_INFO && (
          <ScrollView style={styles.formView}>
            <View style={styles.blockView}>
              <View>
                <Text
                  style={[
                    styles.textStyle,
                    {color: colors.greyishBrownTwo, fontWeight: '700'},
                  ]}>
                  {groundAmbulance.bookFor}
                </Text>
              </View>
              <View style={styles.toggleContainer}>
                {bookFor.map(item => (
                  <TouchableOpacity
                    style={[
                      styles.toggleDataStyle,
                      formValues.bookFor.id === item.id && {
                        backgroundColor: '#41a06233',
                      },
                    ]}
                    onPress={() => {
                      setValues('bookFor', item);
                    }}>
                    <Text
                      style={[
                        styles.toggleTextStyle,
                        formValues.bookFor.id === item.id && {
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

            <View style={styles.blockView}>
              <View>
                <Text
                  style={[
                    styles.textStyle,
                    {color: colors.greyishBrownTwo, fontWeight: '700'},
                  ]}>
                  {groundAmbulance.patientDetails}
                </Text>
              </View>
              <View style={styles.inputView}>
                <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={styles.inputTextStyle}>
                    {`${groundAmbulance.patientName}*`}
                  </Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {formValues.bookFor === bookFor[1] &&
                  props.getMembersSuccess?.data?.length > 0 ? (
                    <StatusSection
                      data={props.getMembersSuccess?.data}
                      searchText={searchText}
                      setSearchText={setSearchText}
                      selectedRelative={selectedRelative}
                      setSelectedRelative={setSelectedRelative}
                    />
                  ) : (
                    <TextInput
                      value={formValues.patientName}
                      onChangeText={val => {
                        setValues('patientName', val);
                      }}
                      placeholder={groundAmbulance.patientName}
                      placeholderTextColor={colors.gray400}
                      disabled={formValues.bookFor == bookFor[0]}
                      isError={formErrors.patientName}
                      underlineColorAndroid="transparent"
                      style={styles.tiStyle}
                      inputStyles={styles.tiInputStyles}
                      errorStyles={styles.errorStyles}
                    />
                  )}

                  {!!formErrors.patientName && (
                    <View style={styles.errorViewStyle}>
                      <Text style={styles.errorTextStyles}>
                        {formErrors.patientName}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {formValues.bookFor.id == bookFor[1].id && (
                <View style={styles.inputView}>
                  <View style={{width: '30%', justifyContent: 'center'}}>
                    <Text style={styles.inputTextStyle}>
                      {`${groundAmbulance.relation}*`}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '65%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Dropdown
                      style={[
                        styles.tiStyle,
                        !!formErrors.relation && {borderColor: colors.red},
                      ]}
                      renderItem={item => {
                        return (
                          <View style={styles.inputDropdown}>
                            <Text style={{color: colors.Black1}}>
                              {item.name}
                            </Text>
                          </View>
                        );
                      }}
                      placeholderStyle={{
                        color: colors.gray400,
                        fontSize: normalize(12),
                      }}
                      selectedTextStyle={{
                        fontSize: normalize(12),
                        color: colors.Black1,
                      }}
                      inputSearchStyle={{}}
                      data={props.getPicklistSuccess?.data?.Relation}
                      maxHeight={heightScale(300)}
                      labelField="name"
                      valueField="id"
                      placeholder={groundAmbulance.relation}
                      value={formValues.relation.id}
                      disable={
                        (formValues.bookFor == bookFor[1] &&
                          objectToChange.current?.relation?.id?.length > 0) ||
                        false
                      }
                      onChange={item => {
                        setValues('relation', item);
                      }}
                    />
                    {!!formErrors.relation && (
                      <View style={styles.errorViewStyle}>
                        <Text style={styles.errorTextStyles}>
                          {formErrors.relation}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
              <View style={styles.inputView}>
                <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={styles.inputTextStyle}>
                    {`${groundAmbulance.patientContact}*`}
                  </Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    value={formValues.patientContact}
                    onChangeText={val => {
                      if (val.length < 11) {
                        setValues('patientContact', val.replace(/[^0-9]/g, ''));
                      }
                    }}
                    keyboardType={'number-pad'}
                    returnKeyType="done"
                    disabled={
                      isChecked ||
                      (formValues.bookFor == bookFor[0] &&
                        formValues.patientContact.length) ||
                      (formValues.bookFor == bookFor[1] &&
                        objectToChange?.current?.patientContact?.length) ||
                      false
                    }
                    placeholder={groundAmbulance.patientContact}
                    placeholderTextColor={colors.gray400}
                    isError={formErrors.patientContact}
                    underlineColorAndroid="transparent"
                    style={styles.tiStyle}
                    inputStyles={styles.tiInputStyles}
                    errorStyles={styles.errorStyles}
                  />
                  {bookingCategory === 'DOCTOR_AT_HOME' &&
                    formValues.bookFor == bookFor[1] && (
                      <View style={styles.sameAsYoursView}>
                        <CheckBox
                          value={isChecked}
                          onValueChange={newValue => {
                            setIsChecked(!isChecked);
                            !isChecked
                              ? setValues(
                                  'patientContact',
                                  props.getProfileSuccess?.data?.mobile,
                                )
                              : setValues('patientContact', '');
                          }}
                          boxType={'square'}
                          onCheckColor={colors.primary}
                          tintColors={{
                            true: colors.primary,
                            false: colors.primary,
                          }}
                        />

                        <Text style={styles.sameAsText}>
                          {doctorAtHome.sameAsYours}
                        </Text>
                      </View>
                    )}
                  {!!formErrors.patientContact && (
                    <View style={styles.errorViewStyle}>
                      <Text style={styles.errorTextStyles}>
                        {formErrors.patientContact}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.inputView}>
                <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={styles.inputTextStyle}>
                    {groundAmbulance.bloodGroup}
                  </Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Dropdown
                    style={styles.tiStyle}
                    renderItem={item => {
                      return (
                        <View style={styles.inputDropdown}>
                          <Text style={styles.inputTextStyle}>{item.name}</Text>
                        </View>
                      );
                    }}
                    placeholderStyle={{
                      color: colors.gray400,
                      fontSize: normalize(12),
                    }}
                    selectedTextStyle={{
                      fontSize: normalize(12),
                      color: colors.black,
                    }}
                    data={props.getPicklistSuccess?.data?.BloodGroup}
                    maxHeight={heightScale(300)}
                    labelField="name"
                    valueField="id"
                    placeholder={groundAmbulance.bloodGroup}
                    value={formValues.bloodGroup?.id}
                    disable={
                      (formValues.bookFor == bookFor[0] &&
                        props.getProfileSuccess?.data?.bloodGroup) ||
                      (formValues.bookFor == bookFor[1] &&
                        objectToChange.current?.bloodGroup?.id?.length > 0) ||
                      false
                    }
                    onChange={item => {
                      setValues('bloodGroup', item);
                    }}
                  />
                </View>
              </View>
              <View style={styles.inputView}>
                <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={styles.inputTextStyle}>
                    {`${ProfileDetails.gender}*`}
                  </Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Dropdown
                    style={[
                      styles.tiStyle,
                      !!formErrors.gender && {
                        borderColor: colors.red,
                      },
                    ]}
                    renderItem={item => {
                      return (
                        <View style={styles.inputDropdown}>
                          <Text style={{color: colors.black}}>{item.name}</Text>
                        </View>
                      );
                    }}
                    placeholderStyle={{
                      color: colors.gray400,
                      fontSize: normalize(12),
                    }}
                    selectedTextStyle={{
                      fontSize: normalize(12),
                      color: colors.black,
                    }}
                    inputSearchStyle={{}}
                    data={props.getPicklistSuccess?.data?.Gender}
                    disable={
                      (formValues.bookFor == bookFor[0] &&
                        props.getProfileSuccess?.data?.gender) ||
                      (formValues.bookFor == bookFor[1] &&
                        objectToChange.current?.gender?.id?.length > 0) ||
                      false
                    }
                    maxHeight={heightScale(300)}
                    labelField="name"
                    valueField="id"
                    placeholder={ProfileDetails.gender}
                    value={formValues.gender.id}
                    onChange={item => {
                      setValues('gender', item);
                    }}
                  />
                  {!!formErrors.gender && (
                    <View style={styles.errorViewStyle}>
                      <Text style={styles.errorTextStyles}>
                        {formErrors.gender}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.inputView}>
                <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={styles.inputTextStyle}>
                    {`${ProfileDetails.age}*`}
                  </Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    value={formValues.age}
                    onChangeText={val => {
                      if (val.length < 4) {
                        setValues('age', val.replace(/[^0-9]/g, ''));
                      }
                    }}
                    disabled={
                      (formValues.bookFor == bookFor[0] &&
                        props.getProfileSuccess?.data?.age) ||
                      (formValues.bookFor == bookFor[1] &&
                        objectToChange.current?.age?.length > 0) ||
                      false
                    }
                    keyboardType={'number-pad'}
                    returnKeyType="done"
                    placeholder={ProfileDetails.age}
                    placeholderTextColor={colors.gray400}
                    isError={formErrors.age}
                    underlineColorAndroid="transparent"
                    style={styles.tiStyle}
                    inputStyles={styles.tiInputStyles}
                    errorStyles={styles.errorStyles}
                  />
                  {!!formErrors.age && (
                    <View style={styles.errorViewStyle}>
                      <Text style={styles.errorTextStyles}>
                        {formErrors.age}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={{marginTop: heightScale(20)}}>
              <View>
                <Text style={styles.textStyle2}>
                  {`${groundAmbulance.whatsTheEmergency}*`}
                </Text>
              </View>
            </View>
            <View>
              <MultiSelect
                style={[
                  styles.individualsWithPatientStyle,
                  !!formErrors.medicalCondition && {
                    borderColor: colors.red,
                  },
                ]}
                placeholderStyle={{
                  color: colors.gray400,
                  fontSize: normalize(14),
                }}
                data={props.getMedicalConditionSuccess?.data?.content}
                labelField="name"
                valueField="id"
                placeholder={groundAmbulance.medicalDropDown}
                value={formValues?.medicalCondition}
                onChange={item => {
                  setValues('medicalCondition', item);
                }}
                renderItem={item => {
                  return (
                    <View style={styles.medicalConditionInputDropdown}>
                      <Text style={styles.blackText}>{item.name}</Text>
                      {formValues?.medicalCondition.indexOf(item?.id) >= 0 && (
                        <AntDesign
                          style={styles.icon}
                          color="black"
                          name="Safety"
                          size={20}
                        />
                      )}
                    </View>
                  );
                }}
                renderSelectedItem={(item, unSelect) => (
                  <View>
                    {formValues?.medicalCondition ? (
                      <TouchableOpacity
                        onPress={() => {
                          unSelect && unSelect(item);
                        }}>
                        <View style={styles.multiSelectInput}>
                          <Text
                            style={[
                              styles.blackText,
                              {marginRight: widthScale(5)},
                            ]}>
                            {item.name}
                          </Text>
                          <AntDesign color="red" name="delete" size={14} />
                        </View>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                )}
              />
              {!!formErrors.medicalCondition && (
                <View style={styles.errorViewStyle}>
                  <Text style={styles.errorTextStyles}>
                    {formErrors.medicalCondition}
                  </Text>
                </View>
              )}
            </View>

            {bookingCategory === 'GROUND_AMBULANCE' && (
              <View style={{marginTop: heightScale(20)}}>
                <View style={{}}>
                  <Text style={styles.textStyle2}>
                    {`${groundAmbulance.howManyIndividualsWillAccompanyThePatient}*`}
                  </Text>
                </View>

                <View>
                  <TextInput
                    value={formValues.numberOfIndividualsWithPatient}
                    onChangeText={val => {
                      setValues(
                        'numberOfIndividualsWithPatient',
                        val.replace(/[^0-9]/g, ''),
                      );
                    }}
                    placeholder={groundAmbulance.enterIndividualCount}
                    placeholderTextColor={colors.gray400}
                    isError={formErrors.numberOfIndividualsWithPatient}
                    underlineColorAndroid="transparent"
                    style={styles.individualsWithPatientStyle}
                    inputStyles={styles.individualsWithPatientInputStyles}
                    keyboardType={'number-pad'}
                    returnKeyType="done"
                    maxLength={1}
                  />
                  {!!formErrors.numberOfIndividualsWithPatient && (
                    <View style={styles.errorViewStyle}>
                      <Text style={styles.errorTextStyles}>
                        {formErrors.numberOfIndividualsWithPatient}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {bookingCategory === 'DOCTOR_AT_HOME' && (
              <View style={{marginTop: heightScale(20)}}>
                <Text style={styles.textStyle2}>
                  {`${doctorAtHome.typeOfDoctor}?*`}
                </Text>
                <Dropdown
                  style={[
                    styles.individualsWithPatientStyle,
                    !!formErrors.vehicleType && {
                      borderColor: colors.red,
                    },
                  ]}
                  renderItem={item => {
                    return (
                      <View style={styles.inputDropdown}>
                        <Text style={styles.sameAsText}>
                          {item.vehicleType.name}
                        </Text>
                      </View>
                    );
                  }}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.typeOfDoctorText}
                  data={props.getTypeOfDoctorsSuccess?.data}
                  value={formValues?.vehicleType?.name}
                  maxHeight={heightScale(300)}
                  labelField="vehicleType.name"
                  valueField="vehicleType.name"
                  placeholder={doctorAtHome.typeOfDoctor}
                  onChange={item => {
                    setValues('vehicleType', item.vehicleType);
                  }}
                />
                {!!formErrors.vehicleType && (
                  <View style={styles.errorViewStyle}>
                    <Text style={styles.errorTextStyles}>
                      {formErrors.vehicleType}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {bookingCategory === 'GROUND_AMBULANCE' && (
              <View style={{marginTop: heightScale(20)}}>
                <View>
                  <Text style={styles.textStyle2}>
                    {groundAmbulance.helpUsKnowMore}
                  </Text>
                </View>
                <View style={styles.qnaBlock}>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={styles.helpUsKnowMoreText}>
                      {groundAmbulance.isPatientCritical}
                    </Text>
                  </View>
                  <View
                    style={{justifyContent: 'center', flexDirection: 'row'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        onPress={() => {
                          setValues('isPatientCritical', true);
                        }}>
                        {formValues.isPatientCritical ? (
                          <IconAnt
                            name="checksquareo"
                            size={21}
                            color={colors.darkGreen}
                          />
                        ) : (
                          <IconMaterial
                            name="check-box-outline-blank"
                            size={26}
                            color={colors.gray93}
                          />
                        )}
                      </TouchableOpacity>
                      <View style={{marginLeft: widthScale(5)}}>
                        <Text style={styles.YesNoText}>{common.yes}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        marginLeft: widthScale(20),
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setValues('isPatientCritical', false);
                        }}>
                        {!formValues.isPatientCritical ? (
                          <IconAnt
                            name="checksquareo"
                            size={21}
                            color={colors.darkGreen}
                          />
                        ) : (
                          <IconMaterial
                            name="check-box-outline-blank"
                            size={26}
                            color={colors.gray93}
                          />
                        )}
                      </TouchableOpacity>
                      <View style={{marginLeft: widthScale(5)}}>
                        <Text style={styles.YesNoText}>{common.no}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.qnaBlock}>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={styles.helpUsKnowMoreText}>
                      {groundAmbulance.isPatientOnVentilator}
                    </Text>
                  </View>
                  <View
                    style={{justifyContent: 'center', flexDirection: 'row'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        onPress={() => {
                          setValues('isPatientOnVentilator', true);
                        }}>
                        {formValues.isPatientOnVentilator ? (
                          <IconAnt
                            name="checksquareo"
                            size={21}
                            color={colors.darkGreen}
                          />
                        ) : (
                          <IconMaterial
                            name="check-box-outline-blank"
                            size={26}
                            color={colors.gray93}
                          />
                        )}
                      </TouchableOpacity>
                      <View style={{marginLeft: widthScale(5)}}>
                        <Text style={styles.YesNoText}>{common.yes}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        marginLeft: widthScale(20),
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setValues('isPatientOnVentilator', false);
                        }}>
                        {!formValues.isPatientOnVentilator ? (
                          <IconAnt
                            name="checksquareo"
                            size={21}
                            color={colors.darkGreen}
                          />
                        ) : (
                          <IconMaterial
                            name="check-box-outline-blank"
                            size={26}
                            color={colors.gray93}
                          />
                        )}
                      </TouchableOpacity>
                      <View style={{marginLeft: widthScale(5)}}>
                        <Text style={styles.YesNoText}>{common.no}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.qnaBlock}>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={styles.helpUsKnowMoreText}>
                      {groundAmbulance.isPatientOnOxygen}
                    </Text>
                  </View>
                  <View
                    style={{justifyContent: 'center', flexDirection: 'row'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        onPress={() => {
                          setValues('isPatientOnOxygen', true);
                        }}>
                        {formValues.isPatientOnOxygen ? (
                          <IconAnt
                            name="checksquareo"
                            size={21}
                            color={colors.darkGreen}
                          />
                        ) : (
                          <IconMaterial
                            name="check-box-outline-blank"
                            size={26}
                            color={colors.gray93}
                          />
                        )}
                      </TouchableOpacity>
                      <View style={{marginLeft: widthScale(5)}}>
                        <Text style={styles.YesNoText}>{common.yes}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        marginLeft: widthScale(20),
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setValues('isPatientOnOxygen', false);
                        }}>
                        {!formValues.isPatientOnOxygen ? (
                          <IconAnt
                            name="checksquareo"
                            size={21}
                            color={colors.darkGreen}
                          />
                        ) : (
                          <IconMaterial
                            name="check-box-outline-blank"
                            size={26}
                            color={colors.gray93}
                          />
                        )}
                      </TouchableOpacity>
                      <View style={{marginLeft: widthScale(5)}}>
                        <Text style={styles.YesNoText}>{common.no}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={{marginTop: heightScale(20)}}>
              <View>
                <Text style={styles.textStyle2}>
                  {groundAmbulance.anyInstructions}
                </Text>
              </View>
              <View>
                <TextInput
                  value={formValues.instructions}
                  onChangeText={val => {
                    setValues('instructions', val);
                  }}
                  placeholder={groundAmbulance.maxCharacters}
                  placeholderTextColor={colors.gray400}
                  isError={formErrors.instructions}
                  underlineColorAndroid="transparent"
                  style={styles.instructionsStyle}
                  maxLength={300}
                  inputStyles={styles.instructionsInputStyles}
                  multiline
                  numberOfLines={6}
                />
              </View>
            </View>

            <View style={styles.blockView}>
              <View>
                <Text style={styles.textStyle2}>
                  {groundAmbulance[bookingCategory].whenDoYouNeedThisAmbulance}
                </Text>
              </View>

              <View style={[styles.toggleContainer]}>
                {whenAmbulanceRequired.map(item => (
                  <TouchableOpacity
                    style={[
                      styles.toggleDataStyle,
                      {width: '45%'},
                      formValues.whenAmbulanceRequired.id === item.id && {
                        backgroundColor: '#41a06233',
                      },
                    ]}
                    onPress={() => {
                      setValues('whenAmbulanceRequired', item);
                    }}>
                    <Text
                      style={[
                        styles.toggleTextStyle,
                        formValues.whenAmbulanceRequired.id === item.id && {
                          color: colors.darkGreen,
                          fontWeight: '700',
                        },
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {formValues.whenAmbulanceRequired.id ==
                whenAmbulanceRequired[1].id && (
                <View style={{marginVertical: heightScale(15)}}>
                  <View>
                    <Text style={[styles.textStyle2]}>
                      {`${groundAmbulance.selectDate}*`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setIsDatePickerVisible(true);
                    }}>
                    <View
                      style={[
                        styles.datePickerViewStyle,
                        {
                          borderColor: formErrors.dateTimeError
                            ? colors.red
                            : colors.whiteSmoke,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.toggleTextStyle,
                          !formValues.bookingDateTime && {
                            color: colors.gray400,
                          },
                        ]}>
                        {formValues.bookingDateTime
                          ? moment(formValues.bookingDateTime).format(
                              'dddd, MMMM Do YYYY, h:mm A',
                            )
                          : strings.groundAmbulance.selectDate}
                      </Text>
                      <IconAnt
                        name="calendar"
                        size={21}
                        color={colors.darkGreen}
                      />
                    </View>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="datetime"
                      minimumDate={new Date()}
                      title={strings.groundAmbulance.selectDate}
                      date={new Date()}
                      onConfirm={date => {
                        setIsDatePickerVisible(false);
                        getTheDate(Date.parse(date));
                      }}
                      onCancel={() => {
                        setIsDatePickerVisible(false);
                      }}
                    />
                    {formErrors.dateTimeError.length > 0 && (
                      <View style={styles.errorViewStyle}>
                        <Text style={styles.errorTextStyles}>
                          {formErrors.dateTimeError}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={handleNextPress}>
                <Text style={styles.buttonTextStyle}>{common.next}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {tabName === tabNames.BOOKING_INFO && (
          <BookingInfo
            formValues={formValues}
            formErrors={formErrors}
            setTabName={setTabName}
            setValues={setValues}
            checkValidator={checkValidator}
            setFormValues={setFormValues}
            bookingCategory={bookingCategory}
            handleConfirmBookingPress={handleConfirmBookingPress}
          />
        )}

        {tabName === tabNames.CHOOSE_AMBULANCE && (
          <ChooseAmbulanceType
            details={formValues.vehicleDetailsApiResponse}
            formValues={formValues}
            setTabName={setTabName}
            setValues={setValues}
          />
        )}

        {tabName === tabNames.PAYMENT_DETAILS && (
          <AmbulenceAddons
            details={formValues.vehicleDetails}
            setValues={setValues}
            formValues={formValues}
            handleConfirmBookingPress={handleConfirmBookingPress}
            bookingCategory={bookingCategory}
            navigation={props.navigation}
          />
        )}

        {confirmedBookingData.isVisible && (
          <ConfirmedBooking
            title={confirmedBookingData.title}
            referenceNumber={confirmedBookingData.referenceNumber}
            buttonText={confirmedBookingData.buttonText}
            bookingCategory={bookingCategory}
            onPress={() => {
              props.resetSrCreationApi();
              props.resetGetMembersApi();
              setConfirmedBookingData({
                isVisible: false,
                referenceNumber: '',
                driverDetails: {},
                title: '',
                buttonText: '',
                leadId: '',
              });
              props.navigation.navigate(navigations.HomeScreen);
            }}
            isVisible={confirmedBookingData.isVisible}
            driverDetails={confirmedBookingData.driverDetails}
            leadId={confirmedBookingData.leadId}
          />
        )}

        {followUpData.isVisible && (
          <FollowUp
            isVisible={followUpData.isVisible}
            serviceRequestId={followUpData.serviceRequestId}
            onPress={data => {
              setFollowUpData({
                isVisible: false,
                serviceRequestId: '',
              });
              setConfirmedBookingData({
                isVisible: true,
                referenceNumber: serviceRequestNumber.current,
                driverDetails: {},
                title: groundAmbulance.requestCreated,
                buttonText: groundAmbulance.okay,
                leadId: data,
              });
            }}
            bookingCategory={bookingCategory}
          />
        )}

        {confirmingBookingData.isVisible && (
          <ConfirmingBooking
            isVisible={confirmingBookingData.isVisible}
            onPress={() => {
              setConfirmingBookingData({isVisible: false});
              setFollowUpData({
                isVisible: true,
                serviceRequestId: serviceRequestId.current,
              });
            }}
            bookingCategory={bookingCategory}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    flex: 1,
  },
  tabView: {
    backgroundColor: colors.primary,
  },
  errorViewStyle: {
    width: '100%',
    padding: widthScale(5),
    paddingBottom: 0,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: heightScale(7),
    paddingHorizontal: widthScale(15),
    borderBottomColor: colors.secondaryGreen,
  },
  textStyle: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.white,
  },
  textStyle2: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.greyishBrownTwo,
    fontWeight: '700',
  },
  formView: {
    paddingHorizontal: widthScale(16),
  },
  blockView: {
    marginVertical: heightScale(20),
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(12),
    borderRadius: normalize(6),
    borderWidth: widthScale(1),
    borderColor: '#EFEFEF',
  },
  inputView: {
    marginTop: heightScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputTextStyle: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    color: colors.greyishBrownTwo,
    fontWeight: '700',
  },
  qnaBlock: {
    marginTop: heightScale(12),
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(12),
    borderRadius: normalize(6),
    borderWidth: widthScale(1),
    borderColor: '#EFEFEF',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginBottom: heightScale(20),
  },
  buttonTextStyle: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    color: colors.white,
    fontWeight: '600',
  },
  buttonStyle: {
    width: '100%',
    paddingVertical: heightScale(12),
    borderRadius: normalize(100),
    alignItems: 'center',
    backgroundColor: '#156330',
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
  instructionsStyle: {
    width: '100%',
    marginTop: heightScale(12),
    paddingHorizontal: widthScale(10),
    borderColor: colors.whiteSmoke,
    borderWidth: widthScale(1),
    borderRadius: normalize(6),
    height: heightScale(100),
  },
  instructionsInputStyles: {
    fontFamily: fonts.calibri.regular,
    color : colors.black,
    fontWeight: '400',
    fontSize: normalize(14),
    lineHeight: normalize(16),
    color: colors.greyishBrownTwo,
    height: heightScale(90),
    textAlignVertical: 'top',
  },
  tiStyle: {
    width: '100%',
    paddingHorizontal: widthScale(10),
    borderBottomWidth: widthScale(1),
    borderColor: colors.darkGreen,
  },
  tiInputStyles: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    fontSize: normalize(12),
    lineHeight: normalize(16),
    color: colors.greyishBrownTwo,
  },
  individualsWithPatientStyle: {
    width: '100%',
    marginTop: heightScale(12),
    paddingHorizontal: widthScale(10),
    borderColor: colors.whiteSmoke,
    borderWidth: widthScale(1),
    borderRadius: normalize(6),
    backgroundColor: colors.white,
  },
  datePickerViewStyle: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingVertical: heightScale(5),
    width: '100%',
    marginTop: heightScale(12),
    paddingHorizontal: widthScale(10),
    borderColor: colors.whiteSmoke,
    borderWidth: widthScale(1),
    borderRadius: normalize(6),
  },
  individualsWithPatientInputStyles: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    fontSize: normalize(14),
    lineHeight: normalize(16),
    color: colors.greyishBrownTwo,
  },
  multiSelectInput: {
    paddingHorizontal: widthScale(3),
    borderColor: colors.gray400,
    borderWidth: widthScale(1),
    borderRadius: normalize(5),
    paddingVertical: heightScale(3),
    marginRight: widthScale(3),
    marginTop: heightScale(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputDropdown: {
    paddingLeft: widthScale(10),
    borderColor: colors.gray400,
    paddingVertical: heightScale(8),
    width: '100%',
  },
  medicalConditionInputDropdown: {
    paddingHorizontal: widthScale(10),
    borderColor: colors.gray400,
    paddingVertical: heightScale(8),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  blackText: {
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(14),
    color: colors.black,
  },
  errorTextStyles: {
    color: colors.red,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
  },
  errorStyles: {
    borderWidth: 0,
    borderBottomColor: colors.red,
  },
  placeholderStyle: {
    color: colors.gray400,
    fontSize: normalize(12),
  },
  sameAsYoursView: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: heightScale(5),
  },
  sameAsText: {
    color: colors.black,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
  },
  YesNoText: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    fontSize: normalize(10),
    color: colors.black,
  },
  helpUsKnowMoreText: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    fontSize: normalize(10),
    color: colors.darkGreen2,
  },
  typeOfDoctorText: {
    fontSize: normalize(12),
    color: colors.black,
    fontFamily: fonts.calibri.regular,
  },
});
const mapStateToProps = ({App}) => {
  const {
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
    getMedicalConditionLoading,
    getMedicalConditionFail,
    getMedicalConditionSuccess,
    getTypeOfDoctorsLoading,
    getTypeOfDoctorsFail,
    getTypeOfDoctorsSuccess,
    globalConfigurationSuccess,
    srCreationLoading,
    srCreationSuccess,
    getProfileSuccess,
    getMembersLoading,
    getMembersSuccess,
    getMembersFail,
    projectConfigLoading,
    projectConfigSuccess,
  } = App;
  return {
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
    getMedicalConditionLoading,
    getMedicalConditionFail,
    getMedicalConditionSuccess,
    getTypeOfDoctorsLoading,
    getTypeOfDoctorsFail,
    getTypeOfDoctorsSuccess,
    globalConfigurationSuccess,
    srCreationLoading,
    srCreationSuccess,
    getProfileSuccess,
    getMembersLoading,
    getMembersSuccess,
    getMembersFail,
    projectConfigLoading,
    projectConfigSuccess,
  };
};

const mapDispatchToProps = {
  getMedicalCondition,
  getTypeOfDoctors,
  srCreationApi,
  resetSrCreationApi,
  getMembers,
  resetGetMembersApi,
  projectConfigAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStomp(GroundAmbulance));
