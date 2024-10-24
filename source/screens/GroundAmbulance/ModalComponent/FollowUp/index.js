import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import Feather from 'react-native-vector-icons/Feather';
import {Button} from '../Button';
import {Context} from '../../../../providers/localization';
import {connect} from 'react-redux';
import {callFollowUpRequired as callFollowUpRequiredApi} from '../../../../redux/api/app.api';
import {ConfirmingBookingImage} from '../../utils';
import Loader from '../../../../components/loader';
import Toast from 'react-native-simple-toast';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const FollowUp = props => {
  const {onPress, serviceRequestId, bookingCategory} = props;
  const strings = useContext(Context).getStrings();

  const [loader, setLoader] = useState(false);

  const callFollowUp = isFollowUpRequired => {
    setLoader(true);
    callFollowUpRequiredApi({
      isFollowUpRequired,
      serviceRequestId: serviceRequestId,
    })
      .then(res => {
        const _data = res?.data?.data;
        onPress(_data, isFollowUpRequired);
        setLoader(false);
      })
      .catch(err => {
        Toast.showWithGravity(strings.common.somethingWentWrong, Toast.LONG, Toast.TOP);
        setLoader(false);
      });
  };

  return (
    <View style={styles.modal}>
      {loader && <Loader />}
      <ScrollView style={styles.primaryContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.titleView}>
            <Feather name="alert-octagon" size={28} color={colors.Red} />
            <Text style={styles.headingStyle}>
              {strings.groundAmbulance[bookingCategory]?.noDataFound}
            </Text>
          </View>

          <Image
            source={ConfirmingBookingImage[bookingCategory]}
            style={styles.imageStyle}
            resizeMode="contain"
          />
          <View style={styles.secondTextContainer}>
            <Text style={styles.secondTextStyle}>
              {`${strings.groundAmbulance.doYouWantFollowUpCall}`}
            </Text>
          </View>
          <View style={styles.buttonTopContainer}>
            <View style={styles.buttonStyle}>
              <Button
                style={{backgroundColor: colors.primary}}
                text={strings.common.yes}
                textStyle={{color: colors.white}}
                onPress={() => {
                  callFollowUp(true);
                }}
              />
            </View>
            <View style={styles.buttonStyle}>
              <Button
                style={styles.button}
                text={strings.common.no}
                textStyle={{color: colors.primary}}
                onPress={() => {
                  callFollowUp(false);
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  primaryContainer: {},
  innerContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingTop: heightScale(10),
    paddingBottom: heightScale(25),
    borderTopRightRadius: normalize(20),
    borderTopLeftRadius: normalize(20),
  },

  headingStyle: {
    fontFamily: fonts.calibri.semiBold,
    fontSize: normalize(14),
    textAlign: 'center',
    color: colors.Red,
  },
  secondTextContainer: {
    marginTop: heightScale(10),
    width: '100%',
    alignItems: 'center',
  },
  secondTextStyle: {
    fontFamily: fonts.calibri.semiBold,
    fontSize: normalize(14),
    textAlign: 'center',
    color: colors.DarkGray,
  },
  imageStyle: {
    width: widthScale(280),
    height: heightScale(96),
    marginBottom: heightScale(6)
  },
  buttonTopContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    marginTop: heightScale(14),
  },
  buttonStyle: {width: widthScale(110), height: heightScale(45)},
  titleView: {alignItems: 'center', marginBottom: heightScale(10)},
  button: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
});

const mapStateToProps = ({Auth, App}) => {
  const {followUpLoading, followUpSuccess, followUpFail} = App;

  return {
    followUpLoading,
    followUpSuccess,
    followUpFail,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FollowUp);
