import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import IconEntypo from "react-native-vector-icons/Entypo";
import { colors, scaling, fonts } from "../library";
import { Context } from "../providers/localization";
import IconAnt from "react-native-vector-icons/AntDesign";
import { Button } from "./button";
import Modal from "react-native-modal";
import { tripStatus } from "../constants";
import { OtpVerified } from "../../assets";
import {PreventDoubleClickWithOpacity} from 'react-native-prevent-double-click';

const { normalize, widthScale, heightScale, moderateScale } = scaling;

const OTPVerifiedPopup = ({
  isVisible,
  onHandleContinue,
}) => {
  const strings = React.useContext(Context).getStrings();

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.3} style={styles.modal}>
      <View style={styles.mainView}>
        <View style={styles.card}>
          <Image source={OtpVerified} style={styles.successIcon} resizeMode="contain" />
            <Text style={styles.verifiedText}>
              {strings.otpScreen.verified}
            </Text>
            <Text style={styles.verifiedSubText}>
              {strings.otpScreen.verifiedSuccessfully}
            </Text>
            <PreventDoubleClickWithOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={onHandleContinue}>
                <Text style={styles.buttonText}>
                  {strings.otpScreen.confirm}
                </Text>
            </PreventDoubleClickWithOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: widthScale(25),
  },
  card: {
    backgroundColor: colors.white,
    width: '100%',
    borderRadius: moderateScale(20),
    paddingHorizontal: widthScale(45),
    paddingVertical: heightScale(45),
    alignItems: "center",
    justifyContent: "center",
  },
  successIcon: {
    height: heightScale(68),
    width: heightScale(68),
  },
  button: {
    alignSelf: 'center',
    backgroundColor: colors.darkGreen,
    color: colors.white,
    width: '100%',
    height: heightScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(100),
    marginTop: heightScale(26),
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  verifiedText: {
    color: colors.black,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginTop: heightScale(15),
  },
  verifiedSubText: {
    color: colors.steelgray,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(12),
    fontWeight: 'bold',
    marginTop: heightScale(15),
    textAlign: 'center',
  },
});

export default OTPVerifiedPopup;
