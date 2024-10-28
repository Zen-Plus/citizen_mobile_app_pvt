export default {
  SET_IS_FIRST_LAUNCH: 'app.set_is_first_launch',

  CONFIGURATION: {
    START: 'app.configuration:start',
    SUCCESS: 'app.configuration:success',
    FAIL: 'app.configuration:fail',
  },

  VERSION_VALID: 'app.version_valid',

  GET_PROFILE: {
    START: 'app.get_profile:start',
    SUCCESS: 'app.get_profile:success',
    FAIL: 'app.get_profile:fail',
  },
  GET_USER_DATA: {
    START: 'app.get_user_data:start',
    SUCCESS: 'app.get_user_data:success',
    FAIL: 'app.get_user_data:fail',
  },

  UPDATE_PROFILE: {
    START: 'app.update_profile:start',
    SUCCESS: 'app.update_profile:success',
    FAIL: 'app.update_profile:fail',
  },

  GET_ALLOWED_LANGUAGES: {
    START: 'app.get_allowed_languages:start',
    SUCCESS: 'app.get_allowed_languages:success',
    FAIL: 'app.get_allowed_languages:fail',
  },

  /**
   * Used to get type of device - personal or shared
   */
  GET_DEVICE_TYPE: {
    START: 'app.get_device_type:start',
    SUCCESS: 'app.get_device_type:success',
    FAIL: 'app.get_device_type:fail',
  },

  /**
   * Set pending count
   */
  SET_PENDING_COUNT: 'app.set_pending_count',

  GET_NOTIFICATIONS_COUNT: {
    START: 'app.get_notifications_count:start',
    SUCCESS: 'app.get_notifications_count:success',
    FAIL: 'app.get_notifications_count:fail',
  },

  GET_NOTIFICATIONS: {
    START: 'app.get_notifications:start',
    SUCCESS: 'app.get_notifications:success',
    FAIL: 'app.get_notifications:fail',
    RESET: 'app.get_notifications:reset',
  },

  READ_NOTIFICATIONS: {
    START: 'app.read_notifications:start',
    SUCCESS: 'app.read_notifications:success',
    FAIL: 'app.read_notifications:fail',
  },

  GET_CUSTOM_NOTIFICATIONS: {
    START: 'app.get_custom_notifications:start',
    SUCCESS: 'app.get_custom_notifications:success',
    FAIL: 'app.get_custom_notifications:fail',
    RESET: 'app.get_custom_notifications:reset',
  },

  READ_CUSTOM_NOTIFICATIONS: {
    START: 'app.read_custom_notifications:start',
    SUCCESS: 'app.read_custom_notifications:success',
    FAIL: 'app.read_custom_notifications:fail',
  },

  ADD_REQUEST: {
    START: 'app.add_request:start',
    SUCCESS: 'app.add_request:success',
    FAIL: 'app.add_request:fail',
    RESET: 'app.add_request:reset',
  },

  REQUEST_DETAILS: {
    START: 'app.request_details:start',
    SUCCESS: 'app.request_details:success',
    FAIL: 'app.request_details:fail',
  },

  REQUEST_LISTING: {
    START: 'app.request_listing:start',
    SUCCESS: 'app.request_listing:success',
    FAIL: 'app.request_listing:fail',
    RESET: 'app.request_listing:reset',
  },

  REQUEST_CANCEL: {
    START: 'app.requestCancel:start',
    SUCCESS: 'app.requestCancel:success',
    FAIL: 'app.requestCancel:fail',
    RESET: 'app.requestCancel:reset',
  },

  GET_CUSTOM_UPDATES_NOTIFICATIONS: {
    START: 'app.get_custom_updates_notifications:start',
    SUCCESS: 'app.get_custom_updates_notifications:success',
    FAIL: 'app.get_custom_updates_notifications:fail',
    RESET: 'app.get_custom_updates_notifications:reset',
  },

  RESET_REDUX_STATE: 'app.reset_redux_state',

  // action to set time zone status
  DEVICE_TIME_INCORRECT: 'app.device_time_incorrect',

  NEARBY_CATEGORY: {
    START: 'app.nearby_category:start',
    SUCCESS: 'app.nearby_category:success',
    FAIL: 'app.nearby_category:fail',
    RESET: 'app.nearby_category:reset',
  },

  AIR_AMBULANCE_MASTER_DATA: {
    START: 'app.air_ambulance_master_data:start',
    SUCCESS: 'app.air_ambulance_master_data:success',
    FAIL: 'app.air_ambulance_master_data:fail',
    RESET: 'app.air_ambulance_master_data:reset',
  },

  NEARBY_HOSPITAL: {
    START: 'app.nearby_hospital:start',
    SUCCESS: 'app.nearby_hospital:success',
    FAIL: 'app.nearby_hospital:fail',
    RESET: 'app.nearby_hospital:reset',
  },

  CANCEL_REASON: {
    START: 'app.cancel_reason:start',
    SUCCESS: 'app.cancel_reason:success',
    FAIL: 'app.cancel_reason:fail',
    RESET: 'app.cancel_reason:reset',
  },

  EDIT_PROFILE: {
    START: 'app.edit_profile:start',
    SUCCESS: 'app.edit_profile:success',
    FAIL: 'app.edit_profile:fail',
    RESET: 'app.edit_profile:reset',
  },
  UPDATE_USER_PROFILE: {
    START: 'app.update_user_profile:start',
    SUCCESS: 'app.update_user_profile:success',
    FAIL: 'app.update_user_profile:fail',
    RESET: 'app.update_user_profile:reset',
  },
  GET_MEDICAL_CONDITION: {
    START: 'app.get_medical_condition:start',
    SUCCESS: 'app.get_medical_condition:success',
    FAIL: 'app.get_medical_condition:fail',
    RESET: 'app.get_medical_condition:reset',
  },
  GET_TYPE_OF_DOCTORS: {
    START: 'app.get_type_of_doctors:start',
    SUCCESS: 'app.get_type_of_doctors:success',
    FAIL: 'app.get_type_of_doctors:fail',
    RESET: 'app.get_type_of_doctors:reset',
  },
  GET_DASHBOARD_VEHICALS: {
    START: 'app.get_dashboard_vehicals:start',
    SUCCESS: 'app.get_dashboard_vehicals:success',
    FAIL: 'app.get_dashboard_vehicals:fail',
    RESET: 'app.get_dashboard_vehicals:reset',
  },
  GET_USER_MEDICAL: {
    START: 'app.get_user_medical:start',
    SUCCESS: 'app.get_user_medical:success',
    FAIL: 'app.get_user_medical:fail',
    RESET: 'app.get_user_medical:reset',
  },
  UPDATE_MEDICAL_CONDITION: {
    START: 'app.update_medical_condition:start',
    SUCCESS: 'app.update_medical_condition:success',
    FAIL: 'app.update_medical_condition:fail',
    RESET: 'app.update_medical_condition:reset',
  },
  VALIDATE_COUPON: {
    START: 'app.validate_coupon:start',
    SUCCESS: 'app.validate_coupon:success',
    FAIL: 'app.validate_coupon:fail',
    RESET: 'app.validate_coupon:reset',
  },
  ADD_MEMBERS: {
    START: 'app.add_members:start',
    SUCCESS: 'app.add_members:success',
    FAIL: 'app.add_members:fail',
    RESET: 'app.add_members:reset',
  },
  IS_PROFILE_UPDATED: 'auth.is_profile_updated.reducer',

  IS_FIRST_START: 'auth.is_first_start',

  GET_CITIZEN_TRIPS: {
    START: 'app.citizen_trips:start',
    SUCCESS: 'app.citizen_trips:success',
    FAIL: 'app.citizen_trips:fail',
    RESET: 'app.citizen_trips.reset',
  },
  MY_REQUEST_DETAILS: {
    START: 'app.my_request_details:start',
    SUCCESS: 'app.my_request_details:success',
    FAIL: 'app.my_request_details:fail',
    RESET: 'app.my_request_details.reset',
  },

  // Payments

  GET_PAYMENT_DETAILS: {
    START: 'app.payments_details:start',
    SUCCESS: 'app.payments_details:success',
    FAIL: 'app.payments_details:fail',
  },

  CREATE_TRANSACTION: {
    START: 'app.create_transaction:start',
    SUCCESS: 'app.create_transaction:success',
    FAIL: 'app.create_transaction:fail',
    RESET: 'app.create_transaction:reset',
  },

  GET_TRANSACTION_DETAILS: {
    START: 'app.transaction_details:start',
    SUCCESS: 'app.transaction_details:success',
    FAIL: 'app.transaction_details:fail',
    RESET: 'app.transaction_details:reset',
  },

  GET_PICKLIST: {
    START: 'app.get_picklist:start',
    SUCCESS: 'app.get_picklist:success',
    FAIL: 'app.get_picklist:fail',
  },
  SR_CREATION: {
    START: 'app.sr_creation:start',
    SUCCESS: 'app.sr_creation:success',
    FAIL: 'app.sr_creation:fail',
    RESET: 'app.sr_creation:reset',
  },
  ALL_ADDONS: {
    START: 'app.all_addons:start',
    SUCCESS: 'app.all_addons:success',
    FAIL: 'app.all_addons:fail',
  },
  GLOBAL_CONFIGURATION: {
    START: 'app.global_configuration:start',
    SUCCESS: 'app.global_configuration:success',
    FAIL: 'app.global_configuration:fail',
  },
  SET_EVENT_STATUS: 'app.set_event_status',

  GET_EVENT_DETAILS_LISTING: {
    START: 'app.get_event_details_listing:start',
    SUCCESS: 'app.get_event_details_listing:success',
    FAIL: 'app.get_event_details_listing:fail',
  },
  EVENT_DETAILS_LIST: {
    START: 'app.event_details:start',
    SUCCESS: 'app.event_details:success',
    FAIL: 'app.event_details:fail',
    RESET: 'app.event_details:reset',
  },
  CREATE_EVENT_REQUEST: {
    START: 'app.create_event:start',
    SUCCESS: 'app.create_event:success',
    FAIL: 'app.create_event:fail',
    RESET: 'app.create_event:reset',
  },
  RESOLUTION_REASON: {
    START: 'app.resolution_reason:start',
    SUCCESS: 'app.resolution_reason:success',
    FAIL: 'app.resolution_reason:fail',
  },
  END_TRIP: {
    START: 'app.end_trip:start',
    SUCCESS: 'app.end_trip:success',
    FAIL: 'app.end_trip:fail',
    RESET: 'app.end_trip:reset',
  },

  RESOLUTION_STATUS: {
    START: 'app.resolution_status:start',
    SUCCESS: 'app.resolution_status:success',
    FAIL: 'app.resolution_status:fail',
  },
  UPDATE_FAMILY_MEMBER: {
    START: 'app.update_family_member:start',
    SUCCESS: 'app.update_family_member:success',
    FAIL: 'app.update_family_member:fail',
    RESET: 'app.update_family_member:reset',
  },
  GET_MEMBERS: {
    START: 'app.get_members:start',
    SUCCESS: 'app.get_members:success',
    FAIL: 'app.get_members:fail',
    RESET: 'app.get_members:reset',
  },
  GET_COSTS: {
    START: 'app.get_cost:start',
    SUCCESS: 'app.get_cost:success',
    FAIL: 'app.get_cost:fail',
  },

  PROJECT_CONFIG: {
    START: 'app.project_config:start',
    SUCCESS: 'app.project_config:success',
    FAIL: 'app.project_config:fail',
  },
  FAQ: {
    START: 'app.faq:start',
    SUCCESS: 'app.faq:success',
    FAIL: 'app.faq:fail',
  },
  POST_CHAT_NOTIFICATION: {
    START: 'app.post_chat_notification:start',
    SUCCESS: 'app.post_chat_notification:success',
    FAIL: 'app.post_chat_notification:fail',
  },
  GET_DOCUMENT: {
    START: 'app.get_documnent:start',
    SUCCESS: 'app.get_documnent:success',
    FAIL: 'app.get_documnent:fail',
  },

  UPDATE_INITIAL_LOCATION: 'app.update_initial_location',

  ANIMAL_CATEGORY: {
    START: 'app.animal_category:start',
    SUCCESS: 'app.animal_category:success',
    FAIL: 'app.animal_category:fail',
  },
  ANIMAL_BREED: {
    START: 'app.animal_breed:start',
    SUCCESS: 'app.animal_breed:success',
    FAIL: 'app.animal_breed:fail',
  },
};
