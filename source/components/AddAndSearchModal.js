import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, fonts, scaling} from '../library';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomButton from './CustomButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Context} from '../providers/localization';
import {SelectedRadio, UnselectedRadio} from '../../assets';

const {heightScale, widthScale} = scaling;

const ListEmptyComponent = () => {
  return <Text>No Match found</Text>;
};

const AddAndSearchModal = ({
  data = [],
  selectedRelative,
  setSelectedRelative,
  searchText,
  setSearchText,
  patientValue,
  setPatientValue,
}) => {
  const {bottom} = useSafeAreaInsets();
  const [currentSelected, setCurrentSelected] = useState(selectedRelative);
  const strings = React.useContext(Context).getStrings();

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  useEffect(() => {
    return () => {
      setSearchText('');
    };
  }, []);

  const filterData = data.filter(item =>
    searchText === ''
      ? true
      : item.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.lastName &&
          item.lastName.toLowerCase().includes(searchText.toLowerCase()))
      ? true
      : false,
  );

  const value =
    selectedRelative && selectedRelative?.firstName
      ? selectedRelative?.firstName
      : patientValue
      ? patientValue
      : '';

  return (
    <View>
      <TouchableOpacity
        style={styles.patientInfoContainer}
        onPress={() => {
          setIsSearchModalVisible(true);
        }}>
        <View style={styles.innerContainer}>
          <Text
            style={[
              styles.displayOptionText,
              !value.length && {
                color: colors.DimGray2,
              },
            ]}>
            {value ? value : strings.bookingFlow.patientName}
          </Text>
        </View>
      </TouchableOpacity>
      <Modal
        visible={isSearchModalVisible}
        transparent={true}
        style={styles.modal}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}>
          <View style={styles.modalBackground}>
            <View style={[styles.modalInner, {paddingBottom: bottom + 20}]}>
              <View style={{flex: 1}}>
                <Text style={styles.modalTitle}>
                  {strings.bookingFlow.patientName}
                </Text>
                <TextInput
                  value={searchText}
                  onChangeText={val => setSearchText(val)}
                  style={[styles.dropDowntextInput]}
                  placeholder={strings.bookingFlow.patientName}
                />
                <FlatList
                  data={filterData}
                  style={styles.list}
                  keyboardShouldPersistTaps="handled"
                  maxHeight={120}
                  nestedScrollEnabled={true}
                  ListEmptyComponent={ListEmptyComponent}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        style={styles.itemView}
                        onPress={() => {
                          setCurrentSelected(item);
                        }}>
                        <Image
                          source={
                            currentSelected?.id === item?.id
                              ? SelectedRadio
                              : UnselectedRadio
                          }
                        />
                        <Text style={styles.displayOptionText}>
                          {item.lastName ? item.firstName : item.firstName}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              <CustomButton
                onPress={() => {
                  if (!filterData.length) {
                    let searchValue = searchText;
                    setPatientValue(searchValue);
                    setSelectedRelative();
                  } else {
                    setSelectedRelative(currentSelected);
                    setPatientValue('');
                  }
                  setIsSearchModalVisible(false);
                }}
                title={strings.bookingFlow.done}
                titleTextStyles={{fontSize: 16}}
                containerStyles={{flex: 0, marginTop: 31}}
                leftIconContainerStyles={{flex: 0}}
                rightIconContainerStyles={{flex: 0}}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    </View>
  );
};

export default AddAndSearchModal;

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
    height: '60%',
    backgroundColor: colors.white,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 12,
    paddingBottom: 16,
  },
  displayOptionText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    textAlignVertical: 'center',
  },
  innerContainer: {
    height: 50,
    justifyContent: 'center',
  },
  itemView: {
    height: 36,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDowntextInput: {
    color: colors.black,
    fontSize: 14,
    lineHeight: 16,
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 10,
    paddingTop: 12,
  },
  dropDownSelect: {
    borderColor: colors.LightGrey7,
    borderRadius: 100,
    width: '100%',
    paddingHorizontal: widthScale(12),
    paddingVertical: heightScale(8),
    borderWidth: 1,
  },
  list: {
    flex: 1,
    marginTop: 16,
  },
  patientInfoContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.LightGrey7,
    borderRadius: 100,
    paddingHorizontal: widthScale(12),
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: fonts.calibri.medium,
    color: colors.black,
    marginBottom: 16,
  },
});
