import React, {useState, forwardRef, useContext, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import data from '../constants/CountryCodes';
import {colors, scaling, fonts} from '../library';
import {close} from '../../assets';
import {Context} from '../providers/localization';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const defaultCountry = data.find(obj => obj.name === 'India');
const defaultFlag = defaultCountry.flag;
const defaultCode = defaultCountry.dial_code;

const PhoneInput = (props, ref) => {
  const strings = useContext(Context).getStrings();
  const {common} = strings;

  const [phoneInputStates, setPhoneInputStates] = useState({
    flag: defaultFlag,
    countryCode: defaultCode,
    modalVisible: false,
  });

  const {
    inputBoxContainerStyle,
    labelStyle,
    label,
    inputContainerStyle,
    error,
    inputErrorStyle,
    disableCountryCodePicker = true,
    flagStyle,
    dialCodeStyle,
    allowFontScaling = false,
    inputBoxStyle,
    placeholder,
    placeholderTextColor = colors.gray400,
    onChangeText,
    fieldName,
    value,
    keyboardType = 'number-pad',
    maxLength = 10,
    returnKeyType = 'done',
    editable,
    autoComplete = 'off',
    selectionColor = colors.primary,
    onBlur,
    onFocus,
    errorTextStyle,
    countryCodeContainerStyle,
    modalContainerStyle,
    modalHeaderContainerStyle,
    modalHeading = common.selectCountryCode,
    modalHeaderTextStyle,
    modalCloseIconContainerStyle,
    onPressModalClose = () => {
      setPhoneInputStates(preVal => ({...preVal, modalVisible: false}));
    },
    modalCloseIcon = close,
    modalCloseIconStyle,
    modalListContainerStyle,
    modalData = data,
    modalKeyboardShouldPersistTaps = 'always',
    modalKeyExtractor,
    modalRenderItem,
    onChangeCountryCode,
    separatorViewStyle,
  } = props;

  useEffect(() => {
    if (onChangeCountryCode) {
      onChangeCountryCode(phoneInputStates.countryCode);
    }
  }, [phoneInputStates.countryCode]);

  return (
    <View style={{...styles.container, ...inputBoxContainerStyle}}>
      {!!label && <Text style={{...styles.label, ...labelStyle}}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          error && {...styles.errorStyle, ...inputErrorStyle},
        ]}>
        <TouchableOpacity
          onPress={() => { setPhoneInputStates((preVal) => ({ ...preVal, modalVisible: true })); }}
          disabled={disableCountryCodePicker}
          style={{ ...styles.countryCodeContainer, ...countryCodeContainerStyle }}
        >
          <Text style={{ ...styles.flag, ...flagStyle }}>{phoneInputStates.flag}</Text>
          <Text style={{ ...styles.dialCode, ...dialCodeStyle }}>
            {phoneInputStates.countryCode}
          </Text>
        </TouchableOpacity>
        <View style={{ ...styles.separatorView, ...separatorViewStyle }} />
        <TextInput
          ref={ref}
          allowFontScaling={allowFontScaling}
          style={{...styles.inputBox, ...inputBoxStyle}}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={text => {
              if(text.length > 0 && !!Number(text) === false){
                return;
              }
              onChangeText(text, fieldName)
            }
          } 
          value={value}
          keyboardType={keyboardType}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          editable={editable}
          autoComplete={autoComplete}
          selectionColor={selectionColor}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </View>
      {!!error && (
        <Text style={{...styles.errorText, ...errorTextStyle}}>{error}</Text>
      )}
      <Modal isVisible={phoneInputStates.modalVisible}>
        <View style={{...styles.modalContainer, ...modalContainerStyle}}>
          <View
            style={{...styles.headerContainer, ...modalHeaderContainerStyle}}>
            <Text style={{...styles.headerText, ...modalHeaderTextStyle}}>
              {modalHeading}
            </Text>
            <TouchableOpacity
              style={{
                ...styles.closeIconContainer,
                ...modalCloseIconContainerStyle,
              }}
              onPress={onPressModalClose}>
              <Image
                source={modalCloseIcon}
                resizeMode="contain"
                style={{...styles.closeIcon, ...modalCloseIconStyle}}
              />
            </TouchableOpacity>
          </View>
          <View style={{...styles.listContainer, ...modalListContainerStyle}}>
            <FlatList
              data={modalData}
              keyboardShouldPersistTaps={modalKeyboardShouldPersistTaps}
              keyExtractor={
                modalKeyExtractor ? modalKeyExtractor : (item, index) => index
              }
              renderItem={
                modalRenderItem
                  ? modalRenderItem
                  : ({item}) => (
                      <TouchableOpacity
                        onPress={() => {
                          setPhoneInputStates(preVal => ({
                            ...preVal,
                            flag: item.flag,
                            countryCode: item.dial_code,
                            modalVisible: false,
                          }));
                        }}>
                        <View style={styles.countryStyle}>
                          <View style={{flex: 1}}>
                            <Text
                              style={styles.dialCodeModal}
                              numberOfLines={2}>
                              {`${item.name} (${item.dial_code})`}
                            </Text>
                          </View>
                          <View style={{marginLeft: widthScale(15)}}>
                            <Text style={styles.flagImage}>{item.flag}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: colors.black,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.bold,
    marginBottom: heightScale(4),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: widthScale(1),
    borderColor: colors.white,
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(12),
    paddingVertical: heightScale(8),
    borderRadius: moderateScale(12),
  },
  errorStyle: {
    borderColor: colors.Red,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: normalize(20),
    fontFamily: fonts.calibri.regular,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  dialCode: {
    color: colors.black,
    marginLeft: widthScale(6),
    fontSize: normalize(16),
    fontFamily: fonts.calibri.regular,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  inputBox: {
    flex: 1,
    color: colors.black,
    fontSize: normalize(16),
    fontFamily: fonts.calibri.regular,
    borderWidth: 0,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  errorText: {
    color: colors.Red,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    marginTop: heightScale(2),
  },
  modalContainer: {
    backgroundColor: colors.whiteSmoke,
    height: '90%',
    width: '90%',
    alignSelf: 'center',
    borderRadius: moderateScale(5),
    opacity: 0.9,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: heightScale(5),
    flex: 1,
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: fonts.calibri.medium,
    color: colors.black,
    fontSize: normalize(22),
    marginRight: widthScale(30),
  },
  closeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: heightScale(25),
    width: widthScale(25),
    right: widthScale(7),
    top: heightScale(7),
    position: 'absolute',
  },
  closeIcon: {
    height: heightScale(25),
    width: widthScale(25),
  },
  listContainer: {
    width: '100%',
    flex: 9,
  },
  countryStyle: {
    flex: 1,
    borderTopColor: colors.primary,
    borderTopWidth: 1,
    paddingVertical: heightScale(10),
    paddingHorizontal: widthScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialCodeModal: {
    color: colors.black,
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
  },
  flagImage: {
    fontSize: normalize(20),
  },
  separatorView: {
    height: '100%',
    borderLeftWidth: widthScale(1),
    borderLeftColor: colors.gray400,
    marginHorizontal: widthScale(8),
  },
});

export default forwardRef(PhoneInput);
