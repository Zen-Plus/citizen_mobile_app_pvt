import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Easing,
  Alert,
} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import {connect} from 'react-redux';
import MapView, {
  PROVIDER_GOOGLE,
  AnimatedRegion,
  MarkerAnimated,
  Polyline,
} from 'react-native-maps';
import Config from 'react-native-config';
import {Context} from '../../../../providers/localization';
import Loader from '../../../../components/loader';
import {
  DELTAS,
  liveTracking,
  milestoneStatus,
  notifications,
} from '../../../../constants';
import TcpSocket from 'react-native-tcp-socket';
import {updateInitialLocation} from '../../../../redux/actions/app.actions';
import haversine from 'haversine';
import socketIO from 'socket.io-client';
import messaging from '@react-native-firebase/messaging';
import Geolocation from 'react-native-geolocation-service';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {Crosshair} from '../../../../../assets';

const {normalize, widthScale, heightScale} = scaling;
let client;
let socket;
let avoidDouble = false;

const Tracking = props => {
  const strings = React.useContext(Context).getStrings();
  const {
    patientLocation,
    vehicalRegistrationNumber,
    jobNumber,
    parkingLocation,
    isMenuIcon,
    requestType,
  } = props.route.params;
  const _profileData = props.getProfileSuccess?.data || {};

  const [ambulanceCurLocation, setAmbulanceCurLocation] = useState({});
  const [heading, setHeading] = useState(1);
  const [coordinates, setCoordinates] = useState(
    new AnimatedRegion(parkingLocation),
  );
  const [eta, setEta] = useState('');
  const [rotation, setRotation] = useState(new Animated.Value(0));
  const scaleAnimationRef = useRef(new Animated.Value(0)).current;
  const opacityAnimationRef = useRef(new Animated.Value(1)).current;
  const [patientCurLocation, setPatientLocation] = useState(patientLocation);
  const [mileStonesStatus, setMileStoneStatus] = useState({
    onScene: false,
    dropped: false,
  });
  const [liveCoordinates, setLiveCoordinates] = useState(null);
  const [packetObject, setPacketObject] = useState({
    latitude: 0,
    longitude: 0,
    jobMilestone: 0,
    status: 0,
    angle: 0,
  });

  const mapRef = useRef();
  const markerRef = useRef();

  useEffect(() => {
    const background = messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        if (remoteMessage?.body.includes(notifications.AMBULANCE_ARRIVED)) {
          setPatientLocation(patientLocation);
          setMileStoneStatus({...mileStonesStatus, onScene: true});
        } else if (remoteMessage?.body.includes(notifications.TRIP_COMPLETED)) {
          setMileStoneStatus({onScene: false, dropped: true});
        }
      }
    });
    const forground = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        if (
          remoteMessage?.notification?.body.includes(
            notifications.AMBULANCE_ARRIVED,
          )
        ) {
          setPatientLocation(patientLocation);
          setMileStoneStatus({...mileStonesStatus, onScene: true});
        } else if (remoteMessage?.body.includes(notifications.TRIP_COMPLETED)) {
          setMileStoneStatus({onScene: false, dropped: true});
        }
      }
    });

    return () => {
      background;
      forground;
    };
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(scaleAnimationRef, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, [scaleAnimationRef]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(opacityAnimationRef, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, [opacityAnimationRef]);

  useEffect(() => {
    if (Config.SOCKET_PROVIDER_NAME === 'PLEXITECH') {
      establishSocketIO();
    } else {
      establishSocket();
    }

    return () => {
      if (Config.SOCKET_PROVIDER_NAME === 'PLEXITECH') {
        socket.off('connection');
        socket.off('joinRoom');
        socket.off('roomData');
      } else {
        client.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!liveCoordinates) {
      getRouteDirections();
    } else {
      let origin = {
        latitude: ambulanceCurLocation.latitude,
        longitude: ambulanceCurLocation.longitude,
      };
      let onRoad = false;
      for (let i = 0; i < liveCoordinates.length; i++) {
        if (
          haversine(origin, liveCoordinates[i], {threshold: 25, unit: 'meter'})
        ) {
          let newLiveCoords = liveCoordinates.slice(i);
          setLiveCoordinates(newLiveCoords);
          onRoad = true;
          break;
        }
      }
      if (!onRoad) {
        getRouteDirections();
      }
    }
  }, [ambulanceCurLocation]);

  useEffect(() => {
    if (
      (mileStonesStatus.dropped ||
        packetObject.jobMilestone === liveTracking.PATIENT_DROPPED ||
        props?.route?.params?.tripStatus === milestoneStatus.TRIP_COMPLETE) &&
      avoidDouble == false
    ) {
      closeTracking();
      avoidDouble = true;
    }
  }, [mileStonesStatus.dropped, packetObject.jobMilestone]);

  useEffect(() => {
    if (heading !== undefined && heading >= 0) {
      startRotation();
    }
  }, [heading]);

  useEffect(() => {
    if (
      packetObject.jobMilestone === liveTracking.PICKUP_REACHED ||
      mileStonesStatus.onScene ||
      props?.route?.params?.tripStatus === milestoneStatus.ON_SCENE
    ) {
      if (client) {
        client.destroy();
      }
      Alert.alert(
        strings.LiveTracking.PickupLocationReached,
        strings.LiveTracking.DropReachedSubTitle,
        [
          {
            text: strings.common.confirm,
            onPress: () => props.navigation.goBack(),
            style: 'ok',
          },
        ],
      );
    }
  }, [mileStonesStatus.onScene, packetObject]);

  useEffect(() => {
    if (packetObject.jobMilestone === liveTracking.PICKUP_REACHED) {
      setPatientLocation(patientLocation);
    } else if (packetObject.jobMilestone === liveTracking.PATIENT_DROPPED) {
      setMileStoneStatus({...mileStonesStatus, dropped: true});
    } else if (packetObject.status === liveTracking.LIVE_PACKET) {
      setAmbulanceCurLocation({
        ...ambulanceCurLocation,
        latitude: packetObject?.latitude,
        longitude: packetObject?.longitude,
        latitudeDelta: DELTAS?.LATTITUDE,
        longitudeDelta: DELTAS?.LONGITUDE,
      });
      setHeading(packetObject?.angle);
      setCoordinates(
        new AnimatedRegion({
          latitude: packetObject.latitude,
          longitude: packetObject.longitude,
        }),
      );

      animate(packetObject.latitude, packetObject.longitude);
      props.updateInitialLocation(packetObject);
    }
  }, [packetObject]);

  const establishSocketIO = () => {
    socket = socketIO(`${Config.PLEXITECH_URL}`, {
      transports: ['websocket', 'polling', 'flashsocket'],
      upgrade: false,
      auth: {
        clientType: 'subscriber',
      },
    });

    let jobNo = jobNumber;
    let vehicleNo = vehicalRegistrationNumber;
    let accountName = Config.ACCOUNT_NAME;
    let roomName = accountName + '_' + vehicleNo + '_' + jobNo;
    socket.on('connection', () => {
      if (props.initialLocation !== null) {
        setAmbulanceCurLocation({
          ...ambulanceCurLocation,
          latitude: props.initialLocation?.latitude,
          longitude: props.initialLocation?.longitude,
          latitudeDelta: DELTAS?.LATTITUDE,
          longitudeDelta: DELTAS?.LONGITUDE,
        });
        setHeading(props.initialLocation?.angle);
        setCoordinates(
          new AnimatedRegion({
            latitude: props.initialLocation.latitude,
            longitude: props.initialLocation.longitude,
          }),
        );

        animate(
          props.initialLocation.latitude,
          props.initialLocation.longitude,
        );
      } else if (Object.keys(coordinates).length > 0) {
        setAmbulanceCurLocation(parkingLocation);
      }
      socket.emit('joinRoom', roomName);
    });
    socket.on('roomData', function (data) {
      setPacketObject({
        latitude: data?.latitude,
        longitude: data?.longitude,
        status: Date.now() - data?.packetTime < 50000 ? 2 : 1,
        jobMilestone: 0,
        angle: data?.angle,
      });
    });
    socket.on('connect_error', err => {
      console.log(`connect_error due to ${err.message}`);
    });
  };

  const establishSocket = () => {
    client = TcpSocket.createConnection(
      {
        host: Config.LIVE_TRACKING_SOCKET_URL,
        port: Config.LIVE_TRACKING_SOCKET_PORT,
      },
      () => {
        console.log('connected .... ');
        client.write(`${jobNumber}${vehicalRegistrationNumber}`);
      },
    );
    client.on('data', function (data) {
      if (
        !data.toString().includes('connected') &&
        data.toString() !== 'null' &&
        data.toString() !== 'close'
      ) {
        if (
          data
            .toString()
            .includes('GPS packet not yet received for this room name')
        ) {
          if (props.initialLocation !== null) {
            setAmbulanceCurLocation({
              ...ambulanceCurLocation,
              latitude: props.initialLocation?.latitude,
              longitude: props.initialLocation?.longitude,
              latitudeDelta: DELTAS?.LATTITUDE,
              longitudeDelta: DELTAS?.LONGITUDE,
            });
            setHeading(props.initialLocation?.angle);
            setCoordinates(
              new AnimatedRegion({
                latitude: props.initialLocation.latitude,
                longitude: props.initialLocation.longitude,
              }),
            );

            animate(
              props.initialLocation.latitude,
              props.initialLocation.longitude,
            );
          } else if (Object.keys(coordinates).length > 0) {
            setAmbulanceCurLocation(parkingLocation);
          } else {
            client.destroy();
            Alert.alert(
              strings.LiveTracking.Unavailable,
              strings.LiveTracking.pleaseTryAgain,
              [
                {
                  text: strings.common.confirm,
                  onPress: () => props.navigation.goBack(),
                  style: 'ok',
                },
              ],
            );
          }
        } else {
          try {
            const socketData = JSON.parse(data.toString());
            setPacketObject({
              latitude: socketData?.latitude,
              longitude: socketData?.longitude,
              angle: socketData?.angle,
              status: socketData?.status,
              jobMilestone: socketData?.jobMilestone,
            });
          } catch (error) {
            console.log('Parsing error ', error);
          }
        }
      }
    });

    client.on('error', function (error) {
      console.log('error kya hai? :', error);
    });
    client.on('close', err => {
      console.log('===> socket closed', err);
    });
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
    if (Platform.OS == 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 1000);
      }
    } else {
      coordinates
        .timing({...newCoordinate, duration: 1000, useNativeDriver: false})
        .start();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setAmbulanceCurLocation({
          ...ambulanceCurLocation,
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          latitudeDelta: DELTAS?.LATTITUDE,
          longitudeDelta: DELTAS?.LONGITUDE,
        });

        setHeading(position?.coords?.heading);

        setCoordinates(
          new AnimatedRegion({
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
          }),
        );
        animate(position?.coords?.latitude, position?.coords?.longitude);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const decode = t => {
    let points = [];
    for (let step of t) {
      let encoded = step.polyline.points;
      let index = 0,
        len = encoded.length;
      let lat = 0,
        lng = 0;
      while (index < len) {
        let b,
          shift = 0,
          result = 0;
        do {
          b = encoded.charAt(index++).charCodeAt(0) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);

        let dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
        lat += dlat;
        shift = 0;
        result = 0;
        do {
          b = encoded.charAt(index++).charCodeAt(0) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        let dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
        lng += dlng;

        points.push({latitude: lat / 1e5, longitude: lng / 1e5});
      }
    }
    return points;
  };

  const getRouteDirections = async () => {
    try {
      let origin = `${ambulanceCurLocation?.latitude},${ambulanceCurLocation?.longitude}`;
      let destination = `${patientCurLocation?.latitude},${patientCurLocation?.longitude}`;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${Config.GOOGLE_MAP_API_KEY}`,
      );
      const json = await response.json();

      let points = json?.routes[0]?.legs.reduce((carry, curr) => {
        return [...carry, ...decode(curr.steps)];
      }, []);
      setLiveCoordinates(points);
      setEta(json?.routes[0]?.legs[0]?.duration?.text);
    } catch (error) {
      console.error(error);
    }
  };

  const closeTracking = () => {
    if (Config.SOCKET_PROVIDER_NAME === 'PLEXITECH') {
      socket.off('connection');
      socket.off('joinRoom');
      socket.off('roomData');
    } else {
      client.destroy();
    }

    props.updateInitialLocation(null);
    Alert.alert(
      strings.LiveTracking.DropLocationReached,
      strings.LiveTracking.DropReachedSubTitle,
      [
        {
          text: strings.common.confirm,
          onPress: () => props.navigation.goBack(),
          style: 'ok',
        },
      ],
    );
  };

  const startRotation = () => {
    Animated.timing(rotation, {
      toValue: heading,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => rotation.setValue(heading));
  };

  const rotationData = rotation.interpolate({
    inputRange: [0, heading !== undefined ? heading : 0],
    outputRange: [`0deg`, `${heading !== undefined ? heading : 0}deg`],
  });

  const onCenter = () => {
    mapRef.current.animateToRegion({
      latitude: ambulanceCurLocation.latitude,
      longitude: ambulanceCurLocation.longitude,
      latitudeDelta: DELTAS.LATTITUDE,
      longitudeDelta: DELTAS.LONGITUDE,
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          position: 'absolute',
          zIndex: 99,
          top: Platform.OS === 'ios' ? heightScale(42) : heightScale(12),
          left: widthScale(12),
          flexDirection: 'row',
          alignItems: 'center',
          width: '90%',
        }}>
        <TouchableOpacity
          onPress={() => {
            if (isMenuIcon) {
              props.navigation.toggleDrawer();
            } else {
              props.navigation.goBack();
            }
          }}
          style={[
            !isMenuIcon && {
              borderRadius: normalize(100),
              backgroundColor: colors.primary,
              paddingVertical: heightScale(6),
              paddingHorizontal: widthScale(6),
            },
          ]}>
          {isMenuIcon ? (
            <IconMaterial name={'menu'} size={35} color={colors.black} />
          ) : (
            <IconMaterial name={'arrow-back'} size={25} color={colors.white} />
          )}
        </TouchableOpacity>
        {!!eta && (
          <View style={{marginLeft: widthScale(12)}}>
            <Text style={styles.headerMessageText}>
              <Text style={{color: colors.primary}}>
                {`${_profileData.firstName}, `}
              </Text>
              {strings.LiveTracking[requestType]?.yourAmbulanceWillReachYou}
            </Text>
            <Text style={styles.header2MessageText}>
              {`${strings.common.in} ${eta}`}
            </Text>
          </View>
        )}
      </View>
      <View style={{flex: 1}}>
        {!eta ? <Loader /> : null}
        {Object.keys(ambulanceCurLocation).length !== 0 ? (
          <View style={{flex: 1}}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              rotateEnabled={false}
              initialRegion={{
                ...ambulanceCurLocation,
                latitudeDelta: 0.09,
                longitudeDelta: 0.04,
              }}
              onMapLoaded={() => {
                mapRef.current.fitToCoordinates(liveCoordinates, {
                  edgePadding: {
                    right: heightScale(70),
                    bottom: heightScale(70),
                    left: heightScale(70),
                    top: heightScale(50),
                  },
                });
              }}>
              <MarkerAnimated
                ref={markerRef}
                coordinate={coordinates}
                anchor={{x: 0.3, y: 0.5}}>
                <Animated.Image
                  source={props.ambulanceIcon}
                  style={{transform: [{rotate: rotationData}]}}
                  resizeMode={'contain'}
                />
              </MarkerAnimated>

              <MarkerAnimated coordinate={patientCurLocation}>
                <Image source={props.DestinationIcon} resizeMode={'contain'} />
              </MarkerAnimated>
              <Polyline
                coordinates={liveCoordinates ? liveCoordinates : []}
                strokeColor={colors.primary}
                strokeWidth={4}
              />
            </MapView>
            <TouchableOpacity style={styles.mapCenterStyle} onPress={onCenter}>
              <Image
                source={Crosshair}
                style={{
                  width: widthScale(22),
                  height: heightScale(22),
                }}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Loader />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  mapCenterStyle: {
    position: 'absolute',
    bottom: heightScale(10),
    right: widthScale(10),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headerMessageText: {
    color: colors.DarkGray,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.semiBold,
  },
  header2MessageText: {
    color: colors.DarkGray,
    fontSize: normalize(24),
    fontFamily: fonts.calibri.bold,
    marginTop: heightScale(-4),
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {initialLocation, getProfileSuccess} = App;
  const {} = Auth;

  return {
    initialLocation,
    getProfileSuccess,
  };
};

const mapDispatchToProps = {updateInitialLocation};

export default connect(mapStateToProps, mapDispatchToProps)(Tracking);
