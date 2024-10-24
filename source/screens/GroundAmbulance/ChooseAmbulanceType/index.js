import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {colors, scaling, fonts} from '../../../library';
import {Context} from '../../../providers/localization';
import {tabNames} from '../utils';
import {blackAndWhiteAmbulance} from '../../../../assets';

const {widthScale, heightScale, normalize, moderateScale} = scaling;

const ChooseAmbulanceType = (props) => {
  const strings = useContext(Context).getStrings();
  const {groundAmbulance, common} = strings;

  const {
    details,
    formValues,
    setTabName,
    setValues,
  } = props;

  const handleNextPress = () => {
    setTabName(tabNames.PAYMENT_DETAILS);
  };

  const setVehicleDetails = (data) => {
    const tempObj = {
      ...data,
      ...details.distance,
      areaType: details.areaType,
      areaCode: details.areaCode,
    };

    setValues('vehicleDetails', tempObj);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.body}>
        <View>
          <View style={{marginTop: heightScale(20)}}>
            <Text style={styles.textStyle2}>
              {groundAmbulance.chooseYourAmbyType}
            </Text>
          </View>

          <View>
            {details.vehicleTypeData && details.vehicleTypeData.length && (
              <View>
                {details.vehicleTypeData.map((item) => (
                  <TouchableOpacity
                    style={[
                      styles.blockView,
                      (formValues.vehicleDetails.vehicleType === item.vehicleType) && {
                        backgroundColor: '#41a06214',
                      },
                    ]}
                    onPress={() => { setVehicleDetails(item); }}
                  >
                    <View>
                      <Image
                        source={blackAndWhiteAmbulance}
                        style={{height: heightScale(24), width: widthScale(26)}}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={{marginLeft: widthScale(16), flex: 1}}>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{width: '75%', paddingRight: widthScale(10)}}>
                          <View>
                            <Text style={styles.vehicleTypeAndNameTextStyle}>
                              {`${item.vehicleType} (${item.vehicleName})`}
                            </Text>
                          </View>
                          <View style={{marginTop: heightScale(3)}}>
                            <Text style={styles.vehicleFeaturesAndDescriptionTextStyle}>
                              {item.features}
                            </Text>
                          </View>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                          <Text style={styles.amountTextStyle}>{`₹ ${(item.vehiclePrice + item.gst).toFixed(2)}`}</Text>
                        </View>
                      </View>

                      <View style={{marginTop: heightScale(8)}}>
                        <Text style={styles.vehicleFeaturesAndDescriptionTextStyle}>
                          {item.vehicleDescription}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={{marginVertical: heightScale(30)}}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={handleNextPress}
            >
              <Text style={styles.buttonTextStyle}>{common.next}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingHorizontal: widthScale(16),
  },
  textStyle2: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.greyishBrownTwo,
    fontWeight: '700',
  },
  buttonStyle: {
    width: '100%',
    paddingVertical: heightScale(12),
    borderRadius: normalize(100),
    alignItems: 'center',
    backgroundColor: '#156330'
  },
  buttonTextStyle: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    color: colors.white,
    fontWeight: '600',
  },
  blockView: {
    flexDirection: 'row',
    marginTop: heightScale(18),
    paddingVertical: heightScale(12),
    paddingHorizontal: widthScale(14),
    borderWidth: widthScale(1),
    borderRadius: moderateScale(10),
    borderColor: '#41a0624d',
  },
  vehicleFeaturesAndDescriptionTextStyle: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '600',
    fontSize: normalize(10),
    lineHeight: normalize(14),
    color: colors.mediumLightGray,
  },
  amountTextStyle: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '700',
    fontSize: normalize(12),
    lineHeight: normalize(16),
    color: colors.darkGreen,
  },
  vehicleTypeAndNameTextStyle: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '700',
    fontSize: normalize(12),
    lineHeight: normalize(16),
    color: colors.greyishBrownTwo,
  },
});

export default ChooseAmbulanceType;
