/**
 * @author Abhay Agrahary
 */
import React from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {Context} from '../../providers/localization.js';
import {colors, scaling, fonts} from '../../library';
import {connect} from 'react-redux';
import Header from '../../components/header';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Notification from './notification';
import Alerts from './alerts';
import Updates from './updates';
import {Body} from '../../components';

const Tab = createMaterialTopTabNavigator();

const {normalize, widthScale, moderateScale} = scaling;

/**
 * render tab title
 * @param {*} title - tab title
 * @param {*} color - tab title color
 * @param {*} isUnread - show dot if their is any unread notification
 *
 */
const TabBarLabel = ({title, color, isUnread, tabHeaderStyle}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Body style={[{color}, tabHeaderStyle]}>{title}</Body>
    {isUnread ? (
      <View style={styles.dot}>
        <Text style={styles.notificationCount}>{isUnread}</Text>
      </View>
    ) : null}
  </View>
);

/**
 * Notification screen
 * Here we render three type of notification list
 * 1. Notification 2. Alerts  3. Updates
 *
 * @param {*} props
 */
const NotificationContainer = props => {
  const strings = React.useContext(Context).getStrings();
  /** get screen texts based on lacale */
  const {notificationContainer: texts} = strings;

  const {data = {}} = props.getNotificationsCountSuccess || {};
  const {
    unreadNotifications = 0,
    unreadAlerts = 0,
    unreadUpdates = 0,
  } = data || {};

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Header
        screenName={strings.notificationContainer.notificationTitle}
        leftIconPress={() => props.navigation.goBack()}
        backArrow={true}
      />
      {/* <Notification /> */}
      <Tab.Navigator
        initialRouteName={texts.notificationTitle}
        tabBarOptions={{
          activeTintColor: colors.primary,
          inactiveTintColor: colors.DimGray2,
          labelStyle: {
            fontSize: normalize(14),
            fontFamily: fonts.calibri.bold,
            fontWeight: '700',
          },

          indicatorStyle: styles.indicatorStyle,
        }}>
        <Tab.Screen
          name={'Notification'}
          component={Notification}
          key={texts.notificationTitle}
          options={{
            tabBarLabel: ({color}) => (
              <TabBarLabel
                color={color}
                title={texts.notificationTitle}
                isUnread={unreadNotifications}
                tabHeaderStyle={styles.tabHeaderStyle}
              />
            ),
          }}
        />
        <Tab.Screen
          name={'Alerts'}
          component={Alerts}
          key={texts.alertsTitle}
          options={{
            tabBarLabel: ({color}) => (
              <TabBarLabel
                color={color}
                title={texts.alertsTitle}
                isUnread={unreadAlerts}
                tabHeaderStyle={styles.tabHeaderStyle}
              />
            ),
          }}
        />
        <Tab.Screen
          name={'Updates'}
          component={Updates}
          key={texts.updatesTitle}
          options={{
            tabBarLabel: ({color}) => (
              <TabBarLabel
                color={color}
                title={texts.updatesTitle}
                isUnread={unreadUpdates}
                tabHeaderStyle={styles.tabHeaderStyle}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  indicatorStyle: {
    backgroundColor: colors.primary,
    height: 1,
    marginHorizontal: widthScale(4),
  },
  dot: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    marginLeft: widthScale(5),
    padding: moderateScale(1),
    backgroundColor: colors.red,
    alignItems: 'center',
    alignContent: 'center',
  },
  notificationCount: {
    color: colors.white,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
  },
  tabHeaderStyle: {fontFamily: fonts.calibri.regular, fontSize: normalize(14)},
});

const mapStateToProps = ({App}) => {
  const {getNotificationsCountSuccess} = App;
  return {
    getNotificationsCountSuccess,
  };
};

export default connect(mapStateToProps)(NotificationContainer);
