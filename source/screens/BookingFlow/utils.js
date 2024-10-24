import Config from 'react-native-config';
import {
  Online,
  Cash,
  eventAmbulance,
  airBookAmbulance,
  bookForAnimalBanner,
  bookDoctorBanner,
} from '../../../assets';
import {requestTypeConstant} from '../../utils/constants';
export const bookFor = [
  {id: 'SELF', name: 'Myself'},
  {id: 'RELATIVE', name: 'Relative'},
  {id: 'OTHER', name: 'Other'},
];
export const bookForPetVet = [
  {id: 'SELF', name: 'Myself'},
  {id: 'OTHER', name: 'Other'},
];

export const genderData = [
  {id: 'MALE', name: 'Male'},
  {id: 'FEMALE', name: 'Female'},
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
  {id: 'CASH', name: 'Cash', icon: Cash, height: 10, width: 24},
  {id: 'ONLINE', name: 'Online', icon: Online, height: 21, width: 21},
];

const alphaNumWithoutSpaceMinFiveRegex = new RegExp(/^([a-zA-Z0-9]){5,}$/);
export function validateAlphaNumWithoutSpaceMinFive(value = '') {
  return alphaNumWithoutSpaceMinFiveRegex.test(value);
}

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
  pickupFlat: 'NA',
  pickupLandmark: '',
  pickUpLatLong: [0, 0],
  dropType: pickupDropOptions[1],
  dropAddress: '',
  dropFlat: 'NA',
  dropLandmark: '',
  dropLatLong: [0, 0],
  vehicleDetails: {},
  vehicleDetailsApiResponse: {},
  age: '',
  ageUnit: 'YEARS',
  gender: genderData[0].id,
  travellerName: '',
  travellerMobile: '',
  addonsData: [],
  negotiationAmount: '',
  discountCode: '',
  paymentMode: preferedModeOfPayment[1].id,
  couponCode: null,
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

const requestTypeData = {
  GROUND_AMBULANCE: {
    requestTypeId: Config.GROUND_AMBULANCE,
    requestTypeName: 'Ground Ambulance - Pickup',
  },
  DOCTOR_AT_HOME: {
    requestTypeId: Config.DOCTOR_AT_HOME,
    requestTypeName: 'Doctor at home - Pickup',
  },
  PET_VETERINARY_AMBULANCE: {
    requestTypeId: Config.PET_VETERINARY_AMBULANCE,
    requestTypeName: 'Pet Veterinary Ambulance - Pickup',
  },
  AIR_AMBULANCE: {
    requestTypeId: Config.AIR_AMBULANCE,
    requestTypeName: 'Air Ambulance - Pickup',
  },
  TRAIN_AMBULANCE: {
    requestTypeId: Config.TRAIN_AMBULANCE,
    requestTypeName: 'Train Ambulance - Pickup',
  },
};

export const createSrPayload = (
  values = {}, details = {}, requestType, corporateBookingData = {},
) => {
  const payload = {};

  const callerRequest = {};
  const victimRequest = {};
  const serviceRequestsObj = {};

  payload.aht = 0;
  payload.resolutionSrStatus = 'OPEN';
  payload.type = 'INITIAL';
  payload.source = 'CUSTOMER';
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
  serviceRequestsObj.couponCode = values.couponCode;
  serviceRequestsObj.estimatedKm = values.vehicleDetails?.distance
    ? values.vehicleDetails.distance / 1000
    : 0;
  serviceRequestsObj.negotiatedAmount = values.negotiationAmount;
  serviceRequestsObj.vehicleType = values.vehicleDetails?.vehicleType || null;
  serviceRequestsObj.dropLocation = {
    addressType: values.dropType.id,
    addressLine1: values.dropAddress,
    addressLine2:
      requestType === requestTypeConstant.doctorAtHome ? '' : values.dropFlat,
    landmark: values.dropLandmark,
    latitude: values.dropLatLong[0],
    longitude: values.dropLatLong[1],
  };
  if (serviceRequestsObj.isBookForLater) {
    serviceRequestsObj.bookingDateTime = Date.parse(values.bookingDateTime);
  }
  serviceRequestsObj.individualsWithPatient =
    values.numberOfIndividualsWithPatient || 0;
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
  victimRequest.bloodGroup = values.bloodGroup;
  victimRequest.gender = values.gender;
  victimRequest.age = values.age;
  victimRequest.ageUnit = values.ageUnit;
  if (values.bookFor.id === bookFor[1].id) {
    victimRequest.callerRelation = values.relation?.id;
  }
  victimRequest.animalBreed = values?.animalBreed?.name;
  victimRequest.animalBreedId = values?.animalBreed?.id;
  victimRequest.animalCategory = values.animalCategory?.name;
  victimRequest.animalCategoryId = values.animalCategory?.id;

  if (
    (values?.bookFor?.id === bookFor[0]?.id)
    && (!!Object.keys(corporateBookingData).length)
  ) {
    payload.projectBillingModel = corporateBookingData?.projectBilling?.model;
    payload.projectId = corporateBookingData?.projectBilling?.project?.id;
    payload.projectName = corporateBookingData?.projectBilling?.project?.name;
    payload.projectPaymentBy = corporateBookingData?.projectBilling?.paymentBy;
    payload.projectTypeNumber = corporateBookingData?.projectBilling?.project?.projectType?.number;

    callerRequest.clientId = corporateBookingData?.client?.id;
    callerRequest.clientName = corporateBookingData?.client?.name;

    if (corporateBookingData?.projectBilling?.project?.callerVerificationFlag) {
      callerRequest.namedCallerId = corporateBookingData?.id;
      callerRequest.identificationParameter = corporateBookingData?.identificationParameter;
      callerRequest.employeeId = corporateBookingData?.identificationNo;
    }
  }

  payload.callerRequest = callerRequest;
  payload.victimRequest = victimRequest;
  payload.serviceRequests = [{...serviceRequestsObj}];

  return payload;
};

export const BookingData = [
  {
    image: eventAmbulance,
    type: requestTypeConstant.event,
  },

  {
    image: airBookAmbulance,
    type: requestTypeConstant.airAmbulance,
  },

  {
    image: bookForAnimalBanner,
    type: requestTypeConstant.petVeterinaryAmbulance,
  },

  {
    image: bookDoctorBanner,
    type: requestTypeConstant.doctorAtHome,
  },
];
