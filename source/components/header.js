import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, AppState} from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather';
import {colors, fonts, scaling} from '../library';
import {connect} from 'react-redux';
import {getNotificationsCount} from '../redux/actions/app.actions';
import {useNavigationState} from '@react-navigation/native';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

let previusCurrentRouteName;

const Header = props => {
  /** set current app state. */
  const [appState, setAppState] = React.useState(AppState.currentState);

  /** get current route name. */
  const state = useNavigationState(state => state);
  const routeName = state.routeNames[state.index];

  React.useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const _handleAppStateChange = nextAppState => {
    if (appState == 'active' && nextAppState === 'active') {
      props.getNotificationsCount();
    }
    setAppState(nextAppState);
  };

  React.useEffect(() => {
    /** call action to get unread notification count */
    if (previusCurrentRouteName != routeName && props.rightIcon) {
      previusCurrentRouteName = routeName;
      props.getNotificationsCount();
    }
  }, [props.getNotificationsCount, routeName, props.rightIcon]);

  const {data = {}} = props.getNotificationsCountSuccess || {};
  const {
    unreadNotifications = 0,
    unreadAlerts = 0,
    unreadUpdates = 0,
  } = data || {};

  return (
    <View style={[styles.container, props.container]}>
      <TouchableOpacity activeOpacity={0.8} onPress={props.leftIconPress}>
        <View style={props.backArrow ? styles.backArrow : null}>
          <IconMaterial
            name={
              props.menu
                ? 'menu'
                : props.backArrow
                ? 'arrow-back'
                : props.cross
                ? 'close'
                : null
            }
            size={props.backArrow ? 25 : 30}
            color={props.backArrow ? colors.white : colors.black}
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.screenName}>
        {props.screenName ? props.screenName : null}
      </Text>
      {props.sync ? (
        <TouchableOpacity activeOpacity={0.8} onPress={props.syncIconPress}>
          <IconMaterial
            name="sync"
            size={35}
            color={props.isSyncButtonDisabled ? colors.black : colors.black}
          />
        </TouchableOpacity>
      ) : props.rightIcon ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={props.rightIconPress}
          style={styles.notification}>
          <Icon name="bell" size={28} color={colors.black} />
          {unreadNotifications || unreadAlerts || unreadUpdates ? (
            <View style={styles.dot}>
              <Text style={styles.notificationCount}>
                {unreadNotifications + unreadAlerts + unreadUpdates > 99 ?  '99+' : unreadNotifications + unreadAlerts + unreadUpdates}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyView}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: heightScale(48),
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: widthScale(16),
    alignItems: 'center',
    paddingTop: heightScale(20),
  },
  screenName: {
    alignSelf: 'center',
    fontFamily: fonts.calibri.bold,
    textAlign: 'center',
    color: colors.DarkGray,
    fontSize: normalize(16),
    letterSpacing: 0,
    fontWeight: 'bold',
  },
  emptyView: {
    width: widthScale(25),
  },
  notification: {
    flexDirection: 'row',
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
  backArrow: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: normalize(20),
    padding: normalize(4),
  },
  notificationCount: {
    color: colors.white,
    fontSize: normalize(8),
    fontFamily: fonts.calibri.regular,
    lineHeight: 22,
  },
  leftIconStyle: {
    backgroundColor: colors.primary,
    height: normalize(32),
    width: normalize(32),
    padding: normalize(5),
    borderRadius: normalize(20),
  },
});

const mapStateToProps = ({App}) => {
  const {
    getNotificationsCountLoading,
    getNotificationsCountSuccess,
    getNotificationsCountFail,
  } = App;
  return {
    getNotificationsCountLoading,
    getNotificationsCountSuccess,
    getNotificationsCountFail,
  };
};

const mapDispatchToProps = {
  getNotificationsCount,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
