import React, {useState, useEffect, useRef} from 'react';
import {colors, scaling} from '../../library';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import BookingInfo from './BookingInfo';
import {initialFormValues} from './utils';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {getCurrentLocation} from '../../library/localization-service';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {
  Crosshair,
  AIR_AMBULANCE_mapicon,
} from '../../../assets';
import Loader from '../../components/loader';
import {viewVehiclesForConfigRadiusApi} from '../../redux/api/app.api';
import {mapIcon} from '../../utils/constants';
import {getRouteDirections} from '../../components/functions';
import {requestTypeConstant} from '../../utils/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {widthScale, heightScale, normalize} = scaling;

function getCenterPoint(coord1, coord2) {
  const latitude = (coord1.latitude + coord2.latitude) / 2;
  const longitude = (coord1.longitude + coord2.longitude) / 2;
  return {
    latitude,
    longitude,
  };
}

const BookingFlow = props => {
  const mapRef = useRef();
  const mapRef2 = useRef();
  const {type, vehicleType, srDetails = {}} = props?.route?.params;

  const [formValues, setFormValues] = useState(initialFormValues);
  const [loader, setLoader] = useState(false);

  const [nearbyVehiclesData, setNearbyVehiclesData] = useState({
    isFetching: false,
    data: [],
  });
  const [pickupDropRoute, setPickupDropRoute] = useState({
    isFetching: false,
    data: [],
  });
  const [centerPointForAir, setCenterPointForAir] = useState(null);

  useEffect(() => {
    setValues('vehicleType', vehicleType);
  }, [vehicleType]);

  useEffect(() => {
    if (!Object.keys(srDetails).length) {
      setLoader(true);
      getCurrentLocation()
        .then(location => {
          setValues('pickupAddress', location.address);
          setValues('pickUpLatLong', [location.latitude, location.longitude]);
          setLoader(false);
        })
        .catch(() => {
          setLoader(false);
        });
    }
  }, []);

  const generateAmbulanceLocations = (pickupLat, pickupLng, radius = 5, count = 2) => {
    // Earth's radius in kilometers
    const earthRadius = 6371;

    // Function to generate random bearing (direction)
    const getRandomBearing = () => Math.random() * 2 * Math.PI;

    // Function to calculate new location based on distance and bearing
    const calculateNewLocation = (lat, lng, distance, bearing) => {
      const lat1 = lat * Math.PI / 180;
      const lng1 = lng * Math.PI / 180;
      
      const angularDistance = distance / earthRadius;
      
      const newLat = Math.asin(
        Math.sin(lat1) * Math.cos(angularDistance) + 
        Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
      );
      
      const newLng = lng1 + Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
        Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(newLat)
      );
      
      return {
        lastPositionLatitude: newLat * 180 / Math.PI,
        lastPositionLongitude: newLng * 180 / Math.PI
      };
    };

    // Generate ambulance locations
    const ambulanceLocations = [];
    
    for (let i = 0; i < count; i++) {
      // Generate a random distance within the radius
      const randomDistance = Math.random() * radius;
      
      // Generate a random bearing
      const randomBearing = getRandomBearing();
      
      // Calculate new location
      const newLocation = calculateNewLocation(
        pickupLat, 
        pickupLng, 
        randomDistance, 
        randomBearing
      );
      
      ambulanceLocations.push(newLocation);
    }
    return ambulanceLocations;
  };

  useEffect(() => {
    if (formValues.pickUpLatLong.length === 2) {
      setNearbyVehiclesData(preVal => ({
        ...preVal,
        isFetching: true,
        data: [],
      }));
      viewVehiclesForConfigRadiusApi({
        bookingCategory: type,
        latitude: formValues.pickUpLatLong[0],
        longitude: formValues.pickUpLatLong[1],
      })
        .then(res => {
          const nearbyVehiclesDataFetch = res?.data?.data;
          nearbyVehiclesDataFetch.push(...generateAmbulanceLocations(formValues.pickUpLatLong[0],formValues.pickUpLatLong[1],1,1));
          nearbyVehiclesDataFetch.push(...generateAmbulanceLocations(formValues.pickUpLatLong[0],formValues.pickUpLatLong[1],3,1));
          nearbyVehiclesDataFetch.push(...generateAmbulanceLocations(formValues.pickUpLatLong[0],formValues.pickUpLatLong[1],6,1));
          nearbyVehiclesDataFetch.push(...generateAmbulanceLocations(formValues.pickUpLatLong[0],formValues.pickUpLatLong[1],8,1));
          setNearbyVehiclesData(preVal => ({
            ...preVal,
            isFetching: false,
            data: nearbyVehiclesDataFetch,
          }));
        })
        .catch(err => {
          const nearbyVehiclesDummyData = [];
          nearbyVehiclesDummyData.push(...generateAmbulanceLocations(formValues.pickUpLatLong[0],formValues.pickUpLatLong[1],1,1));
          nearbyVehiclesDummyData.push(...generateAmbulanceLocations(formValues.pickUpLatLong[0],formValues.pickUpLatLong[1],3,1));
          nearbyVehiclesDummyData.push(...generateAmbulanceLocations(formValues.pickUpLatLong[0],formValues.pickUpLatLong[1],6,1));
          nearbyVehiclesDummyData.push(...generateAmbulanceLocations(formValues.pickUpLatLong[0],formValues.pickUpLatLong[1],8,1));
          setNearbyVehiclesData(preVal => ({
            ...preVal,
            isFetching: false,
            data: nearbyVehiclesDummyData,
          }));
        });
    }
  }, [formValues.pickUpLatLong]);

  useEffect(() => {
    if (
      formValues.pickUpLatLong.length === 2 &&
      formValues.dropLatLong.length === 2
    ) {
      setPickupDropRoute(preVal => ({
        ...preVal,
        isFetching: true,
        data: [],
      }));
      const origin = `${formValues.pickUpLatLong[0]},${formValues.pickUpLatLong[1]}`;
      const destination = `${formValues.dropLatLong[0]},${formValues.dropLatLong[1]}`;
      getRouteDirections(origin, destination)
        .then(res => {
          setPickupDropRoute(preVal => ({
            ...preVal,
            isFetching: false,
            data: res || [],
          }));
        })
        .catch(err => {
          setPickupDropRoute(preVal => ({
            ...preVal,
            isFetching: false,
            data: [],
          }));
        });
    }
  }, [formValues.pickUpLatLong, formValues.dropLatLong]);

  const setValues = (key, data) => {
    setFormValues(preVal => ({
      ...preVal,
      [key]: data,
    }));
  };

  useEffect(() => {
    mapRef.current &&
      mapRef.current.animateToRegion({
        latitude: formValues.pickUpLatLong[0],
        longitude: formValues.pickUpLatLong[1],
        latitudeDelta: 0.011,
        longitudeDelta: 0.011,
      });
  }, [formValues.pickUpLatLong, formValues.dropLatLong]);

  const onPressReCenterIcon = () => {
    mapRef.current &&
      mapRef.current.animateToRegion({
        latitude: formValues.pickUpLatLong[0],
        longitude: formValues.pickUpLatLong[1],
        latitudeDelta: 0.011,
        longitudeDelta: 0.011,
      });
  };

  useEffect(() => {
    if (
      formValues.pickUpLatLong.length === 2 &&
      formValues.pickUpLatLong[0] !== 0 &&
      formValues.pickUpLatLong[1] !== 0 &&
      formValues.dropLatLong.length === 2 &&
      formValues.dropLatLong[0] !== 0 &&
      formValues.dropLatLong[1] !== 0
    ) {
      const _centerPoint = getCenterPoint(
        {
          latitude: formValues.pickUpLatLong[0],
          longitude: formValues.pickUpLatLong[1],
        },
        {
          latitude: formValues.dropLatLong[0],
          longitude: formValues.dropLatLong[1],
        },
      );
      setCenterPointForAir(_centerPoint);
    } else {
      setCenterPointForAir(null);
    }
  }, [formValues.pickUpLatLong, formValues.dropLatLong]);

  useEffect(() => {
    if (Object.keys(srDetails).length) {
      setFormValues(preVal => ({
        ...preVal,
        pickupAddress: srDetails.pickMapLocation,
        pickUpLatLong: [
          srDetails.pickupLocationLatitude,
          srDetails.pickupLocationLongitude,
        ],
        dropAddress: srDetails.dropMapLocation,
        dropLatLong: [
          srDetails.dropLocationLatitude,
          srDetails.dropLocationLongitude,
        ],
      }));
    }
  }, [srDetails]);

  const onLayoutChangeOfMap = () => {
    if (
      formValues.pickUpLatLong[0] &&
      formValues.pickUpLatLong[1] &&
      formValues.dropLatLong[0] &&
      formValues.dropLatLong[1]
    ) {
      const liveCoordinates = [
        {
          latitude: formValues.pickUpLatLong[0],
          longitude: formValues.pickUpLatLong[1],
        },
        {
          latitude: formValues.dropLatLong[0],
          longitude: formValues.dropLatLong[1],
        },
      ];
      mapRef2?.current?.fitToCoordinates(liveCoordinates, {
        edgePadding: {
          right: heightScale(70),
          bottom: heightScale(70),
          left: heightScale(70),
          top: heightScale(50),
        },
        animated: true,
      });
    }
  };

  const renderInitialMap = () => {
    console.log(' =========inside renderInitialMap =====> ');

    return (
      <View style={{flex: 1}} key="initial_map">
        <MapView
          ref={mapRef}
          style={{flex: 1, minHeight: '40%'}}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: formValues.pickUpLatLong[0],
            longitude: formValues.pickUpLatLong[1],
            latitudeDelta: 0.011,
            longitudeDelta: 0.011,
          }}>
          {checkLatCondtion && (
            <Marker
              coordinate={{
                latitude: formValues.pickUpLatLong[0],
                longitude: formValues.pickUpLatLong[1],
              }}>
              <MaterialCommunityIcons
                name="map-marker-account"
                size={normalize(40)}
                color={colors.primary}
              />
            </Marker>
          )}
          {checkLongCondtion && (
            <Marker
              coordinate={{
                latitude: formValues.dropLatLong[0],
                longitude: formValues.dropLatLong[1],
              }}>
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={normalize(40)}
                color={colors.primary}
              />
            </Marker>
          )}
          {nearbyVehiclesData?.data.map(ele => (
            <Marker
              coordinate={{
                latitude: ele.lastPositionLatitude || 0,
                longitude: ele.lastPositionLongitude || 0,
              }}>
              <View>
                <Image source={mapIcon[type]} />
              </View>
            </Marker>
          ))}
          {type === requestTypeConstant.airAmbulance ||
          type === requestTypeConstant.trainAmbulance ? (
            <>
              {checkMapCondition && (
                <>
                  <Polyline
                    coordinates={[
                      {
                        latitude: formValues.pickUpLatLong[0],
                        longitude: formValues.pickUpLatLong[1],
                      },
                      {
                        latitude: formValues.dropLatLong[0],
                        longitude: formValues.dropLatLong[1],
                      },
                    ]}
                    strokeColor={colors.primary}
                    strokeWidth={4}
                    lineDashPattern={[25, 10]}
                  />
                  {centerPointForAir && (
                    <Marker coordinate={centerPointForAir}>
                      <Image source={AIR_AMBULANCE_mapicon} />
                    </Marker>
                  )}
                </>
              )}
            </>
          ) : (
            <Polyline
              coordinates={pickupDropRoute.data}
              strokeColor={colors.primary}
              strokeWidth={4}
            />
          )}
        </MapView>
        <TouchableOpacity
          style={styles.reCenterIconStyle}
          onPress={onPressReCenterIcon}
          activeOpacity={0.8}>
          <Image
            source={Crosshair}
            style={{
              width: normalize(24),
              height: normalize(24),
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderAfterMap = () => {
    console.log(' =========inside renderAfterMap =====> ');
    return (
      <View style={{flex: 1}} key="after_map">
        <MapView
          ref={mapRef2}
          style={{flex: 1, minHeight: '40%'}}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: formValues.pickUpLatLong[0],
            longitude: formValues.pickUpLatLong[1],
            latitudeDelta: 0.011,
            longitudeDelta: 0.011,
          }}
          onLayout={onLayoutChangeOfMap}>
          {checkLatCondtion && (
            <Marker
              coordinate={{
                latitude: formValues.pickUpLatLong[0],
                longitude: formValues.pickUpLatLong[1],
              }}>
              <MaterialCommunityIcons
                name="map-marker-account"
                size={normalize(40)}
                color={colors.primary}
              />
            </Marker>
          )}
          {checkLongCondtion && (
            <Marker
              coordinate={{
                latitude: formValues.dropLatLong[0],
                longitude: formValues.dropLatLong[1],
              }}>
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={normalize(40)}
                color={colors.primary}
              />
            </Marker>
          )}
          {nearbyVehiclesData?.data.map(ele => (
            <Marker
              coordinate={{
                latitude: ele.lastPositionLatitude || 0,
                longitude: ele.lastPositionLongitude || 0,
              }}>
              <View>
                <Image source={mapIcon[type]} />
              </View>
            </Marker>
          ))}
          {type === requestTypeConstant.airAmbulance ||
          type === requestTypeConstant.trainAmbulance ? (
            <>
              {checkMapCondition && (
                <>
                  <Polyline
                    coordinates={[
                      {
                        latitude: formValues.pickUpLatLong[0],
                        longitude: formValues.pickUpLatLong[1],
                      },
                      {
                        latitude: formValues.dropLatLong[0],
                        longitude: formValues.dropLatLong[1],
                      },
                    ]}
                    strokeColor={colors.primary}
                    strokeWidth={4}
                    lineDashPattern={[25, 10]}
                  />
                  {centerPointForAir && (
                    <Marker coordinate={centerPointForAir}>
                      <Image source={mapIcon[type]} />
                    </Marker>
                  )}
                </>
              )}
            </>
          ) : (
            <Polyline
              coordinates={pickupDropRoute.data}
              strokeColor={colors.primary}
              strokeWidth={4}
            />
          )}
        </MapView>
        <TouchableOpacity
          style={styles.reCenterIconStyle}
          onPress={onPressReCenterIcon}
          activeOpacity={0.8}>
          <Image
            source={Crosshair}
            style={{
              width: normalize(24),
              height: normalize(24),
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const checkLatCondtion =
    formValues.pickUpLatLong.length === 2 &&
    formValues.pickUpLatLong[0] !== 0 &&
    formValues.pickUpLatLong[1] !== 0;

  const checkLongCondtion =
    formValues.dropLatLong.length === 2 &&
    formValues.dropLatLong[0] !== 0 &&
    formValues.dropLatLong[1] !== 0;

  const checkMapCondition = checkLatCondtion && checkLongCondtion;

  console.log(checkMapCondition, ' =========checkMapCondition =====> ');

  return (
    <View style={styles.container}>
      {(loader ||
        props.addRequestLoading ||
        nearbyVehiclesData.isFetching ||
        pickupDropRoute.isFetching) && <Loader />}
      <TouchableOpacity
        onPress={props.navigation.toggleDrawer}
        style={{
          position: 'absolute',
          zIndex: 100,
          top: Platform.OS === 'ios' ? heightScale(30) : heightScale(12),
          left: widthScale(12),
        }}>
        <IconMaterial name={'menu'} size={35} color={colors.black} />
      </TouchableOpacity>

      {!checkMapCondition ? renderInitialMap() : renderAfterMap()}

      <BookingInfo
        formValues={formValues}
        setValues={setValues}
        setFormValues={setFormValues}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  reCenterIconStyle: {
    position: 'absolute',
    bottom: normalize(34),
    right: normalize(16),
    width: normalize(48),
    height: normalize(48),
    backgroundColor: colors.white,
    borderRadius: normalize(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {addRequestLoading} = App;
  const {} = Auth;

  return {addRequestLoading};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BookingFlow);
