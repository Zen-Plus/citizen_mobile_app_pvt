import React, {useState} from 'react';
import Config from 'react-native-config';
import {Linking, PermissionsAndroid} from 'react-native';
import getDirections from 'react-native-google-maps-directions';
import {Context} from '../providers/localization';
import {tripStatus} from '../constants';
import {
  serviceRequestStatus,
  leadRequestStatus,
  requestTypeConstant,
  groundAmbulanceIcon,
  petVeterinaryAmbulanceIcon,
} from '../utils/constants';
import {icAirAmbulanca, icDoctor, icTrain} from '../../assets';

var CryptoJs = require('crypto-js');

export const openContact = tel => {
  if (tel) {
    Linking.openURL(`tel:${tel}`);
  }
};

export const capitalizeFirstLetter = string => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};

export const handleGetDirections = (lat, long) => {
  const data = {
    destination: {
      latitude: lat,
      longitude: long,
    },
    params: [
      {
        key: 'travelmode',
        value: 'driving',
      },
    ],
  };
  getDirections(data);
};

export const status = (showNext, data) => {
  const strings = React.useContext(Context).getStrings();
  if (data && showNext) {
    switch (data) {
      case 'DISPATCH':
        return `${tripStatus.JOB_START}`;
      case 'JOB_START':
        return `${tripStatus.ON_SCENE}`;
      case 'ON_SCENE':
        return `${tripStatus.ON_BOARD}`;
      case 'ON_BOARD':
        return `${tripStatus.REACHED_DROP_LOCATION}`;
      case 'REACHED_DROP_LOCATION':
        return `${tripStatus.PATIENT_DROPPED}`;
      case 'PATIENT_DROPPED':
        return `${tripStatus.TRIP_COMPLETE}`;
      case 'TRIP_COMPLETE':
        return `${tripStatus.tripClose}`;
      case 'NEXT_JOB':
        return `${tripStatus.tripClose}`;
      default:
        return `${tripStatus.UNAUTHORIZED_MOVEMENT}`;
    }
  } else if (data && !showNext) {
    switch (data) {
      case 'DISPATCH':
        return `${tripStatus.DISPATCH}`;
      case 'JOB_START':
        return `${tripStatus.JOB_START}`;
      case 'ON_SCENE':
        return `${tripStatus.ON_SCENE}`;
      case 'ON_BOARD':
        return `${tripStatus.ON_BOARD}`;
      case 'REACHED_DROP_LOCATION':
        return `${tripStatus.REACHED_DROP_LOCATION}`;
      case 'PATIENT_DROPPED':
        return `${tripStatus.PATIENT_DROPPED}`;
      case 'TRIP_COMPLETE':
        return `${tripStatus.TRIP_COMPLETE}`;
      case 'TRIP_CLOSED':
        return `${tripStatus.tripClose}`;
      case 'NEXT_JOB':
        return `${tripStatus.tripClose}`;
      default:
        return `${tripStatus.UNAUTHORIZED_MOVEMENT}`;
    }
  }
};

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
    } else {
      console.log('location permission denied');
    }
  } catch (err) {
    console.log('error while request location permission', err);
  }
}

export async function checkLocationPermission() {
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    console.log('check permission result', granted);
    if (!granted) {
      requestLocationPermission();
    }
  } catch (err) {
    console.log('error while check location permission', err);
  }
}

export const HmacSHA256_Encrypt = rawPassword => {
  return CryptoJs.HmacSHA256(rawPassword, '0393e944ee8108bb66fc9fa4f99f9')
    .toString()
    .toUpperCase();
};

export const renderRequestStatus = item => {
  const strings = React.useContext(Context).getStrings();
  const {requestHeading} = strings;
  const leadIntegrationDetails = JSON.parse(item?.leadIntegrationDetails);
  if (item?.jobId) {
    if (
      item?.jobStatus === serviceRequestStatus.CLOSE &&
      item?.resolutionCode?.includes('C_CANCEL')
    ) {
      return requestHeading[item?.requestType?.id]?.CANCELLED;
    } else if (item?.jobStatus === serviceRequestStatus.CLOSE) {
      return requestHeading[item?.requestType?.id]?.TRIP_COMPLETE;
    } else if (item?.jobStatus === serviceRequestStatus.OPEN) {
      return requestHeading[item?.requestType?.id]?.[
        item?.tripStatus?.id || item?.tripStatus
      ];
    }
  } else if (item?.srId) {
    if (
      (item?.srStatus === serviceRequestStatus.CLOSE ||
        item?.srStatus === serviceRequestStatus.CANCEL) &&
      item?.flightName
    ) {
      return requestHeading[item?.requestType?.id]?.bookingCancelled;
    } else if (
      item?.srStatus === serviceRequestStatus.CLOSE ||
      item?.srStatus === serviceRequestStatus.CANCEL
    ) {
      return requestHeading[item?.requestType?.id]?.requestCancelled;
    } else if (item?.negotiatedAmount > 0) {
      return requestHeading[item?.requestType?.id]?.negotiationInitiated;
    } else if (item?.isBookForLater) {
      if (
        item?.requestType?.id === requestTypeConstant.airAmbulance ||
        item?.requestType?.id === requestTypeConstant.trainAmbulance
      ) {
        if (!item?.vehicleType) {
          return requestHeading[item?.requestType?.id]?.requestSubmitted;
        } else if (!item?.flightNumber) {
          return requestHeading[item?.requestType?.id]?.requestAccepted;
        } else {
          return requestHeading[item?.requestType?.id]?.booked;
        }
      } else {
        return requestHeading[item?.requestType?.id]?.booked;
      }
    } else {
      return requestHeading[item?.requestType?.id]?.requestSubmitted;
    }
  } else if (item?.leadNumber) {
    if (item?.leadStatus === leadRequestStatus.OPEN) {
      return requestHeading[leadIntegrationDetails?.requestType]
        ?.requestSubmitted;
    } else if (item?.leadStatus === leadRequestStatus.CLOSE) {
      return requestHeading[leadIntegrationDetails?.requestType]
        ?.requestClosed;
    }
  }
};

export const isRequestStatusCancelled = item => {
  if (
    ((item?.srStatus === serviceRequestStatus.CLOSE ||
      item?.srStatus === serviceRequestStatus.CANCEL) &&
      !item?.jobId) ||
    (item?.jobStatus === serviceRequestStatus.CLOSE &&
      item?.resolutionCode?.includes('C_CANCEL')) ||
    item?.status?.id === 'CANCELLED'
  ) {
    return true;
  }

  return false;
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

export const getRouteDirections = async (origin, destination) => {
  try {
    const response = await fetch(
      `${Config.GOOGLE_MAP_DIRECTIONS_API_URL}?origin=${origin}&destination=${destination}&key=${Config.GOOGLE_MAP_API_KEY}`,
    );
    const json = await response.json();
    const points = json?.routes[0]?.legs.reduce((carry, curr) => {
      return [...carry, ...decode(curr.steps)];
    }, []);
    return points;
  } catch (err) {
    //
  }
};

export const getVehicleIcon = (requestType, vehicleType) => {
  if (requestType === requestTypeConstant.GroundAmbulance) {
    return groundAmbulanceIcon[vehicleType];
  } else if (requestType === requestTypeConstant.petVeterinaryAmbulance) {
    return petVeterinaryAmbulanceIcon[vehicleType];
  } else if (requestType === requestTypeConstant.airAmbulance) {
    return icAirAmbulanca;
  } else if (requestType === requestTypeConstant.doctorAtHome) {
    return icDoctor;
  } else if (requestType === requestTypeConstant.trainAmbulance) {
    return icTrain;
  }
};

export const isNullOrUndefined = value => {
  return [null, undefined].includes(value);
};
