import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Context} from '../../../../providers/localization';
import {colors, scaling, fonts} from '../../../../library';
import _ from 'lodash';
import Modal from 'react-native-modal';
import {BackArrow} from '../../../../components/BackArrow';
import Input from '../../../../components/Input';
import IconAnt from 'react-native-vector-icons/AntDesign';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

export const SearchableComponent = ({
  data,
  selectedAirport,
  setSelectedAirport,
  searchText,
  setSearchText,
  statusError,
  loadMore,
  onHandleBack,
  type,
  loader,
  ...props
}) => {
  const strings = React.useContext(Context).getStrings();

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: heightScale(200),
        }}>
        <Text style={styles.emptyStateText}>
          {strings.groundAmbulance[type].emptyData}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.mainView}>
      <Modal
        isVisible={true}
        style={{margin: 0}}
        >
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            paddingHorizontal: widthScale(16),
            paddingVertical: Platform.OS ? heightScale(30) : heightScale(16),
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <BackArrow
              onPress={() => {
                onHandleBack();
              }}
              style={{marginTop: 0}}
            />
            <Input
              isSecondaryButton={true}
              placeholder={strings.groundAmbulance[type].searchPlaceholder}
              inputBoxStyle={styles.inputTextStyle}
              inputContainerStyle={styles.inputContainer}
              value={searchText}
              onChangeText={val => setSearchText(val)}
              containerStyle={styles.containerStyle}
              rightIcon={
                searchText.length ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchText('');
                    }}>
                    <IconAnt
                      name="close"
                      size={moderateScale(20)}
                      color={colors.black}
                    />
                  </TouchableOpacity>
                ) : null
              }
            />
          </View>
          <FlatList
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            keyboardShouldPersistTaps="handled"
            style={styles.flatListView}
            nestedScrollEnabled={true}
            data={data}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={ loader ? <ActivityIndicator size={'large'} />:'' }
            ListFooterComponentStyle={{height:'auto'}}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={styles.itemView}
                  onPress={() => {
                    setSelectedAirport(item);
                  }}>
                  <Text style={styles.displayOptionText}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  inputTextStyle: {
    fontFamily: fonts.calibri.regular,
  },
  mainView: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: colors.LightGrey7,
    paddingHorizontal: widthScale(10),
    paddingVertical: heightScale(4),
    borderRadius: normalize(20),
    marginTop: heightScale(4),
    marginRight: widthScale(10),
  },
  itemView: {
    paddingHorizontal: widthScale(2),
    paddingVertical: heightScale(10),
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  displayOptionText: {
    marginLeft: widthScale(8),
    color: colors.black,
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    letterSpacing: 0,
    width: '100%',
  },
  emptyStateText: {
    color: colors.black,
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(18),
    letterSpacing: 0,
    marginTop: heightScale(18),
  },
  containerStyle: {
    width: '85%',
  },
});
