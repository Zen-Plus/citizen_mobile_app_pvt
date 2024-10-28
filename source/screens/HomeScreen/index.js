import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {colors, fonts, scaling} from '../../library';
import {connect} from 'react-redux';
import {Context} from '../../providers/localization';
import moment from 'moment';
import {
  getProfile,
  getAllowedLanguages,
  getPickist,
  addRequest,
  resetAddRequest,
  requestCitizenTrips,
  MyRequestDetails,
  getNotificationsCount,
  getDocument,
  requestCitizenTripsReset,
  resetEndTrip,
  getDashboardVehicals,
  MyRequestDetailsReset,
  configuration,
  setIsInitialLaunch,
} from '../../redux/actions/app.actions';
import LinearGradient from 'react-native-linear-gradient';
import {navigations} from '../../constants';
import {requestTypeConstant} from '../../utils/constants';
import {registerDevice} from '../../api';
import Toast from 'react-native-simple-toast';
import {TripDetailsImage} from '../../utils/constants';
import {
  pendingFeedbackApi,
  lastOpenRequestApi,
  myRequestDetailsApi,
  namedCallerAndClientDetailsAPI,
} from '../../redux/api/app.api';
import CorporateBookingModal from './ModalComponent/CorporateBookingModal';
import SnapCarousal from 'react-native-snap-carousel';
import {
  airBookAmbulance,
  eventAmbulance,
  intercity,
  ScrollToTop,
  DoctorIcon,
  TrainCardIcon,
} from '../../../assets';
import {useIsFocused} from '@react-navigation/native';
import Loader from '../../components/loader';
import Icon from 'react-native-vector-icons/Feather';
import IntercityModal from './ModalComponent/InterCityModal';
import {RNImage} from '../../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SelectionItemsRow from './SelectionItemsRow';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';
import { openContact } from '../../components/functions';
import Modal from 'react-native-modal';

const {normalize, heightScale, widthScale, moderateScale} = scaling;

const widgetsOrder = [
  'NEONATAL', //5g
  'ALS', //cardic
  'BLS', //basic
  'HEARSE',
  'MOBILITY_ASSIST',
  'DOCTOR',
  'PET',
  'INTERCITY',
];

const HomeScreen = props => {
  const strings = React.useContext(Context).getStrings();
  const {homeScreen} = strings;
  const {bottom} = useSafeAreaInsets();
  const [percentProgress, setPercentProgress] = useState(0);
  const isCarousel = useRef(null);
  const [profileData, setProfileData] = useState({
    initialName: '',
    initialEmail: '',
    name: '',
    mobile: '',
    email: '',
    age: '',
    contactNumber: '',
    userId: '',
  });
  const [isIntercityVisible, setIsIntercityVisible] = useState(false);
  const [isBookingVisible, setIsBookingVisible] = useState(false);
  const [widgetsData, setWidgetData] = useState([]);
  const [banner, setBanner] = useState();
  const [vehicleType, setVehicleType] = useState();
  const isFocused = useIsFocused();
  const [requestType, setRequestType] = useState();
  const [canAddWidgets, setCanAddWidgets] = useState(false);

  const [index, setIndex] = useState(0);
  const [isLoader, setLoader] = useState(false);
  const [isCorporateBookingModalVisible, setCorporateBookingModalVisible] = useState({});
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [isNoticeContainerVisible, setNoticeContainerVisible] = useState(false);

  useEffect(() => {
    try {
      //fetch Notice Popup flag from configuration api state
      const isNoticePopupEnabled = true;//JSON.parse(props?.configurationSuccess?.data[0]?.metadata)?.mappingRequired ?? false;
      //Check if is enabled and its fresh launch
      setNoticeContainerVisible(isNoticePopupEnabled && props.isAppFirstLaunch);
    } catch (error) {
      //If any error occurs dont show popup.
      setNoticeContainerVisible(false);
      console.log("===> configuration api err : Could not reterive Notice Popup flag", error);
    }
  }, []);

  function getRequestDetails(data, timerData) {
    myRequestDetailsApi(data)
      .then(res => {
        const _data = res?.data?.data || {};
        props.navigation.navigate(navigations.GroundAmbulance, {
          type: _data.requestType?.id,
          vehicleType: _data.vehicleTypeObj,
          srDetails: {..._data, ...timerData},
        });
      })
      .catch(err => {
        console.log('===> myRequestDetailsApi err', err);
      });
  }

  function handleLastOpenRequest(data) {
    lastOpenRequestApi(data)
      .then(res => {
        const _data = res?.data?.data || {};
        if (_data.srRequestSentAt && _data.srTotalRequestTime) {
          getRequestDetails(
            {srId: _data.srId},
            {
              timer: _data.srRequestSentAt,
              totalTimeInMinutes: _data.srTotalRequestTime,
            },
          );
        }
      })
      .catch(err => {
        console.log('===> lastOpenRequestApi err', err);
      });
  }
  useEffect(() => {
    setCanAddWidgets(true);
    props.getDashboardVehicals(
      requestTypeConstant.GroundAmbulance,
      requestTypeConstant.petVeterinaryAmbulance,
    );
    props.getDocument({documentType: 'BANNER'});

    return () => {
      setWidgetData({});
    };
  }, []);

  useEffect(() => {
    if (props.documentSuccess) {
      setBanner(props.documentSuccess?.data[0]?.uuid);
    }
  }, [props.documentSuccess]);

  useEffect(() => {
    if (props.requestCitizenTripsSuccess && vehicleType) {
      if (props.requestCitizenTripsSuccess?.data?.content.length > 0) {
        Toast.showWithGravity(homeScreen.alreadyRequest, Toast.LONG, Toast.TOP);
      } else {
        props.requestCitizenTripsReset();
        setIsBookingVisible(true);
      }
    } else if (
      props.requestCitizenTripsSuccess &&
      requestType &&
      requestType !== requestTypeConstant.GroundAmbulance
    ) {
      if (props.requestCitizenTripsSuccess?.data?.content.length > 0) {
        Toast.showWithGravity(homeScreen.alreadyRequest, Toast.LONG, Toast.TOP);
      } else {
        props.requestCitizenTripsReset();
        props.resetEndTrip();
        props.MyRequestDetailsReset();
        props.navigation.navigate(navigations.GroundAmbulance, {
          type: requestType,
        });
      }
    }
  }, [props.requestCitizenTripsSuccess, vehicleType]);

  const requestCitizenTripCheck = requestType => {
    props.requestCitizenTrips({
      fromDate: moment().subtract(90, 'days').startOf('days').valueOf(),
      toDate: moment().valueOf(),
      pageNo: 0,
      pageSize: 5,
      tripStatus: 'ONGOING',
      requestType: requestType,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      isCarousel?.current?.snapToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (props.getDashboardVehicalsSuccess?.data) {
      let tempVehicle = props.getDashboardVehicalsSuccess?.data
        .map(item => {
          if (item?.vehicleType?.id === 'PET') {
            return {
              label: item.vehicleType.name,
              id: item.vehicleType.id,
              description: item.description,
              image: TripDetailsImage[item.vehicleType.id],
              type: requestTypeConstant.petVeterinaryAmbulance,
              onPress: () => {
                setVehicleType(item.vehicleType);
                setRequestType(requestTypeConstant.petVeterinaryAmbulance);
                requestCitizenTripCheck(
                  requestTypeConstant.petVeterinaryAmbulance,
                );
              },
            };
          }
          return {
            label: item.vehicleType.name,
            id: item.vehicleType.id,
            description: item.description,
            image: TripDetailsImage[item.vehicleType.id],
            onPress: () => {
              setVehicleType(item.vehicleType);
              setRequestType(requestTypeConstant.GroundAmbulance);
              requestCitizenTripCheck(requestTypeConstant.GroundAmbulance);
            },
          };
        })
        .filter(item => widgetsOrder.includes(item.id));

      const ambulanceListing =
        tempVehicle.length > 0
          ? [
              ...tempVehicle,
              {
                label: 'Intercity',
                id: 'INTERCITY',
                description: '',
                image: intercity,
                onPress: () => {
                  setIsIntercityVisible(true);
                  setIsBookingVisible(false);
                },
              },
              {
                label: 'Doctor',
                id: 'DOCTOR',
                description: '',
                image: DoctorIcon,
                hidePopup: true,
                onPress: () => {
                  setVehicleType();
                  setIsBookingVisible(false);
                  setRequestType(requestTypeConstant.doctorAtHome);
                  requestCitizenTripCheck(requestTypeConstant.doctorAtHome);
                },
              },
            ]
          : [];

      let mappedWidget =
        canAddWidgets && tempVehicle.length > 0
          ? ambulanceListing.reduce((prev, item) => {
              const index = widgetsOrder.indexOf(item.id);
              if (widgetsOrder.includes(item.id)) {
                return {...prev, [item.id]: {...item, index}};
              }
              return prev;
            }, {})
          : {};

      setWidgetData({...(widgetsData ?? {}), ...mappedWidget});
    }
  }, [props.getDashboardVehicalsSuccess?.data]);

  const scrollRef = useRef();

  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  useEffect(() => {
    if (isFocused && profileData.mobile) {
      pendingFeedbackApi({phoneNumber: profileData.mobile})
        .then(res => {
          const _data = res?.data?.data || {};
          if (Object.keys(_data).length && !_data.isRatingGiven) {
            props.navigation.navigate(navigations.FeedbackScreen, {
              details: _data,
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [isFocused, profileData.mobile]);

  useEffect(() => {
    props.getAllowedLanguages();
    props.getNotificationsCount();
    props.getProfile();

    if (!props.getPicklistSuccess) {
      props.getPickist();
    }
  }, []);

  useEffect(() => {
    if (props.getProfileSuccess) {
      handleLastOpenRequest({
        callerNumber: props.getProfileSuccess?.data?.mobile,
      });
      registerDevice(props.getProfileSuccess?.data?.id);

      setProfileData({
        ...profileData,
        initialEmail: props.getProfileSuccess?.data?.email,
        initialName: props.getProfileSuccess?.data?.firstName,
        name: props.getProfileSuccess?.data?.firstName,
        mobile: props.getProfileSuccess?.data?.mobile,
        email: props.getProfileSuccess?.data?.email,
        age: props.getProfileSuccess?.data?.age,
        contactNumber: props.getProfileSuccess?.data?.mobile,
        userId: props.getProfileSuccess?.data?.id,
      });

      let count =
        props.getProfileSuccess?.data?.isCustomer +
        props.getProfileSuccess?.data?.isMedicalConditionAvailable +
        props.getProfileSuccess?.data?.isMemberAdded;
      setPercentProgress(count * 33.33);
    }
  }, [props.getProfileSuccess]);

  useEffect(() => {
    if (props.addRequestSuccess) {
      props.resetAddRequest();
      Toast.showWithGravity(
        strings.AddRequestScreen.requestAddedSuccessfully,
        Toast.LONG,
        Toast.TOP,
      );
    }
  }, [props.addRequestSuccess]);

  useEffect(() => {
    if (props.addRequestFail) {
      const errMsg =
        props.addRequestFail?.errors?.response?.data?.apierror?.code || '';
      if (errMsg) {
        if (errMsg === 'ZQTZA0037') {
          Toast.showWithGravity(
            strings.AddRequestScreen.requestAlreadyMade,
            Toast.LONG,
            Toast.TOP,
          );
        }
        props.resetAddRequest();
      }
    }
  }, [props.addRequestFail]);

  const handleClickOnAmbulance = item => {
    if (item) item.onPress();
    if (!item?.hidePopup) setSelectedWidget(item);
  };

  const closeAmbulanceDescriptionModal = () => {
    setSelectedWidget(null);
    setIsBookingVisible(false);
    setVehicleType();
    setRequestType();
  };

  const {data = {}} = props.getNotificationsCountSuccess || {};
  const {
    unreadNotifications = 0,
    unreadAlerts = 0,
    unreadUpdates = 0,
  } = data || {};

  const corporateBooking = () => {
    props.resetEndTrip();
    props.MyRequestDetailsReset();
    props.navigation.navigate(navigations.GroundAmbulance, {
      type: requestType ?? requestTypeConstant.GroundAmbulance,
      vehicleType: vehicleType,
      corporateBookingData: isCorporateBookingModalVisible,
    });
    setCorporateBookingModalVisible({});
  };

  const regularBooking = () => {
    props.resetEndTrip();
    props.MyRequestDetailsReset();
    props.navigation.navigate(navigations.GroundAmbulance, {
      type: requestType ?? requestTypeConstant.GroundAmbulance,
      vehicleType: vehicleType,
    });
  };

  const handleBookNowPress = (type) => {
    if (type === requestTypeConstant.GroundAmbulance) {
      setLoader(true);
      namedCallerAndClientDetailsAPI({phoneNo: profileData.mobile})
        .then((res) => {
          const _data = res?.data?.data || {};
          setLoader(false);
          setCorporateBookingModalVisible(_data);
        })
        .catch(() => {
          setLoader(false);
          regularBooking();
        });
    } else {
      regularBooking();
    }
  };

  return (
      <View style={styles.container}>
        <Modal isVisible={isNoticeContainerVisible} style={styles.modal}>
          <View style={styles.noticeContainer}>
            <Text style={styles.title}>Notice !</Text>
            <Text style={styles.subTitle1}>{homeScreen.userNotice}</Text>
            <TouchableOpacity
              onPress={() => { openContact(homeScreen.tollFreeNumber) }}>
              <View style={[styles.supportButton, { backgroundColor: colors.lightRed2 }]}>
                <Feather
                  name="phone-call"
                  size={20}
                  color={colors.Gainsboro}
                  style={styles.phoneIcon}
                />
                <Text style={styles.buttonText}>{homeScreen.tollFreeNumber}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setNoticeContainerVisible(false), props.setIsInitialLaunch(false) }}>
              <View style={styles.supportButton}>
                <Feather
                  name="log-in"
                  size={20}
                  color={colors.Gainsboro}
                  style={styles.phoneIcon}
                />
                <Text style={styles.buttonText}>{homeScreen.useAppButtonMessage}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        {(props.myRequestDetailsLoading ||
          props.getTypeOfDoctorsLoading ||
          props.getDashboardVehicalsLoading ||
          props.documnentLoading ||
          isLoader) && <Loader />}
        <IntercityModal
          isIntercityVisible={isIntercityVisible}
          supportNumber={props.supportNumber}
          setIsIntercityVisible={value => {
            setIsIntercityVisible(value);
          }}
        />

        {!!Object.keys(isCorporateBookingModalVisible).length && (
          <CorporateBookingModal
            isVisible={!!Object.keys(isCorporateBookingModalVisible).length}
            onCancel={() => { setCorporateBookingModalVisible({}); }}
            onYes={corporateBooking}
            onNo={() => {
              setCorporateBookingModalVisible({});
              regularBooking();
            }}
          />
        )}

        <LinearGradient
          style={{flex: 1}}
          colors={[colors.white, colors.PaleBlue, colors.PaleBlue]}>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: bottom + 20,
            }}
            style={[styles.container]}
            ref={scrollRef}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <SafeAreaView />
            {/* nav header start */}
            <View style={styles.headerImgSection}>
              <TouchableOpacity
                onPress={() => props.navigation.toggleDrawer()}
                style={styles.touchView}>
                <Icon name="menu" color={colors.DarkSlateGray} size={30} />
              </TouchableOpacity>
              <Text style={styles.helloText} numberOfLines={1}>
                {homeScreen.hello}{' '}
                <Text style={styles.name}>{profileData.name}</Text>{' '}
              </Text>
              <View style={styles.rowContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    props.navigation.navigate(navigations.Notifications);
                  }}
                  style={styles.notification}>
                  <Icon name="bell" size={28} color={colors.DarkSlateGray} />
                  {unreadNotifications || unreadAlerts || unreadUpdates ? (
                    <View style={styles.dot}>
                      <Text style={styles.notificationCount}>
                        {unreadNotifications + unreadAlerts + unreadUpdates > 99
                          ? '99+'
                          : unreadNotifications + unreadAlerts + unreadUpdates}
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              </View>
            </View>
            {/* nav header end */}

            {/* carousel start */}
            {props.documentSuccess?.data?.length && (
              <View style={styles.carouselContainer}>
                <SnapCarousal
                  loop={true}
                  ref={isCarousel}
                  enableMomentum={false}
                  lockScrollWhileSnapping
                  data={props.documentSuccess?.data}
                  renderItem={({item}) => <RNImage uuid={item.uuid} />}
                  sliderWidth={Dimensions.get('window').width / 1.1}
                  itemWidth={Dimensions.get('window').width / 1.1}
                  onSnapToItem={index => setIndex(index)}
                />
              </View>
            )}
            {/* carousel end */}

            {/* ambulance list start */}
            <View style={styles.chooseAmbulanceView}>
              <Text
                style={[
                  styles.whatTxt,
                  !props.documentSuccess?.data?.length && {marginTop: 20},
                ]}>
                {homeScreen.lookingForService}
              </Text>
              <SelectionItemsRow
                props={props}
                widgetsOrder={[...widgetsOrder].slice(0, 4)}
                widgetsData={widgetsData}
                isBookingVisible={
                  isBookingVisible &&
                  selectedWidget &&
                  Math.floor(selectedWidget?.index / 4) === 0
                }
                vehicleType={vehicleType}
                handleClickOnAmbulance={handleClickOnAmbulance}
                closeAmbulanceDescriptionModal={closeAmbulanceDescriptionModal}
                selectedWidget={selectedWidget}
                requestType={requestType}
                handleBookNowPress={handleBookNowPress}
              />
              <SelectionItemsRow
                props={props}
                widgetsOrder={widgetsOrder.slice(4)}
                widgetsData={widgetsData}
                isBookingVisible={
                  isBookingVisible &&
                  selectedWidget &&
                  Math.floor(selectedWidget?.index / 4) === 1
                }
                vehicleType={vehicleType}
                handleClickOnAmbulance={handleClickOnAmbulance}
                closeAmbulanceDescriptionModal={closeAmbulanceDescriptionModal}
                selectedWidget={selectedWidget}
                requestType={requestType}
                handleBookNowPress={handleBookNowPress}
              />

              {/* ambulance cards  */}
              <View style={[styles.whyUsBookingView]}>
                {/* train  */}
                <TouchableOpacity
                  style={[styles.findAmbulanceView, styles.eventAmbulance]}
                  onPress={() => {
                    setRequestType(requestTypeConstant.trainAmbulance);
                    requestCitizenTripCheck(requestTypeConstant.trainAmbulance);
                  }}>
                  <FastImage
                    style={styles.ambulanceImage}
                    source={TrainCardIcon}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                </TouchableOpacity>

                {/* air ambulance  */}
                <TouchableOpacity
                  style={[styles.findAmbulanceView, styles.eventAmbulance]}
                  onPress={() => {
                    setRequestType(requestTypeConstant.airAmbulance);
                    requestCitizenTripCheck(requestTypeConstant.airAmbulance);
                  }}>
                  <FastImage
                    style={styles.ambulanceImage}
                    source={airBookAmbulance}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                </TouchableOpacity>

                {/* air ambulance  */}
                <TouchableOpacity
                  style={[styles.findAmbulanceView]}
                  onPress={() =>
                    props.navigation.navigate(navigations.EventRequest)
                  }>
                  <FastImage
                    style={styles.ambulanceImage}
                    source={eventAmbulance}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* ambulance list end */}

            <View style={{alignItems: 'center', marginVertical: heightScale(19)}}>
              <TouchableOpacity onPress={onPressTouch}>
                <Image source={ScrollToTop} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: normalize(24),
    fontFamily: fonts.calibri.bold,
    color: colors.black,
  },
  subTitle1: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.black,
    marginBottom: 10
  },
  modal: {
    marginVertical: 50,
    marginHorizontal: 10,
    backgroundColor: 'transparent'
  },
  noticeContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    paddingHorizontal: widthScale(16),
  },
  buttonText: {
    fontSize: normalize(14),
    color: colors.white,
    fontFamily: fonts.calibri.medium,
    lineHeight: normalize(20),
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  menuIconsContainer: {
    paddingBottom: heightScale(12),
    borderRadius: normalize(6),
    borderColor: colors.Silver,
  },
  chooseAmbulanceView: {},
  whatTxt: {
    color: colors.DarkGray,
    fontSize: normalize(16),
    fontFamily: fonts.calibri.bold,
    marginBottom: normalize(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  assistanceView: {
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(12),
    paddingVertical: widthScale(18),
    borderRadius: normalize(8),
  },
  assistanceText: {
    marginBottom: heightScale(16),
    color: colors.DimGray2,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    lineHeight: normalize(22),
  },
  findAmbulanceView: {
    marginHorizontal: 24,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16.0,
    elevation: 24,
  },
  BannerImageContainer: {
    height: Dimensions.get('window').width / 2,
    minWidth: Dimensions.get('window').width / 1.1,
    marginBottom: heightScale(30),
    marginHorizontal: widthScale(16),
  },
  findCallView: {
    paddingHorizontal: normalize(12),
    flex: 3,
  },
  ambulanceIconView: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  needHelpView: {
    paddingHorizontal: normalize(12),
    flex: 4,
  },
  callIconView: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callUs: {
    color: colors.RoyalBlue,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
  },
  needHelpHeading: {
    color: colors.RoyalBlue,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    fontWeight: 'bold',
    marginBottom: normalize(5),
  },
  callIconImg: {
    width: normalize(28),
    height: normalize(28),
  },
  whyUsImg: {width: normalize(90), height: normalize(77)},
  ambulanceImg: {
    height: heightScale(160),
    width: '100%',
    alignSelf: 'center',
  },
  sosView: {
    zIndex: 1,
  },
  findAmbulanceText: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '700',
    color: colors.justBlack,
    fontSize: normalize(16),
  },

  nearByButton: {
    borderWidth: 1.2,
    borderColor: colors.darkGreen,
    borderRadius: normalize(20),
    width: normalize(106),
    height: normalize(36),
    minHeight: normalize(36),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: normalize(24),
  },

  titleStyle: {
    fontSize: normalize(10),
    fontWeight: '800',
    fontFamily: fonts.calibri.bold,
  },

  headerImgSection: {
    marginTop: normalize(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
  },
  headerImg: {
    width: normalize(40),
    height: normalize(40),
  },
  headerImgDot: {
    width: normalize(20),
    height: normalize(20),
  },
  helloText: {
    fontSize: normalize(18),
    fontWeight: '500',
    fontFamily: fonts.calibri.regular,
    color: colors.DarkGray,
    width: '75%',
    marginLeft: widthScale(5),
  },
  name: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    fontFamily: fonts.calibri.bold,
    color: colors.DarkGray,
  },
  touchView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeText: {
    fontWeight: '600',
    fontSize: normalize(10),
  },
  mainViewStyle: {
    width: Dimensions.get('window').width / 1.7,
    marginBottom: heightScale(20),
  },
  progressLineStyle: {
    width: Dimensions.get('window').width / 2,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notification: {
    marginRight: widthScale(4),
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.red,
    alignContent: 'center',
    position: 'absolute',
    left: widthScale(10),
    bottom: heightScale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: colors.white,
    fontSize: normalize(8),
    fontFamily: fonts.calibri.regular,
    lineHeight: 22,
  },
  bookingAmbulance: {
    position: 'relative',
    marginTop: heightScale(41),
    marginLeft: widthScale(160),
  },
  bookAmbulanceText: {
    fontSize: normalize(17),
    color: colors.white,
    fontFamily: fonts.calibri.bold,
    lineHeight: normalize(25),
  },
  orText: {
    fontSize: normalize(17),
    color: colors.white,
    fontFamily: fonts.calibri.medium,
    lineHeight: normalize(25),
    fontSize: normalize(14),
    textAlign: 'center',
  },
  whyUsView: {
    borderTopEndRadius: normalize(20),
    borderTopStartRadius: normalize(20),
    marginTop: heightScale(20),
    zIndex: 0,
  },
  whyUsBookingView: {
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    zIndex: 0,

    marginTop: 16,
  },
  textView: {
    marginHorizontal: widthScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fixedView: {
    width: normalize(90),
    backgroundColor: colors.white,
    borderBottomEndRadius: normalize(20),
    borderBottomStartRadius: normalize(20),
  },
  whyUsText: {
    paddingVertical: heightScale(6),
    paddingHorizontal: widthScale(6),
    textAlign: 'center',
    color: colors.DarkGray,
    fontSize: normalize(14),
    fontWeight: '600',
  },

  supportButton: {
    backgroundColor: colors.black,
    marginHorizontal: widthScale(25),
    paddingVertical: heightScale(10),
    borderRadius: moderateScale(25),
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: heightScale(8),
  },
  phoneIcon: {marginRight: widthScale(10)},
  closeIconView: {
    alignSelf: 'flex-end',
    bottom: heightScale(8),
  },
  titleTextStyles: {fontSize: normalize(16)},
  bookingModal: {
    alignSelf: 'center',
    width: '98%',
    zIndex: 1000,
  },
  ambulanceImage: {
    width: '100%',
    height: 135,
  },
  eventAmbulance: {
    marginBottom: 16,
  },
  ambulanceGridColumnWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemSeparator: {height: 30},
  ambulanceList: {
    paddingHorizontal: 35,
  },
  carouselContainer: {
    marginBottom: 16,
    marginHorizontal: widthScale(16),
    marginTop: heightScale(10),

    shadowColor: colors.Black4,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {
    getProfileSuccess,
    getProfileFail,
    getPicklistLoading,
    getPicklistSuccess,
    addRequestSuccess,
    addRequestFail,
    requestCitizenTripsLoading,
    requestCitizenTripsSuccess,
    requestCitizenTripsFail,
    myRequestDetailsLoading,
    myRequestDetailsSuccess,
    myRequestDetailsFail,
    supportNumber,
    getNotificationsCountLoading,
    getNotificationsCountSuccess,
    getNotificationsCountFail,
    documnentLoading,
    documentSuccess,
    documentFail,
    getDashboardVehicalsLoading,
    getDashboardVehicalsFail,
    getDashboardVehicalsSuccess,
    configurationSuccess,
    isAppFirstLaunch,
  } = App;
  const {} = Auth;
  return {
    getProfileSuccess,
    getProfileFail,
    getPicklistLoading,
    getPicklistSuccess,
    addRequestSuccess,
    addRequestFail,
    requestCitizenTripsLoading,
    requestCitizenTripsSuccess,
    requestCitizenTripsFail,
    myRequestDetailsLoading,
    myRequestDetailsSuccess,
    myRequestDetailsFail,
    supportNumber,
    getNotificationsCountLoading,
    getNotificationsCountSuccess,
    getNotificationsCountFail,
    documnentLoading,
    documentSuccess,
    documentFail,
    getDashboardVehicalsLoading,
    getDashboardVehicalsFail,
    getDashboardVehicalsSuccess,
    configurationSuccess,
    isAppFirstLaunch,
  };
};

const mapDispatchToProps = {
  requestCitizenTrips,
  requestCitizenTripsReset,
  getProfile,
  getAllowedLanguages,
  getPickist,
  addRequest,
  resetAddRequest,
  MyRequestDetails,
  getNotificationsCount,
  getDashboardVehicals,
  getDocument,
  MyRequestDetailsReset,
  resetEndTrip,
  configuration,
  setIsInitialLaunch,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
