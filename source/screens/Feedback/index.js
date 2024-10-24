import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Context} from '../../providers/localization.js';
import {colors, scaling, fonts} from '../../library';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {
  emptyStar,
  filledStar,
  ConfirmAmbulance
} from '../../../assets/index.js';
import CustomButton from '../../components/CustomButton';
import Input from '../../components/Input.js';
import Icon from 'react-native-vector-icons/Feather';
import {feedbackDataApi} from '../../redux/api/app.api.js';
import Loader from '../../components/loader.js';

const {normalize, widthScale, heightScale} = scaling;

const FeedbackScreen = props => {
  const strings = React.useContext(Context).getStrings();
  const {feedbackScreen, nearByHospital} = strings;

  const {details} = props.route.params;

  const [addComment, setAddComment] = useState('');
  const [ratingStar, setRatingStar] = useState(-1);
  const [isRatingGiven, setRatingGiven] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleSubmit = () => {
    setRatingGiven(true);
    setLoader(true);
    const _payload = {
      customerRating: Number(ratingStar) + 1,
      customerRemark: addComment,
      jobNumber: details?.number,
    };
    feedbackDataApi(_payload)
      .then((res) => {
        setLoader(false);
        props.navigation.goBack();
      })
      .catch((err) => {
        setRatingGiven(false);
        setLoader(false);
      });
  };

  useEffect(() => {
    return () => {
      if (!isRatingGiven) {
        const _payload = {
          customerRating: null,
          customerRemark: null,
          jobNumber: details?.number,
        };
        feedbackDataApi(_payload)
          .then((res) => {})
          .catch((err) => {})
      }
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.container}>
        <SafeAreaView />
        {loader && <Loader />}
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.container2}>
          <LinearGradient
            colors={[colors.white, colors.PaleBlue]}
            style={{
              borderBottomLeftRadius: normalize(10),
              borderBottomRightRadius: normalize(10),
            }}
          >
            <View style={styles.headerImgSection}>
              <TouchableOpacity
                onPress={props.navigation.toggleDrawer}
                style={styles.touchView}>
                <Icon name="menu" color={colors.DarkSlateGray} size={30} />
              </TouchableOpacity>
              <Text style={styles.helloText} numberOfLines={1}>
                {feedbackScreen.yourRideIsComplete}
              </Text>
            </View>
            <View style={{paddingBottom: heightScale(10)}}>
              <Image
                source={ConfirmAmbulance}
                style={styles.ambulanceImageView}
                resizeMode="contain"
              />
              <View style={styles.whiteLine}/>
              <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <View>
                  <View style={styles.tpdView}>
                    <Text style={styles.titleText}>{feedbackScreen.time}</Text>
                  </View>
                  <View style={[styles.tpdView, {marginTop: heightScale(5)}]}>
                    <Text style={styles.ansText}>{`${details.tripTimeInMin} ${feedbackScreen.mins}`}</Text>
                  </View>
                </View>
                <View>
                  <View style={styles.tpdView}>
                    <Text style={styles.titleText}>{feedbackScreen.price}</Text>
                  </View>
                  <View style={[styles.tpdView, {marginTop: heightScale(5)}]}>
                    <Text style={styles.ansText}>{`₹ ${details.totalTripPrice}`}</Text>
                  </View>
                </View>
                <View>
                  <View style={styles.tpdView}>
                    <Text style={styles.titleText}>{feedbackScreen.distance}</Text>
                  </View>
                  <View style={[styles.tpdView, {marginTop: heightScale(5)}]}>
                    <Text style={styles.ansText}>{`${details.tripKm} ${nearByHospital.kms}`}</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>

          <View style = {styles.paidView}>
            <Text style={styles.titleText}>{
              details?.dispatchDetail?.dispatch?.serviceRequest?.caller?.name
            }</Text>
            <Text style={styles.howTrip}>{feedbackScreen.howIsYourTrip}</Text>

            <View style={styles.ratingStarContainer}>
                    {[1, 1, 1, 1, 1].map((item, index) => {
                      if (index <= ratingStar) {
                        return (
                          <TouchableOpacity onPress={() => {
                            if (index > 2) {
                              setAddComment('');
                            }
                            setRatingStar(index)
                          }}> 
                          <Image
                            source={filledStar}
                            style={styles.starImg}
                          />
                          </TouchableOpacity> 
                        );
                      } else {
                        return (
                            <TouchableOpacity onPress={() => {
                              if (index > 2) {
                                setAddComment('');
                              }
                              setRatingStar(index)
                            }}> 
                          <Image
                            source={emptyStar}
                            style={styles.starImg}
                          />
                          </TouchableOpacity> 
                        );
                      }
                    })}
                  </View>

          </View>

          <View style={{paddingHorizontal: widthScale(20), marginTop: heightScale(20)}}>
            <Input
              inputContainerStyle={{
                elevation: 5,
                shadowColor: colors.gray700,
                shadowOffset: {width: widthScale(2), height: heightScale(2)},
                shadowOpacity: normalize(2),
                shadowRadius: normalize(2),
              }}
              multiline
              numberOfLines={5}
              placeholder={feedbackScreen.additionalComment}
              value={addComment}
              onChangeText={val => {
                setAddComment(val);
              }}
              editable={(ratingStar > -1) && (ratingStar < 3)}
              returnKeyType={'done'}
            />
          </View>

          <View style={styles.button}>
            <CustomButton
              onPress={handleSubmit}
              disabled={ratingStar < 0}
              title={feedbackScreen.submitFeedback}
            />
          </View>
          <View style={[styles.button, {marginTop: 0}]}>
            <CustomButton
              onPress={props.navigation.goBack}
              title={feedbackScreen.skip}
              containerStyles={{
                backgroundColor: colors.white,
                borderColor: colors.primary,
                borderWidth: widthScale(1),
              }}
              titleTextStyles={{color: colors.primary}}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainView: {
    marginHorizontal: widthScale(27),
    marginBottom: heightScale(30),
  },
  container2: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  useEmailPhoneText: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.bold,
    color: colors.primary,
    fontWeight: '600',
  },
  headerContainer: {
    marginLeft: widthScale(25),
  },
  text: {
    color: colors.DarkGray,
    fontSize: normalize(24),
    textAlign: 'center',
  },
  logo: {
    height: heightScale(300),
    width: widthScale(250),
  },
  button: {
    marginTop: heightScale(30),
    marginBottom: heightScale(25),
    marginHorizontal: widthScale(20),
  },

  title: {
    fontWeight: '400',
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    color: colors.DimGray,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  forgotPassword: {
    marginTop: heightScale(30),
  },
  errorMsg: {
    marginTop: heightScale(3),
    color: colors.Red,
    marginLeft: widthScale(5),
    width: widthScale(250),
    fontSize: normalize(12),
  },
  headerImgSection: {
    marginTop: normalize(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(24),
  },
  helloText: {
    fontSize: normalize(20),
    fontWeight: '900',
    fontFamily: fonts.calibri.bold,
    color: colors.DarkGray,
    width: '75%',
    marginLeft: widthScale(5),
  },
  ambulanceImageView: {
    height: heightScale(100),
    width: '90%',
    marginHorizontal: widthScale(20),
    alignSelf: 'center',
    marginTop: heightScale(30),
  },
  tpdView: {
    marginTop: heightScale(10),
  },
  paidView:{
    justifyContent:'center',
    alignItems: 'center',
    marginTop: heightScale(30),
  },
  whiteLine:{
    height: heightScale(2),
    backgroundColor: colors.white,
    marginVertical: heightScale(8)
  },
  howTrip:{
    fontSize: normalize(20),
    fontWeight: '900',
    fontFamily: fonts.calibri.bold,
    color: colors.DarkGray,
  },
  ratingStarContainer: {
    flexDirection: 'row',
    marginHorizontal: widthScale(20),
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: heightScale(12),
  },
  starImg: {
    height: heightScale(24),
    width: widthScale(24),
    marginHorizontal: widthScale(10),
    marginTop: heightScale(5),
    resizeMode: 'contain',
  },
  titleText:{
    fontSize: normalize(12),
    fontWeight: '400',
    fontFamily: fonts.calibri.regular,
    color: colors.gray700,
  },
  ansText:{
    fontSize: normalize(12),
    fontWeight: '700',
    fontFamily: fonts.calibri.medium,
    color: colors.DarkGray,
  },
  paidText:{
    fontSize: normalize(18),
    fontWeight: '700',
    fontFamily: fonts.calibri.bold,
    color: colors.primary,
    marginTop: heightScale(5)
  },

});

const mapStateToProps = ({Auth}) => {
  const {resendOtpLoading, resendOtpSuccess, resendOtpFail} = Auth;

  return {
    resendOtpLoading,
    resendOtpSuccess,
    resendOtpFail,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackScreen);
