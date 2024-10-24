import appActions from '../constants/action-types/app.actionTypes';
import commonActions from '../constants/action-types/common';
import * as appApi from '../api/app.api';
// import {
//   configurationApiCreateStatement,
//   configurationApiSelectStatement,
//   configurationApiFormatApiData,
//   configurationApiGetData,
// } from "../../sqlite/app.sqlite";

export const updateOfflineLogin = data => ({
  type: appActions.UPDATE_OFFLINE_LOGIN,
  payload: data,
});

export const configuration = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.CONFIGURATION,
  promise: () => appApi.configurationApi(data),
  // createStatement: configurationApiCreateStatement,
  // selectStatement: configurationApiSelectStatement,
  // formatApiData: configurationApiFormatApiData,
  // getData: configurationApiGetData,
});

export const validateVersion = data => ({
  type: appActions.VERSION_VALID,
  payload: data,
});

export const getProfile = () => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_PROFILE,
  promise: () => appApi.getProfileApi(),
});
export const getUserData = userId => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_USER_DATA,
  promise: () => appApi.getUserDataApi(userId),
});

export const updateProfile = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.UPDATE_PROFILE,
  promise: () => appApi.updateProfileApi(data),
});

export const nearbyCategory = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.NEARBY_CATEGORY,
  promise: () => appApi.nearbyCategoryApi(data),
});

export const airAmbulanceMasterData = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.AIR_AMBULANCE_MASTER_DATA,
  promise: () => appApi.airAmbulanceMasterDataApi(data),
});

export const resetNearByCategory = () => ({
  type: appActions.NEARBY_CATEGORY.RESET,
});

export const resetAirAmbulanceMasterData = () => ({
  type: appActions.AIR_AMBULANCE_MASTER_DATA.RESET,
});

export const getAllowedLanguages = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_ALLOWED_LANGUAGES,
  promise: () => appApi.getAllowedLanguagesApi(data),
});

/**
 * Used to get type of device - personal or shared
 */
export const getDeviceType = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_DEVICE_TYPE,
  promise: () => appApi.getDeviceTypeApi(data),
});

//get notifications count
export const getNotificationsCount = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_NOTIFICATIONS_COUNT,
  promise: () => appApi.getNotificationsCountApi(data),
});

//For get notification action
export const getNotifications = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_NOTIFICATIONS,
  promise: () => appApi.getNotificationsApi(data),
});

export const clearNotificationData = () => ({
  type: appActions.GET_NOTIFICATIONS.RESET,
});

//For read notification action
export const readNotifications = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.READ_NOTIFICATIONS,
  promise: () => appApi.readNotificationsApi(data),
});

//For get alert or update notification action
export const getCustomNotifications = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes:
    data && data.customNotificationType == 'ALERT'
      ? appActions.GET_CUSTOM_NOTIFICATIONS
      : appActions.GET_CUSTOM_UPDATES_NOTIFICATIONS,
  promise: () => appApi.getCustomNotificationsApi(data),
});

export const clearCustomNotificationAlert = () => ({
  type: appActions.GET_CUSTOM_NOTIFICATIONS.RESET,
});
export const clearCustomNotificationUpdate = () => ({
  type: appActions.GET_CUSTOM_UPDATES_NOTIFICATIONS.RESET,
});

//For read alert or update notification action
export const readCustomNotifications = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.READ_CUSTOM_NOTIFICATIONS,
  promise: () => appApi.readCustomNotificationsApi(data),
});

export const addRequest = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.ADD_REQUEST,
  promise: () => appApi.addRequestApi(data),
});

export const requestDetails = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.REQUEST_DETAILS,
  promise: () => appApi.requestDetailsApi(data),
});

export const requestListing = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.REQUEST_LISTING,
  promise: () => appApi.requestListingApi(data),
});

export const resetRequestListing = () => ({
  type: appActions.REQUEST_LISTING.RESET,
});

export const resetAddRequest = () => ({
  type: appActions.ADD_REQUEST.RESET,
});

//For reset redux state
export const resetReduxState = data => ({
  type: appActions.RESET_REDUX_STATE,
  payload: data,
});

export const updateDeviceTimeIncorrect = data => ({
  type: appActions.DEVICE_TIME_INCORRECT,
  payload: data,
});

export const cancelRequest = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.REQUEST_CANCEL,
  promise: () => appApi.cancelRequestApi(data),
});

export const resetCancelRequest = () => ({
  type: appActions.REQUEST_CANCEL.RESET,
});

export const cancelReason = () => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.CANCEL_REASON,
  promise: () => appApi.cancelReasonApi(),
});

export const resetCancelReason = () => ({
  type: appActions.CANCEL_REASON.RESET,
});

export const editProfile = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.EDIT_PROFILE,
  promise: () => appApi.editProfileApi(data),
});
export const updateUserProfile = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.UPDATE_USER_PROFILE,
  promise: () => appApi.updateUserProfileApi(data),
});
export const resetUpdateUserProfile = () => ({
  type: appActions.UPDATE_USER_PROFILE.RESET,
});
export const getMedicalCondition = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_MEDICAL_CONDITION,
  promise: () => appApi.getMedicalConditionApi(data),
});

export const getTypeOfDoctors = type => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_TYPE_OF_DOCTORS,
  promise: () => appApi.getTypeOfDoctors(type),
});

export const getDashboardVehicals = (...type) => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_DASHBOARD_VEHICALS,
  promise: () => appApi.getDashboardVehicals(type),
});

export const updateMedicalCondition = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.UPDATE_MEDICAL_CONDITION,
  promise: () => appApi.updateMedicalConditionApi(data),
});

export const validateCoupon = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.VALIDATE_COUPON,
  promise: () => appApi.validateCouponApi(data),
});

export const resetValidateCoupon = () => ({
  type: appActions.VALIDATE_COUPON.RESET,
});

export const getUserMedical = (customerId, memberId) => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_USER_MEDICAL,
  promise: () => appApi.getUserMedicalApi(customerId, memberId),
});
export const resetupdateMedicalCondition = () => ({
  type: appActions.UPDATE_MEDICAL_CONDITION.RESET,
});
export const addMembers = (data, customerId) => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.ADD_MEMBERS,
  promise: () => appApi.addMembersApi(data, customerId),
});
export const getMembers = customerId => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_MEMBERS,
  promise: () => appApi.getMembersApi(customerId),
});
export const resetGetMembersApi = () => ({
  type: appActions.GET_MEMBERS.RESET,
});
export const resetaddMembers = () => ({
  type: appActions.ADD_MEMBERS.RESET,
});

export const profileUpdate = data => ({
  type: appActions.IS_PROFILE_UPDATED,
  payload: data,
});

export const firstStart = data => ({
  type: appActions.IS_FIRST_START,
  payload: data,
});

export const requestCitizenTrips = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_CITIZEN_TRIPS,
  promise: () => appApi.requestCitizenTripsApi(data),
});

export const requestCitizenTripsReset = () => ({
  type: appActions.GET_CITIZEN_TRIPS.RESET,
});

export const allAddons = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.ALL_ADDONS,
  promise: () => appApi.allAddonsApi(data),
});
export const MyRequestDetails = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.MY_REQUEST_DETAILS,
  promise: () => appApi.myRequestDetailsApi(data),
});

export const MyRequestDetailsReset = () => ({
  type: appActions.MY_REQUEST_DETAILS.RESET,
});

// Payments Api

export const getPaymentDetails = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_PAYMENT_DETAILS,
  promise: () => appApi.getBookingPaymentApi(data),
});

export const createTransaction = (data, isTransactionFromCustomer) => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.CREATE_TRANSACTION,
  promise: () => appApi.createTransactionApi(data, isTransactionFromCustomer),
});

export const transactionDetails = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_TRANSACTION_DETAILS,
  promise: () => appApi.transactionDetailsApi(data),
});

export const resetCreateTransaction = () => ({
  type: appActions.CREATE_TRANSACTION.RESET,
});

export const resetTransactionDetails = () => ({
  type: appActions.GET_TRANSACTION_DETAILS.RESET,
});

export const getPickist = () => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_PICKLIST,
  promise: () => appApi.getPicklistApi(),
});
export const srCreationApi = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.SR_CREATION,
  promise: () => appApi.srCreationApi(data),
});
export const resetSrCreationApi = () => ({
  type: appActions.SR_CREATION.RESET,
});
export const globalConfig = () => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GLOBAL_CONFIGURATION,
  promise: () => appApi.globalConfigApi(),
});

export const setSelectedEventStatus = data => ({
  type: appActions.SET_EVENT_STATUS,
  payload: data,
});

export const getEventDetailsListing = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_EVENT_DETAILS_LISTING,
  promise: () => appApi.getEventDetailsListingApi(data),
});
export const EventListingReset = () => ({
  type: appActions.GET_EVENT_DETAILS_LISTING.RESET,
});

export const EventDetails = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.EVENT_DETAILS_LIST,
  promise: () => appApi.eventsDetailsApi(data),
});

export const createEventRequest = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.CREATE_EVENT_REQUEST,
  promise: () => appApi.createEventRequestApi(data),
});

export const resetCreateEventRequest = () => ({
  type: appActions.CREATE_EVENT_REQUEST.RESET,
});

export const EventDetailsReset = () => ({
  type: appActions.EVENT_DETAILS_LIST.RESET,
});
export const resolutionReason = (data, resolutionFor) => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.RESOLUTION_REASON,
  promise: () => appApi.resolutionReasonApi(data, resolutionFor),
});

export const endTrip = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.END_TRIP,
  promise: () => appApi.endTripApi(data),
});
export const resetEndTrip = () => ({
  type: appActions.END_TRIP.RESET,
});

export const resolutionStatus = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.RESOLUTION_STATUS,
  promise: () => appApi.resolutionStatusApi(data),
});
export const getCost = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_COSTS,
  promise: () => appApi.getCostApi(data),
});

export const updateFamilyMember = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.UPDATE_FAMILY_MEMBER,
  promise: () => appApi.updateFamilyMemberApi(data),
});
export const resetUpdateMemberData = () => ({
  type: appActions.UPDATE_FAMILY_MEMBER.RESET,
});

export const nearbyHospital = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.NEARBY_HOSPITAL,
  promise: () => appApi.nearbyHospitalApi(data),
});

export const projectConfigAction = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.PROJECT_CONFIG,
  promise: () => appApi.projectConfigApi(data),
});

export const faq = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.FAQ,
  promise: () => appApi.faqApi(data),
});

export const updateInitialLocation = data => ({
  type: appActions.UPDATE_INITIAL_LOCATION,
  payload: data,
});

export const CallerChatNotification = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.POST_CHAT_NOTIFICATION,
  promise: () => appApi.postChatNotification(data),
});

export const getDocument = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.GET_DOCUMENT,
  promise: () => appApi.getDocumentApi(data),
});

export const animalCategories = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.ANIMAL_CATEGORY,
  promise: () => appApi.AnimalCategoriesApi(data),
});
export const animalBreed = data => ({
  type: commonActions.COMMON_API_CALL,
  subtypes: appActions.ANIMAL_BREED,
  promise: () => appApi.AnimalBreedApi(data),
});
