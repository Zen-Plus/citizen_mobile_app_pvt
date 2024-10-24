import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {colors, scaling} from '../../library';
import {connect} from 'react-redux';
import Header from '../../components/header';
import {Context} from '../../providers/localization';
import {navigations} from '../../constants';
import FastImage from 'react-native-fast-image';
import {getAsyncStorage} from '../..//utils/asyncStorage';
import Config from 'react-native-config';


const {normalize, heightScale} = scaling;

const MyrequestDetails = props => {
  const {tripReplayUuid} = props.route.params;
  const strings = React.useContext(Context).getStrings();
  const [authToken, setAuthToken] = useState('');
  console.log(tripReplayUuid, 'tripReplayUuid');

  useEffect(() => {
    getAuthToken();
    async function getAuthToken() {
      const authToken = await getAsyncStorage('authToken');
      setAuthToken(authToken);
    }
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Header
        screenName={strings.TripDetails.tripReplay}
        leftIconPress={() => {
          props.navigation.goBack();
        }}
        backArrow={true}
        rightIcon={true}
        rightIconPress={() => {
          props.navigation.navigate(navigations.Notifications);
        }}
      />
      <FastImage
      style={styles.imageStyle}
      source={{
        uri: `${Config.PAYMENT_BASE_URL}/documents/?uuid=${tripReplayUuid}`,
        headers: {
          Authorization: `bearer ${authToken}`,
          'ziqitza-api-key': `${Config.API_KEY}`,
        },
      }}
      resizeMode={FastImage.resizeMode.contain}
      {...props}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: heightScale(120),
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    borderWidth: 0,
    borderRadius: normalize(10),
    overflow: 'hidden',
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {
    
  } = App;
  const {userInfoSuccess} = Auth;
  return {
    
  };
};

const mapDispatchToProps = {
  
};

export default connect(mapStateToProps, mapDispatchToProps)(MyrequestDetails);
