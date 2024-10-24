import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Linking,
} from 'react-native';
import {colors, scaling, fonts} from '../../library';
import {connect} from 'react-redux';
import Header from '../../components/header';
import {Context} from '../../providers/localization';
import {navigations} from '../../constants';
import RequestDataRender from '../../components/requestDataRender';
import {requestListing, getProfile} from '../../redux/actions/app.actions';
import {useIsFocused} from '@react-navigation/native';
import {REQUEST_LIST_LIMIT} from '../../utils/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const Requests = props => {
  const strings = React.useContext(Context).getStrings();
  const [requestData, setRequestData] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (props.userId && isFocused) {
      props.requestListing({
        citizenId: props.userId,
        pageSize: REQUEST_LIST_LIMIT,
      });
    }
  }, [isFocused, props.userId]);

  useEffect(() => {
    props.getProfile();
  }, []);

  useEffect(() => {
    if (props.requestListingSuccess) {
      setRequestData(props.requestListingSuccess.data.content);
    }
  }, [props.requestListingSuccess]);

  const onRefresh = () => {
    props.requestListing({
      citizenId: props.userId,
      pageSize: REQUEST_LIST_LIMIT,
    });
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.center}>
        <Text>{strings.RequestScreen.noRequests}</Text>
      </View>
    );
  };

  const sosNumber = () => {
    Linking.openURL(
      `tel:+91${props.configurationSuccess?.data[0]?.supportPhoneNumber}`,
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Header
        screenName={strings.RequestScreen.RequestScreen}
        leftIconPress={props.navigation.goBack}
        backArrow={true}
      />
      <View style={styles.mainView}>
        <Text style={styles.nameStyle}>{`${strings.RequestScreen.Welcome} ${
          props.userName ?? ''
        }!`}</Text>
        <Text style={styles.subTitle}>{strings.RequestScreen.YourRequests}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.button]}
          onPress={() => {
            props.navigation.navigate(navigations.AddRequest);
          }}>
          <Text style={styles.buttonText}>{strings.RequestScreen.AddNewRequest}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingButton} onPress={sosNumber}>
          <Icon
            name="phone-in-talk"
            size={moderateScale(22)}
            color={colors.white}
          />
        </TouchableOpacity>
        <FlatList
          ListEmptyComponent={listEmptyComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={props.requestListingLoading}
              onRefresh={onRefresh}
            />
          }
          data={requestData}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate(navigations.MyrequestDetails, {
                    leadId: item.id,
                    leadNumber: item.leadNumber,
                  });
                }}>
                <RequestDataRender
                  name={item.callerName}
                  status={item.requestStatus}
                  requestNumber={item.reqNumber}
                  treatment={item.treatment}
                  date={item.leadCreatedAt}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
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
    marginHorizontal: widthScale(20),
  },
  center: {
    alignItems: 'center',
  },
  floatingButton: {
    zIndex: 1,
    position: 'absolute',
    bottom: heightScale(20),
    right: widthScale(5),
    backgroundColor: colors.primary,
    width: moderateScale(46),
    height: moderateScale(46),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(35),
  },
  nameStyle: {
    fontSize: normalize(18),
    color: colors.black,
    fontFamily: fonts.calibri.bold,
  },
  subTitle: {
    marginTop: heightScale(10),
    fontSize: normalize(15),
    color: colors.black,
    fontFamily: fonts.calibri.light,
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
    marginBottom: heightScale(20),
    borderRadius: moderateScale(15),
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
    requestListingLoading,
    requestListingSuccess,
    requestListingFail,
    getProfileLoading,
    userName,
    userId,
    configurationSuccess,
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
  };
};

const mapDispatchToProps = {requestListing, getProfile};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
