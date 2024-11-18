import {
  GROUND_AMBULANCE_mapicon,
  als,
  bls,
  hearse,
  icPet,
  icVet,
  doctorMarker,
  ConfirmAmbulance,
  noDoctor,
  ConfirmAirAmbulance,
  Ambulances5g,
  MobilityAssistIcon,
  PetIcon,
  TrainAmbulance,
  AIR_AMBULANCE_mapicon,
  trainMapIcon,
} from '../../assets';
import Config from 'react-native-config';

export const leadStatus = {
  REQUEST_MADE: 'Request made',
  IN_PROCESS: 'In process',
  ASSIGNED: 'Assigned',
  CANCEL_BY_CALLER: 'Cancel By caller Other',
  CANCEL: 'Cancel',
  ERV_DISPATCHED: 'ERV Dispatched',
  CLOSED: 'Closed',
  CANCELLED: 'Request cancelled',
  COMPLETED: 'Completed',
};

export const leadStatusValue = {
  ERV_DISPATCHED: 'ERV Dispatched',
  REQUEST_MADE: 'Request made',
  IN_PROCESS: 'In process',
  ASSIGNED: 'Assigned',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

export const TERMSCONDITIONSURL =
  'https://zhl.org.in/mobile-app-privacy-policy';

export const OTP_TIMER = 120;

export const DELTAS = {
  LATTITUDE: 0.09,
  LONGITUDE: 0.04,
};
export const tripDetails = {
  addOns: 'ADDONS',
  tripBase: 'TRIP_BASE',
  extra: 'EXTRA',
  cancellation: 'CANCELLATION',
};

export const paymentOption = {
  ONLINE: 'ONLINE',
  TRIPCOMPLETE: 'TRIP_COMPLETE',
  JOBSTART: 'JOB_START',
  DISPATCH: 'DISPATCH',
};

export const serviceRequestStatus = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  CANCEL: 'CANCEL',
};

export const leadRequestStatus = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  CANCEL: 'CANCEL',
};

export const notificationEntityName = {
  VENDOR: 'VENDOR',
  VEHICLE: 'VEHICLE',
  USER: 'USER',
};

export const Resolution = {
  CODE: 'C_CANCEL',
  NAME: 'Cancel By Caller Other',
};
export const REQUEST_LIST_LIMIT = 10;

export const eventListingTabs = {
  ONGOING: 'DISPATCHED',
  COMPLETE: 'CLOSE',
  SCHEDULED: 'SCHEDULED',
};

export const transactionStatus = {
  INVALID_UUID: 'INVALID_UUID',
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  NOT_FETCHED: 'NOT_FETCHED',
};

// TODO: need to update for production
export const requestType =
  !!Config.APP_TYPE
    ? [
        {name: 'All Requests', id: '1', days: ''},
        {name: 'Ground Ambulance', id: '2', days: 'GROUND_AMBULANCE'},
        {name: 'Air Ambulance', id: '3', days: 'AIR_AMBULANCE'},
        {name: 'Doctor at home', id: '4', days: 'DOCTOR_AT_HOME'},
        {name: 'Pet/Veterinary', id: '5', days: 'PET_VETERINARY_AMBULANCE'},
        {name: 'Train Ambulance', id: '6', days: 'TRAIN_AMBULANCE'},
      ]
    : [
        {name: 'All Requests', id: '1', days: ''},
        {name: 'Ground Ambulance', id: '2', days: 'GROUND_AMBULANCE'},
        {name: 'Air Ambulance', id: '3', days: 'AIR_AMBULANCE'},
      ];

export const requestTypeConstant = {
  GroundAmbulance: 'GROUND_AMBULANCE',
  doctorAtHome: 'DOCTOR_AT_HOME',
  airAmbulance: 'AIR_AMBULANCE',
  petVeterinaryAmbulance: 'PET_VETERINARY_AMBULANCE',
  event: 'EVENT',
  trainAmbulance: 'TRAIN_AMBULANCE',
};

export const RequestTypeKeys = {
  [requestTypeConstant.airAmbulance]: 'AIRPORT',
  [requestTypeConstant.trainAmbulance]: 'TRAIN',
};

export const requestTypeConstantValues = {
  GROUND_AMBULANCE: 'Ground Ambulance',
  DOCTOR_AT_HOME: 'Doctor at home',
  AIR_AMBULANCE: 'Air Ambulance',
  PET_VETERINARY_AMBULANCE: 'Pet / Veterinary Ambulance',
  EVENT: 'Event',
};

export const groundAmbulanceIcon = {
  ALS: als,
  BLS: bls,
  HEARSE: hearse,
  NEONATAL: Ambulances5g,
  MOBILITY_ASSIST: MobilityAssistIcon,
};

export const petVeterinaryAmbulanceIcon = {
  PET: icPet,
  VETERINARY: icVet,
};

export const iconName = {
  AmbulanceDetails: {
    GROUND_AMBULANCE: 'ambulance',
    DOCTOR_AT_HOME: 'stethoscope',
  },
};

export const mapIcon = {
  GROUND_AMBULANCE: GROUND_AMBULANCE_mapicon,
  DOCTOR_AT_HOME: doctorMarker,
  PET_VETERINARY_AMBULANCE: GROUND_AMBULANCE_mapicon,
  AIR_AMBULANCE: AIR_AMBULANCE_mapicon,
  TRAIN_AMBULANCE: trainMapIcon,
};

export const preferedModeOfPayment = [
  {id: 'CASH', name: 'Cash'},
  {id: 'ONLINE', name: 'Online'},
];

export const ConfirmingBookingImage = {
  DOCTOR_AT_HOME: noDoctor,
  GROUND_AMBULANCE: ConfirmAmbulance,
  PET_VETERINARY_AMBULANCE: ConfirmAmbulance,
  AIR_AMBULANCE: ConfirmAirAmbulance,
  TRAIN_AMBULANCE: TrainAmbulance,
};

export const TripDetailsImage = {
  ALS: als,
  BLS: bls,
  HEARSE: hearse,
  NEONATAL: Ambulances5g,
  PET: PetIcon,
  VETERINARY: icVet,
  MOBILITY_ASSIST: MobilityAssistIcon,
};
