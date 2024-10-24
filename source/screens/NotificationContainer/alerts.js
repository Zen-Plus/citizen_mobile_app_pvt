/**
 * @author Praveen Kumar
 */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {
  getCustomNotifications,
  readCustomNotifications,
  resetReduxState,
  getNotificationsCount,
  clearCustomNotificationAlert,
} from '../../redux/actions/app.actions';
import RenderList from './render-list';
import moment from 'moment';
import {Context} from '../../providers/localization.js';
import {useIsFocused} from '@react-navigation/native';

/**
 * Second and third tab
 * common list component for render alert and updates notification
 */
const Alerts = props => {
  /** set list data. */
  const isFocused = useIsFocused();
  const [listData, setListData] = useState({
    content: [],
    totalElements: 0,
  });

  /** current page on list. Used for pagination. */
  const currentPage = React.useRef(0);
  const strings = React.useContext(Context).getStrings();
  const {notificationContainer} = strings;

  useEffect(() => {
    currentPage.current = 0;
    if (isFocused) {
      props.getCustomNotifications({
        pageNo: 0,
        pageSize: 10,
        customNotificationType: 'ALERT',
      });
    }
    return () => {
      props.clearCustomNotificationAlert();
    };
  }, [isFocused, props.readCustomNotificationsSuccess]);

  useEffect(() => {
    if (props.readCustomNotificationsSuccess) {
      props.getNotificationsCount();
    }
  }, [props.readCustomNotificationsSuccess]);

  useEffect(() => {
    if (props.getCustomNotificationsSuccess) {
      //set list data based on type
      const {data} = props.getCustomNotificationsSuccess || {};
      const pageNumberFromApi = data?.pageable?.pageNumber;
      const {content = [], totalElements = 0} = data || {};
      let result = {content, totalElements};

      if (content && content.length == 0 && currentPage.current != 0) {
        currentPage.current = currentPage.current - 1;
      }
      if (!pageNumberFromApi || pageNumberFromApi == 0) {
        setListData({
          content: [],
          totalElements: 0,
        });
      }
      updatedDataFunc(result, totalElements);
      props.resetReduxState('getCustomNotificationsSuccess');
    }
  }, [props.getCustomNotificationsSuccess]);

  const updatedDataFunc = (newData, totalElements) => {
    const updatedData = listData.content;
    const todayDateString = moment().startOf('day').format('DD MMMM YYYY');
    const yesterdayDateString = moment()
      .subtract(1, 'days')
      .startOf('day')
      .format('DD MMMM YYYY');
    for (let item of newData?.content) {
      const notificationDateString = moment(item.createdAt, 'x').format(
        'DD MMMM YYYY',
      );
      let title = notificationDateString;
      if (notificationDateString == todayDateString) {
        title = notificationContainer.today;
      } else if (notificationDateString === yesterdayDateString) {
        title = notificationContainer.yesterday;
      }
      if (
        updatedData?.length > 0 &&
        notificationDateString ===
          updatedData[updatedData?.length - 1].dateString
      ) {
        updatedData[updatedData?.length - 1].data.push(item);
      } else {
        updatedData.push({
          title: title,
          dateString: notificationDateString,
          data: [item],
        });
      }
      setListData({
        content: updatedData,
        totalElements: totalElements,
      });
    }
  };

  return (
    <View style={styles.container}>
      <RenderList
        data={listData}
        currentPage={currentPage.current}
        loading={props.getCustomNotificationsLoading}
        getList={value => {
          currentPage.current = value.pageNo;
          props.getCustomNotifications({
            ...value,
            customNotificationType: 'ALERT',
          });
        }}
        isCustomNotification={true}
        readCustomNotifications={props.readCustomNotifications}
        isNotification={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

const mapStateToProps = ({App}) => {
  const {
    getCustomNotificationsLoading,
    getCustomNotificationsSuccess,
    getCustomNotificationsFail,
    readCustomNotificationsSuccess,
    getCustomUpdatesNotificationsSuccess,
  } = App;
  return {
    getCustomNotificationsLoading,
    getCustomNotificationsSuccess,
    getCustomNotificationsFail,
    readCustomNotificationsSuccess,
    getCustomUpdatesNotificationsSuccess,
  };
};

const mapDispatchToProps = {
  clearCustomNotificationAlert,
  getCustomNotifications,
  readCustomNotifications,
  resetReduxState,
  getNotificationsCount,
};

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
