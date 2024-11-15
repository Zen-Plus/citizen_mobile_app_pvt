import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {Context} from '../../providers/localization.js';
import {colors, scaling, fonts} from '../../library';
import {
  requestCitizenTrips,
  MyRequestDetailsReset,
  requestCitizenTripsReset,
} from '../../redux/actions/app.actions';
import {connect} from 'react-redux';
import Header from '../../components/header';
import {useIsFocused} from '@react-navigation/native';
import Modal from './modal';
import Loader from '../../components/loader.js';
import FlatlistComponent from '../../components/flatListComponent';
import {navigations} from '../../constants';
import {requestType} from '../../utils/constants';
import CustomDropdown from '../../components/CustomDropdown.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ListItem from './ListItem.js';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const MyRequests = props => {
  const filterData = requestType;
  const strings = React.useContext(Context).getStrings();
  const [pageSetting, setPageSetting] = useState({
    pageNo: 0,
    selectedTab: 1,
    toDate: moment().endOf('days').valueOf(),
    fromDate: moment().subtract(90, 'days').startOf('days').valueOf(),
  });
  const [requestTypeValue, setRequestTypeValue] = useState(filterData[0]);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [requestListingData, setRequestListingData] = useState({content: []});
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const isFocused = useIsFocused();
  const flatlistRef = useRef();

  useEffect(() => {
    if (props.requestCitizenTripsSuccess) {
      console.log(
        'requestCitizenTripsSuccess...',
        JSON.stringify(props.requestCitizenTripsSuccess),
      );
      let tempData = {...props.requestCitizenTripsSuccess?.data};
      if (pageSetting.pageNo > 0) {
        let requestListingObject = {...requestListingData};
        requestListingObject.content = [
          ...requestListingObject?.content,
          ...tempData?.content,
        ];
        setRequestListingData(requestListingObject);
      } else {
        setRequestListingData(tempData);
      }
    } else {
      setRequestListingData({content: []});
    }
  }, [props.requestCitizenTripsSuccess]);

  useEffect(() => {
    if (props.requestCitizenTripsFail) {
      console.log('trip details listing fail :', props.requestCitizenTripsFail);
    }
  }, [props.requestCitizenTripsFail]);

  useEffect(() => {
    if (isFocused) {
      props.requestCitizenTrips({
        fromDate: pageSetting.fromDate,
        toDate: pageSetting.toDate,
        pageNo: pageSetting.pageNo,
        pageSize: 5,
        requestType: requestTypeValue.days,
      });
    }
  }, [pageSetting, isFocused]);

  useEffect(() => {
    setPageSetting((preVal) => ({
      ...preVal,
      pageNo: 0,
    }));
  }, [requestTypeValue]);

  useEffect(() => {
    return () => {
      props.MyRequestDetailsReset();
      props.requestCitizenTripsReset();
    };
  }, []);

  const handleApplyFilter = () => {
    setRequestListingData({content: []});
    flatlistRef.current.scrollToOffset({animated: true, offset: 0});
    let tempPageSetting = {...pageSetting};
    tempPageSetting.pageNo = 0;
    tempPageSetting.fromDate = moment(startDate).startOf('days').valueOf();
    tempPageSetting.toDate = moment(endDate).endOf('days').valueOf();
    setPageSetting(tempPageSetting);
    setIsFilterApplied(true);
    setShowDateRangeModal(false);
  };

  const handleClearFilter = () => {
    setRequestListingData({content: []});
    flatlistRef.current.scrollToOffset({animated: true, offset: 0});
    let tempPageSetting = {...pageSetting};
    tempPageSetting.pageNo = 0;
    tempPageSetting.fromDate = moment().subtract(90, 'days').startOf('days').valueOf();
    tempPageSetting.toDate = new Date().valueOf();
    setPageSetting(tempPageSetting);
    setIsFilterApplied(false);
  };

  const onEndReached = value => {
    let tempPageSetting = {...pageSetting};
    tempPageSetting.pageNo = value;
    setPageSetting(tempPageSetting);
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item?.srId) {
            props.MyRequestDetailsReset();
            props.requestCitizenTripsReset();
            props.navigation.navigate(navigations.MyrequestDetails, {
              srId: item?.srId,
              jobId: item?.jobId,
              jobNumber: item?.jobNumber,
            });
            setPageSetting((preVal) => ({
              ...preVal,
              pageNo: 0,
            }));
          }
        }}
        disabled={item?.leadNumber}>
        <ListItem item={item} index={index} />
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      {props.requestCitizenTripsLoading ? <Loader /> : null}
      <LinearGradient
        colors={[colors.white, colors.PaleBlue]}
        style={[styles.viewContainer, {paddingBottom: heightScale(20)}]}>
        <Modal
          isVisibleModal={showDateRangeModal}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setShowDateRangeModal={setShowDateRangeModal}
          handleApplyFilter={handleApplyFilter}
        />
        <SafeAreaView />
        <Header
          screenName={strings.myRequestScreen.myRequests}
          menu={true}
          leftIconPress={props.navigation.toggleDrawer}
          rightIcon={true}
          rightIconPress={() => {
            props.navigation.navigate(navigations.Notifications);
          }}
        />

        <View
          style={{
            marginTop: heightScale(20),
            flex: 1,
          }}>
          <View style={styles.filterContainer}>
            <CustomDropdown
              data={filterData}
              value={requestTypeValue}
              onChange={value => {
                setRequestTypeValue(value);
              }}
              containerStyles={{width: '55%'}}
              disable={filterData.length === 1}
            />
            <TouchableOpacity
              style={{width: '40%'}}
              onPress={() => setShowDateRangeModal(true)}
              activeOpacity={0.8}>
              <View style={styles.dateRangeView}>
                <View>
                  <Text
                    style={{
                      color: colors.DimGray2,
                      fontSize: normalize(12),
                      fontFamily: fonts.calibri.regular,
                      textAlignVertical: 'center',
                      includeFontPadding: false,
                    }}>
                    {strings.myRequestScreen.sortByTime}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons
                    name="chevron-down"
                    size={moderateScale(15)}
                    color={colors.DimGray2}
                  />
                  {isFilterApplied ? <View style={styles.dot} /> : null}
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {isFilterApplied && (
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <View style={styles.selectedFilterContainer}>
                <View>
                  <Text style={styles.selectedFilterText}>
                    {`${moment(startDate).format('DD MMM, YYYY')} - ${moment(endDate).format('DD MMM, YYYY')}`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{marginLeft: widthScale(6)}}
                  onPress={handleClearFilter}
                >
                  <Ionicons
                    name="close-outline"
                    color={colors.DimGray2}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={styles.componentView}>
            {requestListingData?.content ?
            <FlatlistComponent
              data={requestListingData?.content || []}
              renderItem={renderItem}
              currentPage={pageSetting.pageNo}
              onPageChange={value => onEndReached(value)}
              reference={flatlistRef}
              thresholdValue={0.5}
              totalItemCount={requestListingData?.totalElements}
            /> : null}
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  viewContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingTop: heightScale(20),
  },
  text1: {
    marginLeft: widthScale(36),
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
  },
  view1: {
    marginTop: heightScale(10),
    height: heightScale(3),
    width: moderateScale(84),
    marginLeft: widthScale(25),
  },
  text2: {
    textAlign: 'center',
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
  },
  view2: {
    marginTop: heightScale(10),
    height: heightScale(3),
    width: moderateScale(84),
  },
  text3: {
    marginRight: widthScale(40),
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    textAlign: 'right',
  },
  view3: {
    marginTop: heightScale(10),
    height: heightScale(3),
    width: moderateScale(84),
    marginRight: widthScale(26),
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthScale(16),
  },
  dateRange: {
    width: widthScale(135),
    height: heightScale(30),
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.gray93,
    justifyContent: 'center',
    paddingHorizontal: widthScale(14),
    paddingVertical: heightScale(8),
    backgroundColor: colors.gray97,
    borderRadius: moderateScale(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateRangeText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.bold,
    color: colors.black,
    fontWeight: 'bold',
    paddingLeft: widthScale(9),
  },
  dot: {
    height: heightScale(6),
    width: widthScale(6),
    borderRadius: moderateScale(100),
    backgroundColor: colors.primary,
  },
  sortByView: {
    marginTop: heightScale(0),
  },
  dateRangeView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: widthScale(0.5),
    borderColor: colors.LightGrey7,
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(12),
    paddingVertical: heightScale(10),
    borderRadius: moderateScale(100),
  },
  componentView: {
    flex: 1,
    marginTop: heightScale(10),
  },
  selectedFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(12),
    paddingVertical: heightScale(5),
    borderRadius: moderateScale(100),
    marginHorizontal: widthScale(16),
    marginTop: heightScale(10),
    elevation: normalize(2),
  },
  selectedFilterText: {
    fontSize: normalize(13),
    fontFamily: fonts.calibri.medium,
    color: colors.DimGray2,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

const mapStateToProps = ({Auth, App}) => {
  const {
    requestCitizenTripsLoading,
    requestCitizenTripsSuccess,
    requestCitizenTripsFail,
  } = App;

  return {
    requestCitizenTripsLoading,
    requestCitizenTripsSuccess,
    requestCitizenTripsFail,
  };
};

const mapDispatchToProps = {
  requestCitizenTrips,
  MyRequestDetailsReset,
  requestCitizenTripsReset,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyRequests);
