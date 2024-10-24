import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors, scaling, fonts} from '../../library';
import {connect} from 'react-redux';
import Header from '../../components/header';
import Card from './Card';
import {
  nearbyCategory,
  resetNearByCategory,
  nearbyHospital,
} from '../../redux/actions/app.actions';
import Feather from 'react-native-vector-icons/Feather';
import Loader from '../../components/loader';
import {Context} from '../../providers/localization';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Entypo';
import SortBy from '../../components/SortBy';
import slugify from 'slugify';
import {navigations, regex} from '../../constants';
import {
  getCurrentLocation,
} from '../../library/localization-service';
const {widthScale, heightScale, normalize, moderateScale} = scaling;
import {useIsFocused} from '@react-navigation/native';
import {
  icNearbyHospital as _icNearbyHospital,
  nearbyBlood as _nearbyBlood,
  Crosshair,
} from '../../../assets/index';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';

const NearBy = props => {
  const ScreenType = props?.route?.params?.masterDataType;
  const strings = React.useContext(Context).getStrings();
  const {ProfileDetails} = strings;
  const [listData, setListData] = useState([]);
  const [value, setValue] = useState('');
  const [location, setLocation] = useState({});
  const mapRef = useRef();

  useEffect(() => {
    if (props.isFromBooking) {
      setLocation(props.location);
    } else {
      getCurrentLocation(true).then(location => {
        setLocation(location);
      });
    }
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && setValue(ScreenType === 'BLOOD_BANK' ? 2 : 1);
  }, [ScreenType, isFocused]);

  useEffect(() => {
    console.log('location changed');
    if (location.latitude && location.longitude) {
      const data = {
        latitude: location?.latitude,
        longitude: location?.longitude,
        pageNo: 0,
        pageSize: 5,
        sortBy: 'modifiedAt',
        sortDirection: 'DESC',
      };
      if (value == 1) {
        props.nearbyHospital(data);
      } else if (value == 2) {
        data['masterDataType'] = 'BLOOD_BANK';
        props.nearbyCategory(data);
      }
    }
  }, [location, value]);

  useEffect(() => {
    return () => {
      props.resetNearByCategory();
    };
  }, []);
  useEffect(() => {
    if (props.nearbyCategorySuccess) {
      const tempListData = props.nearbyCategorySuccess?.data?.content;
      setListData(tempListData);
    }
  }, [props.nearbyCategorySuccess]);

  useEffect(() => {
    if (props.nearbyHospitalSuccess) {
      const tempData = props.nearbyHospitalSuccess?.data;
      setListData(tempData);
    }
  }, [props.nearbyHospitalSuccess]);

  const clearSearchBar = () => {
    setLocation({ });
  };

  const onCenter = () => {
    getCurrentLocation(true).then(locationObject => {
      setLocation(locationObject);
      mapRef.current &&
        mapRef.current.animateToRegion({
          latitude: locationObject.latitude,
          longitude: locationObject.longitude,
          latitudeDelta: 0.011,
          longitudeDelta: 0.011,
        });
    });
  };

  const dropDownData = [
    {name: 'Hospitals', id: '1', days: 1},
    {name: 'Blood Banks', id: '2', days: 2},
  ];

  const newData = listData?.map(value => {
    let data = slugify(
      value.name
        .replace(regex.nonWordSpaceHyphenRegex, '')
        .replace(regex.spaceHyphenRegex, '')
        .replace(regex.leadingTrailingHyphenRegex, '')
        .toLowerCase()
        .trim(),
    );
    return {...value, name: data};
  });

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToSuppliedMarkers(newData.map(({name}) => name));
    }
  }, [newData]);

  return (
    <View style={styles.container}>
      <View style={{position: 'absolute', zIndex: 1, width: '100%'}}>
        {!props.isFromBooking && (
          <>
            <SafeAreaView />
            <Header
              screenName={strings.nearBy.nearby}
              backArrow={true}
              leftIconPress={props.navigation.goBack}
              rightIcon={true}
              rightIconPress={() =>
                props.navigation.navigate(navigations.Notifications)
              }
              container={{backgroundColor: 'transparent'}}
            />
          </>
        )}
        <View style={styles.topView}>
        <View style={{ position: 'absolute', width: '100%' }}>
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
                    height: normalize(50),
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
                  value: location.address,
                  onChangeText: text =>
                    setLocation(text),
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
                        <Text style={{ fontSize: normalize(13), color: colors.Charcoal2, fontFamily: fonts.calibri.regular, fontWeight: '400'  }} numberOfLines={1}>{title}</Text>
                        <Text style={{ fontSize: normalize(12), color: colors.DimGray2, fontFamily: fonts.calibri.regular, fontWeight: '400' }} numberOfLines={1}>{address}</Text>
                      </View>
                    </View>
                  </View>);
                }}
              >

              </GooglePlacesAutocomplete>

            </View>
        </View>
      </View>
      <View style={{flex: 1}}>
        {props.nearbyHospitalLoading || props.nearbyCategoryLoading ? (
          <View style={{height: '100%'}}>
            <Loader />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View style={{flex: 8}}>
              {location?.latitude ? (
                <View>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map1}
                  region={{
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    latitudeDelta: 0.011,
                    longitudeDelta: 0.011,
                  }}>
                  {newData?.map(item => {
                    return (
                      <Marker
                        key={item?.name}
                        identifier={item?.name}
                        coordinate={{
                          latitude: item?.latitude,
                          longitude: item?.longitude,
                        }}
                      >
                        <View style={styles.markerContainer}>
                          <Image
                            source={value == 1 ? _icNearbyHospital : _nearbyBlood}
                            style={{
                              height: heightScale(20),
                              width: widthScale(20),
                            }}
                            resizeMode='contain'
                          />
                        </View>
                      </Marker>
                    );
                  })}
                </MapView>
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
              </View>
              ) : null}
            </View>

            <View
              style={{
                flex: 7,
                borderTopLeftRadius: moderateScale(20),
                borderTopRightRadius: moderateScale(20),
                marginTop: heightScale(-20),
                backgroundColor: colors.white,
              }}
            >
              <View>
                <View
                  style={{
                    marginHorizontal: widthScale(16),
                    marginVertical: heightScale(8),
                  }}
                >
                  <SortBy
                    data={dropDownData}
                    value={value}
                    sortByDays={value => { setValue(value); }}
                    width={{width: '100%'}}
                    mainView={{
                      paddingVertical: heightScale(5),
                      borderRadius: moderateScale(12),
                      backgroundColor: colors.white,
                      paddingHorizontal: widthScale(10),
                      borderWidth: 0,
                      elevation: normalize(4),
                      shadowOpacity: normalize(1),
                      shadowColor: colors.black,
                    }}
                  />
                </View>
              </View>

              <View style={styles.listView}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={listData}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        style={
                          index === listData.length - 1
                            ? [
                                styles.listItemContainer,
                                {marginBottom: heightScale(30)},
                              ]
                            : styles.listItemContainer
                        }
                        onPress={
                          !props.isFromBooking
                            ? () => {}
                            : () => {
                                props.onPressNearbyData(item);
                              }
                        }>
                        {value == 1 ? (
                          <Card
                            name={item.name}
                            address={item.addressLine1}
                            value={value}
                          />
                        ) : (
                          <Card
                            name={item.name}
                            address={item.fullAddress}
                            distance={item.distance}
                            value={value}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listView: {
    flex: 1,
  },
  listEmptyComponentText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(16),
    color: colors.dark,
    textAlign: 'center',
  },
  listItemContainer: {
    marginTop: heightScale(20),
    marginHorizontal: widthScale(16),
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
    bottom: normalize(48),
    right: normalize(16),
    width: normalize(48),
    height: normalize(48),
    backgroundColor: colors.white,
    borderRadius: normalize(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerContainer: {
    height: heightScale(26),
    width: widthScale(26),
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
  questionView: {
    marginTop: heightScale(10),
    marginLeft: widthScale(22),
  },
  questionText: {
    color: colors.black,
    fontSize: normalize(16),
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
  },
  row1: {
    flexDirection: 'row',
  },
  map1: {
    height: '100%',
  },
  firstView: {
    paddingVertical: heightScale(10),
    borderRadius: moderateScale(12),
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: widthScale(10),
    elevation: normalize(5),
  },
  topView: {
    marginTop: heightScale(8),
    paddingHorizontal: widthScale(10),
    alignItems: 'center',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 100,
    backgroundColor: colors.Red,
  },
});

const mapStateToProps = ({App}) => {
  const {
    nearbyCategoryLoading,
    nearbyCategorySuccess,
    nearbyCategoryFail,
    nearbyHospitalLoading,
    nearbyHospitalSuccess,
    nearbyHospitalFail,
  } = App;

  return {
    nearbyCategoryLoading,
    nearbyCategorySuccess,
    nearbyCategoryFail,
    nearbyHospitalLoading,
    nearbyHospitalSuccess,
    nearbyHospitalFail,
  };
};

const mapDispatchToProps = {
  nearbyCategory,
  resetNearByCategory,
  nearbyHospital,
};

export default connect(mapStateToProps, mapDispatchToProps)(NearBy);
