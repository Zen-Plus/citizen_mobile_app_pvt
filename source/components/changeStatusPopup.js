import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import IconEntypo from "react-native-vector-icons/Entypo";
import { colors, scaling, fonts } from "../library";
import { Context } from "../providers/localization";
import IconAnt from "react-native-vector-icons/AntDesign";
import { Button } from "./button";
import Modal from "react-native-modal";
import { tripStatus } from "../constants";

const { normalize, widthScale, heightScale, moderateScale } = scaling;

const ChangeStatusPopup = ({
  isVisible,
  currentStatus,
  newStatus,
  closePopup,
  onPress,
  backToParking,
  showBackToParking,
}) => {
  const strings = React.useContext(Context).getStrings();
  const { changeStatusPopup, jobDetails } = strings;

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.3} style={styles.modal}>
      <View style={styles.mainView}>
        <TouchableOpacity
          style={styles.iconInnerView}
          activeOpacity={0.8}
          onPress={closePopup}
        >
          <IconAnt name="close" size={moderateScale(20)} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.innerView}></View>
        <View style={styles.bottomView}>
          <Text style={styles.cnfrmMessage}>
            {changeStatusPopup.cnfrmMessage}
          </Text>
          <View style={styles.lineView}></View>
          <Text style={[styles.tripMessage]}>
            {currentStatus !== tripStatus.PATIENT_DROPPED
              ? changeStatusPopup.tripMessage
              : jobDetails.closeTripStmt}
          </Text>
          <View style={styles.innerBottomView}>
            <View style={styles.currentStatusView}>
              <Text style={styles.status}>
                {changeStatusPopup.currentStatus}
              </Text>
              <Text style={styles.location}>{currentStatus}</Text>
            </View>
            <View style={styles.arrowIcon}>
              <IconAnt
                name="arrowright"
                size={moderateScale(20)}
                color={colors.black}
              />
            </View>
            <View style={styles.newStatusView}>
              <Text style={styles.status}>{changeStatusPopup.newStatus}</Text>
              <Text style={styles.location}>{newStatus}</Text>
            </View>
          </View>
          {showBackToParking && (
            <TouchableOpacity
              onPress={() => {
                backToParking();
              }}
              style={styles.btpContainer}
            >
              <Text
                style={{
                  fontSize: normalize(14),
                  fontFamily: fonts.calibri.regular,
                  color: colors.red,
                }}
              >
                {jobDetails.backToParking}
              </Text>
            </TouchableOpacity>
          )}
          <View style={styles.buttonView}>
            <Button
              title={
                currentStatus === tripStatus.TRIP_COMPLETE
                  ? tripStatus.closetrip
                  : changeStatusPopup.changeStatus
              }
              color={colors.white}
              backgroundColor={colors.lightRed2}
              primary
              onPress={onPress}
            />
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
    justifyContent: "flex-end",
    flex: 1,
  },
  innerView: {
    height: heightScale(15),
  },
  iconOuterView: {
    backgroundColor: colors.pureTransparent,
    alignItems: "center",
    marginLeft: widthScale(16),
    marginRight: widthScale(16),
  },
  iconInnerView: {
    backgroundColor: colors.white,
    width: heightScale(36),
    height: heightScale(36),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: widthScale(32),
    marginRight: widthScale(16),
    alignSelf: "center",
  },
  bottomView: {
    backgroundColor: "white",
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
  },
  cnfrmMessage: {
    fontFamily: fonts.calibri.bold,
    fontWeight: "bold",
    fontSize: normalize(16),
    color: colors.greyishBrownTwo,
    alignSelf: "center",
    marginTop: heightScale(20),
    paddingHorizontal: widthScale(16),
  },
  lineView: {
    height: heightScale(1),
    marginTop: heightScale(20),
    backgroundColor: colors.lightGrey2,
  },
  tripMessage: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(16),
    color: colors.greyishBrownTwo,
    alignSelf: "center",
    marginTop: heightScale(20),
    paddingHorizontal: widthScale(16),
    textAlign: "center",
  },
  innerBottomView: {
    marginTop: heightScale(26),
    flexDirection: "row",
    paddingHorizontal: widthScale(16),
    marginBottom: heightScale(35),
    alignItems: "flex-end",
    // alignContent: "center",
    alignSelf: "center",
  },
  currentStatusView: {
    marginRight: widthScale(24),
    flex: 1,
    flexWrap: "wrap",
    width: "50%",
    alignItems: "center",
    alignContent: "center",
  },
  status: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    color: colors.lightGrey,
  },
  location: {
    fontWeight: "bold",
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(16),
    color: colors.greyishBrownTwo,
    alignSelf: "center",
    textAlign: "center",
  },
  arrowIcon: {
    backgroundColor: colors.lightGrey2,
    width: heightScale(36),
    height: heightScale(36),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },
  newStatusView: {
    marginLeft: widthScale(24),
    flex: 1,
    flexWrap: "wrap",
    width: "50%",
    alignItems: "center",
    alignContent: "center",
  },
  buttonView: {
    paddingHorizontal: widthScale(16),
    marginBottom: heightScale(18),
  },
  btpContainer: {
    marginBottom: heightScale(18),
    alignItems: "center",
  },
});

export default ChangeStatusPopup;
