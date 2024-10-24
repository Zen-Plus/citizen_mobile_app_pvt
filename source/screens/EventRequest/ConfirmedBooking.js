import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image,TouchableOpacity} from 'react-native';
import {colors, scaling, fonts} from '../../library';
import Modal from 'react-native-modal';
import {Context} from '../../providers/localization';
import {Emergency} from '../../../assets';
import {BackArrow} from '../../components/BackArrow';


const {normalize, widthScale, heightScale, moderateScale} = scaling;

export const ConfirmedBooking = props => {
  const strings = useContext(Context).getStrings();
  const {EventRequest} = strings;
  const {isVisible,onBackPress,onViewDetailsPressed,srNumber} = props;
  return (
    <Modal isVisible={isVisible} style={styles.modal}>
      <View style={styles.mainView}>
        <View style={styles.innerView}>
          <View style={styles.headingView}>
            <Text style={styles.modalTitle}>
              {EventRequest.yourRequestReceive}
            </Text>
            <Text style={styles.outTeamText}>
              {EventRequest.ourTeamWillReach}
            </Text>
            <Text style={styles.srNoText}>{srNumber}</Text>
            <View style={styles.imgView}>
              <Image source={Emergency} style={styles.emergencyImg} />
            </View>
              <View
                style={styles.footerSubButtonContainerContainer}>
                <BackArrow
                  onPress={onBackPress}
                  style={{marginTop: 0}}
                />
                <TouchableOpacity 
                  style={styles.viewDetailsBtn} 
                  onPress={onViewDetailsPressed}>
                    <Text style={styles.viewDetailsText}>{EventRequest.viewDetails}</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  mainView: {
    justifyContent: 'flex-end',
    flex: 1,
    paddingTop: heightScale(20),
  },
  innerView: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
  headingView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightScale(22),
  },
  modalTitle: {
    color: colors.DarkGray,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.bold,
  },
  outTeamText: {
    color: colors.DimGray2,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.medium,
  },
  srNoText: {
    marginVertical: heightScale(20),
    color: colors.DarkGray,
    fontSize: normalize(14),
    fontWeight: '700',
    fontFamily: fonts.calibri.medium,
  },
  imgView: {
    alignItems: 'center',
    marginVertical: heightScale(20),
  },
  footerSubButtonContainerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: heightScale(30),
  },
  viewDetailsBtn:{
    minWidth: widthScale(220),
    backgroundColor: colors.primary,
    borderRadius: normalize(20),
    height: heightScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: widthScale(12),
  },
  viewDetailsText:{
    color: colors.white,
    fontSize: normalize(14),
    fontWeight: '700',
    fontFamily: fonts.calibri.medium,
  }
});
