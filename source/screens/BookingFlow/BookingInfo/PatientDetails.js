import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import {colors, scaling, fonts} from '../../../library';
import CustomDropdown from '../../../components/CustomDropdown';
import Input from '../../../components/Input';
import Toggle from '../../../components/Toggle';
import {connect} from 'react-redux';
import {
  getMedicalCondition,
  srCreationApi,
  resetSrCreationApi,
  getMembers,
  resetGetMembersApi,
  projectConfigAction,
  animalCategories,
  animalBreed,
} from '../../../redux/actions/app.actions';
import Config from 'react-native-config';
import {bookFor, bookForPetVet, genderData} from '../utils';
import {Context} from '../../../providers/localization';
import {requestTypeConstant} from '../../../utils/constants';
import {CrossIcon, SearchIcon} from '../../../../assets';
import MedicalConditionModal from './MedicalConditionModal';
import InstructionModal from './InstructionModal';
import AddAndSearchModal from '../../../components/AddAndSearchModal';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const MAX_VISIBLE_ITEM = 3;

function AmbulanceAndPaymentDetail(props) {
  const {corporateBookingData = {}} = props?.route?.params;
  const strings = useContext(Context).getStrings();
  const [searchText, setSearchText] = useState('');
  const [selectedRelative, setSelectedRelative] = useState();
  const [isMedicalConditionVisible, setIsMedicalConditionVisible] =
    useState(false);
  const [isInstructionModalVisible, setIsInstructionModalVisible] =
    useState(false);

  let objectToChange = useRef(null);

  const bookingCategory = props?.route?.params?.type;

  useEffect(() => {
    const _projectConfigData = {
      clientId: Config.CLIENT_ID,
      projectTypeNumber: Config.PROJECT_TYPE_NUMBER,
    };
    props.projectConfigAction(_projectConfigData);
    props.getMedicalCondition({
      subCategoryIds: Config[bookingCategory]?.split(' ')[1],
      isPicklist: true,
    });
  }, []);

  useEffect(() => {
    if (
      props.getProfileSuccess &&
      props.getPicklistSuccess?.data &&
      (props.formValues.bookFor === bookFor[0] ||
        props.formValues.bookFor === bookForPetVet[0])
    ) {
      const objectToChange = {
        patientName: props.getProfileSuccess?.data?.name || '',
        age: props.getProfileSuccess?.data?.age?.toString() || '',
        patientContact: props.getProfileSuccess?.data?.mobile,
        bloodGroup: props.getProfileSuccess?.data?.bloodGroup || null,
        gender: props.getProfileSuccess?.data?.gender || genderData[0].id,
      };
      props.setFormValues(preVal => ({
        ...preVal,
        ...objectToChange,
      }));
    } else {
      setSelectedRelative('');
      props.setFormValues(preVal => ({
        ...preVal,
        ...objectToChange,
      }));
    }
    if (!props.getMembersSuccess && props.formValues.bookFor === bookFor[1]) {
      console.log('getMembers api call =====>>>>>>');
      props.getMembers(props.getProfileSuccess?.data?.id || '');
    }
  }, [
    props.getProfileSuccess,
    props.formValues.bookFor,
    props.getMembersSuccess,
  ]);

  useEffect(() => {
    if (props.formValues.bookFor === bookFor[1]) {
      if (selectedRelative) {
        const tempObj = selectedRelative;
        console.log(tempObj, 'selectedRelative');

        objectToChange.current = {
          patientName: tempObj?.firstName,
          age: tempObj?.age.toString() || '',
          gender: tempObj?.gender?.id || genderData[0].id,
          bloodGroup: tempObj?.bloodGroup?.id || null,
          patientContact: tempObj?.mobileNumber,
        };
      } else {
        objectToChange.current = {
          patientName: searchText,
          age: '',
        };
      }
      props.setFormValues(preVal => ({
        ...preVal,
        ...objectToChange.current,
      }));
    }
  }, [selectedRelative, searchText]);

  useEffect(() => {
    if (props.formValues?.medicalCondition?.length) {
      const medicalCondition = props.formValues?.medicalCondition?.map(id => {
        return props?.getMedicalConditionSuccess?.data?.content?.find(
          obj => obj.id === id,
        );
      });
      props.setValues('medicalConditionsObj', medicalCondition);
    }
  }, [props.formValues.medicalCondition]);

  useEffect(() => {
    if (
      props.formValues?.vehicleType &&
      bookingCategory === requestTypeConstant.petVeterinaryAmbulance
    ) {
      props.animalCategories(props.formValues?.vehicleType?.id);
    }
  }, [props.formValues?.vehicleType]);

  useEffect(() => {
    if (props.formValues?.animalCategory?.id) {
      props.animalBreed(props.formValues.animalCategory?.id);
    }
  }, [props.formValues?.animalCategory]);

  const openMedicalConditionModal = () => {
    setIsMedicalConditionVisible(true);
  };

  const closeMedicalConditionModal = () => {
    setIsMedicalConditionVisible(false);
  };

  const openInstructionModal = () => setIsInstructionModalVisible(true);
  const closeInstructionModal = () => setIsInstructionModalVisible(false);

  const renderPatientName = () => {
    if (
      props.formValues.bookFor.id === bookFor[0].id &&
      props.getProfileSuccess?.data?.name.length > 0 &&
      props.getProfileSuccess?.data?.age?.toString() > 0
    ) {
      return null;
    } else {
      return (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: heightScale(20),
            paddingRight: 0,
          }}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.title}>
                {strings.bookingFlow.patientName}
              </Text>
              <Text style={styles.astrik}>*</Text>
            </View>
            <View style={{width: widthScale(140), marginTop: heightScale(4)}}>
              {props.formValues.bookFor === bookFor[1] ? (
                <AddAndSearchModal
                  data={props.getMembersSuccess?.data}
                  searchText={searchText}
                  setSearchText={setSearchText}
                  selectedRelative={selectedRelative}
                  setSelectedRelative={setSelectedRelative}
                  patientValue={props.formValues.patientName}
                  setPatientValue={val => {
                    props.setValues('patientName', val);
                  }}
                />
              ) : (
                <View style={styles.patientInfoContainer}>
                  <TextInput
                    placeholder={strings.bookingFlow.patientName}
                    value={props.formValues.patientName}
                    placeholderTextColor={colors.DimGray2}
                    onChangeText={val => {
                      props.setValues('patientName', val);
                    }}
                    style={[
                      styles.inputTextStyle,
                      styles.patientInputStyle,
                      {margin: 0, padding: 0},
                    ]}
                  />
                </View>
              )}
            </View>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.title}>{strings.bookingFlow.patientAge}</Text>
              <Text style={styles.astrik}>*</Text>
            </View>
            <View style={[styles.patientInfoContainer, styles.ageInputView]}>
              <TextInput
                placeholder={strings.common.enter}
                value={props.formValues.age}
                keyboardType={'number-pad'}
                returnKeyType="done"
                placeholderTextColor={colors.DimGray2}
                onChangeText={val => {
                  if(val.length>0 && !!Number(val) === false){
                    return;
                  }
                  if (val.length < 4) {
                    props.setValues('age', val.replace(/[^0-9]/g, ''));
                  }
                }}
                style={[
                  styles.inputTextStyle,
                  styles.patientInputStyle,
                  {margin: 0, padding: 0},
                ]}
              />
            </View>
          </View>
        </View>
      );
    }
  };

  const renderTravellertName = () => {
    if (
      props.formValues.bookFor.id === bookFor[0].id &&
      props.getProfileSuccess?.data?.name.length > 0 &&
      props.getProfileSuccess?.data?.mobile.length > 0
    ) {
      return null;
    } else {
      return (
        <View style={styles.travellerOtherContainer}>
          <View style={[styles.travellerInputContainer, styles.travellerName]}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.title}>{strings.groundAmbulance.name}</Text>
              <Text style={styles.astrik}>*</Text>
            </View>
            <View style={{width: '100%', marginTop: heightScale(4)}}>
              <Input
                isSecondaryButton={true}
                placeholder={strings.common.enter}
                inputBoxStyle={styles.inputTextStyle}
                value={props.formValues.travellerName}
                onChangeText={val => {
                  props.setValues('patientName', val);
                  props.setValues('travellerName', val);
                }}
              />
            </View>
          </View>

          <View style={[styles.travellerInputContainer]}>
            <View style={styles.inputWithHeading}>
              <Text style={styles.title}>
                {strings.groundAmbulance?.phoneNumber}
              </Text>
              <Text style={styles.astrik}>*</Text>
            </View>
            <View style={{marginTop: 4, width: '100%'}}>
              <Input
                isSecondaryButton={true}
                placeholder={strings.common.enter}
                inputBoxStyle={styles.inputTextStyle}
                keyboardType={'number-pad'}
                returnKeyType="done"
                value={props.formValues.travellerMobile}
                onChangeText={val => {
                  if (val.length <= 10) {
                    props.setValues('patientContact', val.toString());
                    props.setValues(
                      'travellerMobile',
                      val.replace(/[^0-9]/g, ''),
                    );
                  }
                }}
              />
            </View>
          </View>
        </View>
      );
    }
  };

  const getMedicalConditionBySearch = value => {
    props.getMedicalCondition({
      subCategoryIds: Config[bookingCategory]?.split(' ')[1],
      isPicklist: true,
      searchText: value,
    });
  };

  const selectedGender = genderData.find(
    gender => gender.id === props.formValues?.gender,
  );

  const renderChipItem = item => {
    return (
      <View style={styles.tileView}>
        <Text numberOfLines={1} style={styles.tileText}>
          {item?.name}
        </Text>
        <TouchableOpacity
          hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}
          onPress={() => {
            let selectedValues =
              props.formValues?.medicalConditionObject?.filter(
                data => data.id !== item.id,
              );

            props.setValues(
              'medicalCondition',
              selectedValues.map(value => value.id),
            );
            props.setValues('medicalConditionObject', selectedValues);
          }}>
          <Image source={CrossIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.boxContainer}>
        <View style={{width: '100%'}}>
          {!!Object.keys(corporateBookingData).length && (
            <View style={{marginTop: heightScale(8)}}>
              <Text style={styles.title}>
                {`${strings.homeScreen.identificationNumber} - `}
                <Text style={{fontSize: normalize(14), fontFamily: fonts.calibri.semiBold}}>
                  {corporateBookingData.identificationNo}
                </Text>
              </Text>
            </View>
          )}
          <Text style={[styles.title, {marginTop: heightScale(8)}]}>
            {strings.groundAmbulance[bookingCategory].bookingAmbulanceFor}
          </Text>
          <View style={styles.mainView}>
            <Toggle
              itemViewStyles={
                bookingCategory ===
                  requestTypeConstant.petVeterinaryAmbulance && {
                  flexBasis: `${100 / 2}%`,
                }
              }
              toggleData={
                bookingCategory === requestTypeConstant.petVeterinaryAmbulance
                  ? bookForPetVet
                  : bookFor
              }
              selectedValue={props.formValues?.bookFor}
              onChange={item => {
                const objectToChange = {
                  patientName: '',
                  age: '',
                  patientContact: '',
                  bloodGroup: null,
                };
                props.setFormValues(preVal => ({
                  ...preVal,
                  ...objectToChange,
                }));
                props.setValues('bookFor', item);
              }}
              disabled={corporateBookingData?.projectBilling?.project?.client?.clientBookingFor === bookFor[0].id}
            />
          </View>
        </View>
        {bookingCategory === requestTypeConstant.petVeterinaryAmbulance
          ? renderTravellertName()
          : renderPatientName()}

        {bookingCategory === requestTypeConstant.petVeterinaryAmbulance && (
          <View style={styles.categoryRow}>
            <View style={[styles.categoryBreedItem, styles.categoryItem]}>
              <View style={styles.inputWithHeading}>
                <Text style={styles.title}>
                  {strings.groundAmbulance[bookingCategory].category}
                </Text>
                <Text style={styles.astrik}>*</Text>
              </View>
              <View style={styles.mainView}>
                <CustomDropdown
                  data={props.animalCategorySuccess?.data?.content}
                  value={props.formValues?.animalCategory}
                  onChange={item => {
                    props.setValues('animalCategory', item);
                  }}
                />
              </View>
            </View>

            <View style={styles.categoryBreedItem}>
              <View style={styles.inputWithHeading}>
                <Text style={styles.title}>
                  {strings.groundAmbulance[bookingCategory].breed}
                </Text>
                <Text style={styles.astrik}>*</Text>
              </View>
              <View style={{marginTop: 4, paddingRight: 0}}>
                <CustomDropdown
                  disable={!props.formValues?.animalCategory?.id}
                  data={props.animalBreedSuccess?.data?.content}
                  value={props.formValues?.animalBreed}
                  onChange={item => {
                    props.setValues('animalBreed', item);
                  }}
                />
              </View>
            </View>
          </View>
        )}
        {bookingCategory === requestTypeConstant.petVeterinaryAmbulance && (
          <View style={{width: '100%'}}>
            <Text style={[styles.title, {marginTop: heightScale(8)}]}>
              {strings.groundAmbulance[bookingCategory].gender}
              <Text style={styles.astrik}>*</Text>
            </Text>
            <View style={styles.mainView}>
              <Toggle
                itemViewStyles={{flexBasis: `${100 / 2}%`}}
                toggleData={genderData}
                selectedValue={selectedGender ? selectedGender : genderData[0]}
                onChange={item => {
                  props.setValues('gender', item.id);
                }}
              />
            </View>
          </View>
        )}

        <View style={{marginTop: heightScale(10)}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>
              {strings.bookingFlow.medicalCondition}
            </Text>
            <Text style={styles.astrik}>*</Text>
          </View>
          <View style={{marginTop: 4, paddingRight: 0}}>
            <View style={styles.searchBox}>
              {!Boolean(props.formValues?.medicalConditionObject?.length) ? (
                <TouchableOpacity onPress={openMedicalConditionModal}>
                  <View style={styles.searchPlaceholderView}>
                    <Text style={styles.placeholderText}>
                      {strings.bookingFlow.searchPlaceholder}
                    </Text>
                    <Image source={SearchIcon} />
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.chipContainer}>
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}>
                    {props?.formValues?.medicalConditionObject
                      .slice(0, MAX_VISIBLE_ITEM)
                      ?.map(renderChipItem)}
                  </ScrollView>
                  <TouchableOpacity onPress={openMedicalConditionModal}>
                    {(props?.formValues?.medicalConditionObject?.length ?? 0) >
                    MAX_VISIBLE_ITEM ? (
                      <Text style={styles.moreText}>
                        +{' '}
                        {(props?.formValues?.medicalConditionObject?.length ??
                          0) - MAX_VISIBLE_ITEM}{' '}
                        {strings.bookingFlow.more}
                      </Text>
                    ) : (
                      <Text style={styles.moreText}>
                        {strings.bookingFlow.addMore}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={{marginTop: heightScale(10)}}>
          <Text style={styles.title}>{strings.bookingFlow.instructions}</Text>
          <View style={styles.mainView}>
            <TouchableOpacity
              onPress={openInstructionModal}
              style={styles.instructionModalButton}>
              <Text
                numberOfLines={1}
                style={[
                  props?.formValues?.instructions
                    ? styles.instructionInputText
                    : styles.instructionInputPlaceholder,
                ]}>
                {props?.formValues?.instructions
                  ? props?.formValues?.instructions
                  : strings.medicine.add}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {isInstructionModalVisible && (
          <InstructionModal
            isVisible={isInstructionModalVisible}
            text={
              props?.formValues?.instructions
                ? props?.formValues?.instructions
                : ''
            }
            closeInstructionModal={closeInstructionModal}
            setInstructionValue={value => {
              props.setValues('instructions', value);
            }}
          />
        )}
        {isMedicalConditionVisible && (
          <MedicalConditionModal
            isGetMedicalConditionLoading={props.getMedicalConditionLoading}
            isGetMedicalConditionFail={props.getMedicalConditionFail}
            isMedicalConditionVisible={isMedicalConditionVisible}
            medicalConditionContent={
              props.getMedicalConditionSuccess?.data?.content
            }
            closeMedicalConditionModal={closeMedicalConditionModal}
            medicalCondition={props.formValues?.medicalConditionObject}
            onChangeMedicalCondtion={item => {
              props.setValues(
                'medicalCondition',
                item.map(value => value.id),
              );
              props.setValues('medicalConditionObject', item);
            }}
            getMedicalCondition={getMedicalConditionBySearch}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  verticalLines: {
    borderColor: colors.DarkGray2,
    borderLeftWidth: moderateScale(2),
    width: 2,
  },
  inputTextStyle: {
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
  },
  patientInputStyle: {
    height: 50,
  },
  ageInputStyle: {
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
  },
  title: {
    color: colors.Charcoal2,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
    fontWeight: '500',
  },
  astrik: {fontSize: normalize(12), color: colors.black},
  boxContainer: {
    flex: 1,
    width: Dimensions.get('window').width / 1.15,
    alignSelf: 'center',
  },
  mainView: {
    marginTop: heightScale(4),
    paddingRight: 0,
  },
  ageInputView: {
    marginTop: heightScale(4),
    width: widthScale(90),
  },

  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.Black5,
  },
  modalInner: {
    minHeight: '50%',
    backgroundColor: colors.white,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 12,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 12,
    lineHeight: 21,
    fontFamily: fonts.calibri.medium,
    color: colors.black,
    marginBottom: 12,
  },
  conditionSearchText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.calibri.regular,
    color: colors.DimGray2,
  },
  searchBox: {
    borderWidth: 1,
    borderColor: colors.LightGrey7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 100,
  },
  placeholderText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.DimGray2,
    fontFamily: fonts.calibri.regular,
  },
  tileView: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.Black6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  tileText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.calibri.regular,
    color: colors.DarkGray,
    marginRight: 4,
  },
  searchPlaceholderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 12,
    lineHeight: 18,
    flexDirection: 'row',
    alignSelf: 'center',
    color: colors.primary,
    fontFamily: fonts.calibri.medium,
    marginLeft: 8,
  },
  instructionModalButton: {
    borderWidth: 1,
    paddingHorizontal: 11,
    justifyContent: 'center',
    borderColor: colors.LightGrey7,
    borderRadius: 28,
    height: 45,
  },
  instructionInputText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.calibri.regular,
    color: colors.black,
  },
  instructionInputPlaceholder: {
    color: colors.DimGray2,
  },
  patientInfoContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.LightGrey7,
    borderRadius: 100,
    paddingHorizontal: widthScale(12),
  },
  travellerOtherContainer: {
    width: '100%',
    marginTop: heightScale(20),
    paddingRight: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  categoryRow: {flexDirection: 'row', justifyContent: 'space-between'},
  categoryBreedItem: {flex: 1, marginTop: heightScale(10)},
  categoryItem: {marginRight: 16},
  inputWithHeading: {flexDirection: 'row'},
  travellerInputContainer: {flex: 1},
  travellerName: {marginRight: 16},
});

const mapStateToProps = ({App}) => {
  const {
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
    getMedicalConditionLoading,
    getMedicalConditionFail,
    getMedicalConditionSuccess,
    getProfileSuccess,
    getMembersSuccess,
    projectConfigLoading,
    projectConfigSuccess,
    srCreationLoading,
    srCreationSuccess,
    animalCategorySuccess,
    animalCategoryLoading,
    animalCategoryFail,
    animalBreedSuccess,
    animalBreedLoading,
    animalBreedFail,
  } = App;
  return {
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
    getMedicalConditionLoading,
    getMedicalConditionFail,
    getMedicalConditionSuccess,
    getProfileSuccess,
    getMembersSuccess,
    projectConfigLoading,
    projectConfigSuccess,
    srCreationLoading,
    srCreationSuccess,
    animalCategorySuccess,
    animalCategoryLoading,
    animalCategoryFail,
    animalBreedSuccess,
    animalBreedLoading,
    animalBreedFail,
  };
};

const mapDispatchToProps = {
  getMedicalCondition,
  getMembers,
  projectConfigAction,
  srCreationApi,
  resetSrCreationApi,
  resetGetMembersApi,
  animalCategories,
  animalBreed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AmbulanceAndPaymentDetail);
