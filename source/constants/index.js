export const navigations = {
  HomeScreen: 'HomeScreen',
  MyJobs: 'MyJobs',
  QRScanner: 'QRScanner',
  TakeOver: 'TakeOver',
  AuthenticatedRoutes: 'AuthenticatedRoutes',
  TestingScreen: 'TestingScreen',
  HandOver: 'HandOver',
  FullscreenImage: 'FullscreenImage',
  SignupScreen: 'SignupScreen',
  SignupProfile: 'SignupProfile',
  LoginScreen: 'LoginScreen',
  ForgotPassword: 'ForgotPassword',
  FeedbackScreen: 'FeedbackScreen ',
  PasswordSent: 'PasswordSent',
  ChangePassword: 'ChangePassword',
  JobDetails: 'JobDetails',
  Jobs: 'Jobs',
  Tickets: 'Tickets',
  NearByHospital: 'NearByHospital',
  ConfigurationScreen: 'Configuration',
  UploadForm: 'UploadForm',
  RaiseTicket: 'RaiseTicket',
  Profile: 'Profile',
  AdditionalDetails: 'AdditionalDetails',
  CloseTicket: 'CloseTicket',
  CloseJob: 'CloseJob',
  AddPatient: 'AddPatient',
  EmergencyLocation: 'EmergencyLocation',
  DropLocation: 'DropLocation',
  MedicalService: 'MedicalService',
  AddMedicine: 'AddMedicine',
  SyncedItems: 'SyncedItems',
  Settings: 'Settings',
  ChangeLanguage: 'Change Langauge',
  SplashScreen: 'SplashScreen',
  Notifications: 'Notifications',
  OfflineLoginScreen: 'OfflineLoginScreen',
  OfflineQRScreen: 'OfflineQRScreen',
  Inventory: 'Inventory',
  Attendance: 'Attendance',
  otpScreen: 'OTP',
  resetPass: 'ResetPass',
  TermsAndConditions: 'TermsAndConditions',
  NearBy: 'NearBy',
  Requests: 'Requests',
  AddRequest: 'AddRequest',
  RequestDetails: 'RequestDetails',
  LiveTracking: 'LiveTracking',
  GroundAmbulance: 'GroundAmbulance',
  ProfileDetailScreen: 'ProfileDetailScreen',
  SecondComponent: 'SecondComponent',
  ThirdComponent: 'ThirdComponent',
  AddMembers: 'AddMembers',
  ProfileDetails: 'ProfileDetails',
  Second: 'Second',
  Third: 'Third',
  Home: 'Home',
  Members: 'Members',
  MyRequest: 'MyRequest',
  GroundAmbulance: 'GroundAmbulance',
  MyrequestDetails: 'MyrequestDetails',
  MyProfile: 'MyProfile',
  Events: 'Events',
  EventDetailsScreen: 'EventDetailsScreen',
  FAQ: 'FAQ',
  GetStarted: 'GetStarted',
  ChatScreen: 'ChatScreen',
  EventRequest: 'EventRequest',
  TripReplay: 'TripReplay',
};

export const DELTAS = {
  LATTITUDE: 0.09,
  LONGITUDE: 0.04,
};

export const faqCategories = {
  ALL: 'ALL',
  GROUND_AMBULANCE: 'GROUND_AMBULANCE',
  AIR_AMBULANCE: 'AIR_AMBULANCE',
  TRAIN_AMBULANCE: 'TRAIN_AMBULANCE',
};

export const tripStatus = {
  BACK_TO_BASE: 'Parking In',
  DISPATCH: 'Dispatched',
  JOB_START: 'Parking Out',
  ON_BOARD: 'Emergency Location Out',
  ON_SCENE: 'Emergency Location In',
  PATIENT_DROPPED: 'Drop Location Out',
  REACHED_DROP_LOCATION: 'Drop Location In',
  UNAUTHORIZED_MOVEMENT: 'Unauthorized Movement',
  closetrip: 'Close Trip',
  tripClose: 'Trip Closed',
  BACK_TO_BASE_SAME: 'TRIP_COMPLETE',
  DISPATCH_SAME: 'DISPATCH',
  JOB_START_SAME: 'JOB_START',
  ON_BOARD_SAME: 'ON_BOARD',
  ON_SCENE_SAME: 'ON_SCENE',
  PATIENT_DROPPED_SAME: 'PATIENT_DROPPED',
  REACHED_DROP_LOCATION_SAME: 'REACHED_DROP_LOCATION',
  UNAUTHORIZED_MOVEMENT_SAME: 'UNAUTHORIZED_MOVEMENT',
  TRIP_CLOSED_SAME: 'TRIP_CLOSED',
  TRIP_COMPLETE: 'Parking In',
};

export const roles = {
  driver: 'MOBILE_APP_DRIVER',
  emt: 'MOBILE_APP_EMT',
};

export const USERS = {
  driver: 'Pilot',
  emt: 'EMT',
  helper: 'Helper',
};

export const ROLEIDS = {
  driver: 3,
  emt: 6,
  helper: 8,
};

export const jobStatus = {
  close: 'CLOSE',
  open: 'OPEN',
  modifiedAt: 'modifiedAt',
  createdAt: 'createdAt',
};

export const formCategory = {
  driver: 'JOB_DRIVER',
  emt: 'JOB_EMT',
};

export const baseUrlType = {
  eds: 'eds',
  vts: 'vts',
  edsPut: 'edsPut',
};

export const regex = {
  consecutive_space: /\s\s/,
  digits: /\d/,
  medConsumption: /^[0-9]{1,2}$/,
  nonWordSpaceHyphenRegex : /[^\w\s-]/g,
  spaceHyphenRegex : /[\s_-]+/g,
  leadingTrailingHyphenRegex : /^-+|-+$/g,
};

export const loginType = 'MOBILE';

export const toastDuration = 7000;
export const toastLONG = 'Toast.LONG';

export const notificationSubtypeEnum = {
  EXPIRING: 'EXPIRING',
  EQUIPMENT: 'EQUIPMENT',
  ATTENDANCE: 'ATTENDANCE',
};

export const homePageTile = {
  ROAD_AMBULANCE: 'Road Ambulance',
  DOCTOR_AT_HOME: 'Doctor at Home',
  AIR_AMBULANCE: 'Air Ambulance',
  AMBULANCE_FOR_EVENT: 'Ambulance for Event',
  NEAR_BY_BLOOD_BANK: 'Nearby Bloodbank',
  NEAR_BY_HOSPITAL: 'Nearby Hospital',
  EVENTS: 'Events',
};
export const eventListingTabs = {
  ONGOING: 'OPEN',
  COMPLETE: 'CLOSE',
  SCHEDULED: 'SCHEDULED',
  DISPATCHED: 'DISPATCHED',
  CANCELLED: 'CANCELLED',
  ACCEPTED: 'ACCEPTED',
};

export const secounds = 1000;

export const tripDetails = {
  addOns: 'ADDONS',
  tripBase: 'TRIP_BASE',
  extra: 'EXTRA',
  cancellation: 'CANCELLATION',
  corporate: 'CORPORATE',
};
export const eventStatus = {
  OPEN: 'OPEN',
  SCHEDULED: 'SCHEDULED',
  DISPATCED: 'DISPATCED',
  ACCEPTED: 'ACCEPTED',
  CLOSE: 'CLOSE',
};

export const milestoneStatus = {
  DISPATCH: 'DISPATCH',
  ON_SCENE: 'ON_SCENE',
  JOB_START: 'JOB_START',
  TRIP_COMPLETE: 'TRIP_COMPLETE',
};

export const notifications = {
  AMBULANCE_ARRIVED: 'has arrived at your place for patient onboarding.',
  TRIP_COMPLETED:
    'has completed the emergency service. Hoping Fast Recovery of the Patient',
  SR_CANCEL: 'Regret to inform that we are not able to serve your request',
  ERV_DISPATCHED: 'and will reach asap',
};

export const liveTracking = {
  PICKUP_REACHED: 6,
  LIVE_PACKET: 2,
  PATIENT_DROPPED: 9,
};
