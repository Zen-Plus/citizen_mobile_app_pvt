import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import {SearchableComponent} from '../SearchableComponentModal';
import Input from '../../../../components/Input';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

function SelectAirport({
  label,
  placeholder,
  data,
  selectedAirport,
  setSelectedAirport,
  searchText,
  setSearchText,
  loadMore,
  readonly,
  loader,
  type,
}) {
  const [openMapClick, setOpenMapClick] = useState(false);

  const onSelectedAirport = item => {
    setSelectedAirport(item);
    setOpenMapClick(false);
  };

  return (
    <View style={{width: '100%', paddingLeft: 2}}>
      <Text style={styles.title}>{label}</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            width: '100%',
          }}
          onPress={() => {
            setOpenMapClick(true);
          }}
          disabled={readonly}>
          <View pointerEvents="none">
            <Input
              isSecondaryButton={true}
              placeholder={placeholder}
              inputBoxStyle={
                selectedAirport && selectedAirport?.name
                  ? styles.inputTextStyle
                  : styles.placeholderText
              }
              inputContainerStyle={styles.inputContainer}   
              value={selectedAirport && selectedAirport?.name}
              onChangeText={val => {}}
              editable={false}
              containerStyle={styles.containerStyle}
              multiline={true}
            />
          </View>
        </TouchableOpacity>
      </View>
      {openMapClick && (
        <SearchableComponent
          type={type}
          data={data}
          selectedAirport={selectedAirport}
          setSelectedAirport={item => onSelectedAirport(item)}
          searchText={searchText}
          setSearchText={setSearchText}
          loadMore={loadMore}
          loader={loader}
          onHandleBack={() => {
            setOpenMapClick(false);
            setSearchText('');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  verticalLine: {
    height: heightScale(13),
    borderColor: colors.Black1,
    width: moderateScale(1),
    borderWidth: moderateScale(0.5),
    marginLeft: widthScale(5),
    flex: 1,
  },
  redDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.Red,
  },
  blueDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.SlateBlue,
  },
  title: {
    fontSize: normalize(12),
    fontWeight: '400',
    fontFamily: fonts.calibri.medium,
    color: colors.Gray,
  },
  tiInputStyles: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    fontSize: normalize(13),
    lineHeight: normalize(16),
    color: colors.DarkGray,
  },
  tiStyle: {
    width: '100%',
    borderBottomWidth: widthScale(0),
  },
  inputTextStyle: {
    fontFamily: fonts.calibri.semiBold,
    fontSize: normalize(14),
    fontWeight: '600',
    color: colors.DarkGray,
  },
  placeholderText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    fontWeight: '400',
    color: colors.DimGray2,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: widthScale(1),
    borderColor: colors.white,
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(12),
    paddingVertical: heightScale(4),
    borderColor: colors.LightGrey7,
    borderRadius: moderateScale(100),
    maxHeight: 70,
  },
  containerStyle: {},
});

export default SelectAirport;
