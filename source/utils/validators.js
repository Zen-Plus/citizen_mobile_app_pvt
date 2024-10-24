const passwordRegex = new RegExp(
  '^(?=.{8,30})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).*$',
);
const numRegex = new RegExp(/^\d+$/);
const alphaNumRegex = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-_ ]*[a-zA-Z0-9]$/);
const alphaNumWithoutSpaceRegex = new RegExp('^[a-zA-Z0-9]*$');
const consecutiveSpaceRegex = new RegExp('^.*\\s{2}.*$');
const loginIdRegex = new RegExp(
  /^(?=.{6,30})(?!.*\.\.)([a-zA-Z0-9][a-zA-Z0-9.]*[a-zA-Z0-9])$/,
);
const allSameNumbers = new RegExp(/^(\d)\1*$/);
const mobileNoRegex = new RegExp(/^(?=.{10,13})\+?[0-9]*$/);
const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);
const userCodeRegex = new RegExp(
  /^(?=.{2,20})[a-zA-Z0-9][a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const contractIdRegex = new RegExp(/^(?=.{2,20})[a-zA-Z0-9]*$/);
const referenceIdRegex = new RegExp(/^(?=.{2,20})[a-zA-Z0-9]*$/);
const referenceSourceRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const nameRegex = new RegExp(/^(?=.{2,26})(?!.*\s\s)[a-zA-Z .]*[a-zA-Z.]$/);
const nameRegexWthoutSpecialCharacters = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[a-zA-Z ]*[a-zA-Z]$/,
);
const addressLineRegex = new RegExp(
  /^(?!.*\s\s)(?=.*[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]).*$/,
);
const zipCodeRegex = new RegExp(/^[1-9][0-9]{5}$/);
const latLongRegex = new RegExp(/^[+-]?\d+(\.\d{1,8})?$/);
const alphaRegex = new RegExp('/^[A-Za-z]+$/');
const stateCodeRegex = new RegExp(/^(?=.{2})[A-Z]*$/);
const gstCodeRegex = new RegExp('^(?=.{2})\\d+$');
const districtRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/,
);
const tehsilRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/,
);
const hospitalNameRegex = new RegExp(/^(?=.{2})(?!.*\s\s)[^\s].*[^\s]$/);
const venderCodeRegex = new RegExp(/^[a-zA-Z0-9]*$/);
const vendorNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[A-Z][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const eventNameRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const contactDirectoryNameRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const validateLandlineNumberRegex = new RegExp(/^(?=.{11})\+?[0-9]*$/);
const officeNameRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const shiftNameRegex = new RegExp(/([A-Za-z]{1}[0-9]{2})$/);
const officeCodeRegex = new RegExp(
  /^(?=.{2,20})[a-zA-Z0-9][a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const hospitalMobileNoRegex = new RegExp(/^(?=.{7,13})\+?[0-9]*$/);
const primaryComplaintNameRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const serviceRequestSubSourceNameRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const contactNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\.\.)(?!.*\s\s)(?!.*\s\.)[A-Z][a-zA-Z\. ]*[a-zA-Z\.]$/,
);
const serviceCategoryNameRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const departmentNameRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const designationNameRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const escalationOfficerNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\.\.)(?!.*\s\s)(?!.*\s\.)[A-Z][a-zA-Z\. ]*[a-zA-Z\.]$/,
);
const telephoneNumberRegex = new RegExp(/^(?=.{7,13})\+?[0-9]*$/);
const parkingBayNameRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const alsBlsJsaRegex = new RegExp(/^(?=.{1,3})?[0-9]*$/);
const secondaryComplaintRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const serviceSubCategoryNameRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const resolutionNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[A-Z][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const callerNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[A-Z][a-zA-Z\. ]*[a-zA-Z\.]$/,
);
const identificationNumberRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const clientNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[A-Z][a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]$/,
);
const clientCodeRegex = new RegExp(
  /^(?=.{2,20})[a-zA-Z0-9][a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const websiteUrlRegex = new RegExp(
  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})*$/,
);
const alphaNumWithUnderScoreRegex = new RegExp(/^(?=.{2,20})[a-zA-Z0-9_]*$/);
const registrationNumberRegex = new RegExp(
  /^(?=.{8,13})(?!.*\s\s)[a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const engineNumberRegex = new RegExp(
  /^(?=.{7,18})(?!.*\s\s)[a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const chassisNumberRegex = new RegExp(
  /^(?=.{17,})(?!.*\s\s)[a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const rtoRegex = new RegExp(/^(?=.{2,26})(?!.*\s\s)[a-zA-Z0-9 ]*[a-zA-Z0-9]$/);
const vehicleContactNumberRegex = new RegExp(/^(?=.{7,13})\+?[0-9]*$/);
const projectNameRegex = new RegExp(
  /^(?=.{2})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const callCenterSeatCapacityRegex = new RegExp(/^[0-9][0-9]*$/);
const projectExtensionPeriodRegex = new RegExp(/^[0-9][0-9]*$/);
const rfpNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const ahtFieldsRegex = new RegExp(/^[0-9][0-9.%]*$/);
const divisionRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/,
);
const insurancePolicyNumberRegex = new RegExp(
  /^(?=.{5,25})(?!.*\s\s)[a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const invoiceNumberRegex = new RegExp(
  /^(?=.{2,20})(?!.*\s\s)[a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const premiumTaxesNumberRegex = new RegExp(/^[+]?\d{1,12}(\.\d{1,2})?$/);
const gstInNumberRegex = new RegExp(
  /^(?=.{15,})(?!.*\s\s)[a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const manufacturerNameRegex = new RegExp(
  /^(?=.{2,100})(?!.*\s\s)[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]$/,
);
const equipmentSerialNumberRegex = new RegExp(
  /^(?=.{2,20})(?!.*\s\s)[a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const equipmentNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const numberRegex = new RegExp(/^[0-9]*$/);
const deviceModelRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]$/,
);
const deviceSerialNumberRegex = new RegExp(
  /^(?=.{5,15})(?!.*\s\s)[a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const deviceImeiNumberRegex = new RegExp(/^[0-9]{15,17}$/);
const deviceIccIdNumberRegex = new RegExp(/^[0-9]{19,20}$/);
const deviceSimCardCompanyRegex = new RegExp(
  /^(?=.{2,20})(?!.*\s\s)[a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const deviceSimCardCapacityRegex = new RegExp(
  /^(?=.{2,4})(?!.*\s\s)[a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const certificateSerialNumberRegex = new RegExp(
  /^(?=.{2,20})(?!.*\s\s)[a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const srCallerNameRegex = new RegExp(
  /^(?=.{2})(?!.*\s\s)(?!.*\.\.)[a-zA-Z][a-zA-Z\. ]*[a-zA-Z]$/,
);
const ageRegex = new RegExp(/^[0-9]*$/);
const interactionRegex = new RegExp(
  /^(?=.{2,300})(?!.*\s\s)(?=.*[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]).*$/,
);
const freeTextRegex = new RegExp(
  /^(?!.*\s\s)(?=.*[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]).*$/,
);
const callerPageNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)(?!.*\.\.)[a-zA-Z][a-zA-Z\. ]*[a-zA-Z\.]$/,
);
const driverNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\s\s)[a-zA-Z][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const ervRegNoRegex = new RegExp(/^(?=.{8,13})[A-Za-z0-9]+$/);
const vehicleDeclineOffRoadReasonRegex = new RegExp(
  /^(?=.{2,})(?!.*\s\s)[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]$/,
);
const vehicleDeclineOffRoadShortCodeRegex = new RegExp(
  /^(?=.{2,})(?!.*\s\s)[a-zA-Z]*[a-zA-Z]$/,
);
const leadClosureReasonRegex = new RegExp(
  /^(?=.{2,50})(?!.*\s\s)[a-zA-Z][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);

const osdNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\.\.)(?!.*\s\s)(?!.*\s\.)[A-Z][a-zA-Z\. ]*[a-zA-Z\.]$/,
);
const decimalNumberRegex = new RegExp(/^[0-9]+(\.\d{0,2})?$/);
const fuelStationRegex = new RegExp(
  /^(?=.{2,30})(?!.*\s\s)[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/,
);
const billNoRegex = new RegExp(
  /^(?=.{2,20})[a-zA-Z0-9][a-zA-Z0-9]*[a-zA-Z0-9]$/,
);
const searchCallerNumberRegex = new RegExp(/^(?=.)\+?[0-9]*$/);
const equipmentCardSerialNumberRegex = new RegExp(/^\d{16}$/);
const exceptionReasonRegex = new RegExp(
  /^(?=.{2,50})(?!.*\s\s)[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const ruleExceptionReasonShortCodeRegex = new RegExp(
  /^(?=.{2,})(?!.*\s\s)[a-zA-Z]*[a-zA-Z]$/,
);
const telephoneComplaintRegex = new RegExp(/^\d{11}$/);
const complaintCallerNameRegex = new RegExp(
  /^(?=.{2,26})(?!.*\.\.)(?!.*\s\s)[A-Za-z.][a-zA-Z. ]*[a-zA-Z.]$/,
);
const resolutionReasonRegex = new RegExp(
  /^(?=.{2,50})(?!.*\s\s)[a-zA-Z][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
);
const mobileNumberSearchRegex = new RegExp(/^(?=.{1,13})\+?[0-9]*$/);
const telephoneNumberSearchRegex = new RegExp(/^(?=.{1,})?[0-9]*$/);
const remarksRegex = new RegExp(
  /^(?=.{2,300})(?!.*\s\s)(?=.*[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]).*$/,
);
const consumptionRegex = new RegExp(/^[0-9]{1,2}$/);
const patientNameRegex = new RegExp(
  /^(?=.{2})(?!.*\s\s)(?!.*\.\.)[a-zA-Z][a-zA-Z\. ]*[a-zA-Z]$/,
);
const validateLatitudeRegex = new RegExp(
  /^[-+]?([1-8]?\d(\.\d{1,8})?|90(\.0{1,8})?)$/,
);
const validateLongitudeRegex = new RegExp(
  /^[-+]?(180(\.0{1,8})?|((1[0-7]\d)|([1-9]?\d))(\.\d{1,8})?)$/,
);
const ipdOpdNumberRegex = new RegExp(
  /^(?=.{5,20})(?!.*\s)[a-zA-Z0-9\-\/][a-zA-Z0-9\-\/]*[a-zA-Z0-9\-\/]$/,
);
const crewReportedKmRegex = new RegExp(/^[0-9\b]+$/);
const pincodeRegex = new RegExp(/^(\d{6})$/);

export function validateRequire(value = '') {
  return value && !!value.trim();
}

export function validatePassword(value = '') {
  return passwordRegex.test(value);
}

export function validateAlphaNumeric(value = '') {
  return alphaNumRegex.test(value);
}

export function validateLoginId(value = '') {
  return loginIdRegex.test(value);
}

export function validateUserCode(value = '') {
  return userCodeRegex.test(value);
}

export function validateConsecutiveSpaces(value = '') {
  return consecutiveSpaceRegex.test(value);
}

export function validateMobileNumber(value = '') {
  return mobileNoRegex.test(value);
}
export function validateAllSameNumbers(value = '') {
  return allSameNumbers.test(value);
}

export function validateEmail(value = '') {
  return emailRegex.test(value);
}

export function validateContractId(value = '') {
  return contractIdRegex.test(value);
}

export function validateUserReferenceId(value = '') {
  return referenceIdRegex.test(value);
}

export function validateUserReferenceSource(value = '') {
  return referenceSourceRegex.test(value);
}

export function validateNameWithoutSpecialCharacters(value = '') {
  return nameRegexWthoutSpecialCharacters.test(value);
}
export function validateName(value = '') {
  return nameRegex.test(value);
}

export function validateAddressLine(value = '') {
  return addressLineRegex.test(value);
}

export function validateZipCode(value = '') {
  return zipCodeRegex.test(value);
}

export function validateLatLong(value = '') {
  return latLongRegex.test(value);
}

export function validateAlphabets(value = '') {
  return alphaRegex.test(value);
}

export function validateGstCodeRegex(value = '') {
  return gstCodeRegex.test(value);
}

export function validateStateCode(value = '') {
  return stateCodeRegex.test(value);
}

export function validateAlphaNumWithoutSpace(value = '') {
  return alphaNumWithoutSpaceRegex.test(value);
}

export function validateDistrict(value = '') {
  return districtRegex.test(value);
}

export function validateTehsil(value = '') {
  return tehsilRegex.test(value);
}

export function validateHospitalName(value = '') {
  return hospitalNameRegex.test(value);
}

export function validateHospitalMobileNo(value = '') {
  return hospitalMobileNoRegex.test(value);
}

export function validateVendorCode(value = '') {
  return venderCodeRegex.test(value);
}
export function validateVendorName(value = '') {
  return vendorNameRegex.test(value);
}
export function validateEventName(value = '') {
  return eventNameRegex.test(value);
}
export function validateOfficeName(value = '') {
  return officeNameRegex.test(value);
}
export function validateOfficeCode(value = '') {
  return officeCodeRegex.test(value);
}

export function validateContactDirectoryName(value = '') {
  return contactDirectoryNameRegex.test(value);
}

export function validateLandlineNumber(value = '') {
  return validateLandlineNumberRegex.test(value);
}

export function validateShiftName(value = '') {
  return shiftNameRegex.test(value);
}
export function validatePrimaryComplaintName(value = '') {
  return primaryComplaintNameRegex.test(value);
}

export function validateServiceRequestSubSourceName(value = '') {
  return serviceRequestSubSourceNameRegex.test(value);
}

export function validateContactNameRegex(value = '') {
  return contactNameRegex.test(value);
}

export function validateServiceCategoryNameRegex(value = '') {
  return serviceCategoryNameRegex.test(value);
}
export function validateDepartmentNameRegex(value = '') {
  return departmentNameRegex.test(value);
}
export function validateDesignationNameRegex(value = '') {
  return designationNameRegex.test(value);
}
export function validateEscalationOfficerNameRegex(value = '') {
  return escalationOfficerNameRegex.test(value);
}
export function validateTelephoneNumberRegex(value = '') {
  return telephoneNumberRegex.test(value);
}

export function validatePhoneNumber(value = '') {
  return telephoneNumberRegex.test(value);
}

export function validateParkingBayNameRegex(value = '') {
  return parkingBayNameRegex.test(value);
}

export function validateALSBLSJSA(value = '') {
  return alsBlsJsaRegex.test(value);
}
export function validateServiceSubCategoryNameRegex(value = '') {
  return serviceSubCategoryNameRegex.test(value);
}

export function validateSecondaryComplaintName(value = '') {
  return secondaryComplaintRegex.test(value);
}

export function validateResolutionName(value = '') {
  return resolutionNameRegex.test(value);
}

export function validateCallerName(value = '') {
  return callerNameRegex.test(value);
}

export function validateIdentificationNumber(value = '') {
  return identificationNumberRegex.test(value);
}

export function validateClientName(value = '') {
  return clientNameRegex.test(value);
}

export function validateClientCode(value = '') {
  return clientCodeRegex.test(value);
}

export function validateWebsiteUrl(value = '') {
  return websiteUrlRegex.test(value);
}

export function validateAlphaNumericWithUnderScore(value = '') {
  return alphaNumWithUnderScoreRegex.test(value);
}

export function validateRegistrationNumber(value = '') {
  return registrationNumberRegex.test(value);
}

export function validateEngineNumber(value = '') {
  return engineNumberRegex.test(value);
}

export function validateChassisNumber(value = '') {
  return chassisNumberRegex.test(value);
}

export function validateRto(value = '') {
  return rtoRegex.test(value);
}

export function validateVehicleContactNumber(value = '') {
  return vehicleContactNumberRegex.test(value);
}
export function validateGstInNumber(value = '') {
  return gstInNumberRegex.test(value);
}
export function validateManufacturerNameRegex(value = '') {
  return manufacturerNameRegex.test(value);
}
export function validateDeviceModel(value = '') {
  return deviceModelRegex.test(value);
}
export function validateDeviceSerialNumber(value = '') {
  return deviceSerialNumberRegex.test(value);
}
export function validateDeviceIccIdNumberRegex(value = '') {
  return deviceIccIdNumberRegex.test(value);
}
export function validateDeviceImeiNumber(value = '') {
  return deviceImeiNumberRegex.test(value);
}
export function validateDeviceSimCardCapacity(value = '') {
  return deviceSimCardCapacityRegex.test(value);
}
export function validateDeviceSimCardCompany(value = '') {
  return deviceSimCardCompanyRegex.test(value);
}

export function validateDivision(value = '') {
  return divisionRegex.test(value);
}

export function validateInsurancePolicyNumber(value = '') {
  return insurancePolicyNumberRegex.test(value);
}

export function validateInvoiceNumber(value = '') {
  return invoiceNumberRegex.test(value);
}

export function validatePremiumTaxesRegex(value = '') {
  return premiumTaxesNumberRegex.test(value);
}

export function validateEquipmentSerialNumberRegex(value = '') {
  return equipmentSerialNumberRegex.test(value);
}

export function validateEquipmentNameRegex(value = '') {
  return equipmentNameRegex.test(value);
}

export function validateNumberRegex(value = '') {
  return numberRegex.test(value);
}

export function validateCertificateSerialNumber(value = '') {
  return certificateSerialNumberRegex.test(value);
}

export function validateProjectname(value = '') {
  return projectNameRegex.test(value);
}

export function validateCallCenterSeatCapacity(value = '') {
  return callCenterSeatCapacityRegex.test(value);
}

export function validateProjectExtensionPeriod(value = '') {
  return projectExtensionPeriodRegex.test(value);
}

export function validateRfpName(value = '') {
  return rfpNameRegex.test(value);
}

export function validateAhtFields(value = '') {
  return ahtFieldsRegex.test(value);
}

export function validateSRCallerName(value = '') {
  return srCallerNameRegex.test(value);
}

export function validateAge(value = '') {
  return ageRegex.test(value);
}

export function validateAddress(value = '') {
  return freeTextRegex.test(value);
}
export function validateLandMark(value = '') {
  return freeTextRegex.test(value);
}
export function validateCallerPageName(value = '') {
  return callerPageNameRegex.test(value);
}
export function validateInteraction(value = '') {
  return interactionRegex.test(value);
}
export function validateComplaintDetails(value = '') {
  return interactionRegex.test(value);
}
export function validateEnquiryDetails(value = '') {
  return interactionRegex.test(value);
}
export function validateDriverName(value = '') {
  return driverNameRegex.test(value);
}

export function validateErvRegNo(value = '') {
  return ervRegNoRegex.test(value);
}

export function validateVehicleDeclineOffRoadReason(value = '') {
  return vehicleDeclineOffRoadReasonRegex.test(value);
}
export function validateVehicleDeclineOffRoadShortCode(value = '') {
  return vehicleDeclineOffRoadShortCodeRegex.test(value);
}

export function validateLeadReason(value = '') {
  return leadClosureReasonRegex.test(value);
}
export function validateResolutionReason(value = '') {
  return resolutionReasonRegex.test(value);
}

export function validateOsdName(value = '') {
  return osdNameRegex.test(value);
}

export function validateOdometerReading(value = '') {
  return validateNumberRegex(value) && parseInt(value, 10) <= 1000000;
}

export function validateDecimalNumber(value = '') {
  return decimalNumberRegex.test(value);
}

export function validateFuelStation(value = '') {
  return fuelStationRegex.test(value);
}

export function validateBillNo(value = '') {
  return billNoRegex.test(value);
}

export function validateSearchCallerNumber(value = '') {
  return searchCallerNumberRegex.test(value);
}
export function validateEquipmentCardSerialNumber(value = '') {
  return equipmentCardSerialNumberRegex.test(value);
}
export function validateExceptionReason(value = '') {
  return exceptionReasonRegex.test(value);
}
export function validateRuleExceptionReasonShortCodeRegex(value = '') {
  return ruleExceptionReasonShortCodeRegex.test(value);
}

export function validateTelephoneComplaint(value = '') {
  return telephoneComplaintRegex.test(value);
}

export function validateComplaintCallerName(value = '') {
  return complaintCallerNameRegex.test(value);
}

export function validateSearchMobileNumber(value = '') {
  return mobileNumberSearchRegex.test(value);
}

export function validateSearchTelephoneNumber(value = '') {
  return telephoneNumberSearchRegex.test(value);
}

export function validateRemark(value = '') {
  return remarksRegex.test(value);
}

export function validateConsumptionRegex(value = '') {
  return consumptionRegex.test(value);
}

export function validatePatientName(value = '') {
  return patientNameRegex.test(value);
}

export function validateLatitude(value = '') {
  return validateLatitudeRegex.test(value);
}
export function validateLongitude(value = '') {
  return validateLongitudeRegex.test(value);
}

export function validateIpdOpdNumber(value = '') {
  return ipdOpdNumberRegex.test(value);
}

export function validatecrewReportedKm(value = '') {
  return crewReportedKmRegex.test(value);
}

export function validatePincode(value = '') {
  return pincodeRegex.test(value);
}

export function validateNumeric(value = '') {
  return numRegex.test(value);
}

export function isNullOrUndefined(value) {
  return [null, undefined].includes(value);
}

export default {
  validateRequire,
  validatePassword,
  validateAlphaNumeric,
  validateConsecutiveSpaces,
  validateMobileNumber,
  validateEmail,
  validateContractId,
  validateUserReferenceId,
  validateName,
  validateAddressLine,
  validateZipCode,
  validateLatLong,
  validateStateCode,
  validateAlphaNumWithoutSpace,
  validateDistrict,
  validateHospitalName,
  validateVendorCode,
  validateVendorName,
  validateEventName,
  validateContactDirectoryName,
  validateLandlineNumber,
  validateShiftName,
  validateHospitalMobileNo,
  validatePrimaryComplaintName,
  validateServiceRequestSubSourceName,
  validateContactNameRegex,
  validateServiceCategoryNameRegex,
  validateDepartmentNameRegex,
  validateDesignationNameRegex,
  validateEscalationOfficerNameRegex,
  validateTelephoneNumberRegex,
  validateParkingBayNameRegex,
  validateALSBLSJSA,
  validateSecondaryComplaintName,
  validateServiceSubCategoryNameRegex,
  validateResolutionName,
  validateCallerName,
  validateIdentificationNumber,
  validateClientName,
  validateClientCode,
  validateWebsiteUrl,
  validateAlphaNumericWithUnderScore,
  validateRegistrationNumber,
  validateEngineNumber,
  validateChassisNumber,
  validateRto,
  validateVehicleContactNumber,
  validateDivision,
  validateInsurancePolicyNumber,
  validateInvoiceNumber,
  validateGstInNumber,
  validatePremiumTaxesRegex,
  validateManufacturerNameRegex,
  validateEquipmentSerialNumberRegex,
  validateEquipmentNameRegex,
  validateNumberRegex,
  validateDeviceModel,
  validateDeviceSerialNumber,
  validateDeviceIccIdNumberRegex,
  validateDeviceImeiNumber,
  validateDeviceSimCardCapacity,
  validateDeviceSimCardCompany,
  validateCertificateSerialNumber,
  validateInteraction,
  validateVehicleDeclineOffRoadReason,
  validateVehicleDeclineOffRoadShortCode,
  validateLeadReason,
  validateResolutionReason,
  validateOsdName,
  validateSearchCallerNumber,
  validateEquipmentCardSerialNumber,
  validateExceptionReason,
  validateRuleExceptionReasonShortCodeRegex,
  validateSearchMobileNumber,
  validateSearchTelephoneNumber,
  validateRemark,
  validateConsumptionRegex,
  validatePatientName,
  validateLatitude,
  validateLongitude,
  validateIpdOpdNumber,
};
