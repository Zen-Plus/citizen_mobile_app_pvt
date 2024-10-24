import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from "react-redux";
import { colors, scaling, fonts } from '../library';
import { Button } from './button';
import Modal from "react-native-modal";
import {
  updateDeviceTimeIncorrect,
} from '../redux/actions/app.actions';

const { heightScale, widthScale, moderateScale, normalize } = scaling;

const DeviceTimeIncorrectModal = (props) => {

  const {
    deviceTimeIncorrect,
  } = props;

  return (
    
      <Modal isVisible={deviceTimeIncorrect}>
        <View style={styles.modalContainer}>
          <View style={{marginTop: heightScale(25)}}>
            <Text style={styles.modalHeadingText}>
              {'Alert'}
            </Text>
          </View>

          <View style={{marginTop: heightScale(20), paddingHorizontal: widthScale(16)}}>
            <Text style={styles.modalBodyText}>
              {'Your device time is incorrect please correct the device time from settings and relaunch the application.'}
            </Text>
          </View>

          <View style={styles.modalButtonContainer}>
            <View style={{width: widthScale(110)}}>
              <Button
                title={'OK'}
                color={colors.white}
                primary
                backgroundColor={colors.primary}
                onPress={() => props.updateDeviceTimeIncorrect({
                  isIncorrectTime: false,
                })}
              />
            </View>
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  container: {
    flex: 1,
    marginTop: heightScale(20),
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: heightScale(14),
    paddingHorizontal: widthScale(16),
    alignItems: 'center',
  },
  bottomBorder: {
    height: heightScale(1),
    opacity: 0.4,
    borderRadius: moderateScale(2),
    backgroundColor: colors.gray50,
  },
  crewTypeContainer: {
    width: widthScale(52),
    height: heightScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(10),
  },
  crewTypeContainerText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(12),
    color: colors.white,
    fontWeight: 'bold',
  },
  listUserNameText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: colors.gray900,
  },
  listNameText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    fontWeight: 'normal',
    color: colors.gray900,
  },
  noFieldSelectedError: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(16),
    color: colors.red,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    // alignItems: "center",
    borderRadius: moderateScale(5),
    borderWidth: 1,
    // flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  modalHeadingText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
  },
  modalBodyText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(16),
    fontWeight: 'normal',
    color: colors.dark,
    textAlign: 'center',
  },
  modalButtonContainer: {
    marginTop: heightScale(22),
    marginBottom: heightScale(16),
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: widthScale(16),
  },
});

const mapStateToProps = ({ App, Auth }) => {
  const {
    deviceTimeIncorrect,
  } = App;
  return {
    deviceTimeIncorrect,
  };
};

const mapDispatchToProps = {
  updateDeviceTimeIncorrect,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceTimeIncorrectModal);
