/**
 * @author Praveen Kumar
 */
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {
  getNotifications,
  readNotifications,
  resetReduxState,
  getNotificationsCount,
} from '../../redux/actions/app.actions';
import RenderList from './render-list';
import moment from 'moment';
import {Context} from '../../providers/localization.js';
import {notificationEntityName} from '../../utils/constants';
import {useIsFocused} from '@react-navigation/native';
import { clearNotificationData } from '../../redux/actions/app.actions';
/**
 * First Tab
 * Render list of simple notification
 * @param {*} props
 */
const Notification = props => {
  const isFocused = useIsFocused();
  const [listData, setListData] = React.useState({
    content: [],
    totalElements: 0,
  });
  /** current page on list. Used for pagination. */
  const currentPage = React.useRef(0);
  const strings = React.useContext(Context).getStrings();
  const {notificationContainer} = strings;

  useEffect(() => {
    currentPage.current = 0;
    /** call action to get notification list on first load. */
    if (isFocused) {
      getNotificationData();
    }
    return () => {
      props.clearNotificationData();
     };
  }, [isFocused]);

  useEffect(() => {
    if (props.getNotificationsSuccess) {
      const {data} = props.getNotificationsSuccess || {};
      const pageNumberFromApi = data?.allNotifications?.pageable?.pageNumber;

      let {content = [], totalElements = 0} =
        (data && data.allNotifications) || {};

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

      if (data && data.unreadMessages) {
        props.readNotifications({isRead: true});
      }
      props.resetReduxState('getNotificationsSuccess');
    }
    
  }, [props.getNotificationsSuccess]);

  useEffect(() => {
    if (props.readNotificationsSuccess) {
      props.getNotificationsCount();
      props.resetReduxState('readNotificationsSuccess');
    }
  }, [props.readNotificationsSuccess]);

  const getNotificationData = async value => {
    let request = {};
    request['pageNo'] = 0;
    request['pageSize'] = 10;
    request['referenceName'] = notificationEntityName.USER;
    request['referenceId'] = props.userId;
    request['sortBy'] = 'triggeredOn';
    request['sortDirection'] = 'DESC';

    props.getNotifications(request);
  };

  const updatedDataFunc = (newData, totalElements) => {
    const updatedData = listData.content;
    const todayDateString = moment().startOf('day').format('DD MMMM YYYY');
    const yesterdayDateString = moment()
      .subtract(1, 'days')
      .startOf('day')
      .format('DD MMMM YYYY');
    for (let item of newData?.content) {
      const notificationDateString = moment(item.generateOn, 'x').format(
        'DD MMMM YYYY',
      );
      let title = notificationDateString;
      if (notificationDateString == todayDateString) {
        title = notificationContainer.today;
      } else if (notificationDateString === yesterdayDateString) {
        title = notificationContainer.yesterday;
      }
      if (
        updatedData.length > 0 &&
        notificationDateString ===
          updatedData[updatedData.length - 1].dateString
      ) {
        updatedData[updatedData.length - 1].data.push(item);
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
        loading={props.getNotificationsLoading}
        getList={value => {
          currentPage.current = value.pageNo;
          props.getNotifications(value);
        }}
        navigation={props.navigation}
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

const mapStateToProps = ({App, Auth}) => {
  const {
    getNotificationsLoading,
    getNotificationsSuccess,
    getNotificationsFail,
    readNotificationsSuccess,
  } = App;
  const {userRole} = Auth;
  return {
    getNotificationsLoading,
    getNotificationsSuccess,
    getNotificationsFail,
    readNotificationsSuccess,
    userRole,
  };
};

const mapDispatchToProps = {
  clearNotificationData,
  getNotifications,
  readNotifications,
  resetReduxState,
  getNotificationsCount,
  
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
