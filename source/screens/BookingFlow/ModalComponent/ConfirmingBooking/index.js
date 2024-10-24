import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {colors, scaling, fonts} from '../../../../library';
import LinearGradient from 'react-native-linear-gradient';
import {Context} from '../../../../providers/localization';
import {ConfirmingBookingImage} from '../../../../utils/constants';
import moment from 'moment';
import {myRequestDetailsApi} from '../../../../redux/api/app.api';
import CustomButton from '../../../../components/CustomButton';
import Loader from '../../../../components/loader';
import Toast from 'react-native-simple-toast';
import CancelTrip from '../../../MyrequestDetails/Components/CancelTrip';
import {navigations} from '../../../../constants';
import CountdownTimer from '../../../../components/CountdownTimer';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const ConfirmingBooking = props => {
  const strings = useContext(Context).getStrings();
  const {onPress, bookingCategory} = props;
  const [widthValue, setWidthValue] = useState(0);
  let timeInMiliseconds = useRef(0);
  const timeout = useRef(null);
  const [loader, setLoader] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [srData, setSrData] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fixedTimeinMinute = props.details?.totalTimeInMinutes;
    const _timeInSeconds = moment(props.details.timer)
      .add(fixedTimeinMinute, 'seconds')
      .diff(moment(), 'seconds');

    if (_timeInSeconds <= 0) {
      setWidthValue(100);
    } else {
      const _timeInMiliseconds = _timeInSeconds * 10;
      setCount(_timeInSeconds);
      timeout.current = setInterval(() => {
        setWidthValue(preVal => preVal + 1);
      }, _timeInMiliseconds);
    }

    return () => {
      clearInterval(timeout?.current);
    };
  }, []);

  useEffect(() => {
    if (widthValue >= 100) {
      clearInterval(timeout?.current);
      onPress();
    }
  }, [widthValue]);

  function getSrDetails() {
    setLoader(true);
    myRequestDetailsApi({srId: props.details?.srId})
      .then(res => {
        const {data} = res.data;
        setSrData(data);
        setLoader(false);
        setCancelModalVisible(true);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
        Toast.showWithGravity(
          strings.myRequestScreen.unableToCancelTheRequest,
          Toast.LONG,
          Toast.TOP,
        );
      });
  }

  return (
    <View style={styles.modal}>
      {loader && <Loader />}
      <ScrollView style={styles.primaryContainer}>
        <View style={styles.innerContainer1}>
          <View>
            <Text style={styles.headingTextStyle}>
              {strings.groundAmbulance[bookingCategory].searchingNearYou}
            </Text>
          </View>
          <Image
            source={ConfirmingBookingImage[bookingCategory]}
            style={styles.imageStyle}
            resizeMode="contain"
          />
          <View>{!!count && <CountdownTimer initialValue={count} />}</View>
          <View style={styles.progressBarViewStyle}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={[colors.primary, colors.primary]}
              style={[
                styles.progressBarInnerView,
                {width: widthScale(260) * 0.01 * widthValue},
              ]}
            />
          </View>
          <View>
            <Text style={styles.pleaseWait}>
              {strings.groundAmbulance[bookingCategory].pleaseWait}
            </Text>
          </View>
          <View style={{width: '100%', marginTop: heightScale(15)}}>
            <CustomButton
              title={strings.RequestDetailsScreen.cancelRequest}
              containerStyles={styles.buttonContainerStyle}
              leftIconContainerStyles={{flex: 0}}
              rightIconContainerStyles={{flex: 0}}
              titleTextStyles={{
                fontSize: normalize(14),
                color: colors.primary,
              }}
              onPress={() => {
                getSrDetails();
              }}
            />
          </View>
        </View>
      </ScrollView>
      {cancelModalVisible && Object.keys(srData).length && (
        <CancelTrip
          isVisible={cancelModalVisible}
          srId={srData.id}
          jobId={srData.jobId}
          myRequestDetailsData={srData}
          changeVisible={() => {
            setSrData({});
            setCancelModalVisible(false);
          }}
          onCancellationSuccessfull={() => {
            Toast.showWithGravity(
              strings.myRequestScreen.requestCancelledSuccessfully,
              Toast.LONG,
              Toast.TOP,
            );
            props.navigation.navigate(navigations.HomeScreen);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  primaryContainer: {},
  innerContainer1: {
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingTop: heightScale(10),
    paddingBottom: heightScale(30),
    paddingHorizontal: widthScale(22),
    borderTopRightRadius: normalize(20),
    borderTopLeftRadius: normalize(20),
  },
  headingTextStyle: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    textAlign: 'center',
    color: colors.DarkGray,
  },
  imageStyle: {
    width: widthScale(280),
    height: heightScale(96),
    marginTop: heightScale(10),
  },
  progressBarViewStyle: {
    height: heightScale(8),
    width: widthScale(260),
    borderRadius: moderateScale(20),
    marginTop: heightScale(16),
    backgroundColor: colors.gray93,
    marginBottom: heightScale(19),
  },
  progressBarInnerView: {
    height: heightScale(8),
    borderRadius: moderateScale(20),
  },
  buttonViewStyle: {
    height: heightScale(45),
    width: widthScale(219),
    marginTop: heightScale(56.38),
    marginBottom: heightScale(31),
  },
  pleaseWait: {
    fontFamily: fonts.calibri.medium,
    color: colors.Charcoal2,
    fontSize: normalize(13),
    textAlign: 'center',
  },
  buttonContainerStyle: {
    flex: 0,
    backgroundColor: colors.white,
    borderWidth: widthScale(1),
    borderColor: colors.primary,
  },
});

const mapStateToProps = ({App}) => {
  const {globalConfigurationSuccess} = App;

  return {
    globalConfigurationSuccess,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmingBooking);
