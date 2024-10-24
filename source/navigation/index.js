import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {syncUsers, validateVersion} from '../redux/actions/app.actions';

import LoginScreen from '../screens/LoginScreen';
import ForgotPassword from '../screens/ForgotPassword';
import FeedbackScreen from '../screens/Feedback';
import ChangePassword from '../screens/ChangePassword';
import HomeScreen from '../screens/HomeScreen';
import otpScreen from '../screens/OTPScreen/otpScreen';
import ResetPassword from '../screens/ForgotPassword/ResetPassword';
import SignupScreen from '../screens/SignupScreen/index';
import SignupProfile from '../screens/SignupScreen/Profile';
import TermsAndConditions from '../screens/TermsAndConditions';
import NearBy from '../screens/NearBy';
import Requests from '../screens/RequestScreen';
import AddRequest from '../screens/RequestScreen/AddRequestScreen';
import RequestDetails from '../screens/RequestScreen/RequestDetailsScreen';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';
import SecondComponent from '../screens/ProfileDetailScreen/SecondComponent';
import ThirdComponent from '../screens/ProfileDetailScreen/ThirdComponent';
import AddMembers from '../screens/ProfileDetailScreen/Component/AddMembers';
import LiveTracking from '../screens/LiveTracking';
import MyRequest from '../screens/MyRequest';
import FAQ from '../screens/FAQ';
import BookingFlow from '../screens/BookingFlow';

import CustomDrawerContent from './drawer';
import Configuration from '../utils/configuration';
import ChangeLanguage from '../screens/ChangeLanguage';
import MyProfile from '../screens/MyProfile';
import NotificationContainer from '../screens/NotificationContainer';
import {connect} from 'react-redux';
import {scaling} from '../library';
import {navigations} from '../constants';
import {navigationRef} from '../RootNavigation';
import MyrequestDetails from '../screens/MyrequestDetails';
import Events from '../screens/Events';
import EventDetailsScreen from '../screens/Events/EventDetailsScreen';
import GetStarted from '../screens/GetStarted';
import ChatScreen from '../screens/ChatScreen';
import {colors} from '../library';
import EventRequest from '../screens/EventRequest';
import TripReplay from '../screens/MyrequestDetails/tripReplay';

const AppNavigator = props => {
  const {widthScale} = scaling;

  const ConfigurationStack = createStackNavigator();
  const AuthenticationStack = createStackNavigator();
  const FirstStack = createStackNavigator();
  const Drawer = createDrawerNavigator();
  const Common = createStackNavigator();
  const ProfileStack = createStackNavigator();

  const configuration = () => {
    return (
      <ConfigurationStack.Navigator screenOptions={{headerShown: false}}>
        <ConfigurationStack.Screen
          name={navigations.ConfigurationScreen}
          component={Configuration}
        />
      </ConfigurationStack.Navigator>
    );
  };

  const AuthenticatedRoutes = () => {
    return (
      <Drawer.Navigator
        useLegacyImplementation={true}
        drawerType={'front'}
        // defaultStatus="open"
        drawerStyle={{width: '100%'}}
        screenOptions={{
          drawerStyle: {
            backgroundColor: colors.LightSkyBlue2,
            width: '75%',
          },
          headerShown: false,
        }}
        initialRouteName={navigations.HomeScreen}
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name={navigations.HomeScreen}
          component={HomeScreen}
          options={{unmountOnBlur: true}}
        />

        <Drawer.Screen
          name={navigations.ChangeLanguage}
          component={ChangeLanguage}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name={navigations.ChangePassword}
          component={ChangePassword}
        />
        <Drawer.Screen
          name={navigations.MyRequest}
          component={MyRequest}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name={navigations.TermsAndConditions}
          component={TermsAndConditions}
        />
        <Drawer.Screen
          name={navigations.Notifications}
          component={NotificationContainer}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen name={navigations.MyProfile} component={MyProfile} />
        <Drawer.Screen
          name={navigations.NearBy}
          component={NearBy}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name={navigations.GroundAmbulance}
          component={BookingFlow}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name={navigations.LiveTracking}
          component={LiveTracking}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name={navigations.EventRequest}
          component={EventRequest}
          options={{unmountOnBlur: true}}
        />

        <Drawer.Screen
          name={navigations.Events}
          component={Events}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name={navigations.FeedbackScreen}
          component={FeedbackScreen}
          options={{unmountOnBlur: true}}
        />
      </Drawer.Navigator>
    );
  };

  const commonStack = () => {
    return (
      <Common.Navigator screenOptions={{headerShown: false}}>
        <Common.Screen
          name={navigations.AuthenticatedRoutes}
          component={AuthenticatedRoutes}
        />
        <Common.Screen name={navigations.NearBy} component={NearBy} />
        <Common.Screen name={navigations.Requests} component={Requests} />
        <Common.Screen name={navigations.AddRequest} component={AddRequest} />
        <Common.Screen
          name={navigations.RequestDetails}
          component={RequestDetails}
        />
        <Common.Screen
          name={navigations.LiveTracking}
          component={LiveTracking}
        />
        <Common.Screen
          name={navigations.ChangeLanguage}
          component={ChangeLanguage}
        />
        <Common.Screen
          name={navigations.GroundAmbulance}
          component={BookingFlow}
          options={{unmountOnBlur: true}}
        />
        <Common.Screen
          name={navigations.MyrequestDetails}
          component={MyrequestDetails}
          options={{unmountOnBlur: true}}
        />
        <Common.Screen
          name={navigations.ProfileDetailScreen}
          component={ProfileDetailScreen}
        />
        <Common.Screen
          name={navigations.SecondComponent}
          component={SecondComponent}
        />
        <Common.Screen
          name={navigations.ThirdComponent}
          component={ThirdComponent}
        />
        <Common.Screen name={navigations.MyProfile} component={MyProfile} />
        <Common.Screen name={navigations.AddMembers} component={AddMembers} />
        <Common.Screen name={navigations.Events} component={Events} />
        <Common.Screen
          name={navigations.EventDetailsScreen}
          component={EventDetailsScreen}
          options={{unmountOnBlur: true}}
        />
        <Common.Screen name={navigations.FAQ} component={FAQ} />
        <Common.Screen name={navigations.ChatScreen} component={ChatScreen} />

        <Common.Screen
          name={navigations.EventRequest}
          component={EventRequest}
        />
        <Common.Screen
          name={navigations.FeedbackScreen}
          component={FeedbackScreen}
        />
        <Common.Screen name={navigations.TripReplay} component={TripReplay} />
      </Common.Navigator>
    );
  };
  const commonProfileStack = () => {
    return (
      <ProfileStack.Navigator screenOptions={{headerShown: false}}>
        <ProfileStack.Screen
          name={navigations.ProfileDetails}
          component={ProfileDetailScreen}
        />
        <ProfileStack.Screen
          name={navigations.Home}
          component={HomeScreen}
          options={{unmountOnBlur: true}}
        />

        <ProfileStack.Screen
          name={navigations.Second}
          component={SecondComponent}
        />
        <ProfileStack.Screen
          name={navigations.Third}
          component={ThirdComponent}
        />
        <ProfileStack.Screen
          name={navigations.Members}
          component={AddMembers}
        />
      </ProfileStack.Navigator>
    );
  };

  const firstStartRoutes = () => {
    return (
      <FirstStack.Navigator screenOptions={{headerShown: false}}>
        <FirstStack.Screen
          name={navigations.GetStarted}
          component={GetStarted}
        />
      </FirstStack.Navigator>
    );
  };

  const authenticationRoutes = () => {
    return (
      <AuthenticationStack.Navigator screenOptions={{headerShown: false}}>
        <AuthenticationStack.Screen
          name={navigations.LoginScreen}
          component={LoginScreen}
        />
        <AuthenticationStack.Screen
          name={navigations.SignupScreen}
          component={SignupScreen}
        />
        <AuthenticationStack.Screen
          name={navigations.SignupProfile}
          component={SignupProfile}
        />
        <AuthenticationStack.Screen
          name={navigations.ForgotPassword}
          component={ForgotPassword}
        />
        <AuthenticationStack.Screen
          name={navigations.otpScreen}
          component={otpScreen}
        />
        <AuthenticationStack.Screen
          name={navigations.resetPass}
          component={ResetPassword}
        />
        <AuthenticationStack.Screen
          name={navigations.TermsAndConditions}
          component={TermsAndConditions}
        />
      </AuthenticationStack.Navigator>
    );
  };

  useEffect(() => {
    return () => {
      props.validateVersion({isVersionValid: false});
    };
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      {!props.versionValid
        ? configuration()
        : !props.isFirstStart
        ? firstStartRoutes()
        : !props.isLoggedIn
        ? authenticationRoutes()
        : !props.isProfileUpdated
        ? commonProfileStack()
        : commonStack()}
    </NavigationContainer>
  );
};

const mapStateToProps = ({Auth, App}) => {
  const {isLoggedIn} = Auth;
  const {
    isQrScanned,
    isTakeOver,
    versionValid,
    navigateToJobListing,
    isOfflineLoggedIn,
    configurationSuccess,
    isProfileUpdated,
    isFirstStart,
  } = App;
  return {
    isLoggedIn,
    isQrScanned,
    isTakeOver,
    versionValid,
    navigateToJobListing,
    isOfflineLoggedIn,
    configurationSuccess,
    isProfileUpdated,
    isFirstStart,
  };
};

const mapDispatchToProps = {
  syncUsers,
  validateVersion,
};

// connect(mapStateToProps, null)(AuthenticatedRoutes);
export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
