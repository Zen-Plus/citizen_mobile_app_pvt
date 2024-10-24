import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Text,
} from 'react-native';
import { Context } from '../providers/localization';
import Config from 'react-native-config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Modal from 'react-native-modal';
import { colors, scaling, fonts } from '../library';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Entypo';
import _ from 'lodash';
import {
  getCurrentLocation,
  getAddressFromLatLong,
} from '../library/localization-service';
import {BackArrow} from './BackArrow';
import CustomButton from './CustomButton';
import { MapPin1, Crosshair } from '../../assets';
import Feather from 'react-native-vector-icons/Feather';

const { normalize, widthScale, heightScale, moderateScale } = scaling;

export const MapComponent = props => {
  const strings = React.useContext(Context).getStrings();
  const { ProfileDetails } = strings;

  const mapRef = useRef();

  const [location, setLocation] = useState({});

  const {
    confirmLocationButtonLabel = ProfileDetails.confirmLocation,
  } = props;

  useEffect(() => {
    if (
      (_.isEmpty(props.defaultLocation) &&
      !props.defaultLocation.latitude &&
      !props.defaultLocation.longitude &&
      !props.defaultLocation.address) && !props.isDrop
    ) {
      getCurrentLocation(true).then(locationObject => {
        setLocation({ ...locationObject, searchValue: locationObject.address });
      });
    } else {
      setLocation({
        ...props.defaultLocation,
        searchValue: props.defaultLocation.address,
      });
    }
  }, [props.defaultLocation]);

  const clearSearchBar = () => {
    setLocation({ ...location, searchValue: '' });
  };

  const onRegionChange = region => {
    getAddressFromLatLong(region?.latitude, region?.longitude).then(
      locationObject => {
        setLocation({ ...locationObject, searchValue: locationObject.address });
      },
    ).catch(() => {
      setLocation({
        ...location,
        latitude: region.latitude,
        longitude: region.longitude,
      });
    });
  };

  const onCenter = () => {
    getCurrentLocation(true).then(locationObject => {
      setLocation({ ...locationObject, searchValue: locationObject.address });
      mapRef.current &&
        mapRef.current.animateToRegion({
          latitude: locationObject.latitude,
          longitude: locationObject.longitude,
          latitudeDelta: 0.011,
          longitudeDelta: 0.011,
        });
    });
  };

  const renderMap = () => {
    return (
      <Modal
        isVisible={true}
        style={{ margin: 0 }}
        onBackButtonPress={() => {
          props.onSelectedAddress && props.onSelectedAddress(props.defaultLocation);
        }}>
        {
          <View style={styles.mapContainer}>
            <View style={{ position: 'absolute', width: '100%', zIndex: 1000, marginTop: Platform.OS === 'ios' ? moderateScale(40) : null}}>
              <GooglePlacesAutocomplete
                placeholder={ProfileDetails.search}
                fetchDetails={true}
                GooglePlacesSearchQuery={{
                  rankby: 'distance',
                }}

                onPress={(data, details = null) => {
                  const locationObject = {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    address: data.description,
                    searchValue: data.description,
                  };
                  setLocation(locationObject);
                  mapRef.current.animateToRegion({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.011,
                    longitudeDelta: 0.011,
                  });
                }}
                query={{
                  key: `${Config.GOOGLE_MAP_API_KEY}`,
                  language: 'en',
                  components: 'country:in',
                }}

                 isRowScrollable={false}

                styles={{

                  textInput: {
                    top: Platform.OS === 'ios' ? moderateScale(0) : null,
                    backgroundColor: 'white',
                    color: colors.DarkGray,
                    fontFamily: fonts.calibri.semiBold,
                    fontSize: normalize(16),
                    marginBottom: 0,
                    flex:1,
                    alignSelf:'center'
                  },

                  textInputContainer: {
                    marginTop: normalize(12),
                    height: normalize(54),
                    backgroundColor: 'white',
                    marginLeft: normalize(8),
                    marginRight: normalize(8),
                    borderRadius: normalize(8),
                    elevation: normalize(10),
                  },

                  separator: {
                    backgroundColor: colors.Gainsboro,
                    width: '90%',
                    alignSelf: 'center'
                  },

                  description: { color: 'gray' },

                  container: {
                    width: '100%',
                    zIndex: 1,
                  },
                  row: {
                    backgroundColor: colors.white,
                    borderRadius: normalize(8),
                  },

                  listView: {
                    backgroundColor: colors.white,
                    color: colors.black,
                    marginTop: normalize(8),
                    marginLeft: normalize(8),
                    marginRight: normalize(8),
                    borderRadius: normalize(8),
                  },
                }}

                textInputProps={{
                  clearButtonMode: 'never',
                  value: location.searchValue,
                  onChangeText: text =>
                    setLocation({ ...location, searchValue: text }),
                  placeholderTextColor: colors.gray700,
                }}

                renderRightButton={() => (
                  <TouchableOpacity onPress={clearSearchBar}>
                    <View
                      style={{
                        justifyContent: 'center',
                        flex: 1,
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        borderRadius: normalize(8),
                        marginRight:normalize(10)
                      }}>
                      <Icon name="cross" size={normalize(24)} color={colors.Gainsboro} />
                    </View>
                  </TouchableOpacity>
                )}

                renderLeftButton={() => (
                  <View style={{ justifyContent: 'center', alignSelf: 'center', backgroundColor: 'white', marginLeft: normalize(16) }}>
                    <View style={{
                      width: 8,
                      height: 8,
                      borderRadius: 100,
                      backgroundColor: colors.primary,
                    }} />
                  </View>

                )}

                renderRow={(rowData) => {
                  // console.log("serach data ::::: ",JSON.stringify(rowData));
                  const title = rowData.structured_formatting.main_text;
                  const address = rowData.structured_formatting.secondary_text;
                  return (<View style={{
                    backgroundColor: 'white',
                    flex: 1,
                  }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: normalize(0) }} >
                      <Feather
                        name="map-pin"
                        size={normalize(16)}
                        color={colors.black}
                        style={styles.icon1}
                      />
                      <View
                        style={{
                          marginLeft: normalize(10)
                        }}
                      >
                        <Text style={{ fontSize: normalize(13), color: colors.Charcoal2, fontFamily: fonts.calibri.regular, fontWeight: '400'  }}>{title}</Text>
                        <Text style={{ fontSize: normalize(12), color: colors.DimGray2, fontFamily: fonts.calibri.regular, fontWeight: '400' }}>{address}</Text>
                      </View>
                    </View>
                  </View>);
                }}
              >

              </GooglePlacesAutocomplete>

            </View>

            <View style={{ flex: 1 }}>
              {true && (
                <>
                  <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    initialRegion={{
                      latitude: location?.latitude || 0,
                      longitude: location?.longitude || 0,
                      latitudeDelta: 0.011,
                      longitudeDelta: 0.011,
                    }}
                    onRegionChangeComplete={onRegionChange}></MapView>
                  <View
                    pointerEvents="none"
                    style={styles.fakeMarkerView}
                  >
                    <Image
                      source={MapPin1}
                      style={{
                        width: normalize(66),
                        height: normalize(100),
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.mapCenterStyle}
                    onPress={onCenter}>
                    <Image
                      source={Crosshair}
                      style={{
                        width: normalize(24),
                        height: normalize(24),
                      }}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View style={styles.bottomLocationView}>
              <View style={styles.footerButtonContainer}>
                <View style={{marginRight: widthScale(20), ...styles.footerSubButtonContainerContainer}}>
                  <BackArrow
                    onPress={() => {
                      props.onSelectedAddress && props.onSelectedAddress(props.defaultLocation);
                    }}
                    style={{marginTop: 0}}
                  />
                </View>
                <View style={{flex: 1, ...styles.footerSubButtonContainerContainer}}>
                  <CustomButton
                    onPress={() => {
                      props.onSelectedAddress && props.onSelectedAddress(location);
                    }}
                    title={confirmLocationButtonLabel}
                    titleTextStyles={{fontSize: normalize(16)}}
                    containerStyles={{flex: 0}}
                    leftIconContainerStyles={{flex: 0}}
                    rightIconContainerStyles={{flex: 0}}
                    disabled={!location.searchValue}
                  />
                </View>
              </View>
            </View>
          </View>
        }
      </Modal>
    );
  };

  return <View style={styles.mainView}>{renderMap()}</View>;
};

const styles = StyleSheet.create({
  mainView: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
    bottom: 0,
  },

  mapCenterStyle: {
    position: 'absolute',
    bottom: normalize(16),
    right: normalize(16),
    width: normalize(48),
    height: normalize(48),
    backgroundColor: colors.white,
    borderRadius: normalize(100),
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomLocationView: {
    paddingHorizontal: widthScale(10),
    paddingVertical: heightScale(12),
    backgroundColor: colors.white,
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
  row1: { flexDirection: 'row' },
  footerButtonContainer: {
    flexDirection: 'row',
  },
  footerSubButtonContainerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});