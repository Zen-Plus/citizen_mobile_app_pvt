import {
  View,
  Text,
  Modal,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {colors, fonts} from '../../../library';
import Input from '../../../components/Input';
import {SearchIcon} from '../../../../assets';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../../components/CustomButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Context} from '../../../providers/localization';

const MedicalConditionModal = ({
  isMedicalConditionVisible,
  medicalConditionContent,
  medicalCondition = [],
  onChangeMedicalCondtion,
  closeMedicalConditionModal,
  getMedicalCondition,
  isGetMedicalConditionLoading,
  isGetMedicalConditionFail,
}) => {
  const strings = useContext(Context).getStrings();
  const [selectedItems, setSelectedItems] = useState({
    ...medicalCondition.reduce((prev, item) => {
      return {...prev, [item.id]: item};
    }, {}),
  });
  const {bottom} = useSafeAreaInsets();
  const [medicalConditionSearch, setMedicalConditionSearch] = useState('');

  useEffect(() => {
    onChangeMedicalCondtion(Object.values(selectedItems));
  }, [selectedItems]);

  useEffect(() => {
    getMedicalCondition && getMedicalCondition(medicalConditionSearch);
  }, [medicalConditionSearch]);

  const handleClickOnCondition = (item, isAdd) => {
    if (isAdd) {
      delete selectedItems[item.id];
      setSelectedItems({...selectedItems});
    } else {
      setSelectedItems({...selectedItems, [item.id]: item});
    }
  };

  const renderItem = ({item}) => {
    const isSelected = selectedItems[item.id];

    return (
      <TouchableOpacity
        onPress={() => handleClickOnCondition(item, isSelected)}
        style={[styles.inputDropdownMultiSelect]}>
        {isSelected ? (
          <MaterialCommunityIcons
            color={colors.primary}
            name="checkbox-marked"
            size={22}
            style={styles.inputDropDownIcon}
          />
        ) : (
          <MaterialCommunityIcons
            color={colors.DimGray2}
            name="checkbox-blank-outline"
            size={22}
            style={styles.inputDropDownIcon}
          />
        )}

        <Text style={[styles.inputDropdownText]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isMedicalConditionVisible}
      transparent={true}
      style={styles.modal}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={styles.modalBackground}>
          <View style={{flex: 1}} />
          <View
            style={[
              styles.modalInner,
              {
                paddingBottom: bottom + 10,
              },
            ]}>
            <Text style={styles.modalTitle}>
              {strings.bookingFlow.medicalCondition}
            </Text>
            <Input
              value={medicalConditionSearch}
              isSecondaryButton={true}
              placeholder=""
              inputBoxStyle={styles.conditionSearchText}
              multiline
              onChangeText={val => {
                setMedicalConditionSearch(val);
              }}
              rightIcon={
                isGetMedicalConditionLoading ? (
                  <ActivityIndicator size="small" color={colors.LightGrey7} />
                ) : (
                  <Image source={SearchIcon} style={{height: 24, width: 24}} />
                )
              }
              inputContainerStyle={styles.inputContainerStyle}
            />
            <FlatList
              data={medicalConditionContent}
              renderItem={renderItem}
              ItemSeparatorComponent={<View style={styles.separator} />}
              style={styles.optionList}
              ListEmptyComponent={
                isGetMedicalConditionFail ? (
                  <Text style={styles.errorText}>
                    {strings.common.somethingWentWrong}
                  </Text>
                ) : (
                  <View>
                    <Text style={styles.noDataFoundText}>
                      {strings.common.noDataFound}
                    </Text>
                  </View>
                )
              }
            />
            <CustomButton
              onPress={() => {
                closeMedicalConditionModal();
              }}
              title={strings.bookingFlow.done}
              titleTextStyles={{fontSize: 16}}
              containerStyles={styles.customButton}
              leftIconContainerStyles={{flex: 0}}
              rightIconContainerStyles={{flex: 0}}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MedicalConditionModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {flex: 1},
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.Black5,
  },
  modalInner: {
    height: '80%',
    backgroundColor: colors.white,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 16,
    paddingTop: 20,
  },
  modalTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: fonts.calibri.medium,
    color: colors.black,
    marginBottom: 16,
  },
  conditionSearchText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.calibri.regular,
    color: colors.DimGray2,
  },
  submitButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  inputDropdownText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.calibri.regular,
    color: colors.DimGray2,
  },
  inputDropdownMultiSelect: {
    flexDirection: 'row',
    paddingVertical: 2.5,
  },
  separator: {
    height: 18,
  },
  optionList: {
    flex: 1,
    marginTop: 10,
  },
  inputDropDownIcon: {
    marginRight: 8,
  },
  customButton: {
    flex: 0,
    marginTop: 31,
    alignSelf: 'center',
    width: '95%',
  },
  inputContainerStyle: {
    padding: 14,
    paddingRight: undefined,
    paddingTop: 8,
    paddingBottom: 12,
  },
  noDataFoundText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.calibri.regular,
    color: colors.black,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.calibri.regular,
    color: colors.red,
  },
});
