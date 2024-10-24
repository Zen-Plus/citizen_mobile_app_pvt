import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {colors, scaling, fonts} from '../../../library';
import Header from '../../../components/header';
import {
  navigations,
} from '../../../constants';
import {connect} from 'react-redux';
import {
  EventDetails,
  resolutionStatus,
} from '../../../redux/actions/app.actions';
import {Context} from '../../../providers/localization.js';

import IconAnt from 'react-native-vector-icons/AntDesign';
import Loader from '../../../components/loader';
import moment from 'moment';
import EventDetail from '../Components/EventDetails';
import PaymentDetails from '../../../components/PaymentDetails';
import PayNow from '../../../components/payNow';
import DriverDetails from '../Components/DriverDetails';
import Toggle from '../../../components/Toggle';
import RideDetails from '../Components/RideDetails';
import ViewDetail from '../../MyrequestDetails/ModalComponent/ViewDetail';
import TransactionHistory from '../../MyrequestDetails/Components/TransactionHistory';
import AmbulanceDetails from '../Components/AmbulanceDetails';
import {useIsFocused} from '@react-navigation/native';
import PubNub from 'pubnub';
import Invoice from '../../../components/download-invoice';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const EventDetailsScreen = props => {
  const {eventId, eventNumber, justBooked} = props.route.params;
  const strings = React.useContext(Context).getStrings();
  const [chatCount, setChatCount] = useState();
  const [message, setMessage] = useState();
  const [channel, setChannel] = useState();
  const isFocused = useIsFocused();
  const pubnub = new PubNub({
    publishKey: 'pub-c-9b323ef6-8a3f-455a-8de2-b389ac242f3c',
    subscribeKey: 'sub-c-89925685-8a2e-4342-9541-edefbeb75378',
    uuid: `${
      props.userInfoSuccess &&
      props.userInfoSuccess.data &&
      props.userInfoSuccess.data.id
    }`,
  });
  const [toggleData, setToggleData] = useState({
    id: 'RIDE',
    name: strings.TripDetails.rideDetails,
  });
  const [viewDetailVisible, setViewDetailVisible] = useState(false);
  const [eventDetailsData, setEventDetailsData] = useState(null);
  const [tripStartedDateTime, setTripStartedDateTime] = useState({
    tripStartedDate: '',
    tripStartedTime: '',
    tripEndDate: '',
    tripEndTime: '',
    days: '',
    hours: '',
  });
  useEffect(() => {
    pubnub.subscribe({channels: [channel], withPresence: true});
    pubnub.addListener({
      message: function (event) {
        setMessage(event);
      },
    });
    return () => {
      pubnub.unsubscribeAll();
    };
  }, [channel]);

  console.log(props.eventDetailsSuccess, "eventDetailsSuccess")

  useEffect(() => {
    if (props.eventDetailsSuccess) {
      setChannel(eventNumber);
      pubnub.objects.getChannelMetadata(
        {
          channel: eventNumber,
        },
        (status, response) => {
          pubnub.messageCounts(
            {
              channels: [eventNumber],
              channelTimetokens: [
                `${
                  response?.data?.custom?.CustomerLastRead &&
                  response?.data?.custom?.CustomerLastRead !== 'undefined'
                    ? response?.data?.custom?.CustomerLastRead
                    : 16869111905570000
                }`,
              ],
            },
            (status, results) => {
              setChatCount(results?.channels[eventNumber]);
            },
          );
        },
      );
    }
  }, [props.eventDetailsSuccess, message, isFocused]);

  useEffect(() => {
    props.EventDetails({
      eventId: eventId,
    });
  }, []);

  useEffect(() => {
    if (props.eventDetailsSuccess) {
      setEventDetailsData(props.eventDetailsSuccess?.data);
    }
  }, [props.eventDetailsSuccess]);

  useEffect(() => {
    if (props.tripDetailsFail) {
      console.log('Fail1111 :', props.tripDetailsFail);
    }
  }, [props.tripDetailsFail]);

  useEffect(() => {
    startDateTime();
  }, [eventDetailsData]);

  const faqNavigation = () => {
    props.navigation.navigate(navigations.FAQ);
  };

  const onTransactionSuccessfull = () => {
    props.EventDetails({
      eventId: eventId,
    });
  };

  const startDateTime = () => {
    let tripStartedDate = eventDetailsData?.eventStartDate
      ? moment(eventDetailsData?.eventStartDateAndTime).format('DD MMMM YYYY')
      : 'NA';
    let tripStartedTime = eventDetailsData?.eventStartTime
      ? moment(eventDetailsData?.eventStartDateAndTime).format('hh:mm a')
      : 'NA';
    let tripEndDate = eventDetailsData?.eventEndDate
      ? moment(eventDetailsData?.eventEndDateAndTime).format('DD MMMM YYYY')
      : 'NA';

    let tripEndTime = eventDetailsData?.eventEndTime
      ? moment(eventDetailsData?.eventEndDateAndTime).format('hh:mm a')
      : 'NA';
    let duration = moment.duration(
      eventDetailsData?.eventEndDate - eventDetailsData?.eventStartDate,
      'milliseconds',
    );
    let difference = moment.duration(
      eventDetailsData?.eventEndTime - eventDetailsData?.eventStartTime,
    );
    let days = duration.days();
    let hours = difference.hours();
    setTripStartedDateTime({
      tripStartedDate: tripStartedDate,
      tripStartedTime: tripStartedTime,
      tripEndDate: tripEndDate,
      tripEndTime: tripEndTime,
      days: days,
      hours: hours,
    });
  };
  
  const writeoff = eventDetailsData && eventDetailsData?.paymentCollectedHistoryList?.filter(value => {
    return value?.isWriteOffData
  })

  console.log(writeoff, 'writeoffeventDetailsData', eventDetailsData?.paymentCollectedHistoryList);

  return (
    <View style={styles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.grayWhite2}} />
      <Header
        screenName={`${eventNumber}`}
        barColor={{color: colors.black}}
        backArrow={true}
        leftIconPress={() => {
          justBooked
            ? props.navigation.navigate(navigations.HomeScreen)
            : props.navigation.goBack();
        }}
        rightIcon={true}
        rightIconColor={{color: colors.black}}
        notification={true}
        color={{color: colors.black}}
        rightIconPress={() =>
          props.navigation.navigate(navigations.Notifications)
        }
      />
      <ViewDetail
        isVisible={viewDetailVisible}
        changeVisible={() => {
          setViewDetailVisible(false);
        }}
        data={eventDetailsData?.tripItemWisePriceResourceList}
        myRequestDetailsData={eventDetailsData}
        writeoff={writeoff && writeoff.length && writeoff[0]}
      />
      {props.eventDetailsLoading ||
      !eventDetailsData ||
      props.requestCreateTransactionLoading ? (
        <Loader />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.jobMilestoneView}>
            <Text style={styles.jobMilestoneText}>
              {`${strings.closeJobs.status}: ${
                eventDetailsData?.status?.id === 'CANCELLED' &&
                !eventDetailsData?.eventVehicleAssignedList.length > 0
                  ? strings.ambulanceAction.OPENCANCELLED
                  : strings.ambulanceAction[eventDetailsData?.status?.id]
              }`}
            </Text>
          </View>
          {eventDetailsData?.eventVehicleAssignedList.length > 0 ? (
            <View>
              <DriverDetails
                eventDetailsData={eventDetailsData}
                navigation={props.navigation}
                eventNumber={eventNumber}
                eventId={eventId}
                chatCount={chatCount}
              />
            </View>
          ) : null}
          <View style={styles.toggleView}>
            <Toggle
              toggleData={[
                {id: 'RIDE', name: strings.TripDetails.rideDetails},
                {id: 'EVENT', name: strings.EventDetails.eventDetails},
              ]}
              selectedValue={toggleData}
              onChange={item => {
                setToggleData(item);
              }}
              itemViewStyles={{flexBasis: `${100 / 2}%`}}
            />
          </View>
          {toggleData.id == 'EVENT' ? (
            <View style={styles.eventDetailsView}>
              <EventDetail
                eventDetailsData={eventDetailsData}
                tripStartedDateTime={tripStartedDateTime}
              />
            </View>
          ) : (
            <View>
              <View style={styles.rideDetailsView}>
                <RideDetails
                  eventDetailsData={eventDetailsData}
                  eventNumber={eventNumber}
                  navigation={props.navigation}
                  tripStartedDateTime={tripStartedDateTime}
                />
              </View>
              {eventDetailsData?.eventVehicleAssignedList.length > 0 &&
              eventDetailsData?.status?.id !== 'CANCELLED' ? (
                <View style={styles.paymentView}>
                  <AmbulanceDetails
                    eventDetailsData={eventDetailsData}
                    supportNumber={props.supportNumber}
                  />
                </View>
              ) : null}
              {eventDetailsData?.totalAmount ? (
                <View style={styles.paymentView}>
                  <PaymentDetails
                    data={eventDetailsData?.tripItemWisePriceResourceList}
                    transactionData={eventDetailsData}
                    totalPrice={eventDetailsData?.totalAmount}
                    paymentOption={eventDetailsData?.paymentOption}
                    setViewDetailVisible={setViewDetailVisible}
                    writeoff={writeoff && writeoff.length && writeoff[0]}
                  />
                </View>
              ) : null}

              {eventDetailsData?.paymentCollectedHistoryList?.length > 0 ? (
                <View style={styles.paymentView}>
                  <TransactionHistory myRequestDetailsData={eventDetailsData} />
                </View>
              ) : null}

              <View style={{marginHorizontal: widthScale(22)}}>
                <PayNow
                  srId={eventDetailsData?.srId}
                  amountReceived={eventDetailsData?.amountRecieved}
                  onTransactionSuccessfull={onTransactionSuccessfull}
                />
              </View>

              {eventDetailsData?.invoiceUuid && (
                <View style={{marginHorizontal: widthScale(22)}}>
                  <Invoice uuid={eventDetailsData?.invoiceUuid} />
                </View>
              )}
            </View>
          )}
          <View style={{marginHorizontal: widthScale(22)}}>
            <TouchableOpacity style={styles.faqView} onPress={faqNavigation}>
              <IconAnt
                name="questioncircleo"
                size={moderateScale(18)}
                style={styles.faqIcon}
              />
              <Text style={styles.faqText}>{strings.TripDetails.faq}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  padding: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobMilestoneView: {
    paddingHorizontal: widthScale(23),
    paddingVertical: heightScale(15),
  },
  jobMilestoneText: {
    fontSize: normalize(16),
    color: colors.primary,
    fontFamily: fonts.calibri.medium,
  },
  verifyBox: {
    height: moderateScale(35),
    width: moderateScale(89),
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(100),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.grayWhite,
    backgroundColor: colors.grassGreen,
    shadowColor: colors.tripGray,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  verifyTextStyle: {
    color: colors.grassGreen,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    fontWeight: '600',
  },
  seperator: {
    marginTop: heightScale(6),
    borderBottomColor: colors.grayWhite3,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topTabs: {
    flex: 1,
    width: moderateScale(130),
    height: moderateScale(51),
    backgroundColor: colors.white,
    borderRadius: moderateScale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTabsText: {
    fontSize: normalize(12),
    marginLeft: widthScale(9),
    color: colors.Black1,
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
  },
  bookedByView: {
    marginTop: heightScale(20),
    marginHorizontal: widthScale(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray400,
    borderRadius: moderateScale(10),
  },
  ambulanceDetailsView: {
    marginTop: heightScale(8),
  },
  faqView: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    paddingVertical: moderateScale(10),
    marginTop: heightScale(15),
    marginBottom: heightScale(10),
    flexDirection: 'row',
    borderRadius: normalize(20),
    justifyContent: 'center',
  },
  paymentDetailsStyling: {
    marginVertical: heightScale(20),

    marginHorizontal: widthScale(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray400,
    borderRadius: moderateScale(10),
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: heightScale(16),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(100),
    paddingHorizontal: widthScale(30),
    paddingVertical: heightScale(14),
  },
  buttonText: {
    color: colors.lightWhite,
    fontSize: normalize(14),
    fontWeight: '600',
  },
  centerButton: {
    marginBottom: heightScale(16),
    alignSelf: 'center',
  },
  resendView: {
    alignSelf: 'flex-end',
    borderRadius: moderateScale(5),
    backgroundColor: colors.lightGrey10,
    marginBottom: heightScale(42),
    marginRight: widthScale(10),
  },
  iconView: {
    paddingVertical: heightScale(7),
    paddingHorizontal: widthScale(20),
    flexDirection: 'row',
  },
  replay: {
    right: moderateScale(3),
    transform: [{rotateY: '180deg'}, {rotateZ: '330deg'}],
  },
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: heightScale(10),
  },
  closeButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(100),
    paddingHorizontal: widthScale(10),
    paddingVertical: heightScale(10),
    backgroundColor: colors.grassGreen,
    marginBottom: heightScale(10),
  },
  tripDetailStyling: {
    marginTop: heightScale(12),
    marginHorizontal: widthScale(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray400,
    borderRadius: moderateScale(10),
  },
  closeventButtonText: {
    color: colors.lightWhite,
    fontSize: normalize(14),
    fontWeight: '600',
    fontFamily: fonts.calibri.medium,
  },
  downloadView: {
    flexDirection: 'row',
    marginRight: widthScale(150),
    paddingVertical: heightScale(8),
    backgroundColor: colors.grayWhite4,
    marginBottom: heightScale(10),
    borderWidth: 0.5,
    borderColor: colors.tripGray,
  },
  downloadText: {
    marginLeft: widthScale(5),
  },

  toggleView: {
    marginTop: heightScale(25),
    marginBottom: heightScale(20),
    marginHorizontal: widthScale(22),
  },
  rideDetailsView: {marginHorizontal: widthScale(22)},
  eventDetailsView: {marginHorizontal: widthScale(22)},
  paymentView: {marginTop: heightScale(20), marginHorizontal: widthScale(22)},
  faqIcon: {
    color: colors.primary,
    marginLeft: heightScale(10),
  },
  faqText: {
    fontSize: normalize(12),
    color: colors.primary,
    fontFamily: fonts.calibri.medium,
    fontWeight: '500',
    marginLeft: heightScale(6),
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {
    eventDetailsLoading,
    eventDetailsSuccess,
    eventDetailsFail,
    requestCreateTransactionLoading,
    supportNumber,
  } = App;
  const {userRole, userInfoSuccess} = Auth;
  return {
    eventDetailsLoading,
    eventDetailsSuccess,
    eventDetailsFail,
    userInfoSuccess,
    userRole,
    requestCreateTransactionLoading,
    supportNumber,
  };
};

const mapDispatchToProps = {
  EventDetails,
  resolutionStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetailsScreen);
