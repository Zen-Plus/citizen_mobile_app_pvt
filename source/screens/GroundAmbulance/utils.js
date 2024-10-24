import Config from 'react-native-config';
import {
  ConfirmAmbulanceGrey,
  DoctorAtHomeGrey,
  ConfirmAmbulance,
  als,
  bls,
  hearse,
  noDoctor,
  ConfirmAirAmbulance,
  Ambulances5g,
} from '../../../assets';
export const tripBaseObj = {
  tripPriceItemType: 'TRIP_BASE',
  unitPrice: 0,
  sgstAmount: 0,
  igstAmount: 0,
  cgstAmount: 0,
  manualPrice: null,
  manualPriceSetById: null,
  manualPriceSetByName: null,
  manualPriceSetAt: null,
  allowanceAmount: 0,
  discountPercentage: 0,
  discountAmount: 0,
  isDeleted: false,
};

export const tabNames = {
  PATIENT_INFO: 'PATIENT_INFO',
  BOOKING_INFO: 'BOOKING_INFO',
  CHOOSE_AMBULANCE: 'CHOOSE_AMBULANCE',
  PAYMENT_DETAILS: 'PAYMENT_DETAILS',
};

export const FollowUpImage = {
  DOCTOR_AT_HOME: DoctorAtHomeGrey,
  GROUND_AMBULANCE: ConfirmAmbulanceGrey,
};

export const TripDetailsImage = {
  ALS: als,
  BLS: bls,
  HEARSE: hearse,
  NEONATAL: Ambulances5g,
};

export const ConfirmingBookingImage = {
  DOCTOR_AT_HOME: noDoctor,
  GROUND_AMBULANCE: ConfirmAmbulance,
  PET_VETERINARY_AMBULANCE: ConfirmAmbulance,
  AIR_AMBULANCE: ConfirmAirAmbulance,
};

export const bookFor = [
  {id: 'SELF', name: 'Self'},
  {id: 'RELATIVE', name: 'Relative'},
  {id: 'OTHER', name: 'Other'},
];

export const whenAmbulanceRequired = [
  {id: 'NOW', name: 'Now'},
  {id: 'LATER', name: 'Later'},
];

export const pickupDropOptions = [
  {id: 'HOME', name: 'Home'},
  {id: 'HOSPITAL', name: 'Hospital'},
  {id: 'OTHER', name: 'Other'},
];

export const preferedModeOfPayment = [
  {id: 'CASH', name: 'Cash'},
  {id: 'ONLINE', name: 'Online'},
];

export const initialFormValues = {
  bookFor: bookFor[0],
  patientName: '',
  patientContact: '',
  relation: '',
  bloodGroup: '',
  numberOfIndividualsWithPatient: '',
  isPatientCritical: false,
  isPatientOnVentilator: false,
  isPatientOnOxygen: false,
  instructions: '',
  medicalCondition: '',
  medicalConditionsObj: '',
  whenAmbulanceRequired: whenAmbulanceRequired[0],
  pickupType: pickupDropOptions[0],
  pickupAddress: '',
  bookingDateTime: '',
  pickupFlat: '',
  pickupLandmark: '',
  pickUpLatLong: [0, 0],
  dropType: pickupDropOptions[1],
  dropAddress: '',
  dropFlat: '',
  dropLandmark: '',
  dropLatLong: [0, 0],
  vehicleDetails: {},
  vehicleDetailsApiResponse: {},
  age: '',
  ageUnit: 'YEARS',
  gender: '',
  addonsData: [],
  negotiationAmount: '',
  discountCode: '',
  paymentMode: preferedModeOfPayment[1].id,
};
export const initialFormError = {
  patientName: '',
  patientContact: '',
  relation: '',
  bloodGroup: '',
  numberOfIndividualsWithPatient: '',
  instructions: '',
  pickupAddress: '',
  pickupFlat: '',
  pickupLandmark: '',
  dropAddress: '',
  dropFlat: '',
  dropLandmark: '',
  negotiationAmount: '',
  discountCode: '',
  dateTimeError: '',
  medicalCondition: '',
  age: '',
  gender: '',
};

const requestTypeData = {
  GROUND_AMBULANCE: {
    requestTypeId: Config.GROUND_AMBULANCE,
    requestTypeName: 'Ground Ambulance - Pickup',
  },
  DOCTOR_AT_HOME: {
    requestTypeId: Config.DOCTOR_AT_HOME,
    requestTypeName: 'Doctor at home - Pickup',
  },
};

export const createSrPayload = (values = {}, details = {}, requestType) => {
  const payload = {};

  const callerRequest = {};
  const victimRequest = {};
  const serviceRequestsObj = {};

  payload.aht = 0;
  payload.resolutionSrStatus = 'OPEN';
  payload.type = 'INITIAL';
  payload.source = 'VOICE_CALL';
  payload.isParent = false;
  payload.isCallerLocation = false;
  payload.isCallerVictim = false;
  payload.requestType = requestType;

  payload.projectTypeNumber = details.projectTypeNumber;
  callerRequest.clientId = details.clientId;

  callerRequest.phoneNumber = details.callerPhoneNumber;
  callerRequest.name = details.callerName?.trim();
  callerRequest.email = details.callerEmail;

  serviceRequestsObj.addonsCalculationRequests = [
    tripBaseObj,
    ...values.addonsData,
  ];
  serviceRequestsObj.bookAmbulanceFor = values.bookFor.id;
  serviceRequestsObj.isBookForLater =
    values.whenAmbulanceRequired.id === whenAmbulanceRequired[1].id;
  serviceRequestsObj.paymentOption = values.paymentMode;
  serviceRequestsObj.estimatedTime = values.vehicleDetails?.duration || 0;
  serviceRequestsObj.areaCode = values.vehicleDetails?.areaCode || null;
  serviceRequestsObj.areaType = values.vehicleDetails?.areaType || null;
  serviceRequestsObj.estimatedKm = values.vehicleDetails?.distance
    ? values.vehicleDetails.distance / 1000
    : 0;
  serviceRequestsObj.negotiatedAmount = values.negotiationAmount;
  serviceRequestsObj.vehicleType = values.vehicleDetails?.vehicleType || null;
  serviceRequestsObj.dropLocation = {
    addressType: values.dropType.id,
    addressLine1: values.dropAddress,
    addressLine2: values.dropFlat,
    landmark: values.dropLandmark,
    latitude: values.dropLatLong[0],
    longitude: values.dropLatLong[1],
  };
  if (serviceRequestsObj.isBookForLater) {
    serviceRequestsObj.bookingDateTime = values.bookingDateTime;
  }
  serviceRequestsObj.individualsWithPatient =
    values.numberOfIndividualsWithPatient;
  serviceRequestsObj.requestTypeCode = 'C_EMERGENCY - OTHER';
  serviceRequestsObj.requestType = requestType;
  serviceRequestsObj.requestTypeName =
    requestTypeData[requestType]?.requestTypeName;
  serviceRequestsObj.requestTypeId =
    requestTypeData[requestType]?.requestTypeId;
  serviceRequestsObj.emergencyServiceId = details.id;
  serviceRequestsObj.emergencyServiceName = details.name;
  serviceRequestsObj.emergencyServiceNumber = details.code;

  victimRequest.name = values.patientName?.trim();
  victimRequest.phoneNumber = values.patientContact;
  victimRequest.victimMedicalConditions = values.medicalConditionsObj;
  victimRequest.isPatientCritical = values.isPatientCritical;
  victimRequest.isPatientOnVentilator = values.isPatientOnVentilator;
  victimRequest.isPatientOnOxygen = values.isPatientOnOxygen;
  victimRequest.location = {
    addressType: values.pickupType.id,
    addressLine1: values.pickupAddress,
    addressLine2: values.pickupFlat,
    landmark: values.pickupLandmark,
    latitude: values.pickUpLatLong[0],
    longitude: values.pickUpLatLong[1],
  };
  victimRequest.instruction = values.instructions;
  victimRequest.bloodGroup = values.bloodGroup?.id;
  victimRequest.gender = values.gender?.id;
  victimRequest.age = values.age;
  victimRequest.ageUnit = values.ageUnit;
  if (values.bookFor.id === bookFor[1].id) {
    victimRequest.callerRelation = values.relation?.id;
  }

  payload.callerRequest = callerRequest;
  payload.victimRequest = victimRequest;
  payload.serviceRequests = [{...serviceRequestsObj}];

  return payload;
};

export default {
  tripBaseObj,
  tabNames,
  bookFor,
  whenAmbulanceRequired,
  pickupDropOptions,
  createSrPayload,
};
