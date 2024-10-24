import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {colors, scaling, fonts} from '../../library';
import {connect} from 'react-redux';
import {
  getProfile,
  createEventRequest,
  projectConfigAction,
  resetCreateEventRequest,
} from '../../redux/actions/app.actions';
import LinearGradient from 'react-native-linear-gradient';
import {TextInput} from '../../components';
import {Context} from '../../providers/localization';
import {navigations} from '../../constants';
import {Emergency} from '../../../assets';
import moment from 'moment';
import {ConfirmedBooking} from './ConfirmedBooking.js';
import Config from 'react-native-config';
import Header from '../../components/header';
import {addHours} from 'date-fns';
import {BookLaterModal} from '../BookingFlow/Modal/BookLaterComponent';
import {whenAmbulanceRequired} from '../BookingFlow/utils';
import {requestTypeConstant} from '../../utils/constants';
import {BackArrow} from '../../components/BackArrow';
import CustomButton from '../../components/CustomButton';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const initialState = {
  eventName: '',
  firmName: '',
  eventNature: '',
  startDateToggle: false,
  endDateToggle: false,
  startDate: '',
  endDate: '',
};

const EventRequest = props => {
  const strings = React.useContext(Context).getStrings();
  const {EventRequest} = strings;
  const [state, setState] = useState(initialState);
  const [eventError, setEventError] = useState();
  const [firmError, setFirmError] = useState();
  const [natureError, setNatureError] = useState();
  const [startDateError, setStartDateError] = useState();
  const [endDateError, setEndDateError] = useState();
  const [confirmedEventModal, setConfirmedEventModal] = useState(false);

  useEffect(() => {
    props.getProfile();

    const _projectConfigData = {
      clientId: Config.CLIENT_ID,
      projectTypeNumber: Config.PROJECT_TYPE_NUMBER,
    };
    props.projectConfigAction(_projectConfigData);
  }, []);

  const eventNameValidationFunc = () => {
    if (!state.eventName) {
      setEventError(EventRequest.fieldMandatory);
    } else {
      setEventError('');
      return true;
    }
  };

  const eventBookingTatInHrs = JSON.parse(
    props.configurationSuccess?.data[0]?.metadata,
  )?.eventBookingTatInHrs;

  const firmNameValidationFunc = () => {
    if (!state.firmName) {
      setFirmError(EventRequest.fieldMandatory);
    } else {
      setFirmError('');
      return true;
    }
  };

  const natureEventValidationFunc = () => {
    if (!state.eventNature) {
      setNatureError(EventRequest.fieldMandatory);
    } else {
      setNatureError('');
      return true;
    }
  };

  const startDateValidationFunc = () => {
    if (!state.startDate) {
      setStartDateError(EventRequest.fieldMandatory);
    } else if (state.startDate < Date.now()) {
      setStartDateError(EventRequest.pastTime);
    } else if (state.startDate < addHours(Date.now(), eventBookingTatInHrs)) {
      setStartDateError(
        `${EventRequest.pleaseEnter} ${eventBookingTatInHrs} ${EventRequest.hourLater}`,
      );
    } else {
      setStartDateError('');
      return true;
    }
  };

  const endDateValidationFunc = () => {
    const timeDiffMinutes = moment(state.endDate)
      .utc()
      .diff(moment(state.startDate).utc(), 'minute');
    if (!state.endDate) {
      setEndDateError(EventRequest.fieldMandatory);
    } else if (timeDiffMinutes + 1 < 60) {
      setEndDateError(EventRequest.endDateBig);
    } else {
      setEndDateError('');
      return true;
    }
  };

  const validateFields = () => {
    let eventNameValidated = eventNameValidationFunc();
    let firmNameValidated = firmNameValidationFunc();
    let natureEventValidated = natureEventValidationFunc();
    let startDateValidated = startDateValidationFunc();
    let endDateValidated = endDateValidationFunc();

    if (
      eventNameValidated &&
      firmNameValidated &&
      natureEventValidated &&
      startDateValidated &&
      endDateValidated
    ) {
      return true;
    } else {
      return false;
    }
  };

  const requestTypeData = {
    EVENT: {
      requestTypeCode: 'C_EMERGENCY - OTHER',
      requestTypeId: Config.EVENT,
      requestTypeName: 'Event - Pickup',
    },
  };
  const emergencyData = props.projectConfigSuccess?.data || {};
  const tempEmergencyService =
    (emergencyData.projectPreferenceResources &&
      emergencyData.projectPreferenceResources.length &&
      emergencyData.projectPreferenceResources[0]) ||
    {};
  const _emergencyService = tempEmergencyService.emergencyService || {};

  const handleSubmit = () => {
    let allFieldsValidated = validateFields();
    if (allFieldsValidated) {
      props.createEventRequest({
        aht: 0,
        projectTypeNumber: Config.PROJECT_TYPE_NUMBER,
        dispatchPriority: 'HIGH',
        isCallerLocation: false,
        isCallerVictim: false,
        isParent: false,
        note: 'sr',
        resolutionSrStatus: 'OPEN',
        requestType: 'EVENT',
        source: 'VOICE_CALL',
        type: 'INITIAL',
        eventName: state.eventName,
        organizingFirmName: state.firmName,
        natureOfEvent: state.eventNature,
        eventStartDate: moment(state.startDate).startOf('day').valueOf(),
        eventEndDate: moment(state.endDate).startOf('day').valueOf(),
        eventStartTime:
          moment(state.startDate).valueOf() -
          moment(state.startDate).startOf('day').valueOf(),
        eventEndTime:
          moment(state.endDate).valueOf() -
          moment(state.endDate).startOf('day').valueOf(),
        callerRequest: {
          name: props?.getProfileSuccess?.data?.firstName,
          phoneNumber: props?.getProfileSuccess?.data?.mobile,
          email: props.getProfileSuccess?.data?.email,
          gender: props.getProfileSuccess?.data?.gender,
          age: props.getProfileSuccess?.data?.age,
          ageUnit: 'YEARS',
          clientId: Config.CLIENT_ID,
        },
        serviceRequest: {
          requestTypeCode: requestTypeData.EVENT.requestTypeCode,
          requestTypeName: requestTypeData.EVENT.requestTypeName,
          requestTypeId: requestTypeData.EVENT.requestTypeId,
          emergencyServiceId: _emergencyService.id,
          emergencyServiceName: _emergencyService.name,
          emergencyServiceNumber: _emergencyService.code,
          requestType: 'EVENT',
        },
      });
    }
  };

  useEffect(() => {
    if (props?.createEventRequestSuccess) {
      setConfirmedEventModal(true);
    }
  }, [props?.createEventRequestSuccess]);

  const onViewDetailsPressed = () => {
    setState(initialState);
    setConfirmedEventModal(false);
    props.resetCreateEventRequest();
    const {data} = props?.createEventRequestSuccess;
    props.navigation.goBack();
    props.navigation.navigate(navigations.EventDetailsScreen, {
      eventId: data?.id,
      eventNumber: data?.eventNumber,
      justBooked: true,
    });
  };

  const onBackPress = () => {
    setState(initialState);
    setConfirmedEventModal(false);
    props.navigation.navigate(navigations.HomeScreen);
    props.resetCreateEventRequest();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <ScrollView keyboardShouldPersistTaps="always">
        <LinearGradient colors={[colors.white, colors.LightBlue]}>
          <Header
            leftIconPress={() => {
              props.navigation.toggleDrawer();
            }}
            screenName={EventRequest.bookAmbulance}
            rightIcon={true}
            rightIconPress={() =>
              props.navigation.navigate(navigations.Notifications)
            }
            menu={true}
          />

          <View style={styles.imgView}>
            <Image
              source={Emergency}
              style={styles.emergencyImg}
              resizeMode="contain"
            />
          </View>

          <View style={styles.inputView}>
            <View>
              <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                <Text style={styles.greyTextBold}>
                  {EventRequest.eventName}
                </Text>
                <Text style={styles.astrik}>*</Text>
              </View>

              <TextInput
                style={[
                  styles.input,
                  eventError
                    ? {borderColor: colors.red}
                    : {borderColor: colors.gray400},
                ]}
                underlineColorAndroid="transparent"
                placeholder={EventRequest.enter}
                placeholderTextColor={colors.lightGrey}
                autoCapitalize="none"
                value={state.eventName}
                onChangeText={value => {
                  setEventError('');
                  setState({...state, eventName: value});
                }}
                inputStyles={styles.inputStyles}
                maxLength={32}
              />
              {eventError ? (
                <Text style={styles.errorMsg}>{eventError}</Text>
              ) : null}
            </View>

            <View style={{marginTop: heightScale(22)}}>
              <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                <Text style={styles.greyTextBold}>
                  {EventRequest.organizingFirm}
                </Text>
                <Text style={styles.astrik}>*</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  firmError
                    ? {borderColor: colors.red}
                    : {borderColor: colors.gray400},
                ]}
                underlineColorAndroid="transparent"
                placeholder={EventRequest.enter}
                placeholderTextColor={colors.lightGrey}
                autoCapitalize="none"
                value={state.firmName}
                onChangeText={value => {
                  setFirmError('');
                  setState({...state, firmName: value});
                }}
                inputStyles={styles.inputStyles}
                maxLength={32}
              />
              {firmError ? (
                <Text style={styles.errorMsg}>{firmError}</Text>
              ) : null}
            </View>

            <View style={{marginTop: heightScale(22)}}>
              <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                <Text style={styles.greyTextBold}>
                  {EventRequest.natureOfEvent}
                </Text>
                <Text style={styles.astrik}>*</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  natureError
                    ? {borderColor: colors.red}
                    : {borderColor: colors.gray400},
                ]}
                underlineColorAndroid="transparent"
                placeholder={EventRequest.enter}
                placeholderTextColor={colors.lightGrey}
                autoCapitalize="none"
                value={state.eventNature}
                onChangeText={value => {
                  setNatureError('');
                  setState({...state, eventNature: value});
                }}
                inputStyles={styles.inputStyles}
                maxLength={32}
              />
              {natureError ? (
                <Text style={styles.errorMsg}>{natureError}</Text>
              ) : null}
            </View>

            <View style={{marginTop: heightScale(22)}}>
              <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                <Text style={styles.greyTextBold}>
                  {EventRequest.startDate}
                </Text>
                <Text style={styles.astrik}>*</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.input,
                  startDateError
                    ? {borderColor: colors.red}
                    : {borderColor: colors.gray400},
                ]}
                onPress={() => {
                  setState({...state, startDateToggle: true});
                }}>
                <Text
                  style={[
                    styles.inputStyles,
                    {
                      color: !state.startDate
                        ? colors.lightGrey
                        : colors.DarkGray,
                    },
                  ]}>
                  {state.startDate
                    ? moment(state.startDate).format('DD MMM, YYYY, hh:mm a')
                    : EventRequest.select}
                </Text>
              </TouchableOpacity>
              {/* Start date modal */}
              <BookLaterModal
                ambulanceTat={moment(
                  addHours(new Date(), eventBookingTatInHrs).valueOf(),
                )}
                bookFor={whenAmbulanceRequired[1]}
                isVisible={state.startDateToggle}
                setBookLaterModalOpen={value => {
                  setState({...state, startDateToggle: value});
                }}
                onConfirm={(item, date) => {
                  setState({
                    ...state,
                    startDateToggle: false,
                    startDate: date,
                    endDate: '',
                  });
                  setStartDateError('');
                }}
                bookForLaterDateAndTime={addHours(
                  new Date(),
                  eventBookingTatInHrs,
                )}
                requestType={requestTypeConstant.event}
              />

              {startDateError ? (
                <Text style={styles.errorMsg}>{startDateError}</Text>
              ) : null}
            </View>
            <View style={{marginTop: heightScale(22)}}>
              <View style={[styles.row1, {marginBottom: heightScale(8)}]}>
                <Text style={styles.greyTextBold}>{EventRequest.endDate}</Text>
                <Text style={styles.astrik}>*</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.input,
                  endDateError
                    ? {borderColor: colors.red}
                    : {borderColor: colors.gray400},
                ]}
                onPress={() => {
                  if (state.startDate === '') {
                    setEndDateError('Choose start date');
                  } else {
                    setEndDateError('');
                    setState({...state, endDateToggle: true});
                  }
                }}>
                <Text
                  style={[
                    styles.inputStyles,
                    {color: !state.endDate ? colors.lightGrey : colors.DarkGray},
                  ]}>
                  {state.endDate
                    ? moment(state.endDate).format('DD MMM, YYYY, hh:mm a')
                    : EventRequest.select}
                </Text>
              </TouchableOpacity>
              {/* End Date modal */}
              {state.endDateToggle && (
                <BookLaterModal
                  ambulanceTat={moment(state.startDate)
                    .add(eventBookingTatInHrs, 'h')
                    .valueOf()}
                  bookFor={whenAmbulanceRequired[1]}
                  isVisible={state.endDateToggle}
                  setBookLaterModalOpen={value => {
                    setState({...state, endDateToggle: value});
                  }}
                  onConfirm={(item, date) => {
                    setState({...state, endDateToggle: false, endDate: date});
                    setEndDateError('');
                  }}
                  requestType={requestTypeConstant.event}
                />
              )}

              {endDateError ? (
                <Text style={styles.errorMsg}>{endDateError}</Text>
              ) : null}
            </View>
          </View>

          <ConfirmedBooking
            isVisible={confirmedEventModal}
            setConfirmedEventModal={setConfirmedEventModal}
            onViewDetailsPressed={onViewDetailsPressed}
            navigation={props.navigation}
            onBackPress={onBackPress}
            srNumber={
              props?.createEventRequestSuccess?.data?.serviceRequestResource
                ?.serviceRequestNumber
            }
          />
          <View style={styles.bottomLocationView}>
            <View style={styles.footerButtonContainer}>
              <View
                style={{
                  marginRight: widthScale(20),
                  ...styles.footerSubButtonContainerContainer,
                }}>
                <BackArrow
                  onPress={() => {
                    props.navigation.goBack();
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
                  onPress={() => {
                    handleSubmit();
                  }}
                  title={EventRequest.confirmAmbulance}
                  titleTextStyles={{fontSize: normalize(16)}}
                  containerStyles={{flex: 0}}
                  leftIconContainerStyles={{flex: 0}}
                  rightIconContainerStyles={{flex: 0}}
                  disabled={
                    !(
                      state.eventName &&
                      state.firmName &&
                      state.eventNature &&
                      state.startDate &&
                      state.endDate
                    )
                  }
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerImgSection: {
    marginTop: normalize(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(24),
  },
  touchView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notification: {
    marginRight: widthScale(4),
  },
  dot: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    padding: moderateScale(1),
    backgroundColor: colors.red,
    alignItems: 'center',
    alignContent: 'center',
    position: 'absolute',
    right: widthScale(-3),
    top: heightScale(-5),
  },
  name: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    fontFamily: fonts.calibri.bold,
    color: colors.DarkGray,
  },
  imgView: {
    alignItems: 'center',
    marginTop: heightScale(20),
  },
  emergencyImg: {
    width: widthScale(120),
    height: heightScale(100),
  },
  notificationCount: {
    color: colors.white,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
  },
  row1: {
    flexDirection: 'row',
  },
  greyTextBold: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(12),
    color: colors.steelgray,
    fontWeight: '700',
  },
  inputView: {
    borderTopStartRadius: moderateScale(20),
    borderTopEndRadius: moderateScale(20),
    backgroundColor: colors.white,
    paddingTop: heightScale(32),
    paddingHorizontal: widthScale(25),
    paddingBottom: heightScale(20),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: heightScale(2)},
    shadowOpacity: normalize(2),
    shadowRadius: normalize(4),
    elevation: normalize(4),
    marginTop: heightScale(30),
  },
  astrik: {fontSize: normalize(12), color: colors.black},
  inputStyles: {
    fontFamily: fonts.calibri.semiBold,
    fontWeight: '600',
    color: colors.DarkGray,
    fontSize: normalize(14),
    lineHeight: 20,
  },
  input: {
    paddingHorizontal: widthScale(10),
    borderColor: colors.gray400,
    borderWidth: widthScale(1),
    borderRadius: normalize(20),
    width: '100%',
    height: heightScale(36),
    justifyContent: 'center',
  },
  errorMsg: {
    marginTop: heightScale(3),
    color: colors.red,
    marginLeft: widthScale(5),
    width: widthScale(250),
    fontSize: normalize(12),
  },
  footerSubButtonContainerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLocationView: {
    padding: heightScale(20),
    backgroundColor: colors.white,
  },
  footerButtonContainer: {
    flexDirection: 'row',
  },
  footerSubButtonContainerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = ({App}) => {
  const {
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    getNotificationsCountLoading,
    getNotificationsCountSuccess,
    getNotificationsCountFail,
    createEventRequestLoading,
    createEventRequestSuccess,
    createEventRequestFail,
    projectConfigSuccess,
    configurationSuccess,
  } = App;
  return {
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    getNotificationsCountLoading,
    getNotificationsCountSuccess,
    getNotificationsCountFail,
    createEventRequestLoading,
    createEventRequestSuccess,
    createEventRequestFail,
    projectConfigSuccess,
    configurationSuccess,
  };
};

const mapDispatchToProps = {
  getProfile,
  createEventRequest,
  projectConfigAction,
  resetCreateEventRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventRequest);
