import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import {colors, scaling, fonts} from '../../../library';
import {connect} from 'react-redux';
import Header from '../../../components/header';
import {Context} from '../../../providers/localization';
import {navigations} from '../../../constants';
import {
  requestDetails,
  cancelRequest,
  resetCancelRequest,
  cancelReason,
  resetCancelReason,
} from '../../../redux/actions/app.actions';
import {ScrollView} from 'react-native-gesture-handler';
import Loader from '../../../components/loader';
import {leadStatus} from '../../../utils/constants';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import CancelReasonList from '../../../components/cancelReasonList';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const RequestDetails = props => {
  const {leadId} = props.route.params;
  const strings = React.useContext(Context).getStrings();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    props.requestDetails({id: leadId});
  }, []);

  useEffect(() => {
    if (props.cancelReasonSuccess) {
      setIsVisible(true);
    }
  }, [props.cancelReasonSuccess]);

  useEffect(() => {
    if (props.cancelReasonFail) {
      console.log('not working ? :', props.cancelReasonFail);
    }
  }, [props.cancelReasonFail]);

  useEffect(() => {
    if (props.requestDetailsSuccess) {
      setIsLoading(false);
    }
  }, [props.requestDetailsSuccess]);
  useEffect(() => {
    if (props.requestDetailsFail) {
      setIsLoading(false);
      const errMsg =
        props.requestDetailsFail?.errors?.response?.data?.apierror?.msg ||
        strings.common.generalError;
      Toast.showWithGravity(errMsg, Toast.LONG, Toast.TOP);
    }
  }, [props.requestDetailsFail]);
  useEffect(() => {
    if (props.requestCancelSuccess) {
      props.resetCancelRequest();
      Toast.showWithGravity(strings.RequestDetailsScreen.requestCancelled, Toast.LONG, Toast.TOP);
      props.navigation.goBack();
    }
  }, [props.requestCancelSuccess]);

  useEffect(() => {
    if (props.requestCancelFail) {
      const errMsg =
        props.requestCancelFail?.errors?.response?.data?.apierror?.code || '';
      if (errMsg) {
        if (errMsg === 'ZQTZA0004') {
          Toast.showWithGravity(strings.RequestDetailsScreen.requestNotFound, Toast.LONG, Toast.TOP);
        }
        if (errMsg === 'ZQTZA0002') {
          Toast.showWithGravity(strings.RequestDetailsScreen.errorCancellingRequest, Toast.LONG, Toast.TOP);
        }
      }
    }
  }, [props.requestCancelFail]);

  const changeIsVisible = value => {
    setIsVisible(value);
    props.resetCancelReason();
  };

  const callDriver = number => {
    Linking.openURL(`tel:+91${number}`);
  };

  const selectedValue = (cancelReasonValue, isVisibleValue) => {
    setIsVisible(isVisibleValue);
    props.cancelRequest({
      id: leadId,
      cancelReason: `${cancelReasonValue} through Citizen App`,
    });
  };

  const cancelReasonList = () => {
    return (
      <CancelReasonList
        isVisible={isVisible}
        data={props.cancelReasonSuccess}
        disableIsVisible={changeIsVisible}
        selectedValue={selectedValue}
      />
    );
  };

  const requestDetailsData = [
    {
      Label: strings.RequestDetailsScreen.Name,
      Value: props.requestDetailsSuccess?.data?.callerName,
    },
    {
      Label: strings.RequestDetailsScreen.Age,
      Value: props.requestDetailsSuccess?.data?.age,
    },
    {
      Label: strings.RequestDetailsScreen.phoneNumber,
      Value: props.requestDetailsSuccess?.data?.callerNumber,
    },
    {
      Label: strings.RequestDetailsScreen.treatment,
      Value: props.requestDetailsSuccess?.data?.treatment,
    },
    {
      Label: strings.RequestDetailsScreen.address,
      Value: props.requestDetailsSuccess?.data?.address,
    },
    {
      Label: strings.RequestDetailsScreen.createdOn,
      Value: moment(props.requestDetailsSuccess?.data?.leadCreatedAt).format(
        'DD MMM YYYY , hh:mm a',
      ),
    },
    {
      Label: strings.RequestDetailsScreen.requestStatus,
      Value: props.requestDetailsSuccess?.data?.requestStatus,
    },
  ];
  const driverDetails = [
    {
      Label: strings.RequestDetailsScreen.driverName,
      Value: props.requestDetailsSuccess?.data?.driverName,
    },
    {
      Label: strings.RequestDetailsScreen.driverNumber,
      Value: props.requestDetailsSuccess?.data?.driverPhoneNumber,
    },
    {
      Label: strings.RequestDetailsScreen.vehicalRegistrationNumber,
      Value: props.requestDetailsSuccess?.data?.vehicleRegNumber,
    },
    {
      Label: strings.RequestDetailsScreen.vehicalType,
      Value: props.requestDetailsSuccess?.data?.vehicleType,
    },
  ];
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.container}>
        <SafeAreaView />
        <Header
          screenName={strings.RequestDetailsScreen.RequestDetailsScreen}
          leftIconPress={props.navigation.goBack}
          backArrow={true}
        />
        {props.requestDetailsLoading ||
        props.cancelReasonLoading ||
        isLoading ? (
          <Loader />
        ) : (
          <View style={styles.mainView}>
            {isVisible ? cancelReasonList() : null}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                marginBottom: heightScale(10),
              }}>
              {requestDetailsData.map((item, index, array) => {
                return (
                  <View style={[styles.row]}>
                    <Text
                      style={[
                        styles.subTitle,
                        {width: '35%', fontFamily: fonts.calibri.bold},
                      ]}>
                      {item.Label}
                    </Text>
                    <Text
                      style={[
                        styles.subTitle,
                        {width: '60%', marginLeft: '5%'},
                      ]}>
                      {item.Value}
                    </Text>
                  </View>
                );
              })}

              {props.requestDetailsSuccess?.data?.resolutionReasonName &&
              props.requestDetailsSuccess?.data?.requestStatus !=
                leadStatus.ERV_DISPATCHED ? (
                <View style={[styles.row]}>
                  <Text
                    style={[
                      styles.subTitle,
                      {width: '35%', fontFamily: fonts.calibri.bold},
                    ]}>
                    {strings.RequestDetailsScreen.resolutionReason}
                  </Text>
                  <Text
                    style={[styles.subTitle, {width: '60%', marginLeft: '5%'}]}>
                    {props.requestDetailsSuccess?.data?.resolutionReasonName.indexOf(
                      'through Citizen App',
                    ) !== -1
                      ? props.requestDetailsSuccess?.data?.resolutionReasonName.substring(
                          0,
                          props.requestDetailsSuccess?.data?.resolutionReasonName.indexOf(
                            'through Citizen App',
                          ),
                        )
                      : props.requestDetailsSuccess?.data?.resolutionReasonName}
                  </Text>
                </View>
              ) : null}

              {props.requestDetailsSuccess?.data?.remarks ? (
                <View style={[styles.row]}>
                  <Text
                    style={[
                      styles.subTitle,
                      {width: '35%', fontFamily: fonts.calibri.bold},
                    ]}>
                    {strings.RequestDetailsScreen.remarks}
                  </Text>
                  <Text
                    style={[styles.subTitle, {width: '60%', marginLeft: '5%'}]}>
                    {props.requestDetailsSuccess?.data?.remarks}
                  </Text>
                </View>
              ) : null}
              {props.requestDetailsSuccess?.data?.leadNumber ? (
                <View style={[styles.row]}>
                  <Text
                    style={[
                      styles.subTitle,
                      {width: '35%', fontFamily: fonts.calibri.bold},
                    ]}>
                    {strings.RequestDetailsScreen.leadNumber}
                  </Text>
                  <Text
                    style={[styles.subTitle, {width: '60%', marginLeft: '5%'}]}>
                    {props.requestDetailsSuccess?.data?.leadNumber}
                  </Text>
                </View>
              ) : null}
              {props.requestDetailsSuccess?.data?.srNumber ? (
                <View style={[styles.row]}>
                  <Text
                    style={[
                      styles.subTitle,
                      {width: '35%', fontFamily: fonts.calibri.bold},
                    ]}>
                    {strings.RequestDetailsScreen.srNumber}
                  </Text>
                  <Text
                    style={[styles.subTitle, {width: '60%', marginLeft: '5%'}]}>
                    {props.requestDetailsSuccess?.data?.srNumber}
                  </Text>
                </View>
              ) : null}
              {props.requestDetailsSuccess?.data?.jobNumber ? (
                <View style={[styles.row]}>
                  <Text
                    style={[
                      styles.subTitle,
                      {width: '35%', fontFamily: fonts.calibri.bold},
                    ]}>
                    {strings.RequestDetailsScreen.jobNumber}
                  </Text>
                  <Text
                    style={[styles.subTitle, {width: '60%', marginLeft: '5%'}]}>
                    {props.requestDetailsSuccess?.data?.jobNumber}
                  </Text>
                </View>
              ) : null}

              {props.requestDetailsSuccess?.data?.requestStatus ===
              leadStatus.REQUEST_MADE ? (
                <View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.button]}
                    onPress={() => {
                      props.cancelReason();
                    }}>
                    <Text style={styles.buttonText}>
                      {strings.RequestDetailsScreen.cancelRequest}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {props.requestDetailsSuccess?.data?.requestStatus ===
              leadStatus.ERV_DISPATCHED
                ? driverDetails.map(item => {
                    return (
                      <View>
                        <View style={[styles.row]}>
                          <Text
                            style={[
                              styles.subTitle,
                              {width: '35%', fontFamily: fonts.calibri.bold},
                            ]}>
                            {item.Label}
                          </Text>
                          <Text
                            style={[
                              styles.subTitle,
                              {width: '60%', marginLeft: '5%'},
                            ]}>
                            {item.Label ===
                            strings.RequestDetailsScreen.driverNumber ? (
                              <TouchableOpacity
                                style={styles.row}
                                onPress={() => callDriver(item.Value)}>
                                <Text style={styles.caller}>
                                  {strings.RequestDetailsScreen.callDriver}
                                </Text>
                                <Icon
                                  name="phone-in-talk"
                                  size={moderateScale(22)}
                                  color={colors.green}
                                />
                              </TouchableOpacity>
                            ) : (
                              item.Value
                            )}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                : null}
              {props.requestDetailsSuccess?.data?.requestStatus ===
              leadStatus.ERV_DISPATCHED ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.trackButton]}
                  onPress={() => {
                    props.navigation.navigate(navigations.LiveTracking, {
                      patientAddres: props.requestDetailsSuccess?.data?.address,
                      patientLocation: {
                        latitude: props.requestDetailsSuccess?.data?.latitude,
                        longitude: props.requestDetailsSuccess?.data?.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      },
                    });
                  }}>
                  <Text style={styles.buttonText}>
                    {strings.RequestDetailsScreen.track}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainView: {
    flex: 1,
    marginTop: heightScale(20),
    marginHorizontal: widthScale(30),
  },
  caller: {
    fontSize: normalize(16),
    color: colors.black,
    fontFamily: fonts.calibri.light,
    marginRight: widthScale(5),
    textDecorationLine: 'underline',
  },
  nameStyle: {
    fontSize: normalize(18),
    color: colors.black,
    fontFamily: fonts.calibri.bold,
  },
  subTitle: {
    marginTop: heightScale(20),
    fontSize: normalize(15),
    color: colors.black,
    fontFamily: fonts.calibri.light,
  },

  row: {
    flexDirection: 'row',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    color: colors.white,
    width: widthScale(250),
    height: heightScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightScale(20),
    marginBottom: heightScale(10),
    borderRadius: moderateScale(15),
  },
  trackButton: {
    alignSelf: 'center',
    backgroundColor: colors.green,
    color: colors.white,
    width: widthScale(250),
    height: heightScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightScale(20),
    marginBottom: heightScale(10),
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(14),
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {
    requestDetailsLoading,
    requestDetailsSuccess,
    requestDetailsFail,
    requestCancelLoading,
    requestCancelSuccess,
    requestCancelFail,
    cancelReasonFail,
    cancelReasonLoading,
    cancelReasonSuccess,
  } = App;
  const {userInfoSuccess} = Auth;
  return {
    userInfoSuccess,
    requestDetailsLoading,
    requestDetailsSuccess,
    requestDetailsFail,
    requestCancelLoading,
    requestCancelSuccess,
    requestCancelFail,
    cancelReasonFail,
    cancelReasonLoading,
    cancelReasonSuccess,
  };
};

const mapDispatchToProps = {
  requestDetails,
  cancelRequest,
  resetCancelRequest,
  cancelReason,
  resetCancelReason,
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestDetails);
