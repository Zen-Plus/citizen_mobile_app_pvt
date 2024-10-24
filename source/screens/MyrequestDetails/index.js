import React, {useState, useEffect} from 'react';
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
import Header from '../../components/header';
import {Context} from '../../providers/localization';
import {navigations, tripDetails} from '../../constants';
import {
  MyRequestDetails,
  resolutionStatus,
  getPaymentDetails,
  createTransaction,
  transactionDetails,
  resetTransactionDetails,
  resetCreateTransaction,
} from '../../redux/actions/app.actions';
import Loader from '../../components/loader';
import PaymentDetails from '../../components/PaymentDetails';
import DriverDetails from './Components/DriverDetails';
import RideDetails from './Components/RideDetails';
import {paymentOption} from '../../utils/constants';
import PatientDetails from './Components/PatientDetails';
import IconAnt from 'react-native-vector-icons/AntDesign';
import CancelTrip from './Components/CancelTrip';
import ViewDetail from './ModalComponent/ViewDetail';
import PayNow from '../../components/payNow';
import {useIsFocused} from '@react-navigation/native';
import TransactionHistory from './Components/TransactionHistory';
import PubNub from 'pubnub';
import {renderRequestStatus} from '../../components/functions';
import Invoice from '../../components/download-invoice';
import {requestTypeConstant} from '../../utils/constants';
import {Star} from '../../../assets';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const MyrequestDetails = props => {
  const {jobId, jobNumber, srId, requestType, justBooked} = props.route.params;
  const strings = React.useContext(Context).getStrings();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [viewDetailVisible, setViewDetailVisible] = useState(false);
  const [patientDetailsActive, setpatientDetailsActive] = useState(false);
  const [myRequestDetailsData, setMyRequestDetailsData] = useState();

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
  const medicalDetails = value => {
    setpatientDetailsActive(value);
  };

  useEffect(() => {
    if (isFocused) {
      props.MyRequestDetails({
        srId: srId,
      });
    }
  }, [isFocused]);

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

  useEffect(() => {
    if (props.myRequestDetailsSuccess) {
      setChannel(jobNumber);
      pubnub.objects.getChannelMetadata(
        {
          channel: jobNumber,
        },
        (status, response) => {
          pubnub.messageCounts(
            {
              channels: [jobNumber],
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
              setChatCount(results?.channels[jobNumber]);
            },
          );
        },
      );
    }
  }, [props.myRequestDetailsSuccess, message, isFocused]);

  useEffect(() => {
    if (props?.myRequestDetailsSuccess) {
      setMyRequestDetailsData(props?.myRequestDetailsSuccess?.data);
    }
  }, [props?.myRequestDetailsSuccess]);

  console.log(
    JSON.stringify(props.myRequestDetailsSuccess),
    'myRequestDetailsSuccess',
  );

  const onTransactionSuccessfull = () => {
    props.MyRequestDetails({
      srId: srId,
    });
  };

  const faqNavigation = () => {
    props.navigation.navigate(navigations.FAQ, {
      type: myRequestDetailsData?.requestType?.id,
    });
  };

  const writeoff = myRequestDetailsData?.paymentsCollectedHistory?.filter(
    value => {
      return value?.isWriteOffData;
    },
  );

  return (
    <View style={styles.container}>
      <CancelTrip
        isVisible={cancelModalVisible}
        srId={srId}
        jobId={jobId}
        myRequestDetailsData={myRequestDetailsData}
        changeVisible={() => {
          setCancelModalVisible(false);
        }}
        onCancellationSuccessfull={onTransactionSuccessfull}
      />
      <ViewDetail
        isVisible={viewDetailVisible}
        changeVisible={() => {
          setViewDetailVisible(false);
        }}
        data={myRequestDetailsData?.tripItemWisePriceResources}
        myRequestDetailsData={myRequestDetailsData}
        writeoff={writeoff && writeoff.length && writeoff[0]}
      />
      <SafeAreaView />
      <Header
        screenName={
          jobNumber
            ? `${jobNumber}`
            : myRequestDetailsData?.serviceRequestNumber
        }
        leftIconPress={() => {
          justBooked
            ? props.navigation.navigate(navigations.HomeScreen)
            : props.navigation.goBack();
        }}
        backArrow={true}
        rightIcon={true}
        rightIconPress={() => {
          props.navigation.navigate(navigations.Notifications);
        }}
      />

      {props.myRequestDetailsLoading ||
      props.requestCreateTransactionLoading ||
      !myRequestDetailsData ? (
        <Loader />
      ) : (
        <View>
          <View
            style={{
              backgroundColor: colors.white,
              paddingVertical: heightScale(12),
            }}>
            {props.myRequestDetailsLoading ? null : (
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingHorizontal: widthScale(20),
                }}>
                <View>
                  <Text style={styles.belowHeaderText}>
                    {`${strings.closeJobs.status}: ${renderRequestStatus(
                      myRequestDetailsData,
                    )}`}
                  </Text>
                </View>
                {!!myRequestDetailsData?.customerRating && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{width: widthScale(16), height: heightScale(16)}}
                      source={Star}
                    />
                    <Text
                      style={[
                        styles.belowHeaderText,
                        {
                          color: colors.DarkGray,
                          includeFontPadding: false,
                          textAlignVertical: 'center',
                          marginLeft: widthScale(2),
                        },
                      ]}>
                      {myRequestDetailsData?.customerRating}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            {myRequestDetailsData &&
            myRequestDetailsData?.vehicleRegistrationNumber &&
            myRequestDetailsData?.driverName &&
            (jobNumber ||
              myRequestDetailsData?.requestType?.id ===
                requestTypeConstant.airAmbulance) ? (
              <View>
                <DriverDetails
                  myRequestDetailsData={myRequestDetailsData}
                  navigation={props.navigation}
                  jobNumber={jobNumber}
                  jobId={jobId}
                  chatCount={chatCount}
                  requestType={requestType}
                />
              </View>
            ) : null}

            <View style={styles.padding}>
              <View style={styles.row2}>
                <TouchableOpacity
                  style={
                    !patientDetailsActive
                      ? styles.selectedTab
                      : styles.unSelectedTab
                  }
                  onPress={() => medicalDetails(false)}>
                  <Text
                    style={
                      !patientDetailsActive
                        ? styles.selectedTabText
                        : styles.unSelectedTabText
                    }>
                    {strings.TripDetails.rideDetails}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    patientDetailsActive
                      ? styles.selectedTab
                      : styles.unSelectedTab
                  }
                  onPress={() => medicalDetails(true)}>
                  <Text
                    style={
                      patientDetailsActive
                        ? styles.selectedTabText
                        : styles.unSelectedTabText
                    }>
                    {strings.TripDetails.MedicalDetails}
                  </Text>
                </TouchableOpacity>
              </View>

              {patientDetailsActive ? (
                <View style={styles.patientView}>
                  <PatientDetails
                    medCondVal={
                      myRequestDetailsData?.victimMedicalConditions &&
                      myRequestDetailsData?.victimMedicalConditions.length
                        ? myRequestDetailsData?.victimMedicalConditions
                        : null
                    }
                    myRequestDetailsData={myRequestDetailsData}
                  />
                </View>
              ) : (
                <View>
                  <View style={styles.rideView}>
                    <RideDetails
                      myRequestDetailsData={myRequestDetailsData}
                      jobNumber={jobNumber}
                      navigation={props.navigation}
                      resolutionStatus={props.resolutionStatus}
                      setCancelModalVisible={setCancelModalVisible}
                    />
                  </View>

                  {!!myRequestDetailsData?.tripItemWisePriceResources
                    ?.length && (
                    <>
                      <View style={styles.paymentView}>
                        <PaymentDetails
                          data={
                            myRequestDetailsData?.tripItemWisePriceResources
                          }
                          transactionData={myRequestDetailsData}
                          totalPrice={myRequestDetailsData?.totalPrice}
                          paymentOption={myRequestDetailsData?.paymentOption}
                          setViewDetailVisible={setViewDetailVisible}
                          writeoff={writeoff && writeoff.length && writeoff[0]}
                        />
                      </View>
                      {myRequestDetailsData?.paymentsCollectedHistory?.length >=
                      0 ? (
                        <View style={styles.paymentView}>
                          <TransactionHistory
                            myRequestDetailsData={myRequestDetailsData}
                          />
                        </View>
                      ) : null}
                    </>
                  )}

                  {myRequestDetailsData?.clientResource?.projectPaymentBy !==
                    tripDetails.corporate &&
                  (myRequestDetailsData?.paymentOption ===
                    paymentOption.ONLINE ||
                    myRequestDetailsData?.requestType?.id ===
                      requestTypeConstant.airAmbulance) ? (
                    <PayNow
                      srId={srId}
                      amountReceived={myRequestDetailsData?.amountReceived}
                      onTransactionSuccessfull={onTransactionSuccessfull}
                    />
                  ) : null}
                  {myRequestDetailsData?.invoiceUuid && (
                    <View style={styles.downloadView}>
                      <Invoice uuid={myRequestDetailsData?.invoiceUuid} />
                    </View>
                  )}
                </View>
              )}
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: heightScale(120),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.PaleBlue,
    borderRadius: moderateScale(25),
    marginTop: heightScale(10),
    borderWidth: 3,
    borderColor: colors.PaleBlue,
  },
  selectedTab: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    paddingVertical: heightScale(7),
    alignItems: 'center',
  },
  unSelectedTab: {
    flex: 1,
    backgroundColor: colors.PaleBlue,
    borderRadius: moderateScale(20),
    paddingVertical: heightScale(7),
    alignItems: 'center',
  },
  selectedTabText: {
    fontSize: normalize(14),
    color: colors.DarkGray,
    fontFamily: fonts.calibri.medium,
  },
  unSelectedTabText: {
    fontSize: normalize(14),
    color: colors.DimGray2,
    fontFamily: fonts.calibri.medium,
  },

  padding: {
    paddingHorizontal: widthScale(22),
  },
  rideView: {
    marginTop: heightScale(15),
  },
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

  paymentView: {
    marginTop: heightScale(15),
  },
  belowHeaderText: {
    fontSize: normalize(14),
    color: colors.primary,
    fontFamily: fonts.calibri.medium,
    fontWeight: '500',
  },
  downloadView: {
    marginTop: heightScale(15),
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

  patientView: {marginTop: heightScale(15)},
});

const mapStateToProps = ({App, Auth}) => {
  const {
    requestListingLoading,
    requestListingSuccess,
    requestListingFail,
    getProfileLoading,
    userName,
    userId,
    configurationSuccess,
    myRequestDetailsLoading,
    myRequestDetailsSuccess,
    myRequestDetailsFail,
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
  const {userInfoSuccess} = Auth;
  return {
    userInfoSuccess,
    getProfileLoading,
    requestListingLoading,
    requestListingSuccess,
    requestListingFail,
    userName,
    userId,
    configurationSuccess,
    myRequestDetailsLoading,
    myRequestDetailsSuccess,
    myRequestDetailsFail,
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
  MyRequestDetails,
  resolutionStatus,
  getPaymentDetails,
  createTransaction,
  transactionDetails,
  resetTransactionDetails,
  resetCreateTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyrequestDetails);
