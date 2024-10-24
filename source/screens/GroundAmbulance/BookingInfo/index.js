import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import {colors, scaling, fonts} from '../../../library';
import {Context} from '../../../providers/localization';
import {tabNames, pickupDropOptions} from '../utils';
import {TextInput} from '../../../components';
import Icon from 'react-native-vector-icons/Entypo';
import {searchAmbulanceApi} from '../../../redux/api/app.api';
import Loader from '../../../components/loader';
import {MapComponent} from '../../../components/MapComponent';
import NearBy from '../../NearBy';

const {widthScale, heightScale, normalize, moderateScale} = scaling;
const BookingInfo = props => {
  const {
    formValues,
    formErrors,
    setTabName,
    setValues,
    checkValidator,
    setFormValues,
    handleConfirmBookingPress,
    bookingCategory,
  } = props;

  

  const strings = useContext(Context).getStrings();
  const {groundAmbulance, common} = strings;

  console.log(groundAmbulance[bookingCategory]?.search, 'bookingcategory')

  const [loader, setLoader] = useState(false);
  const [openMapClick, setOpenMapClick] = useState(null);
  const [isNearbySelectionEnable, setNearbySelectionEnable] = useState(false);

  const handleSearchAmbulancePress = bookingCategory => {
    const tabName = bookingCategory === 'GROUND_AMBULANCE' ? tabNames.CHOOSE_AMBULANCE  : tabNames.PAYMENT_DETAILS;
    if (
      formValues.pickUpLatLong.length == 2 &&
      formValues.dropLatLong.length == 2
    ) {
      const objectToSend =
        bookingCategory === 'GROUND_AMBULANCE'
          ? {
              pickupLat: formValues.pickUpLatLong[0],
              pickupLong: formValues.pickUpLatLong[1],
              dropLat: formValues.dropLatLong[0],
              dropLong: formValues.dropLatLong[1],
            }
          : {
              pickupLat: formValues.pickUpLatLong[0],
              pickupLong: formValues.pickUpLatLong[1],
              bookingCategory: 'DOCTOR_AT_HOME',
              vehicleType: formValues?.vehicleType?.id,
            };
      setLoader(true);
      searchAmbulanceApi(objectToSend)
        .then(res => {
          const tempData = res.data?.data || {};
          console.log(tempData, 'vehicleDetailsApiResponse')
          setValues('vehicleDetailsApiResponse', tempData);
          const tempVehicleData =
            (tempData.vehicleTypeData &&
              tempData.vehicleTypeData.length && {
                ...tempData.vehicleTypeData[0],
                ...tempData.distance,
                areaType: tempData.areaType,
                areaCode: tempData.areaCode,
              }) ||
            {};
          setValues('vehicleDetails', tempVehicleData);
          setTabName(tabName);
          setLoader(false);
        })
        .catch(e => {
          setLoader(false);
          const _code = e?.response?.data?.apierror?.code;
          if (_code === 'ZQTZA0053' || _code === 'ZQTZA0054') {
            handleConfirmBookingPress();
          }
        });
    }
  };

  const validateForm = () => {
    if (!checkValidator()) {
      handleSearchAmbulancePress(bookingCategory);
    }
  };

  return (
    <View style={styles.container}>
      {loader && <Loader />}
      {isNearbySelectionEnable && (
        <Modal isVisible={isNearbySelectionEnable}>
          <View style={styles.modalContainer}>
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                right: widthScale(10),
                top: heightScale(5),
              }}>
              <IconMaterial
                name={'close'}
                size={32}
                onPress={() => {
                  setNearbySelectionEnable(false);
                }}
                color={colors.black}
              />
            </View>
            <View style={{marginTop: heightScale(30)}} />
            <NearBy
              isFromBooking
              location={{
                address: formValues.pickupAddress,
                latitude: formValues.pickUpLatLong[0],
                longitude: formValues.pickUpLatLong[1],
              }}
              onPressNearbyData={data => {
                setFormValues(preVal => ({
                  ...preVal,
                  dropAddress: data.addressLine1 || data.fullAddress,
                  dropLatLong: [data.latitude, data.longitude],
                }));
                setNearbySelectionEnable(false);
              }}
            />
          </View>
        </Modal>
      )}
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.bookingInfoBody}>
        <View>
          <View>
            {!!openMapClick && (
              <MapComponent
                defaultLocation={{
                  address:
                    openMapClick === 'FROM'
                      ? formValues.pickupAddress
                      : formValues.dropAddress,
                  latitude:
                    openMapClick === 'FROM'
                      ? formValues.pickUpLatLong[0]
                      : formValues.dropLatLong[0],
                  longitude:
                    openMapClick === 'FROM'
                      ? formValues.pickUpLatLong[1]
                      : formValues.dropLatLong[1],
                }}
                onSelectedAddress={selectedLocation => {
                  setOpenMapClick(null);

                  if (openMapClick === 'FROM') {
                    setFormValues(preVal => ({
                      ...preVal,
                      pickupAddress: selectedLocation.address,
                      pickUpLatLong: [
                        selectedLocation.latitude,
                        selectedLocation.longitude,
                      ],
                    }));
                  } else {
                    setFormValues(preVal => ({
                      ...preVal,
                      dropAddress: selectedLocation.address,
                      dropLatLong: [
                        selectedLocation.latitude,
                        selectedLocation.longitude,
                      ],
                    }));
                  }
                }}
              />
            )}
            <View style={styles.blockView}>
              <View>
                <Text style={styles.textStyle2}>
                  {groundAmbulance.emergencyLocation}
                </Text>
              </View>

              {bookingCategory === 'GROUND_AMBULANCE' && (
                <>
                  <View style={{marginTop: heightScale(12)}}>
                    <Text
                      style={[styles.textStyle2, {fontSize: normalize(12)}]}>
                      {groundAmbulance.pickup}
                    </Text>
                  </View>
                  <View style={styles.toggleContainer}>
                    {pickupDropOptions.map(item => (
                      <TouchableOpacity
                        style={[
                          styles.toggleDataStyle,
                          formValues.pickupType.id === item.id && {
                            backgroundColor: '#41a06233',
                          },
                        ]}
                        onPress={() => {
                          setValues('pickupType', item);
                        }}>
                        <Text
                          style={[
                            styles.toggleTextStyle,
                            formValues.pickupType.id === item.id && {
                              color: colors.darkGreen,
                              fontWeight: '700',
                            },
                          ]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
              <View style={styles.inputView}>
                <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={styles.inputTextStyle}>
                    {`${groundAmbulance.address}*`}
                  </Text>
                </View>
                <View style={{width: '65%'}}>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setOpenMapClick('FROM');
                    }}>
                    <TextInput
                      value={formValues.pickupAddress}
                      multiline
                      numberOfLines={2}
                      placeholder={groundAmbulance.address}
                      placeholderTextColor={colors.gray400}
                      isError={formErrors.pickupAddress}
                      underlineColorAndroid="transparent"
                      style={styles.tiStyle}
                      inputStyles={styles.tiInputStyles}
                      errorStyles={styles.errorStyles}
                      disabled={true}
                    />
                    <Icon
                      name="location-pin"
                      size={moderateScale(22)}
                      color={colors.steelgray}
                      style={{position: 'absolute', right: 0}}
                    />
                  </TouchableOpacity>
                  {!!formErrors.pickupAddress && (
                        <View
                          style={{width: '100%', marginTop: heightScale(2)}}>
                          <Text style={styles.errorTextStyles}>
                            {formErrors.pickupAddress}
                          </Text>
                        </View>
                      )}

                  {!!formValues.pickupAddress && bookingCategory === 'GROUND_AMBULANCE' &&(
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={[
                          styles.blockView,
                          {
                            marginTop: heightScale(25),
                            flexDirection: 'row',
                            paddingVertical: heightScale(8),
                            paddingHorizontal: widthScale(12),
                          },
                        ]}
                        onPress={() => {
                          setNearbySelectionEnable(true);
                        }}>
                        <View style={{justifyContent: 'center'}}>
                          <IconFontAwesome
                            name={'hospital-alt'}
                            size={moderateScale(20)}
                            style={{color: colors.darkGreen}}
                          />
                        </View>
                        <View
                          style={{
                            marginLeft: widthScale(8),
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={[
                              styles.textStyle2,
                              {
                                color: colors.darkGreen,
                                fontSize: normalize(12),
                              },
                            ]}>
                            {groundAmbulance.findNearbyHospital}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.inputView}>
                <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={styles.inputTextStyle}>
                    {`${groundAmbulance.flatNo}*`}
                  </Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    value={formValues.pickupFlat}
                    onChangeText={val => {
                      setValues('pickupFlat', val);
                    }}
                    placeholder={groundAmbulance.flatNo}
                    placeholderTextColor={colors.gray400}
                    isError={formErrors.pickupFlat}
                    underlineColorAndroid="transparent"
                    style={styles.tiStyle}
                    inputStyles={styles.tiInputStyles}
                    errorStyles={styles.errorStyles}
                  />
                  {!!formErrors.pickupFlat && (
                    <View style={{width: '100%', marginTop: heightScale(2)}}>
                      <Text style={styles.errorTextStyles}>
                        {formErrors.pickupFlat}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.inputView}>
                <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={styles.inputTextStyle}>
                    {groundAmbulance.landmark}
                  </Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    value={formValues.pickupLandmark}
                    onChangeText={val => {
                      setValues('pickupLandmark', val);
                    }}
                    placeholder={groundAmbulance.landmark}
                    placeholderTextColor={colors.gray400}
                    isError={formErrors.pickupLandmark}
                    underlineColorAndroid="transparent"
                    style={styles.tiStyle}
                    inputStyles={styles.tiInputStyles}
                    errorStyles={styles.errorStyles}
                  />
                  {!!formErrors.pickupLandmark && (
                    <View style={{width: '100%', marginTop: heightScale(2)}}>
                      <Text style={styles.errorTextStyles}>
                        {formErrors.pickupLandmark}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {bookingCategory === 'GROUND_AMBULANCE' && (
                <>
                  <View style={{marginTop: heightScale(12)}}>
                    <Text
                      style={[styles.textStyle2, {fontSize: normalize(12)}]}>
                      {groundAmbulance.drop}
                    </Text>
                  </View>
                  <View style={styles.toggleContainer}>
                    {pickupDropOptions.map(item => (
                      <TouchableOpacity
                        style={[
                          styles.toggleDataStyle,
                          formValues.dropType.id === item.id && {
                            backgroundColor: '#41a06233',
                          },
                        ]}
                        onPress={() => {
                          setValues('dropType', item);
                        }}>
                        <Text
                          style={[
                            styles.toggleTextStyle,
                            formValues.dropType.id === item.id && {
                              color: colors.darkGreen,
                              fontWeight: '700',
                            },
                          ]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.inputView}>
                    <View style={{width: '30%', justifyContent: 'center'}}>
                      <Text style={styles.inputTextStyle}>
                        {`${groundAmbulance.address}*`}
                      </Text>
                    </View>
                    <View style={{width: '65%'}}>
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          setOpenMapClick('TO');
                        }}>
                        <TextInput
                          value={formValues.dropAddress}
                          placeholder={groundAmbulance.address}
                          multiline
                          numberOfLines={2}
                          placeholderTextColor={colors.gray400}
                          isError={formErrors.dropAddress}
                          underlineColorAndroid="transparent"
                          style={styles.tiStyle}
                          inputStyles={styles.tiInputStyles}
                          errorStyles={styles.errorStyles}
                          disabled={true}
                        />
                        <Icon
                          name="location-pin"
                          size={moderateScale(22)}
                          color={colors.steelgray}
                          style={{position: 'absolute', right: 0}}
                        />
                      </TouchableOpacity>
                      {!!formErrors.dropAddress && (
                        <View
                          style={{width: '100%', marginTop: heightScale(2)}}>
                          <Text style={styles.errorTextStyles}>
                            {formErrors.dropAddress}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.inputView}>
                    <View style={{width: '30%', justifyContent: 'center'}}>
                      <Text style={styles.inputTextStyle}>
                        {`${groundAmbulance.flatNo}*`}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: '65%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TextInput
                        value={formValues.dropFlat}
                        onChangeText={val => {
                          setValues('dropFlat', val);
                        }}
                        placeholder={groundAmbulance.flatNo}
                        placeholderTextColor={colors.gray400}
                        isError={formErrors.dropFlat}
                        underlineColorAndroid="transparent"
                        style={styles.tiStyle}
                        inputStyles={styles.tiInputStyles}
                        errorStyles={styles.errorStyles}
                      />
                      {!!formErrors.dropFlat && (
                        <View
                          style={{width: '100%', marginTop: heightScale(2)}}>
                          <Text style={styles.errorTextStyles}>
                            {formErrors.dropFlat}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.inputView}>
                    <View style={{width: '30%', justifyContent: 'center'}}>
                      <Text style={styles.inputTextStyle}>
                        {groundAmbulance.landmark}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '65%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TextInput
                        value={formValues.dropLandmark}
                        onChangeText={val => {
                          setValues('dropLandmark', val);
                        }}
                        placeholder={groundAmbulance.landmark}
                        placeholderTextColor={colors.gray400}
                        isError={formErrors.dropLandmark}
                        underlineColorAndroid="transparent"
                        style={styles.tiStyle}
                        inputStyles={styles.tiInputStyles}
                        errorStyles={styles.errorStyles}
                      />
                      {!!formErrors.dropLandmark && (
                        <View
                          style={{width: '100%', marginTop: heightScale(2)}}>
                          <Text style={styles.errorTextStyles}>
                            {formErrors.dropLandmark}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
          <View style={{marginVertical: heightScale(30)}}>
            <TouchableOpacity style={styles.buttonStyle} onPress={validateForm}>
              <Text style={styles.buttonTextStyle}>
                {groundAmbulance[bookingCategory].search}
              </Text>
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
  bookingInfoBody: {
    paddingHorizontal: widthScale(16),
  },
  textStyle2: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.greyishBrownTwo,
    fontWeight: '700',
  },
  blockView: {
    marginTop: heightScale(20),
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(12),
    borderRadius: normalize(6),
    borderWidth: widthScale(1),
    borderColor: '#EFEFEF',
  },
  buttonTextStyle: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    color: colors.white,
    fontWeight: '600',
  },
  buttonStyle: {
    width: '100%',
    paddingVertical: heightScale(12),
    borderRadius: normalize(100),
    alignItems: 'center',
    backgroundColor: '#156330',
  },
  toggleContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleDataStyle: {
    width: '28%',
    alignItems: 'center',
    marginTop: heightScale(12),
    paddingVertical: heightScale(10),
    borderWidth: widthScale(1),
    borderColor: colors.whiteSmoke,
    borderRadius: moderateScale(10),
  },
  toggleTextStyle: {
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    color: colors.greyishBrownTwo,
    fontWeight: '400',
  },
  inputView: {
    marginTop: heightScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputTextStyle: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    color: colors.darkGreen,
    fontWeight: '600',
  },
  tiStyle: {
    width: '100%',
    paddingHorizontal: widthScale(10),
    borderBottomWidth: widthScale(1),
    borderColor: colors.darkGreen,
  },
  row1: {
    flexDirection: 'row',
  },
  tiInputStyles: {
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    fontSize: normalize(12),
    lineHeight: normalize(16),
    color: colors.greyishBrownTwo,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    marginTop: heightScale(10),
  },
  mapText: {
    color: colors.black,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fakeMarkerView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: heightScale(20),
  },
  mapCenterStyle: {
    position: 'absolute',
    bottom: heightScale(115),
    right: widthScale(10),
    width: moderateScale(34),
    height: moderateScale(34),
    backgroundColor: colors.white,
    borderRadius: moderateScale(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLocationView: {
    paddingHorizontal: widthScale(10),
    position: 'absolute',
    bottom: 0,
    height: heightScale(100),
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  textStyleLocation: {
    color: colors.black,
    textAlign: 'center',
    fontSize: normalize(18),
    fontFamily: fonts.calibri.medium,
  },
  textStyle: {
    color: colors.black,
  },
  mapConfirmButton: {
    alignSelf: 'center',
    backgroundColor: colors.grassGreen,
    color: colors.white,
    width: widthScale(280),
    height: heightScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightScale(20),
    marginBottom: heightScale(10),
    borderRadius: moderateScale(15),
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(12),
  },
  centerClear: {
    marginTop: Platform.OS === 'ios' ? heightScale(40) : heightScale(20),
  },
  clearCross: {
    height: moderateScale(31),
    width: moderateScale(29),
    borderWidth: moderateScale(1),
    borderLeftWidth: 0,
    borderTopRightRadius: moderateScale(4),
    borderBottomRightRadius: moderateScale(4),
    justifyContent: 'center',
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
  },
  dropdownListContainer: {
    padding: normalize(10),
  },
  errorStyles: {
    borderWidth: 0,
    borderBottomColor: colors.red,
  },
  errorTextStyles: {
    color: colors.red,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
  },
  modalContainer: {
    height: '100%',
    backgroundColor: colors.white,
  },
});

export default BookingInfo;
