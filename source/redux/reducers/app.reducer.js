import appActions from '../constants/action-types/app.actionTypes';
import authActions from '../constants/action-types/auth.actionTypes';
import persistWraper from './persistWraper';
import _ from 'lodash';
import {
  setAsyncStorage,
  getJSONFromAsync,
  setJSONToAsync,
} from '../../utils/asyncStorage';
import {tripsData} from '../../constants/data';

const initialState = {
  configurationLoading: false,
  configurationSuccess: null,
  configurationFail: false,

  getProfileLoading: false,
  getProfileSuccess: null,
  getProfileFail: false,

  getUserDataLoading: false,
  getUserDataSuccess: null,
  getUserDataFail: false,

  userName: null,
  userMobile: null,
  userId: null,

  getDeviceTypeLoading: false,
  getDeviceTypeFail: false,
  getDeviceTypeSuccess: null,

  getNotificationsCountLoading: false,
  getNotificationsCountSuccess: null,
  getNotificationsCountFail: false,

  getNotificationsLoading: false,
  getNotificationsSuccess: null,
  getNotificationsFail: false,

  readNotificationsLoading: false,
  readNotificationsSuccess: null,
  readNotificationsFail: false,

  getCustomNotificationsLoading: false,
  getCustomNotificationsSuccess: null,
  getCustomNotificationsFail: false,

  readCustomNotificationsLoading: false,
  readCustomNotificationsSuccess: null,
  readCustomNotificationsFail: false,

  getCustomUpdatesNotificationsLoading: false,
  getCustomUpdatesNotificationsSuccess: null,
  getCustomUpdatesNotificationsFail: false,

  isInternetConnected: false,
  isOfflineLoggedIn: false,

  deviceTimeIncorrect: false,

  versionValid: false,

  osdNumber: null,
  supportNumber: null,
  supportEmail: null,
  emergencyServiceId: null,

  getAllowedLanguagesLoading: false,
  getAllowedLanguagesFail: false,
  getAllowedLanguagesSuccess: null,

  addRequestLoading: false,
  addRequestFail: false,
  addRequestSuccess: null,

  requestDetailsLoading: false,
  requestDetailsFail: false,
  requestDetailsSuccess: null,

  requestListingLoading: false,
  requestListingFail: false,
  requestListingSuccess: null,

  requestCitizenTripsFail: false,
  requestCitizenTripsLoading: false,
  requestCitizenTripsSuccess: null,

  requestTransactionDetailFail: false,
  requestTransactionDetailLoading: false,
  requestTransactionDetailSuccess: null,

  requestCreateTransactionFail: false,
  requestCreateTransactionLoading: false,
  requestCreateTransactionSuccess: null,

  requestPaymentDetailsFail: false,
  requestPaymentDetailsLoading: false,
  requestPaymentDetailsSuccess: null,

  requestCancelLoading: false,
  requestCancelFail: false,
  requestCancelSuccess: null,

  nearbyCategoryLoading: false,
  nearbyCategorySuccess: null,
  nearbyCategoryFail: false,

  airAmbulanceMasterDataLoading: false,
  airAmbulanceMasterDataSuccess: null,
  airAmbulanceMasterDataFail: false,

  cancelReasonLoading: false,
  cancelReasonSuccess: null,
  cancelReasonFail: false,

  editProfileLoading: false,
  editProfileSuccess: null,
  editProfileFail: false,

  allAddOnsLoading: false,
  allAddOnsSuccess: null,
  allAddOnsFail: null,
  myRequestDetailsLoading: false,
  myRequestDetailsSuccess: null,
  myRequestDetailsFail: false,

  updateUserProfileLoading: false,
  updateUserProfileSuccess: null,
  updateUserProfileFail: false,

  getMedicalConditionLoading: false,
  getMedicalConditionFail: false,
  getMedicalConditionSuccess: null,

  getTypeOfDoctorsLoading: false,
  getTypeOfDoctorsFail: false,
  getTypeOfDoctorsSuccess: null,

  getDashboardVehicalsLoading: false,
  getDashboardVehicalsFail: false,
  getDashboardVehicalsSuccess: null,

  updateMedicalCondionLoading: false,
  updateMedicalCondionSuccess: null,
  updateMedicalCondionFail: false,

  validateCouponLoading: false,
  validateCouponSuccess: null,
  validateCouponFail: false,

  getUserMedicalLoading: false,
  getUserMedicalFail: false,
  getUserMedicalSuccess: null,

  addMembersLoading: false,
  addMembersSuccess: null,
  addMembersFail: false,

  getMembersLoading: false,
  getMembersFail: false,
  getMembersSuccess: null,

  getPicklistLoading: false,
  getPicklistSuccess: null,
  getPicklistFail: null,

  isProfileUpdated: true,

  isFirstStart: false,

  srCreationLoading: false,
  srCreationSuccess: null,
  srCreationFail: null,

  globalConfigurationLoading: false,
  globalConfigurationSuccess: null,
  globalConfigurationFail: null,

  getEventDetailsListingLoading: false,
  getEventDetailsListingSuccess: null,
  getEventDetailsListingFail: false,

  createEventRequestLoading: false,
  createEventRequestSuccess: null,
  createEventRequestFail: false,

  eventDetailsLoading: false,
  eventDetailsSuccess: null,
  eventDetailsFail: null,
  resolutionReasonLoading: false,
  resolutionReasonSuccess: null,
  resolutionReasonFail: null,

  endTripLoading: false,
  endTripSuccess: null,
  endTripFail: null,

  resolutionStatusLoading: false,
  resolutionStatusSuccess: null,
  resolutionStatusFail: null,

  updateFamilyMemberLoading: false,
  updateFamilyMemberSuccess: null,
  updateFamilyMemberFail: false,

  getCostLoading: false,
  getCostSuccess: null,
  getCostFail: null,
  nearbyHospitalLoading: false,
  nearbyHospitalSuccess: null,
  nearbyHospitalFail: false,

  faqLoading: false,
  faqSuccess: null,
  faqFail: null,

  projectConfigLoading: false,
  projectConfigSuccess: null,
  projectConfigFail: false,

  documnentLoading: false,
  documentSuccess: null,
  documentFail: null,

  initialLocation: null,

  animalCategorySuccess: null,
  animalCategoryLoading: false,
  animalCategoryFail: false,

  animalBreedSuccess: null,
  animalBreedLoading: false,
  animalBreedFail: false,
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case appActions.CONFIGURATION.START:
      return {
        ...state,
        configurationLoading: true,
        configurationFail: false,
      };
    case appActions.CONFIGURATION.SUCCESS:
      return {
        ...state,
        configurationLoading: false,
        osdNumber: action.payload.data[0].osdPhoneNumber,
        emergencyServiceId: JSON.parse(action.payload.data[0].metadata)
          .emergencyServiceId,
        supportEmail: JSON.parse(action.payload.data[0].metadata).supportEmail,
        supportNumber: action.payload.data[0].supportPhoneNumber,
        configurationSuccess: action.payload,
        // configurationFail: true,
      };
    case appActions.CONFIGURATION.FAIL:
      return {
        ...state,
        configurationFail: !state.configurationFail,
        configurationLoading: false,
        // osdNumber: action.payload.data[0].osdPhoneNumber,
        // emergencyServiceId: JSON.parse(action.payload.data[0].metadata).emergencyServiceId,
        // supportEmail:JSON.parse(action.payload.data[0].metadata).supportEmail,
        // supportNumber: action.payload.data[0].supportPhoneNumber,
        // configurationSuccess: action.payload,
      };

    case appActions.VERSION_VALID:
      return {
        ...state,
        versionValid: action && action.payload && action.payload.isVersionValid,
      };

    case appActions.GET_PROFILE.START:
      return {
        ...state,
        getProfileLoading: true,
        getProfileSuccess: null,
        getProfileFail: false,
      };
    case appActions.GET_PROFILE.SUCCESS:
      return {
        ...state,
        getProfileLoading: false,
        getProfileSuccess: action.payload,
        getProfileFail: false,
        userName: action.payload?.data?.name,
        userMobile: action.payload?.data?.mobile,
        userId: action.payload?.data?.id,
      };
    case appActions.GET_PROFILE.FAIL:
      return {
        ...state,
        getProfileLoading: false,
        getProfileSuccess: null,
        getProfileFail: action,
      };

    case appActions.GET_USER_DATA.START:
      return {
        ...state,
        getUserDataLoading: true,
        getUserDataSuccess: null,
        getUserDataFail: false,
      };
    case appActions.GET_USER_DATA.SUCCESS:
      return {
        ...state,
        getUserDataLoading: false,
        getUserDataSuccess: action.payload,
        getUserDataFail: false,
      };
    case appActions.GET_USER_DATA.FAIL:
      return {
        ...state,
        getUserDataLoading: false,
        getUserDataSuccess: null,
        getUserDataFail: action,
      };

    case appActions.GET_DEVICE_TYPE.START:
      return {
        ...state,
        getDeviceTypeLoading: true,
        getDeviceTypeFail: false,
        getDeviceTypeSuccess: null,
      };
    case appActions.GET_DEVICE_TYPE.SUCCESS:
      setJSONToAsync('deviceType', action.payload);
      return {
        ...state,
        getDeviceTypeLoading: false,
        getDeviceTypeSuccess: action.payload,
        getDeviceTypeFail: false,
      };
    case appActions.GET_DEVICE_TYPE.FAIL:
      return {
        ...state,
        getDeviceTypeFail: true,
        getDeviceTypeLoading: false,
        getDeviceTypeSuccess: null,
      };

    case appActions.GET_NOTIFICATIONS_COUNT.START:
      return {
        ...state,
        getNotificationsCountLoading: true,
        getNotificationsCountFail: false,
      };
    case appActions.GET_NOTIFICATIONS_COUNT.SUCCESS:
      return {
        ...state,
        getNotificationsCountLoading: false,
        getNotificationsCountSuccess: action.payload,
      };
    case appActions.GET_NOTIFICATIONS_COUNT.FAIL:
      return {
        ...state,
        getNotificationsCountFail: !state.getNotificationsCountFail,
        getNotificationsCountLoading: false,
      };

    case appActions.GET_NOTIFICATIONS.START:
      return {
        ...state,
        getNotificationsLoading: true,
        getNotificationsFail: false,
      };
    case appActions.GET_NOTIFICATIONS.SUCCESS:
      return {
        ...state,
        getNotificationsLoading: false,
        getNotificationsSuccess: action.payload,
      };
    case appActions.GET_NOTIFICATIONS.FAIL:
      return {
        ...state,
        getNotificationsFail: !state.getNotificationsFail,
        getNotificationsLoading: false,
      };
    case appActions.GET_NOTIFICATIONS.RESET:
      return {
        ...state,
        getNotificationsFail: false,
        getNotificationsLoading: false,
        getNotificationsSuccess: [],
      };

    case appActions.READ_NOTIFICATIONS.START:
      return {
        ...state,
        readNotificationsLoading: true,
        readNotificationsFail: false,
      };
    case appActions.READ_NOTIFICATIONS.SUCCESS:
      return {
        ...state,
        readNotificationsLoading: false,
        readNotificationsSuccess: action.payload,
      };
    case appActions.READ_NOTIFICATIONS.FAIL:
      return {
        ...state,
        readNotificationsFail: !state.readNotificationsFail,
        readNotificationsLoading: false,
      };

    case appActions.GET_CUSTOM_NOTIFICATIONS.START:
      return {
        ...state,
        getCustomNotificationsLoading: true,
        getCustomNotificationsFail: false,
      };
    case appActions.GET_CUSTOM_NOTIFICATIONS.SUCCESS:
      return {
        ...state,
        getCustomNotificationsLoading: false,
        getCustomNotificationsSuccess: action.payload,
      };
    case appActions.GET_CUSTOM_NOTIFICATIONS.FAIL:
      return {
        ...state,
        getCustomNotificationsFail: !state.getCustomNotificationsFail,
        getCustomNotificationsLoading: false,
      };
    case appActions.GET_CUSTOM_NOTIFICATIONS.RESET:
      return {
        ...state,
        getCustomNotificationsFail: false,
        getCustomNotificationsLoading: false,
        getCustomNotificationsSuccess: [],
      };

    case appActions.READ_CUSTOM_NOTIFICATIONS.START:
      return {
        ...state,
        readCustomNotificationsLoading: true,
        readCustomNotificationsFail: false,
      };
    case appActions.READ_CUSTOM_NOTIFICATIONS.SUCCESS:
      return {
        ...state,
        readCustomNotificationsLoading: false,
        readCustomNotificationsSuccess: action.payload,
      };
    case appActions.READ_CUSTOM_NOTIFICATIONS.FAIL:
      return {
        ...state,
        readCustomNotificationsFail: !state.readCustomNotificationsFail,
        readCustomNotificationsLoading: false,
      };

    case appActions.GET_CUSTOM_UPDATES_NOTIFICATIONS.START:
      return {
        ...state,
        getCustomUpdatesNotificationsLoading: true,
        getCustomUpdatesNotificationsFail: false,
      };
    case appActions.GET_CUSTOM_UPDATES_NOTIFICATIONS.SUCCESS:
      return {
        ...state,
        getCustomUpdatesNotificationsLoading: false,
        getCustomUpdatesNotificationsSuccess: action.payload,
      };
    case appActions.GET_CUSTOM_UPDATES_NOTIFICATIONS.FAIL:
      return {
        ...state,
        getCustomUpdatesNotificationsFail:
          !state.getCustomUpdatesNotificationsFail,
        getCustomUpdatesNotificationsLoading: false,
      };

    case appActions.GET_CUSTOM_UPDATES_NOTIFICATIONS.RESET:
      return {
        ...state,
        getCustomUpdatesNotificationsFail: false,
        getCustomUpdatesNotificationsLoading: false,
        getCustomUpdatesNotificationsSuccess: [],
      };

    case appActions.GET_ALLOWED_LANGUAGES.START:
      return {
        ...state,
        getAllowedLanguagesLoading: true,
        getAllowedLanguagesFail: false,
      };
    case appActions.GET_ALLOWED_LANGUAGES.SUCCESS:
      return {
        ...state,
        getAllowedLanguagesLoading: false,
        getAllowedLanguagesSuccess: action.payload,
      };
    case appActions.GET_ALLOWED_LANGUAGES.FAIL:
      return {
        ...state,
        getAllowedLanguagesFail: !state.getAllowedLanguagesFail,
        getAllowedLanguagesLoading: false,
      };

    case appActions.NEARBY_CATEGORY.START:
      return {
        ...state,
        nearbyCategoryLoading: true,
        nearbyCategorySuccess: null,
        nearbyCategoryFail: false,
      };
    case appActions.NEARBY_CATEGORY.SUCCESS:
      return {
        ...state,
        nearbyCategoryLoading: false,
        nearbyCategorySuccess: action.payload,
        nearbyCategoryFail: false,
      };
    case appActions.NEARBY_CATEGORY.FAIL:
      return {
        ...state,
        nearbyCategoryLoading: false,
        nearbyCategorySuccess: null,
        nearbyCategoryFail: action,
      };

    case appActions.NEARBY_CATEGORY.RESET:
      return {
        ...state,
        nearbyCategoryLoading: false,
        nearbyCategorySuccess: null,
        nearbyCategoryFail: false,
      };

    case appActions.AIR_AMBULANCE_MASTER_DATA.START:
      return {
        ...state,
        airAmbulanceMasterDataLoading: true,
        airAmbulanceMasterDataSuccess: null,
        airAmbulanceMasterDataFail: false,
      };
    case appActions.AIR_AMBULANCE_MASTER_DATA.SUCCESS:
      return {
        ...state,
        airAmbulanceMasterDataLoading: false,
        airAmbulanceMasterDataSuccess: action.payload,
        airAmbulanceMasterDataFail: false,
      };
    case appActions.AIR_AMBULANCE_MASTER_DATA.FAIL:
      return {
        ...state,
        airAmbulanceMasterDataLoading: false,
        airAmbulanceMasterDataSuccess: null,
        airAmbulanceMasterDataFail: action,
      };

    case appActions.AIR_AMBULANCE_MASTER_DATA.RESET:
      return {
        ...state,
        airAmbulanceMasterDataLoading: false,
        airAmbulanceMasterDataSuccess: null,
        airAmbulanceMasterDataFail: false,
      };

    case appActions.UPDATE_OFFLINE_LOGIN:
      return {
        ...state,
        isOfflineLoggedIn: action.payload,
      };

    case authActions.RESET_AUTH_REDUCER:
      return {
        ...initialState,
        isOfflineLoggedIn: state.isOfflineLoggedIn,
        isInternetConnected: state.isInternetConnected,
        osdNumber: state.osdNumber,
        supportNumber: state.supportNumber,
        supportEmail: state.supportEmail,
        emergencyServiceId: state.emergencyServiceId,
        versionValid: state.versionValid,
        isProfileUpdated: state.isProfileUpdated,

        isFirstStart: state.isFirstStart,

        getDeviceTypeLoading: state.getDeviceTypeLoading,
        getDeviceTypeFail: state.getDeviceTypeFail,
        getDeviceTypeSuccess: state.getDeviceTypeSuccess,

        getAllowedLanguagesLoading: state.getAllowedLanguagesLoading,
        getAllowedLanguagesFail: state.getAllowedLanguagesFail,
        getAllowedLanguagesSuccess: state.getAllowedLanguagesSuccess,

        configurationLoading: state.configurationLoading,
        configurationSuccess: state.configurationSuccess,
        configurationFail: state.configurationFail,
      };

    case appActions.ADD_REQUEST.START:
      return {
        ...state,
        addRequestLoading: true,
        addRequestFail: false,
      };
    case appActions.ADD_REQUEST.SUCCESS:
      return {
        ...state,
        addRequestLoading: false,
        addRequestSuccess: action.payload,
      };
    case appActions.ADD_REQUEST.FAIL:
      return {
        ...state,
        addRequestFail: action,
        addRequestLoading: false,
      };
    case appActions.ADD_REQUEST.RESET:
      return {
        ...state,
        addRequestLoading: false,
        addRequestSuccess: null,
        addRequestFail: false,
      };

    case appActions.REQUEST_DETAILS.START:
      return {
        ...state,
        requestDetailsLoading: true,
        requestDetailsFail: false,
        requestDetailsSuccess: null,
      };
    case appActions.REQUEST_DETAILS.SUCCESS:
      return {
        ...state,
        requestDetailsLoading: false,
        requestDetailsSuccess: action.payload,
      };
    case appActions.REQUEST_DETAILS.FAIL:
      return {
        ...state,
        requestDetailsFail: !state.requestDetailsFail,
        requestDetailsLoading: false,
      };
    case appActions.REQUEST_LISTING.START:
      return {
        ...state,
        requestListingLoading: true,
        requestListingFail: false,
      };
    case appActions.REQUEST_LISTING.SUCCESS:
      return {
        ...state,
        requestListingLoading: false,
        requestListingSuccess: action.payload,
      };
    case appActions.REQUEST_LISTING.FAIL:
      return {
        ...state,
        requestListingFail: action,
        requestListingLoading: false,
      };
    case appActions.REQUEST_LISTING.RESET:
      return {
        ...state,
        requestListingLoading: false,
        requestListingSuccess: null,
        requestListingFail: false,
      };

    case appActions.DEVICE_TIME_INCORRECT:
      return {
        ...state,
        deviceTimeIncorrect:
          action && action.payload && action.payload.isIncorrectTime,
      };

    case appActions.REQUEST_CANCEL.START:
      return {
        ...state,
        requestCancelLoading: true,
        requestCancelFail: false,
      };
    case appActions.REQUEST_CANCEL.SUCCESS:
      return {
        ...state,
        requestCancelLoading: false,
        requestCancelSuccess: action.payload,
      };
    case appActions.REQUEST_CANCEL.FAIL:
      return {
        ...state,
        requestCancelFail: action,
        requestCancelLoading: false,
      };
    case appActions.REQUEST_CANCEL.RESET:
      return {
        ...state,
        requestCancelLoading: false,
        requestCancelSuccess: null,
        requestCancelFail: false,
      };

    case appActions.CREATE_EVENT_REQUEST.START:
      return {
        ...state,
        createEventRequestLoading: true,
        createEventRequestFail: false,
      };
    case appActions.CREATE_EVENT_REQUEST.SUCCESS:
      return {
        ...state,
        createEventRequestLoading: false,
        createEventRequestSuccess: action.payload,
      };
    case appActions.CREATE_EVENT_REQUEST.FAIL:
      return {
        ...state,
        createEventRequestFail: action,
        createEventRequestLoading: false,
      };
    case appActions.CREATE_EVENT_REQUEST.RESET:
      return {
        ...state,
        createEventRequestLoading: false,
        createEventRequestSuccess: null,
        createEventRequestFail: false,
      };

    case appActions.CANCEL_REASON.START:
      return {
        ...state,
        cancelReasonLoading: true,
        cancelReasonFail: false,
      };
    case appActions.CANCEL_REASON.SUCCESS:
      return {
        ...state,
        cancelReasonLoading: false,
        cancelReasonSuccess: action.payload,
      };
    case appActions.CANCEL_REASON.FAIL:
      return {
        ...state,
        cancelReasonFail: action,
        cancelReasonLoading: false,
      };
    case appActions.CANCEL_REASON.RESET:
      return {
        ...state,
        cancelReasonLoading: false,
        cancelReasonSuccess: null,
        cancelReasonFail: false,
      };

    case appActions.EDIT_PROFILE.START:
      return {
        ...state,
        editProfileLoading: true,
        editProfileFail: false,
      };
    case appActions.EDIT_PROFILE.SUCCESS:
      return {
        ...state,
        editProfileLoading: false,
        editProfileSuccess: action.payload,
      };
    case appActions.EDIT_PROFILE.FAIL:
      return {
        ...state,
        editProfileFail: action,
        editProfileLoading: false,
      };
    case appActions.ALL_ADDONS.START:
      return {
        ...state,
        allAddonsLoading: true,
        allAddonsSuccess: null,
        allAddonsFail: false,
      };
    case appActions.ALL_ADDONS.SUCCESS:
      return {
        ...state,
        allAddonsLoading: false,
        allAddonsSuccess: action.payload,
      };
    case appActions.ALL_ADDONS.FAIL:
      return {
        ...state,
        allAddonsFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
        allAddonsLoading: false,
      };
    case appActions.GET_CITIZEN_TRIPS.START:
      return {
        ...state,
        requestCitizenTripsLoading: true,
        requestCitizenTripsFail: false,
      };
    case appActions.GET_CITIZEN_TRIPS.SUCCESS:
      return {
        ...state,
        requestCitizenTripsLoading: false,
        requestCitizenTripsSuccess: action.payload,
      };
    case appActions.GET_CITIZEN_TRIPS.FAIL:
      return {
        ...state,
        requestCitizenTripsFail: action,
        requestCitizenTripsLoading: false,
      };
    case appActions.GET_CITIZEN_TRIPS.RESET:
      return {
        ...state,
        requestCitizenTripsFail: false,
        requestCitizenTripsLoading: false,
        requestCitizenTripsSuccess: null,
      };
    // get payments
    case appActions.GET_PAYMENT_DETAILS.START:
      return {
        ...state,
        requestPaymentDetailsLoading: true,
        requestPaymentDetailsFail: false,
      };
    case appActions.GET_PAYMENT_DETAILS.SUCCESS:
      return {
        ...state,
        requestPaymentDetailsLoading: false,
        requestPaymentDetailsSuccess: action.payload,
      };
    case appActions.GET_PAYMENT_DETAILS.FAIL:
      return {
        ...state,
        requestPaymentDetailsFail: action,
        requestPaymentDetailsLoading: false,
      };

    //createpayment
    case appActions.CREATE_TRANSACTION.START:
      console.log('start', action?.payload);
      return {
        ...state,
        requestCreateTransactionLoading: true,
        requestCreateTransactionFail: false,
      };
    case appActions.CREATE_TRANSACTION.SUCCESS:
      console.log('success', action?.payload);
      return {
        ...state,
        requestCreateTransactionLoading: false,
        requestCreateTransactionSuccess: action.payload,
      };
    case appActions.CREATE_TRANSACTION.FAIL:
      console.log('fail', action?.payload);
      return {
        ...state,
        requestCreateTransactionFail: action,
        requestCreateTransactionLoading: false,
      };
    case appActions.CREATE_TRANSACTION.RESET:
      return {
        ...state,
        requestCreateTransactionLoading: false,
        requestCreateTransactionSuccess: null,
        requestCreateTransactionFail: false,
      };

    //trnsaction detail

    case appActions.GET_TRANSACTION_DETAILS.START:
      return {
        ...state,
        requestTransactionDetailLoading: true,
        requestTransactionDetailFail: false,
      };
    case appActions.GET_TRANSACTION_DETAILS.SUCCESS:
      return {
        ...state,
        requestTransactionDetailLoading: false,
        requestTransactionDetailSuccess: action.payload,
      };
    case appActions.GET_TRANSACTION_DETAILS.FAIL:
      return {
        ...state,
        requestTransactionDetailFail: action,
        requestTransactionDetailLoading: false,
      };

    case appActions.GET_TRANSACTION_DETAILS.RESET:
      return {
        ...state,
        requestTransactionDetailLoading: false,
        requestTransactionDetailSuccess: null,
        requestTransactionDetailFail: false,
      };

    case appActions.MY_REQUEST_DETAILS.START:
      return {
        ...state,
        myRequestDetailsLoading: true,
        myRequestDetailsFail: false,
      };
    case appActions.MY_REQUEST_DETAILS.SUCCESS:
      return {
        ...state,
        myRequestDetailsLoading: false,
        myRequestDetailsSuccess: action.payload,
      };
    case appActions.MY_REQUEST_DETAILS.FAIL:
      return {
        ...state,
        myRequestDetailsFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
        myRequestDetailsLoading: false,
      };
    case appActions.MY_REQUEST_DETAILS.RESET:
      return {
        ...state,
        myRequestDetailsLoading: false,
        myRequestDetailsSuccess: null,
        myRequestDetailsFail: false,
      };

    case appActions.UPDATE_USER_PROFILE.START:
      return {
        ...state,
        updateUserProfileLoading: true,
        updateUserProfileFail: false,
      };
    case appActions.UPDATE_USER_PROFILE.SUCCESS:
      return {
        ...state,
        updateUserProfileLoading: false,
        updateUserProfileSuccess: action.payload,
      };
    case appActions.UPDATE_USER_PROFILE.FAIL:
      return {
        ...state,
        updateUserProfileFail: action,
        updateUserProfileLoading: false,
      };
    case appActions.UPDATE_USER_PROFILE.RESET:
      return {
        ...state,
        updateUserProfileLoading: false,
        updateUserProfileSuccess: null,
        updateUserProfileFail: false,
      };

    case appActions.GET_MEDICAL_CONDITION.START:
      return {
        ...state,
        getMedicalConditionLoading: true,
        getMedicalConditionFail: false,
        getMedicalConditionSuccess: null,
      };
    case appActions.GET_MEDICAL_CONDITION.SUCCESS:
      return {
        ...state,
        getMedicalConditionLoading: false,
        getMedicalConditionSuccess: action.payload,
        getMedicalConditionFail: false,
      };
    case appActions.GET_MEDICAL_CONDITION.FAIL:
      return {
        ...state,
        getMedicalConditionFail: true,
        getMedicalConditionLoading: false,
        getMedicalConditionSuccess: null,
      };

    case appActions.GET_TYPE_OF_DOCTORS.START:
      return {
        ...state,
        getTypeOfDoctorsLoading: true,
        getTypeOfDoctorsFail: false,
        getTypeOfDoctorsSuccess: null,
      };
    case appActions.GET_TYPE_OF_DOCTORS.SUCCESS:
      return {
        ...state,
        getTypeOfDoctorsLoading: false,
        getTypeOfDoctorsSuccess: action.payload,
        getTypeOfDoctorsFail: false,
      };
    case appActions.GET_TYPE_OF_DOCTORS.FAIL:
      return {
        ...state,
        getTypeOfDoctorsFail: true,
        getTypeOfDoctorsLoading: false,
        getTypeOfDoctorsSuccess: null,
      };

    case appActions.GET_DASHBOARD_VEHICALS.START:
      return {
        ...state,
        getDashboardVehicalsLoading: true,
        getDashboardVehicalsFail: false,
        getDashboardVehicalsSuccess: null,
      };
    case appActions.GET_DASHBOARD_VEHICALS.SUCCESS:
      return {
        ...state,
        getDashboardVehicalsLoading: false,
        getDashboardVehicalsSuccess: action.payload,
        getDashboardVehicalsFail: false,
      };
    case appActions.GET_DASHBOARD_VEHICALS.FAIL:
      return {
        ...state,
        getDashboardVehicalsFail: true,
        getDashboardVehicalsLoading: false,
        getDashboardVehicalsSuccess: null,
      };

    case appActions.UPDATE_MEDICAL_CONDITION.START:
      return {
        ...state,
        updateMedicalCondionLoading: true,
        updateMedicalCondionFail: false,
      };
    case appActions.UPDATE_MEDICAL_CONDITION.SUCCESS:
      return {
        ...state,
        updateMedicalCondionLoading: false,
        updateMedicalCondionSuccess: action.payload,
      };
    case appActions.UPDATE_MEDICAL_CONDITION.FAIL:
      return {
        ...state,
        updateMedicalCondionFail: action,
        updateMedicalCondionLoading: false,
      };
    case appActions.UPDATE_MEDICAL_CONDITION.RESET:
      return {
        ...state,
        updateMedicalCondionLoading: false,
        updateMedicalCondionSuccess: null,
        updateMedicalCondionFail: false,
      };

    case appActions.VALIDATE_COUPON.START:
      return {
        ...state,
        validateCouponLoading: true,
        validateCouponFail: false,
      };
    case appActions.VALIDATE_COUPON.SUCCESS:
      return {
        ...state,
        validateCouponLoading: false,
        validateCouponSuccess: action.payload,
      };
    case appActions.VALIDATE_COUPON.FAIL:
      return {
        ...state,
        validateCouponFail: action,
        validateCouponLoading: false,
      };
    case appActions.VALIDATE_COUPON.RESET:
      return {
        ...state,
        validateCouponLoading: false,
        validateCouponSuccess: null,
        validateCouponFail: false,
      };

    case appActions.GET_USER_MEDICAL.START:
      return {
        ...state,
        getUserMedicalLoading: true,
        getUserMedicalFail: false,
        getUserMedicalSuccess: null,
      };
    case appActions.GET_USER_MEDICAL.SUCCESS:
      return {
        ...state,
        getUserMedicalLoading: false,
        getUserMedicalSuccess: action.payload,
        getUserMedicalFail: false,
      };
    case appActions.GET_USER_MEDICAL.FAIL:
      return {
        ...state,
        getUserMedicalFail: true,
        getUserMedicalLoading: false,
        getUserMedicalSuccess: null,
      };
    case appActions.ADD_MEMBERS.START:
      return {
        ...state,
        addMembersLoading: true,
        addMembersFail: false,
      };
    case appActions.ADD_MEMBERS.SUCCESS:
      return {
        ...state,
        addMembersLoading: false,
        addMembersSuccess: action.payload,
      };
    case appActions.ADD_MEMBERS.FAIL:
      return {
        ...state,
        addMembersFail: action,
        addMembersLoading: false,
      };
    case appActions.ADD_MEMBERS.RESET:
      return {
        ...state,
        addMembersLoading: false,
        addMembersSuccess: null,
        addMembersFail: false,
      };

    case appActions.GET_MEMBERS.START:
      return {
        ...state,
        getMembersLoading: true,
        getMembersFail: false,
        getMembersSuccess: null,
      };
    case appActions.GET_MEMBERS.SUCCESS:
      return {
        ...state,
        getMembersLoading: false,
        getMembersSuccess: action.payload,
        getMembersFail: false,
      };
    case appActions.GET_MEMBERS.FAIL:
      return {
        ...state,
        getMembersFail: true,
        getMembersLoading: false,
        getMembersSuccess: null,
      };
    case appActions.IS_PROFILE_UPDATED:
      return {...state, isProfileUpdated: action.payload};

    case appActions.IS_FIRST_START:
      return {...state, isFirstStart: action.payload};

    case appActions.GET_PICKLIST.START:
      return {
        ...state,
        getPicklistLoading: true,
        getPicklistSuccess: null,
        getPicklistFail: false,
      };
    case appActions.GET_PICKLIST.SUCCESS:
      return {
        ...state,
        getPicklistLoading: false,
        getPicklistSuccess: action.payload,
      };
    case appActions.GET_PICKLIST.FAIL:
      return {
        ...state,
        getPicklistFail: action,
        getPicklistLoading: false,
      };
    case appActions.SET_EVENT_STATUS:
      return {
        ...state,
        eventStatus: action.payload,
      };
    case appActions.GET_EVENT_DETAILS_LISTING.START:
      return {
        ...state,
        getEventDetailsListingLoading: true,
        getEventDetailsListingSuccess: null,
        getEventDetailsListingFail: false,
      };
    case appActions.GET_EVENT_DETAILS_LISTING.SUCCESS:
      return {
        ...state,
        getEventDetailsListingLoading: false,
        getEventDetailsListingSuccess: action.payload,
      };
    case appActions.GET_EVENT_DETAILS_LISTING.FAIL:
      return {
        ...state,
        getEventDetailsListingFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
        getEventDetailsListingLoading: false,
      };
    case appActions.EVENT_DETAILS_LIST.START:
      return {
        ...state,
        eventDetailsLoading: true,
        eventDetailsFail: false,
      };
    case appActions.EVENT_DETAILS_LIST.SUCCESS:
      return {
        ...state,
        eventDetailsLoading: false,
        eventDetailsSuccess: action.payload,
      };
    case appActions.EVENT_DETAILS_LIST.FAIL:
      return {
        ...state,
        eventDetailsFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
        eventDetailsLoading: false,
      };
    case appActions.EVENT_DETAILS_LIST.RESET:
      return {
        ...state,
        eventDetailsLoading: false,
        eventDetailsSuccess: null,
        eventDetailsFail: null,
      };
    case appActions.SR_CREATION.START:
      return {
        ...state,
        srCreationLoading: true,
        srCreationSuccess: null,
        srCreationFail: false,
      };
    case appActions.SR_CREATION.SUCCESS:
      return {
        ...state,
        srCreationLoading: false,
        srCreationSuccess: action.payload,
      };
    case appActions.SR_CREATION.FAIL:
      return {
        ...state,
        srCreationFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
        srCreationLoading: false,
      };
    case appActions.SR_CREATION.RESET:
      return {
        ...state,
        srCreationLoading: false,
        srCreationSuccess: null,
        srCreationFail: null,
      };

    case appActions.GLOBAL_CONFIGURATION.START:
      return {
        ...state,
        globalConfigurationLoading: true,
        globalConfigurationSuccess: null,
        globalConfigurationFail: false,
      };
    case appActions.GLOBAL_CONFIGURATION.SUCCESS:
      return {
        ...state,
        globalConfigurationLoading: false,
        globalConfigurationSuccess: action.payload,
      };
    case appActions.GLOBAL_CONFIGURATION.FAIL:
      return {
        ...state,
        globalConfigurationFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
        globalConfigurationLoading: false,
      };

    case appActions.RESOLUTION_REASON.START:
      console.log('start');
      return {
        ...state,
        resolutionReasonLoading: true,
        resolutionReasonSuccess: null,
        resolutionReasonFail: false,
      };
    case appActions.RESOLUTION_REASON.SUCCESS:
      return {
        ...state,
        resolutionReasonLoading: false,
        resolutionReasonSuccess: action.payload,
      };
    case appActions.RESOLUTION_REASON.FAIL:
      return {
        ...state,
        resolutionReasonFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
        resolutionReasonLoading: false,
      };
    case appActions.END_TRIP.START:
      return {
        ...state,
        endTripLoading: true,
        endTripSuccess: null,
        endTripFail: false,
      };
    case appActions.END_TRIP.SUCCESS:
      return {
        ...state,
        endTripLoading: false,
        endTripSuccess: action.payload,
      };
    case appActions.END_TRIP.FAIL:
      return {
        ...state,
        endTripLoading: false,
        endTripFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
      };
    case appActions.END_TRIP.RESET:
      return {
        ...state,
        endTripLoading: false,
        endTripSuccess: null,
        endTripFail: false,
      };
    case appActions.RESOLUTION_STATUS.START:
      return {
        ...state,
        resolutionStatusLoading: true,
        resolutionStatusSuccess: null,
        resolutionStatusFail: false,
      };
    case appActions.RESOLUTION_STATUS.SUCCESS:
      return {
        ...state,
        resolutionStatusLoading: false,
        resolutionStatusSuccess: action.payload,
      };
    case appActions.RESOLUTION_STATUS.FAIL:
      return {
        ...state,
        resolutionStatusFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
        resolutionStatusLoading: false,
      };

    case appActions.UPDATE_FAMILY_MEMBER.START:
      return {
        ...state,
        updateFamilyMemberLoading: true,
        updateFamilyMemberFail: false,
      };
    case appActions.UPDATE_FAMILY_MEMBER.SUCCESS:
      return {
        ...state,
        updateFamilyMemberLoading: false,
        updateFamilyMemberSuccess: action.payload,
      };
    case appActions.UPDATE_FAMILY_MEMBER.FAIL:
      return {
        ...state,
        updateFamilyMemberFail: action,
        updateFamilyMemberLoading: false,
      };
    case appActions.UPDATE_FAMILY_MEMBER.RESET:
      return {
        ...state,
        updateFamilyMemberLoading: false,
        updateFamilyMemberSuccess: null,
        updateFamilyMemberFail: false,
      };

    case appActions.GET_MEMBERS.RESET:
      return {
        ...state,
        getMembersLoading: false,
        getMembersSuccess: null,
        getMembersFail: null,
      };

    case appActions.GET_COSTS.START:
      return {
        ...state,
        getCostLoading: true,
        getCostSuccess: null,
        getCostFail: false,
      };
    case appActions.GET_COSTS.SUCCESS:
      return {
        ...state,
        getCostLoading: false,
        getCostSuccess: action.payload,
      };
    case appActions.GET_COSTS.FAIL:
      return {
        ...state,
        getCostFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
        getCostLoading: false,
      };

    case appActions.NEARBY_HOSPITAL.START:
      return {
        ...state,
        nearbyHospitalLoading: true,
        nearbyHospitalSuccess: null,
        nearbyHospitalFail: false,
      };
    case appActions.NEARBY_HOSPITAL.SUCCESS:
      return {
        ...state,
        nearbyHospitalLoading: false,
        nearbyHospitalSuccess: action.payload,
        nearbyHospitalFail: false,
      };
    case appActions.NEARBY_HOSPITAL.FAIL:
      return {
        ...state,
        nearbyHospitalLoading: false,
        nearbyHospitalSuccess: null,
        nearbyHospitalFail: action,
      };
    case appActions.PROJECT_CONFIG.START:
      return {
        ...state,
        projectConfigLoading: true,
        projectConfigSuccess: null,
        projectConfigFail: false,
      };
    case appActions.PROJECT_CONFIG.SUCCESS:
      return {
        ...state,
        projectConfigLoading: false,
        projectConfigSuccess: action.payload,
        projectConfigFail: false,
      };
    case appActions.PROJECT_CONFIG.FAIL:
      return {
        ...state,
        projectConfigLoading: false,
        projectConfigSuccess: null,
        projectConfigFail: true,
      };
    case appActions.FAQ.START:
      return {
        ...state,
        faqLoading: true,
        faqFail: false,
      };

    case appActions.FAQ.SUCCESS:
      return {
        ...state,
        faqLoading: false,
        faqSuccess: action.payload,
      };
    case appActions.FAQ.FAIL:
      return {
        ...state,
        faqFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
        faqLoading: false,
      };
    case appActions.GET_DOCUMENT.START:
      return {
        ...state,
        documnentLoading: true,
        documentFail: false,
      };

    case appActions.GET_DOCUMENT.SUCCESS:
      return {
        ...state,
        documnentLoading: false,
        documentSuccess: action.payload,
      };
    case appActions.GET_DOCUMENT.FAIL:
      return {
        ...state,
        documentFail:
          action &&
          action.errors &&
          action.errors.response &&
          action.errors.response.data,
        documnentLoading: false,
      };
    case appActions.UPDATE_INITIAL_LOCATION:
      return {
        ...state,
        initialLocation: action.payload,
      };

    case appActions.ANIMAL_CATEGORY.START:
      return {
        ...state,
        animalCategorySuccess: null,
        animalCategoryLoading: true,
        animalCategoryFail: false,
      };
    case appActions.ANIMAL_CATEGORY.SUCCESS:
      return {
        ...state,
        animalCategorySuccess: action.payload,
        animalCategoryLoading: false,
        animalCategoryFail: false,
      };
    case appActions.ANIMAL_CATEGORY.FAIL:
      return {
        ...state,
        animalCategorySuccess: null,
        animalCategoryLoading: false,
        animalCategoryFail: true,
      };
    case appActions.ANIMAL_BREED.START:
      return {
        ...state,
        animalBreedSuccess: null,
        animalBreedLoading: true,
        animalBreedFail: false,
      };
    case appActions.ANIMAL_BREED.SUCCESS:
      return {
        ...state,
        animalBreedSuccess: action.payload,
        animalBreedLoading: false,
        animalBreedFail: false,
      };
    case appActions.ANIMAL_BREED.FAIL:
      return {
        ...state,
        animalBreedSuccess: null,
        animalBreedLoading: false,
        animalBreedFail: true,
      };
    default:
      return state;
  }
};

const blackList = _.without(
  Object.keys(initialState),
  // Persist all the keys listed below
  'getProfileSuccess',
  'globalConfigurationSuccess',
  'isOfflineLoggedIn',
  'isInternetConnected',
  'osdNumber',
  'supportNumber',
  'supportEmail',
  'userName',
  'userMobile',
  'userId',

  'emergencyServiceId',
  // "versionValid",
  'getDeviceTypeLoading',
  'getDeviceTypeFail',
  'getDeviceTypeSuccess',
  'getAllowedLanguagesLoading',
  'getAllowedLanguagesFail',
  'getAllowedLanguagesSuccess',
  'configurationLoading',
  'configurationSuccess',
  'configurationFail',
  'isProfileUpdated',
  'isFirstStart',
);

export default persistWraper(AppReducer, blackList, 'App');
