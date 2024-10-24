import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {Context} from '../../../../providers/localization';
import {colors, fonts, scaling} from '../../../../library';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../../../components/CustomButton';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const CorporateBookingModal = props => {
  const strings = React.useContext(Context).getStrings();

  return (
    <Modal
      style={styles.modalContainer}
      isVisible={props.isVisible}
      avoidKeyboard={true}
      onBackdropPress={props.onCancel}
    >
      <View style={styles.innerView}>
        <View style={{alignItems: 'flex-end', marginHorizontal: widthScale(10)}}>
          <IconMaterial
            name={'close'}
            size={32}
            onPress={props.onCancel}
            color={colors.black}
          />
        </View>
        <View style={{marginTop: heightScale(8)}}>
          <Text style={styles.title}>{strings.homeScreen.corporateAmbulance}</Text>
        </View>
        <View style={{marginTop: heightScale(15), flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={{flex: 1, marginHorizontal: widthScale(8)}}>
            <CustomButton
              title={strings.common.yes}
              onPress={props.onYes}
              containerStyles={{flex: 0}}
              leftIconContainerStyles={{flex: 0}}
              rightIconContainerStyles={{flex: 0}}
            />
          </View>
          <View style={{flex: 1, marginHorizontal: widthScale(8)}}>
            <CustomButton
              title={strings.common.no}
              onPress={props.onNo}
              containerStyles={{flex: 0}}
              leftIconContainerStyles={{flex: 0}}
              rightIconContainerStyles={{flex: 0}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  innerView: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(30),
    padding: moderateScale(15),
  },
  title: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(16),
    color: colors.DarkGray,
    textAlign: 'center',
  },
});

export default CorporateBookingModal;
