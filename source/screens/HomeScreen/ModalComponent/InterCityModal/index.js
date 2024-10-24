import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {Context} from '../../../../providers/localization';
import {colors, fonts, scaling} from '../../../../library';
import Feather from 'react-native-vector-icons/Feather';
import {openContact} from '../../../../components/functions';
import {GreyCrossIcon, MapPinLine} from '../../../../../assets';
const {normalize, widthScale, heightScale, moderateScale} = scaling;

const IntercityModal = props => {
  const strings = React.useContext(Context).getStrings();
  const {homeScreen} = strings;

  const onCloseModal = () => {
    props.setIsIntercityVisible(false);
  };

  return (
    <Modal
      style={styles.modalContainer}
      isVisible={props.isIntercityVisible}
      avoidKeyboard={true}
      onBackdropPress={onCloseModal}>
      <View style={styles.innerView}>
        <TouchableOpacity onPress={onCloseModal} style={styles.crossBtn}>
          <Image source={GreyCrossIcon} />
        </TouchableOpacity>
        <View style={styles.mapIconView}>
          <Image
            source={MapPinLine}
            style={{height: moderateScale(50), width: moderateScale(50)}}
          />
        </View>
        <Text style={styles.title}>{homeScreen.interCityTitle}</Text>
        <Text style={styles.subTitle}>{homeScreen.interCityMessage}</Text>
        <TouchableOpacity
          onPress={() => {
            openContact(props.supportNumber);
            props.setIsIntercityVisible(false);
          }}>
          <View style={styles.callButton}>
            <Feather name="phone-call" color={colors.primary} size={18} />
            <Text style={styles.callText}>{homeScreen.CallSupport}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default IntercityModal;

const styles = StyleSheet.create({
  modalContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  innerView: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(30),
    padding: moderateScale(15),
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: heightScale(8),
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    color: colors.DarkGray,
    marginHorizontal: widthScale(15),
  },
  subTitle: {
    textAlign: 'center',
    marginTop: heightScale(36),
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    color: colors.DarkGray,
    marginHorizontal: widthScale(15),
  },
  callButton: {
    marginTop: heightScale(36),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: moderateScale(30),
    paddingVertical: heightScale(10),
    paddingHorizontal: widthScale(20),
    marginBottom: heightScale(15),
    flexDirection: 'row',
  },
  callText: {
    color: colors.primary,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(13),
    marginLeft: widthScale(5),
  },
  mapIconView: {
    padding: 4,
    marginTop: heightScale(15),
  },
  innerCircle: {},
  crossBtn: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 16
  },
});
