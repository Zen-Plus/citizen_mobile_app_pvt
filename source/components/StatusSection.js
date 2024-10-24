import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {colors, scaling, fonts} from '../library';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Context} from '../providers/localization';
const {normalize, widthScale, heightScale, moderateScale} = scaling;

const StatusSection = ({
  data,
  selectedRelative,
  setSelectedRelative,
  searchText,
  setSearchText,
  statusError,
}) => {
  const strings = React.useContext(Context).getStrings();
  const {closeJobs, groundAmbulance} = strings;
  const [activeIndex, setActiveIndex] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const searchableDropdown = (
    displayValue,
    index,
    isDisabled,
    isSearchable,
  ) => {
    if (
      isSearch &&
      activeIndex !== null &&
      index === activeIndex &&
      !isDisabled
    ) {
      return (
        <>
          <View style={[styles.dropdownView]}>
            {isSearchable ? (
              <TextInput
                placeholder=""
                autoCompleteType="off"
                style={styles.dropDowntextInput}
                autoFocus={true}
                onChangeText={text => setSearchText(text)}
                value={searchText}
                onPressIn={() => setActiveIndex(0)}
                onPressOut={() => setActiveIndex(null)}
              />
            ) : null}
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                setSelectedRelative();
              }}
              activeOpacity={0.8}>
              {filterData.length > 0 ? (
                <IconAnt
                  name="close"
                  size={moderateScale(20)}
                  color={colors.DimGray2}
                />
              ) : null}
            </TouchableOpacity>
          </View>
        </>
      );
    } else {
      return (
        <TouchableOpacity
          style={
            isDisabled
              ? [styles.dropDownSelect, {backgroundColor: colors.gray400}]
              : styles.dropDownSelect
          }
          disabled={isDisabled}
          onPress={() => {
            if (activeIndex !== index) {
              setSelectedRelative();
              setSearchText('');
            }
            setIsSearch(true);
            setActiveIndex(index);
          }}
          onBlur={() => {
            setActiveIndex(null);
            setSearchText('');
            setSelectedRelative();
          }}
          activeOpacity={0.8}>
          <Text
            style={
              displayValue === groundAmbulance.patientName
                ? styles.placeholderText
                : styles.displayOptionText
            }>
            {displayValue}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const ListEmptyComponent = () => {
    return <Text>No Match found</Text>;
  };

  const filterData = data.filter(item =>
    searchText === ''
      ? true
      : item.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.lastName &&
          item.lastName.toLowerCase().includes(searchText.toLowerCase()))
      ? true
      : false,
  );

  return (
    <View style={{flex: 1, paddingBottom: heightScale(16)}}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
        <View>
          <TouchableOpacity
            onPress={() => {
              setIsSearch(true);
            }}>
            {searchableDropdown(
              selectedRelative
                ? selectedRelative?.lastName
                  ? selectedRelative.firstName
                  : selectedRelative.firstName
                : groundAmbulance.patientName,
              0,
              false,
              true,
            )}
            {statusError && (
              <Text style={styles.error}>{closeJobs.requiredField}</Text>
            )}
          </TouchableOpacity>
          {activeIndex === 0 && filterData.length > 0 && (
            <View>
              <FlatList
                keyboardShouldPersistTaps="handled"
                maxHeight={heightScale(120)}
                style={styles.mainView}
                nestedScrollEnabled={true}
                data={filterData}
                ListEmptyComponent={ListEmptyComponent}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={styles.itemView}
                      onPress={() => {
                        setActiveIndex(null);
                        setIsSearch(false);
                        setSelectedRelative(item);
                        setSearchText('');
                      }}>
                      <Text style={styles.displayOptionText}>
                        {item.lastName ? item.firstName : item.firstName}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.lightGrey,
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    letterSpacing: 0,
    paddingHorizontal: widthScale(16),
    marginTop: heightScale(20),
    marginBottom: heightScale(12),
  },

  error: {
    color: colors.primary,
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(12),
    letterSpacing: 0,
    paddingHorizontal: widthScale(16),
  },
  displayOptionText: {
    marginLeft: widthScale(8),
    letterSpacing: 0,
    width: '100%',
    color: colors.black,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    lineHeight: normalize(26),
  },
  placeholderText: {
    marginLeft: widthScale(0),
    color: colors.DimGray2,
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    letterSpacing: 0,
    lineHeight: normalize(26),
    width: '100%',
  },
  dropDownSelect: {
    borderWidth: 1,
    borderColor: colors.LightGrey7,
    borderRadius: normalize(100),
    paddingHorizontal: widthScale(14),
    width: '100%',
    paddingVertical: heightScale(8),
  },
  itemView: {
    height: heightScale(36),
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  mainView: {
    borderWidth: 0.5,
    borderColor: colors.LightGrey7,
    paddingHorizontal: widthScale(10),
    paddingVertical: heightScale(4),
    borderRadius: normalize(20),
    marginTop: heightScale(4),
    marginRight: widthScale(10),
  },
  dropdownView: {
    borderWidth: 1,
    borderColor: colors.LightGrey7,
    borderRadius: moderateScale(100),
    paddingRight: widthScale(22),
    paddingLeft: widthScale(12),
    height: heightScale(36),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dropDowntextInput: {
    width: '100%',
    color: colors.black,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    borderRadius: moderateScale(100),
  },
});

export default StatusSection;
