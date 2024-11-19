import Config from 'react-native-config';
import {
  configurationEndpoint,
  getProfileEndpoint,
  updateProfileEndpoint,
  localizationEndpoint,
  getAllowedLangaugesEndPoint,
  getDeviceType,
  customNotificationsEndPoint,
  notificationsEndPoint,
  citizenUser,
  hospitalMasterData,
  commonMaster,
  nearby,
  lead,
  addRequest,
  requestDetails,
  requestList,
  cancelRequest,
  cancelReason,
  users,
  primaryComplaints,
  medicalCondition,
  familyMember,
  customer,
  jobs,
  citizenTrips,
  additionalServices,
  getPicklistEndpoints,
  followUpRequired,
  serviceRequest,
  lastOpenRequest,
  ambulanceSearch,
  globalConfiguration,
  requestDetail,
  eventDetailsListingEndpoint,
  resolutionReason,
  tripComplete,
  jobDetailsEndPoint,
  serviceRequestResolution,
  payments,
  bookingPayment,
  createTransaction,
  transactionDetail,
  paymentCalculation,
  addonsPrice,
  nearbyHospital,
  masterHospital,
  faqEndpoint,
  member,
  typeOfDoctor,
  typeDoctor,
  callersChatNotification,
  documnentUuid,
  vtsDashboardVehiclesConfigRadius,
  validateCoupon,
  tripBasePrice,
  update,
  animalCategory,
  animalBreed,
  customers,
  pendingFeedback,
  job,
  feedback,
  namedCallersDetails,
  groundPetDistanceAmountData
} from '../constants/endpoint-constants';
import apiService from './axios-service';
import axios from 'axios';

export const configurationApi = data => {
  return axios.get(
    `${configurationEndpoint}?appName=${Config.APP_NAME_ENUM_FOR_API}&appPlatform=${data}`,
  );
};

export const getProfileApi = () => {
  return apiService.get(`${citizenUser}${citizenUser}`);
};

export const getUserDataApi = userId => {
  return apiService.get(`${users}/${userId}`);
};

export const updateProfileApi = data => {
  return apiService.put(`${updateProfileEndpoint}`, data);
};

export const nearbyCategoryApi = data => {
  const queryParams = `?latitude=${data.latitude}&longitude=${data.longitude}&masterDataType=${data.masterDataType}&pageNo=${data.pageNo}&pageSize=${data.pageSize}&sortBy=${data.sortBy}&sortDirection=${data.sortDirection}`;

  return apiService.get(`${hospitalMasterData}${nearby}${queryParams}`);
};

export const airAmbulanceMasterDataApi = data => {
  const queryParams = `?masterDataType=${data.masterDataType}&pageNo=${data.pageNo}&pageSize=${data.pageSize}&searchText=${data.searchText}`;
  return apiService.get(`${hospitalMasterData}${commonMaster}${queryParams}`);
};

export const groundPetDistanceAmountDataApi = data => {
  const queryParams = `?dropLat=${data.dropLat}&dropLong=${data.dropLong}&pickupLat=${data.pickupLat}&pickupLong=${data.pickupLong}`;
  return apiService.vtsGet(`${groundPetDistanceAmountData}${queryParams}`);
};

/**
 * This api used to get app text based on current app language
 * @param {*} appName - App name
 * @param {*} language - current app language
 */
export const localizationApi = (appName, language) => {
  let queryParams = '';
  if (appName && language) {
    queryParams = `?appName=${appName}&language=${language}`;
  }
  return apiService.get(`${localizationEndpoint}${queryParams}`);
};

export const getAllowedLanguagesApi = data => {
  let queryParams;
  queryParams = `?appName=${Config.APP_NAME_ENUM_FOR_API}`;
  return apiService.userGet(`${getAllowedLangaugesEndPoint}${queryParams}`);
};

export const getDeviceTypeApi = data => {
  let queryParams;
  if (data) {
    queryParams = `?deviceId=${data.deviceId}`;
  }
  return apiService.get(`${getDeviceType}${queryParams}`);
};

export const getNotificationsCountApi = () => {
  return apiService.notificationGet(`${notificationsEndPoint}info`);
};

//For Notification
export const getNotificationsApi = data => {
  let queryParams = '';
  if (data) {
    queryParams = '?';
    for (const key in data) {
      if (
        data.hasOwnProperty(key) &&
        data[key] != undefined &&
        data[key] != null
      ) {
        const value = data[key];
        queryParams += `${key}=${value}&`;
      }
    }
    queryParams = queryParams.slice(0, -1);
  }
  return apiService.notificationGet(`${notificationsEndPoint}${queryParams}`);
};

export const readNotificationsApi = data => {
  return apiService.notificationPut(
    `${notificationsEndPoint}read-notifications`,
    data,
  );
};

//For Notification
export const getCustomNotificationsApi = data => {
  let queryParams = '';
  if (data) {
    queryParams = '?';
    for (const key in data) {
      if (
        data.hasOwnProperty(key) &&
        data[key] != undefined &&
        data[key] != null
      ) {
        const value = data[key];
        queryParams += `${key}=${value}&`;
      }
    }
    queryParams = queryParams.slice(0, -1);
  }
  return apiService.notificationGet(
    `${customNotificationsEndPoint}${queryParams}`,
  );
};

export const readCustomNotificationsApi = data => {
  let queryParams = '';
  if (data.isRead) {
    queryParams = `?isRead=${data.isRead}`;
  }
  return apiService.notificationPut(
    `${customNotificationsEndPoint}${data.customNotificationId}${queryParams}`,
    data,
  );
};

export const addRequestApi = data => {
  let queryParams = '';
  if (data) {
    queryParams = `/citizen-user`;
  }
  return apiService.edsPost(`${lead}${addRequest}${queryParams}`, data);
};

export const requestDetailsApi = data => {
  let queryParams = ``;

  if (data) {
    queryParams = `/${data.id}`;
  }

  return apiService.edsGet(`${lead}${requestDetails}${queryParams}`);
};

export const requestListingApi = data => {
  let queryParams = '';

  if (data) {
    queryParams = `/${data.citizenId}/?pageSize=${data.pageSize}`;
  }

  return apiService.edsGet(`${lead}${requestList}${queryParams}`);
};

export const cancelRequestApi = data => {
  let queryParams = '';
  if (data) {
    queryParams = `/${data.id}`;
  }
  return apiService.edsPut(`${lead}${queryParams}`, {
    leadStatus: 'CLOSED',
    interaction: data.cancelReason,
    leadClosureReason: 'Cancel By Caller',
    leadClosureReasonId: 4,
  });
};

export const cancelReasonApi = () => {
  return apiService.get(`${citizenUser}${citizenUser}${cancelReason}`);
};

export const editProfileApi = data => {
  let queryParams = '';

  if (data) {
    console.log('data :', data);
    queryParams = `/${data.citizenId}`;
  }
  // if (data.email) {
  //   console.log('inside email?');
  //   return apiService.put(`${citizenUser}${citizenUser}${queryParams}`, {
  //     firstName: data.firstName,
  //     email: data.email,
  //   });
  // } else {
  //   console.log('inside?');
  //   return apiService.put(`${citizenUser}${citizenUser}${queryParams}`, {
  //     firstName: data.firstName,
  //   });
  // }

  return apiService.put(`${citizenUser}${citizenUser}${queryParams}`, {
    firstName: data.firstName,
    email: data.email,
  });
};
export const updateUserProfileApi = data => {
  return apiService.put(`${users}${customer}/${data.userId}`, data);
};

export const getMedicalConditionApi = data => {
  let queryParams = `?pageNo=0&pageSize=100&${
    data.searchText ? `searchText=${data.searchText}` : ''
  }&sortBy=modifiedAt&sortDirection=DESC&status=ACTIVE${
    data?.subCategoryIds ? `&serviceSubCategoryIds=${data.subCategoryIds}` : ''
  }${data?.isPicklist ? `&isPicklist=${data.isPicklist}` : ''}`;
  return apiService.get(`${primaryComplaints}/${queryParams}`);
};

export const getTypeOfDoctors = type => {
  const queryParams = `?bookingCategory=${type}`;

  if (type === 'DOCTOR_AT_HOME' || type === 'PET_VETERINARY_AMBULANCE') {
    return apiService.vtsGet(`${typeDoctor}${queryParams}`);
  } else {
    return apiService.vtsGet(`${typeOfDoctor}${queryParams}`);
  }
};

export const getDashboardVehicals = type => {
  const queryParams = type.reduce((prev, curr, index) => {
    if (index === 0) {
      return `?bookingCategory=${curr}`;
    } else {
      return prev + `&bookingCategory=${curr}`;
    }
  }, '');

  return apiService.vtsGet(`${typeOfDoctor}${queryParams}`);
};

export const validateCouponApi = data => {
  const queryParams = `?baseFairExcludingGst=${data.baseFairExcludingGst}&callerNumber=${data.callerNumber}&couponCode=${data.couponCode}`;
  return apiService.edsGet(`${serviceRequest}${validateCoupon}${queryParams}`);
};

export const updateMedicalConditionApi = data => {
  let queryParams = '';
  if (data) {
    queryParams = `?bloodGroup=${data.bloodGroup}&medicalConditionIds=${data.medicalConditionIds}`;
  }
  if (data.memberId) {
    queryParams = `${queryParams}&memberId=${data.memberId}`;
  }
  return apiService.put(
    `${citizenUser}/${data.customerId}${medicalCondition}${queryParams}`,
  );
};
export const getUserMedicalApi = (customerId, memberId) => {
  if (memberId) {
    const queryParams = `?memberId=${memberId}`;
    return apiService.get(
      `${citizenUser}/${customerId}${medicalCondition}${queryParams}`,
    );
  }
  return apiService.get(`${citizenUser}/${customerId}${medicalCondition}`);
};

export const addMembersApi = (data, customerId) => {
  return apiService.post(`${citizenUser}/${customerId}${familyMember}`, data);
};
export const getMembersApi = customerId => {
  return apiService.get(`${citizenUser}/${customerId}${familyMember}`);
};
export const requestCitizenTripsApi = data => {
  let queryParams = `?fromDate=${data?.fromDate}&toDate=${data?.toDate}&pageNo=${data?.pageNo}&pageSize=${data?.pageSize}&requestType=${data?.requestType}`;
  if (data?.tripStatus) {
    queryParams = `${queryParams}&tripStatus=${data?.tripStatus}`;
  }
  return apiService.edsGet(`${jobs}${citizenTrips}${queryParams}`);
};
export const myRequestDetailsApi = data => {
  return apiService.edsGet(`${requestDetail}/${data?.srId}`);
};

export const getBookingPaymentApi = data => {
  return apiService.paymentGet(`${payments}${bookingPayment}/${data?.srId}`);
};

export const createTransactionApi = (data, isTransactionFromCustomer) => {
  let queryParams = `?isTransactionFromCustomer=${isTransactionFromCustomer}`;
  return apiService.paymentPost(
    `${payments}${createTransaction}${queryParams}`,
    data,
  );
};

export const transactionDetailsApi = data => {
  let queryParams = `?transactionUuid=${data?.transactionUuid}`;
  return apiService.paymentGet(`${payments}${transactionDetail}${queryParams}`);
};

export const allAddonsApi = data => {
  let queryParams = '';
  if (data) {
    queryParams = `?vehicleType=${data?.vehicleType}`;
    return apiService.vtsGet(`${additionalServices}${queryParams}`);
  }
};

export const getPicklistApi = () => {
  return apiService.userGet(`${getPicklistEndpoints}`);
};

export const callFollowUpRequired = data => {
  let queryParams = `?isFollowUpRequired=${data?.isFollowUpRequired}&serviceRequestId=${data?.serviceRequestId}`;
  return apiService.edsPost(
    `${serviceRequest}${followUpRequired}${queryParams}`,
  );
};
export const srCreationApi = data => {
  return apiService.edsPost(`${serviceRequest}/`, data);
};
export const searchAmbulanceApi = data => {
  let queryParams =
    data.bookingCategory === 'DOCTOR_AT_HOME'
      ? `?pickupLat=${data.pickupLat}&pickupLong=${data.pickupLong}`
      : `?pickupLat=${data.pickupLat}&pickupLong=${data.pickupLong}&dropLat=${data.dropLat}&dropLong=${data.dropLong}`;
  if (data?.vehicleType) {
    queryParams = `${queryParams}&vehicleType=${data.vehicleType}`;
  }
  if (data?.bookingCategory) {
    queryParams = `${queryParams}&bookingCategory=${data.bookingCategory}`;
  }

  return apiService.vtsGet(`${ambulanceSearch}${queryParams}`);
};

export const globalConfigApi = () => {
  return apiService.get(globalConfiguration);
};

export const getEventDetailsListingApi = data => {
  let queryParams = '';
  if (data) {
    if (!queryParams) {
      queryParams = `?duration=${data?.duration}&pageNo=${data?.pageNo}&pageSize=${data?.pageSize}&phoneNumber=${data?.phoneNumber}&fromDate=${data.fromDate}&toDate=${data.toDate}&isCustomerRequest=true`;
    }
    // if (data.eventStatus === 'COMPLETE') {
    //    queryParams = `${queryParams}&eventStatus=CANCELLED`
    // }
    if (data.eventStatus !== '') {
      for (const value in data.eventStatus) {
        console.log('value===', value);
        queryParams = `${queryParams}&eventStatus=${data.eventStatus[value]}`;
      }
    }
    console.log('queryParams==', queryParams);
  }
  return apiService.edsGet(`${eventDetailsListingEndpoint}${queryParams}`);
};

export const eventsDetailsApi = data => {
  return apiService.edsGet(`${eventDetailsListingEndpoint}/${data?.eventId}`);
};

export const createEventRequestApi = data => {
  let payload = {
    aht: data.aht,
    projectTypeNumber: data.projectTypeNumber,
    dispatchPriority: data.dispatchPriority,
    isCallerLocation: data.isCallerLocation,
    isCallerVictim: data.isCallerVictim,
    isParent: data.isParent,
    note: data.note,
    resolutionSrStatus: data.resolutionSrStatus,
    requestType: data.requestType,
    source: data.source,
    type: data.type,
    eventName: data.eventName,
    organizingFirmName: data.organizingFirmName,
    natureOfEvent: data.natureOfEvent,
    eventStartDate: data.eventStartDate,
    eventEndDate: data.eventEndDate,
    eventStartTime: data.eventStartTime,
    eventEndTime: data.eventEndTime,
    callerRequest: data.callerRequest,
    serviceRequest: data.serviceRequest,
  };
  return apiService.edsPost(`${eventDetailsListingEndpoint}`, payload);
};

export const resolutionReasonApi = (data, resolutionFor) => {
  let queryParams = '';
  if (data) {
    queryParams = `?pageSize=25&pageNo=0&resolutionIds=${data}&sortBy=modifiedAt&sortDirection=DESC&isPicklist=true&
    `;
  }
  if (resolutionFor) {
    queryParams = `${queryParams}&resolutionFor=${resolutionFor}`;
  }

  return apiService.get(`${resolutionReason}${queryParams}`);
};

export const endTripApi = data => {
  if (data) {
    if (data.jobId) {
      return apiService.edsPut(
        `${jobDetailsEndPoint}${data.jobId}${tripComplete}`,
        {
          addonsCalculationRequests: data.addonsCalculationRequests,
          dropLocation: data.dropLocation,
          jobStatusRequest: data.jobStatusRequest,
          aht: data.aht,
          isCancelledByCustomer: true,
        },
      );
    } else {
      let queryParams = '';
      queryParams = `?dispatchMedical=${data.dispatchMedical}`;
      let payload = {
        aht: data.aht,
        dispatchPriority: data.dispatchPriority,
        isCallerLocation: data.isCallerLocation,
        isCallerVictim: data.isCallerVictim,
        isParent: data.isParent,
        leadId: data.leadId,
        resolutionSrStatus: data.resolutionSrStatus,
        source: data.source,
        type: data.type,
        requestType: data.requestType,
        victimRequest: data.victimRequest,
        serviceRequest: data.serviceRequest,
        dispatchRequest: data.dispatchRequest,
      };
      return apiService.edsPut(
        `${serviceRequest}${update}${data.srId}${queryParams}`,
        payload,
      );
    }
  }
};

export const lastOpenRequestApi = data => {
  return apiService.edsPut(
    `${serviceRequest}${lastOpenRequest}?callerNumber=${data.callerNumber}`,
  );
};

export const resolutionStatusApi = data => {
  let queryParams = '';
  queryParams = `?pageSize=50&pageNo=0&searchText=&isPicklist=true&serviceSubCategoryIds=${data?.serviceSubCategoryIds}&stages=JOB_STATUS&status=ACTIVE`;
  return apiService.get(`${serviceRequestResolution}${queryParams}`);
};
export const updateFamilyMemberApi = data => {
  return apiService.put(
    `${citizenUser}${customer}/${data.customerId}${member}/${data.memberId}`,
    data,
  );
};
export const getCostApi = data => {
  return apiService.vtsPost(`/${paymentCalculation}${addonsPrice}`, data);
};

export const getTripBasePrice = data => {
  return apiService.vtsPost(`/${paymentCalculation}${tripBasePrice}`, data);
};

export const nearbyHospitalApi = data => {
  const queryParams = `?latitude=${data.latitude}&longitude=${data.longitude}&masterDataType=${data.masterDataType}&pageNo=${data.pageNo}&pageSize=${data.pageSize}&sortBy=${data.sortBy}&sortDirection=${data.sortDirection}`;
  console.log(queryParams, 'queryParams');
  return apiService.get(`${masterHospital}${nearbyHospital}${queryParams}`);
};

export const faqApi = data => {
  let queryParams = '';
  if (data) {
    queryParams = `?pageNo=${data?.pageNo}&pageSize=${data?.pageSize}&searchText=${data?.searchText}`;
    if (data?.category !== '') {
      for (const value in data?.category) {
        queryParams = `${queryParams}&category=${data?.category[value]}`;
      }
    }
    return apiService.get(`${faqEndpoint}/${queryParams}`);
  }
};

export const projectConfigApi = data => {
  return apiService.get(
    `${masterHospital}/project?clientId=${data.clientId}&projectTypeNumber=${data.projectTypeNumber}`,
  );
};
export const postChatNotification = data => {
  let queryParams = '';
  if (data) {
    queryParams = `?entityType=${data.entityType}&jobId=${data.jobId}&message=${data.message}`;
  }
  return apiService.edsPost(`${callersChatNotification}${queryParams}`);
};

export const getDocumentApi = data => {
  console.log('doucumnet Api...', data);
  let queryParams = '';
  if (data) {
    queryParams = `?documentType=${data?.documentType}`;
  }
  return apiService.get(`${documnentUuid}${queryParams}`);
};

export const viewVehiclesForConfigRadiusApi = data => {
  const queryParams = `?bookingCategory=${data.bookingCategory}&latitude=${data.latitude}&longitude=${data.longitude}`;

  return apiService.vtsGet(`${vtsDashboardVehiclesConfigRadius}${queryParams}`);
};

export const AnimalCategoriesApi = data => {
  let queryParams = '';
  if (data) {
    queryParams = `?pageNo=0&pageSize=50&status=ACTIVE&isPicklist=true&animalType=${data}`;
    return apiService.get(`${animalCategory}/${queryParams}`);
  }
};
export const AnimalBreedApi = data => {
  console.log('data...', data);
  let queryParams = '';
  if (data) {
    queryParams = `?&pageNo=0&pageSize=50&isPicklist=true&status=ACTIVE&animalCategoryIds=${data}`;
    return apiService.get(`${animalBreed}/${queryParams}`);
  }
};

export const pendingFeedbackApi = data => {
  return apiService.edsGet(
    `${jobDetailsEndPoint}${customers}${data.phoneNumber}${pendingFeedback}`,
  );
};

export const feedbackDataApi = data => {
  let queryParams = '?isCustomerRatingGiven=true';

  if (data.customerRating) {
    queryParams = `${queryParams}&customerRating=${data.customerRating}`;
  }

  if (data.customerRemark) {
    queryParams = `${queryParams}&customerRemark=${data.customerRemark}`;
  }

  return apiService.edsPost(
    `${jobDetailsEndPoint}${job}${data.jobNumber}${feedback}${queryParams}`,
  );
};

export const namedCallerAndClientDetailsAPI = data => {
  return apiService.get(`${namedCallersDetails}?phoneNo=${data.phoneNo}&isMobileVerification=true`);
};
