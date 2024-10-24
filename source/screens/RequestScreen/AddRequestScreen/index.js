import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import {colors, scaling, fonts} from '../../../library';
import {TextInput} from '../../../components';
import {connect} from 'react-redux';
import Header from '../../../components/header';
import {Context} from '../../../providers/localization';
import {Dropdown} from 'react-native-element-dropdown';
import {
  validateNameWithoutSpecialCharacters,
  validateAge,
  validateAllSameNumbers,
  validateMobileNumber as mobileValidation,
} from '../../../utils/validators';
import {
  addRequest,
  requestListing,
  resetAddRequest,
} from '../../../redux/actions/app.actions';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {ScrollView} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import IconEnt from 'react-native-vector-icons/Entypo';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import Config from 'react-native-config';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import Loader from '../../../components/loader';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const data = [
  {label: 'Item 1', value: '1'},
  {label: 'Item 2', value: '2'},
  {label: 'Item 3', value: '3'},
  {label: 'Item 4', value: '4'},
  {label: 'Item 5', value: '5'},
  {label: 'Item 6', value: '6'},
  {label: 'Item 7', value: '7'},
  {label: 'Item 8', value: '8'},
];
const data1 = [
  {label: 'Father', value: '1'},
  {label: 'Mother', value: '2'},
  {label: 'Sister', value: '3'},
  {label: 'Brother', value: '4'},
  {label: 'Self', value: '5'},
  {label: 'Other', value: '6'},
];

const AddRequest = props => {
  const strings = React.useContext(Context).getStrings();
  const [personValue, setPersonValue] = useState({});
  const [treatmentValue, setTreatmentValue] = useState({});
  const [fullName, setFullName] = useState('');
  const [validateFullName, setValidateFullName] = useState('');
  const [date, setDate] = useState(new Date());
  const [age, setAge] = useState('');
  const [dateOpen, setDateOpen] = useState(false);
  const [invalidAge, setInvalidAge] = useState('');
  const [invalidAddress, setInvalidAddress] = useState('');
  const [address, setAddress] = useState('');
  const [validatePhoneNumber, setValidatePhoneNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submit, setSubmit] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [location, setLocation] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [remarksValidation, setRemarksValidation] = useState();

  const mapRef = useRef();

  useEffect(() => {
    Geocoder.init(`${Config.GOOGLE_MAP_API_KEY}`);
  }, []);
  useEffect(() => {
    if (props.addRequestSuccess) {
      props.resetAddRequest();
      props.navigation.pop();
    }
  }, [props.addRequestSuccess]);

  useEffect(() => {
    if (props.addRequestFail) {
      const errMsg =
        props.addRequestFail?.errors?.response?.data?.apierror?.code || '';
      if (errMsg) {
        if (errMsg === 'ZQTZA0037') {
          Toast.showWithGravity(strings.AddRequestScreen.requestAlreadyMade, Toast.LONG, Toast.TOP);
        }
        props.resetAddRequest();
      }
    }
  }, [props.addRequestFail]);

  useEffect(() => {
    if (Object.keys(location).length !== 0 && !location.name) {
      Geocoder.from({
        latitude: location.latitude,
        longitude: location.longitude,
      })
        .then(json => {
          var addressComponent = json.results[0].formatted_address;
          setLocation({...location, name: addressComponent});
          setSearchValue(addressComponent);
        })
        .catch(error => console.warn('ERROR', error));
    }
  }, [location]);
  useEffect(() => {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  }, [hasLocationPermission]);

  const onChangeSearchValue = value => {
    setSearchValue(value);
  };

  const getAge = birthDate => {
    const yearInMs = 3.15576e10;
    const calculatedAge = Math.floor(
      (new Date() - new Date(birthDate).getTime()) / yearInMs,
    );

    if (calculatedAge === 0) {
      let monthDif = Math.floor(
        moment().diff(moment(birthDate), 'months', true),
      );
      if (monthDif === 0) {
        setInvalidAge(strings.AddRequestScreen.ageInvalid);
      } else if (monthDif === 1) {
        setInvalidAge('');
        setAge(`${monthDif} ${strings.AddRequestScreen.month}`);
      } else {
        setInvalidAge('');
        setAge(`${monthDif} ${strings.AddRequestScreen.months}`);
      }
    } else if (calculatedAge === 1) {
      setInvalidAge('');
      setAge(`${calculatedAge} ${strings.AddRequestScreen.year}`);
    } else if (!validateAge(calculatedAge)) {
      setInvalidAge(strings.AddRequestScreen.ageInvalid);
      setAge('');
    } else {
      setInvalidAge('');
      setAge(`${calculatedAge} ${strings.AddRequestScreen.years}`);
    }
  };
  const onRegionChange = region => {
    setLocation({
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    });
  };

  const renderMap = () => {
    return (
      <Modal
        isVisible={mapVisible}
        style={{margin: 0}}
        onBackButtonPress={() => setMapVisible(false)}>
        {Object.keys(location).length !== 0 ? (
          <View style={styles.mapContainer}>
            <GooglePlacesAutocomplete
              currentLocation={true}
              placeholder="Search"
              fetchDetails={true}
              GooglePlacesSearchQuery={{
                rankby: 'distance',
              }}
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                setLocation({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: 0.011,
                  longitudeDelta: 0.011,
                  name: data.description,
                });
                mapRef.current.animateToRegion({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: 0.011,
                  longitudeDelta: 0.011,
                });
              }}
              query={{
                key: `${Config.GOOGLE_MAP_API_KEY}`,
                language: 'en',
                components: 'country:in',
              }}
              styles={styles.googleSearchStyle}
              textInputProps={{
                value: searchValue,
                onChange: onChangeSearchValue,
                placeholderTextColor: colors.gray700,
              }}
            />
            <View style={{flex: 1}}>
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.011,
                  longitudeDelta: 0.011,
                }}
                onRegionChangeComplete={onRegionChange}></MapView>
              <View pointerEvents="none" style={styles.fakeMarkerView}>
                <IconEnt
                  name="location-pin"
                  size={moderateScale(40)}
                  color={colors.red}
                />
              </View>
            </View>

            <View style={styles.bottomLocationView}>
              <Text style={styles.textStyleLocation}>
                {strings.AddRequestScreen.Location}
              </Text>
              <Text style={[styles.textStyle, {textAlign: 'center'}]}>{`${
                location.name ? location.name : ''
              }`}</Text>
              <View style={[styles.row1, {justifyContent: 'space-between'}]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.button,
                    {
                      width: widthScale(100),
                      height: heightScale(20),
                      marginTop: heightScale(10),
                    },
                  ]}
                  onPress={() => {
                    setMapVisible(false);
                  }}>
                  <Text style={styles.buttonText}>
                    {strings.AddRequestScreen.Cancel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.button,
                    {
                      width: widthScale(100),
                      height: heightScale(20),
                      marginTop: heightScale(10),
                    },
                  ]}
                  onPress={() => {
                    setMapVisible(false);
                    setAddress(location.name);
                  }}>
                  <Text style={styles.buttonText}>
                    {strings.AddRequestScreen.Save}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <Loader />
        )}
      </Modal>
    );
  };

  const fullNameValidationFunc = () => {
    if (fullName == '') {
      setValidateFullName(strings.signUpScreen.enterName);
    } else if (fullName.length > 32 || fullName.length < 2) {
      setValidateFullName(strings.signUpScreen.fullNameMaxLength);
    } else if (!validateNameWithoutSpecialCharacters(fullName)) {
      setValidateFullName(strings.signUpScreen.wrongNameFormat);
    } else {
      setValidateFullName('');
      return true;
    }
  };
  const phoneNumberValidationFunc = () => {
    if (phoneNumber == '') {
      setValidatePhoneNumber(strings.signUpScreen.enterPhoneNumber);
    } else if (phoneNumber.length < 10) {
      setValidatePhoneNumber(strings.signUpScreen.enterValidNumber);
    } else if (validateAllSameNumbers(phoneNumber)) {
      setValidatePhoneNumber(strings.signUpScreen.invalidNumber);
    } else if (!mobileValidation(phoneNumber)) {
      setValidatePhoneNumber(strings.signUpScreen.specialCharactersNotAllowed);
    } else {
      setValidatePhoneNumber('');
      return true;
    }
  };
  const ageValidationFunc = () => {
    if (age == '') {
      setInvalidAge(strings.AddRequestScreen.ageEmpty);
    } else if (age <= 0) {
      setInvalidAge(strings.AddRequestScreen.ageInvalid);
    } else {
      setInvalidAge('');
      return true;
    }
  };
  const remarksValidationFunc = () => {
    if (remarks && remarks.length > 200) {
      setRemarksValidation(strings.AddRequestScreen.remarksExceeded);
    } else {
      setRemarksValidation('');
      return true;
    }
  };

  const addressValidatedFunc = () => {
    if (address == '') {
      setInvalidAddress(strings.AddRequestScreen.addressEmpty);
    } else {
      setInvalidAddress('');
      return true;
    }
  };

  const validateFields = () => {
    let fullNameValidated = fullNameValidationFunc();
    let ageValidated = ageValidationFunc();
    let addressValidated = addressValidatedFunc();
    let phoneNumberValidated = phoneNumberValidationFunc();
    let remarksValidated = remarksValidationFunc();
    if (
      fullNameValidated &&
      ageValidated &&
      phoneNumberValidated &&
      addressValidated &&
      personValue.value &&
      treatmentValue.value &&
      address &&
      remarksValidated
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = () => {
    setSubmit(true);
    let allFieldsValidated = validateFields();
    if (allFieldsValidated) {
      setSubmit(false);
      props.addRequest({
        challanNo: '12345Challan16',
        contactno: phoneNumber,
        callerName: fullName,
        latitude: location.latitude,
        longitude: location.longitude,
        citizenId: props.userId,
        address: address,
        for: personValue.label,
        remarks: remarks,
        age: age,
        dob: date,
        treatment: treatmentValue.label,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.container}>
        {renderMap()}
        <SafeAreaView />

        <Header
          screenName={strings.AddRequestScreen.AddRequestScreen}
          leftIconPress={props.navigation.goBack}
          backArrow={true}
        />

        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps={'always'}>
          <View style={styles.textFieldsContainer}>
            <Text style={styles.inputHeader}>
              {strings.AddRequestScreen.For}
            </Text>
            <Dropdown
              style={
                !personValue.value && submit
                  ? [styles.dropdown, {borderColor: colors.red}]
                  : styles.dropdown
              }
              renderItem={item => {
                return (
                  <View style={styles.dropdownListContainer}>
                    <Text style={styles.dropdownListTextStyle}>
                      {item.label}
                    </Text>
                  </View>
                );
              }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={data1}
              maxHeight={heightScale(250)}
              labelField="label"
              valueField="value"
              placeholder={strings.AddRequestScreen.For}
              value={personValue.value}
              onChange={item => {
                setPersonValue(item);
              }}
            />
            {!personValue.value && submit ? (
              <Text style={styles.errorMsg}>
                {strings.AddRequestScreen.empty}
              </Text>
            ) : null}
            <Text style={styles.inputHeader2}>
              {strings.AddRequestScreen.fullName}
            </Text>
            <TextInput
              isError={validateFullName}
              underlineColorAndroid="transparent"
              style={styles.input}
              placeholder={strings.signUpScreen.fullName}
              placeholderTextColor={colors.gray400}
              autoCapitalize="words"
              value={fullName}
              onChangeText={value => {
                setFullName(value);
              }}
              inputStyles={styles.inputStyles}
            />
            {validateFullName ? (
              <Text style={styles.errorMsg}>{validateFullName}</Text>
            ) : null}
            <Text style={styles.inputHeader2}>
              {strings.AddRequestScreen.phoneNumber}
            </Text>
            <View style={styles.row1}>
              <TextInput
                underlineColorAndroid="transparent"
                isError={validatePhoneNumber}
                isPhoneNumber
                style={styles.input}
                placeholder={strings.signUpScreen.phoneNumber}
                keyboardType="numeric"
                placeholderTextColor={colors.gray400}
                autoCapitalize="none"
                maxLength={10}
                value={phoneNumber}
                onChangeText={value => {
                  setPhoneNumber(value);
                }}
                inputStyles={Platform.OS === 'ios' ? styles.inputStyles : null}
              />
            </View>

            {validatePhoneNumber ? (
              <Text style={styles.errorMsg}>{validatePhoneNumber}</Text>
            ) : null}
            <Text style={styles.inputHeader2}>
              {strings.AddRequestScreen.Age}
            </Text>
            <TouchableOpacity
              style={
                !invalidAge
                  ? [styles.input, {justifyContent: 'center'}]
                  : [
                      [styles.input, {justifyContent: 'center'}],
                      {borderColor: colors.red, justifyContent: 'center'},
                    ]
              }
              onPress={() => {
                setDateOpen(true);
              }}>
              <Text
                style={
                  age
                    ? styles.ageStyle
                    : [styles.ageStyle, {color: colors.gray400}]
                }>
                {age ? age : strings.AddRequestScreen.Age}
              </Text>
            </TouchableOpacity>
            {invalidAge ? (
              <Text style={styles.errorMsg}>{invalidAge}</Text>
            ) : null}
            <DateTimePickerModal
              isVisible={dateOpen}
              mode="date"
              title={strings.AddRequestScreen.selectDate}
              date={date}
              onConfirm={date => {
                getAge(date);
                setDateOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setDateOpen(false);
              }}
            />
            <Text style={styles.inputHeader2}>
              {strings.AddRequestScreen.Treatment}
            </Text>
            <Dropdown
              style={
                !treatmentValue.value && submit
                  ? [
                      styles.dropdown,
                      {marginTop: heightScale(5), borderColor: colors.red},
                    ]
                  : [styles.dropdown, {marginTop: heightScale(5)}]
              }
              renderItem={item => {
                return (
                  <View style={styles.dropdownListContainer}>
                    <Text style={styles.dropdownListTextStyle}>
                      {item.label}
                    </Text>
                  </View>
                );
              }}
              containerStyle={styles.textStyle}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={data}
              maxHeight={heightScale(250)}
              labelField="label"
              valueField="value"
              placeholder={strings.AddRequestScreen.Treatment}
              value={treatmentValue?.value}
              onChange={item => {
                setTreatmentValue(item);
              }}
            />
            {!treatmentValue.value && submit ? (
              <Text style={styles.errorMsg}>
                {strings.AddRequestScreen.empty}
              </Text>
            ) : null}
            <Text style={styles.inputHeader2}>
              {strings.AddRequestScreen.Address}
            </Text>
            <TouchableOpacity
              style={
                !invalidAddress
                  ? [styles.input, {justifyContent: 'center'}]
                  : [
                      styles.input,
                      {
                        borderColor: colors.red,
                        justifyContent: 'center',
                      },
                    ]
              }
              onPress={async () => {
                if (Platform.OS === 'android') {
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                  );
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setHasLocationPermission(true);
                    setMapVisible(true);
                  } else {
                    Alert.alert(
                      strings.AddRequestScreen.locationDenied,
                      strings.AddRequestScreen.locationDeniedMsg,
                      [
                        {
                          text: strings.common.abort,
                          style: 'cancel',
                        },
                        {text: strings.common.confirm},
                      ],
                    );
                    setHasLocationPermission(false);
                    setMapVisible(false);
                  }
                } else {
                  const granted = await Geolocation.requestAuthorization(
                    'always',
                  );
                  if (granted === 'granted') {
                    setMapVisible(true);
                    setHasLocationPermission(true);
                  }
                }
                renderMap();
              }}>
              <Text
                ellipsizeMode="tail"
                style={
                  address
                    ? styles.ageStyle
                    : [styles.ageStyle, {color: colors.gray600}]
                }>
                {address ? address : `${strings.AddRequestScreen.address}`}
              </Text>
            </TouchableOpacity>
            {invalidAddress ? (
              <Text style={styles.errorMsg}>{invalidAddress}</Text>
            ) : null}
            <Text style={styles.inputHeader2}>
              {strings.AddRequestScreen.Remarks}
            </Text>
            <TextInput
              isError={remarksValidation}
              multiline={true}
              underlineColorAndroid="transparent"
              style={styles.remarksInput}
              placeholder={strings.AddRequestScreen.Remarks}
              placeholderTextColor={colors.gray400}
              autoCapitalize="words"
              value={remarks}
              onChangeText={value => {
                setRemarks(value);
              }}
              inputStyles={styles.inputStyles}
            />
            {remarksValidation ? (
              <Text style={styles.errorMsg}>{remarksValidation}</Text>
            ) : null}
            {props.addRequestLoading || props.requestListingLoading ? (
              <View style={styles.button}>
                <ActivityIndicator color={colors.white} size="small" />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.button]}
                onPress={() => {
                  handleSubmit();
                }}>
                <Text style={styles.buttonText}>
                  {strings.RequestScreen.Submit}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  dropdownListContainer: {
    padding: normalize(10),
  },
  fakeMarkerView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: heightScale(20),
  },
  bottomLocationView: {
    paddingHorizontal: widthScale(10),
    position: 'absolute',
    bottom: 0,
    height: heightScale(100),
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  textStyleLocation: {
    color: colors.black,
    textAlign: 'center',
    fontSize: normalize(18),
    fontFamily: fonts.calibri.bold,
  },
  textFieldsContainer: {
    flex: 1,
    marginBottom: heightScale(20),
    marginTop: heightScale(20),
    marginHorizontal: widthScale(20),
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  textStyle: {
    color: colors.black,
  },
  dropdownListTextStyle: {
    color: colors.black,
    fontSize: normalize(13),
  },
  googleSearchStyle: {
    textInput: {
      placeholderTextColor: colors.black,
      color: colors.black,
      marginTop: heightScale(20),
    },
    textInputContainer: {
      backgroundColor: colors.white,
    },

    separator: {colors: 'black'},
    description: {color: 'gray'},
    container: {
      flex: 0,
      position: 'absolute',
      width: '100%',
      zIndex: 1,
    },
    row: {color: colors.black},
    listView: {
      backgroundColor: colors.white,
      color: colors.black,
    },
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    marginTop: heightScale(10),
    // zIndex: 1,
  },
  mapText: {
    color: colors.black,
  },
  row1: {
    flexDirection: 'row',
  },
  inputHeader: {
    color: colors.gray700,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    marginBottom: heightScale(8),
  },
  inputHeader2: {
    marginTop: heightScale(20),
    color: colors.gray700,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
  },
  errorMsg: {
    marginTop: heightScale(3),
    color: colors.red,
    marginLeft: widthScale(5),
    width: widthScale(250),
    fontSize: normalize(12),
  },
  countryCode: {
    marginTop: heightScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: widthScale(1),
    borderRightWidth: widthScale(0),
    borderColor: colors.gray400,
    width: widthScale(40),
  },
  ageStyle: {
    fontSize: normalize(13),
    color: colors.black,
  },
  remarksInput: {
    marginTop: heightScale(5),
    width: widthScale(280),
    paddingLeft: widthScale(10),
    borderColor: colors.gray400,
    color: colors.black,
    borderWidth: 1,
  },
  input: {
    padding: 0,
    marginTop: heightScale(5),
    width: widthScale(280),
    color: colors.black,
    paddingLeft: widthScale(10),
    minHeight: heightScale(36),
    borderColor: colors.gray400,
    borderWidth: widthScale(1),
  },
  dropdown: {
    minHeight: heightScale(37),
    borderColor: colors.gray400,
    borderWidth: widthScale(1),
    paddingHorizontal: widthScale(8),
  },
  inputStyles: {
    fontSize: normalize(15),
    lineHeight: normalize(15),
    color: colors.black,
  },
  placeholderStyle: {
    fontSize: normalize(13),
    color: colors.gray600,
  },
  selectedTextStyle: {
    fontSize: normalize(13),
    color: colors.black,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  mainView: {
    flex: 1,
    marginTop: heightScale(20),
    marginHorizontal: widthScale(20),
  },
  nameStyle: {
    fontSize: normalize(18),
    color: colors.black,
    fontFamily: fonts.calibri.bold,
  },
  subTitle: {
    marginTop: heightScale(10),
    fontSize: normalize(15),
    color: colors.black,
    fontFamily: fonts.calibri.light,
  },

  button: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    color: colors.white,
    width: widthScale(280),
    height: heightScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightScale(20),
    marginBottom: heightScale(10),
    borderRadius: moderateScale(15),
  },
  countryCodeText: {
    fontSize: normalize(15.4),
    textAlign: 'center',
    color: colors.gray900,
    fontFamily: fonts.calibri.regular,
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(14),
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {
    addRequestLoading,
    addRequestSuccess,
    addRequestFail,
    requestListingLoading,
    requestListingSuccess,
    requestListingFail,
    userId,
  } = App;
  const {userInfoSuccess} = Auth;
  return {
    userInfoSuccess,
    addRequestLoading,
    addRequestSuccess,
    addRequestFail,
    requestListingLoading,
    requestListingSuccess,
    requestListingFail,
    userId,
  };
};

const mapDispatchToProps = {
  addRequest,
  requestListing,
  resetAddRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddRequest);
