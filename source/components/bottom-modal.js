import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, scaling, fonts} from '../library';
import IconAnt from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

export const BottomModal = props => (
  <Modal isVisible={true} backdropOpacity={0.3} style={styles.modal}>
    <View style={styles.mainView}>
      <View style={styles.innerView}>
        <View style={styles.innerFlexViewUpper}>
          <View style={styles.header}>
            <Text style={[styles.title, props.titleStyle]}>{props.title}</Text>
            <TouchableOpacity
              style={styles.iconInnerView}
              activeOpacity={0.8}
              onPress={() => props.setCloseBottomModal(false)}>
              <IconAnt
                name="close"
                size={moderateScale(20)}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>
          {props.children}
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  mainView: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  innerView: {
    backgroundColor: colors.white,
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: heightScale(24),
  },
  title: {
    fontSize: normalize(16),
    color: colors.greyishBrownTwo,
    letterSpacing: 0,
    fontFamily: fonts.calibri.bold,
    fontWeight: 'bold',
  },
  innerFlexViewUpper: {
    marginVertical: heightScale(24),
    paddingHorizontal: widthScale(16),
  },
});
