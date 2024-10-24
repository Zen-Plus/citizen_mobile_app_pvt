import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {height} from '../../../library/device';
import {
  SelectedRadio,
  UnselectedRadio,
  GreyCrossIcon,
  Info,
} from '../../../../assets';
import {colors, fonts} from '../../../library';
import {CashIcon, MobileIcon} from '../../../../assets';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Icons = {
  CASH: CashIcon,
  ONLINE: MobileIcon,
};

const hitSlop = {top: 20, left: 20, right: 20, bottom: 20};

const AmbulanceAndPaymentOption = ({data, value, onChange, isInfoItem}) => {
  const {bottom} = useSafeAreaInsets();
  const [modalData, setModalData] = useState(null);

  const onCloseModal = () => {
    setModalData(null);
  };

  const renderItem = ({item}) => {
    if (isInfoItem) {
      return (
        <View style={styles.renderItem}>
          <TouchableOpacity
            style={styles.buttonClick}
            onPress={() => {
              onChange(item);
            }}>
            <View style={styles.detailIcon}>
              <Image
                source={item.id === value ? SelectedRadio : UnselectedRadio}
                style={styles.radio}
              />
              {Icons[item?.id] && (
                <Image source={Icons[item?.id]} style={styles.icon} />
              )}
              <Text style={styles.renderItemText}>{item.name}</Text>
            </View>
          </TouchableOpacity>

          {item.id === value && (
            <TouchableOpacity
              hitSlop={hitSlop}
              onPress={() => {
                setModalData(item);
              }}>
              <Image source={Info} />
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => onChange(item)}
        style={styles.renderItem}>
        <>
          <Image
            source={item.id === value ? SelectedRadio : UnselectedRadio}
            style={styles.radio}
          />
          <Image source={Icons[item?.id]} style={styles.icon} />
          <Text style={styles.renderItemText}>{item.name}</Text>
        </>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        maxHeight: height * 0.7,
      }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={<View style={styles.itemSeparator} />}
      />
      {modalData && (
        <Modal
          style={styles.modal}
          transparent={true}
          visible={Boolean(modalData)}>
          <View style={styles.modalBackground}>
            <View style={[styles.modalInner, {paddingBottom: bottom + 20}]}>
              <View style={{flex: 1, backgroundColor: 'white'}}>
                <View style={styles.header}>
                  <Text style={styles.modalHeading}>
                    {modalData?.name ?? ''}
                  </Text>
                  <TouchableOpacity
                    onPress={onCloseModal}
                    style={styles.crossBtn}>
                    <Image source={GreyCrossIcon} />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}>
                  <Text style={styles.description}>
                    {modalData?.description ?? ''}
                  </Text>
                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default AmbulanceAndPaymentOption;

const styles = StyleSheet.create({
  renderItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  radio: {
    height: 28,
    width: 28,
    marginRight: 18,
  },
  renderItemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: fonts.calibri.medium,
    color: colors.DarkGray,
  },
  itemSeparator: {
    height: 12,
  },
  icon: {
    marginRight: 8,
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
  keyboardAvoidingView: {flex: 1},
  modalInner: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: '40%',
  },
  modalHeading: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
    fontFamily: fonts.calibri.medium,
  },
  crossBtn: {
    marginRight: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.black,
    fontFamily: fonts.calibri.regular,
  },
  scrollView: {
    flex: 1,
  },
  detailIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonClick: {
    flex: 1,
  },
});
