import React, {useState, useEffect, useRef} from 'react';
import {colors, scaling, fonts} from '../../library';
import moment from 'moment';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {navigations} from '../../constants';
import Loader from '../../components/loader';
import {connect} from 'react-redux';
import Header from '../../components/header';
import {Context} from '../../providers/localization.js';
import EventComponent from './Components/EventComponent';
import FlatlistComponent from '../../components/flatListComponent';
import {
  getEventDetailsListing,
  getProfile,
  EventDetailsReset,
} from '../../redux/actions/app.actions';
import {eventListingTabs, secounds} from '../../constants/index';
import {useIsFocused} from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
import Modal from '../MyRequest/modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const Events = props => {
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [pageSetting, setPageSetting] = useState({
    pageNo: 0,
    selectedTab: 1,
    toDate: new Date().valueOf(),
    fromDate: moment().subtract(90, 'days').startOf('days').valueOf(),
  });

  const [requestListingData, setRequestListingData] = useState({});
  const strings = React.useContext(Context).getStrings();

  const flatlistRef = useRef();
  const isFocused = useIsFocused();
  const handleApplyFilter = () => {
    let tempPageSetting = {...pageSetting};
    tempPageSetting.pageNo = 0;
    tempPageSetting.fromDate = moment(startDate).startOf('days').valueOf();
    tempPageSetting.toDate = moment(endDate).valueOf();
    setPageSetting(tempPageSetting);
    flatlistRef.current.scrollToOffset({animated: true, offset: 0});
    setIsFilterApplied(true);
    setShowDateRangeModal(false);
  };

  const handleClearFilter = () => {
    let tempPageSetting = {...pageSetting};
    tempPageSetting.pageNo = 0;
    tempPageSetting.fromDate = moment()
      .subtract(90, 'days')
      .startOf('days')
      .valueOf();
    tempPageSetting.toDate = new Date().valueOf();
    setPageSetting(tempPageSetting);
    flatlistRef.current.scrollToOffset({animated: true, offset: 0});
    setIsFilterApplied(false);
  };

  useEffect(() => {
    props.getProfile();
  }, [isFocused]);

  useEffect(() => {
    if (props.getEventDetailsListingSuccess) {
      let tempData = {...props.getEventDetailsListingSuccess?.data};
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
    }
  }, [props.getEventDetailsListingSuccess]);

  useEffect(() => {
    if (props.getEventDetailsListingFail) {
      console.log(
        'trip details listing fail :',
        props.getEventDetailsListingFail,
      );
    }
  }, [props.getEventDetailsListingFail]);

  useEffect(() => {
    if (isFocused) {
      props.getEventDetailsListing({
        duration: parseInt(
          (moment(pageSetting.fromDate).valueOf() -
            moment(pageSetting.toDate).valueOf()) /
            secounds,
        ),
        pageNo: pageSetting.pageNo,
        pageSize: 10,
        eventStatus: [
          eventListingTabs.DISPATCHED,
          eventListingTabs.SCHEDULED,
          eventListingTabs.COMPLETE,
          eventListingTabs.CANCELLED,
          eventListingTabs.ONGOING,
          eventListingTabs.ACCEPTED,
        ],
        phoneNumber: props.getProfileSuccess?.data?.mobile,
        fromDate: pageSetting.fromDate,
        toDate: pageSetting.toDate,
      });
    }
  }, [pageSetting, isFocused]);

  const onEndReached = value => {
    let tempPageSetting = {...pageSetting};
    tempPageSetting.pageNo = value;
    setPageSetting(tempPageSetting);
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.EventDetailsReset();
          props.navigation.navigate(navigations.EventDetailsScreen, {
            eventId: item?.eventId,
            eventNumber: item?.eventNumber,
          });
        }}>
        <EventComponent item={item} index={index} />
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[colors.white, colors.PaleBlue]}
      style={styles.container}>
      <Modal
        isVisibleModal={showDateRangeModal}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setShowDateRangeModal={setShowDateRangeModal}
        handleApplyFilter={handleApplyFilter}
      />
      <Header
        screenName={strings.sideMenu.myEvents}
        menu={true}
        leftIconPress={props.navigation.toggleDrawer}
        rightIcon={true}
        rightIconPress={() => {
          props.navigation.navigate(navigations.Notifications);
        }}
      />

      <View
        style={[
          styles.filterContainer,
          isFilterApplied
            ? {justifyContent: 'space-between'}
            : {justifyContent: 'flex-end'},
        ]}>
        {isFilterApplied && (
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View style={styles.selectedFilterContainer}>
              <View>
                <Text style={styles.selectedFilterText}>
                  {`${moment(startDate).format('DD MMM, YYYY')} - ${moment(
                    endDate,
                  ).format('DD MMM, YYYY')}`}
                </Text>
              </View>
              <TouchableOpacity
                style={{marginLeft: widthScale(2)}}
                onPress={handleClearFilter}>
                <Ionicons
                  name="close-outline"
                  color={colors.DimGray2}
                  size={22}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
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

      {props.getEventDetailsListingLoading ? (
        <Loader />
      ) : (
        <View style={styles.componentView}>
          <FlatlistComponent
            data={requestListingData?.content}
            renderItem={renderItem}
            currentPage={pageSetting.pageNo}
            onPageChange={value => onEndReached(value)}
            reference={flatlistRef}
            thresholdValue={0.8}
            totalItemCount={requestListingData?.totalElements}
          />
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  componentView: {
    marginLeft: widthScale(5),
    marginRight: widthScale(5),
    marginBottom: heightScale(100),
  },

  filterContainer: {
    flexDirection: 'row',
    alignContent: 'flex-end',
    marginHorizontal: widthScale(16),
  },

  dot: {
    height: heightScale(6),
    width: widthScale(6),
    borderRadius: moderateScale(100),
    backgroundColor: colors.primary,
  },
  dateRangeView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: widthScale(0.5),
    borderColor: colors.LightGrey7,
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(12),
    paddingVertical: heightScale(10),
    borderRadius: moderateScale(100),
    marginTop: heightScale(10),
    alignSelf: 'flex-end',
  },
  selectedFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(8),
    paddingVertical: heightScale(5),
    borderRadius: moderateScale(100),
    marginTop: heightScale(10),
    elevation: normalize(2),
  },
  selectedFilterText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    color: colors.DimGray2,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  row: {flexDirection: 'row'},
});
const mapStateToProps = ({App, Auth}) => {
  const {
    getEventDetailsListingLoading,
    getEventDetailsListingSuccess,
    getEventDetailsListingFail,
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    osdNumber,
  } = App;
  const {userInfoSuccess} = Auth;
  return {
    getEventDetailsListingLoading,
    getEventDetailsListingSuccess,
    getEventDetailsListingFail,
    userInfoSuccess,
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    osdNumber,
  };
};

const mapDispatchToProps = {
  getEventDetailsListing,
  getProfile,
  EventDetailsReset,
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);
