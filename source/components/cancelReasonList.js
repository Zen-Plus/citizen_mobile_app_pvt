import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {Context} from '../providers/localization';
import RadioForm from 'react-native-simple-radio-button';
import {TextInput} from '../components';
import {colors, scaling, fonts} from '../library';
const {normalize, widthScale, heightScale, moderateScale} = scaling;

const CancelReasonList = props => {
  const finalData = props.data.data.map((value, index, array) => {
    return {label: value, value: index};
  });
  const strings = React.useContext(Context).getStrings();
  const [selectedValue, setSelectedValue] = useState({value: 0});
  const [enteredReason, setEnteredReason] = useState('');

  const onSubmit = () => {
    if (finalData[selectedValue.value]?.label === 'Other') {
      Keyboard.dismiss();
      setTimeout(() => {
        props.selectedValue(enteredReason);
        props.disableIsVisible(false);
      }, 15);
    } else {
      props.disableIsVisible(false);
      props.selectedValue(finalData[selectedValue.value]?.label);
    }
  };

  // Cancel Alert before submit function
  // const cancelAlert = () => {
  //   Alert.alert(
  //     strings.RequestDetailsScreen.cancelRequest,
  //     strings.RequestDetailsScreen.areYouSure,
  //     [
  //       {
  //         text: 'Ok',
  //         onPress: onSubmit,
  //         style: 'ok',
  //       },
  //       {
  //         text: 'Cancel',
  //         style: 'Cancel',
  //       },
  //     ],
  //   );
  // };
  return (
    <Modal
      isVisible={props.isVisible}
      avoidKeyboard={true}
      onBackdropPress={() => {
        props.disableIsVisible(false);
      }}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {strings.RequestDetailsScreen.selectCancelReason}
          </Text>
        </View>
        <View style={styles.radioContainer}>
          <RadioForm
            buttonColor={colors.primary}
            buttonSize={moderateScale(15)}
            selectedButtonColor={colors.primary}
            radio_props={finalData}
            buttonInnerColor={colors.primary}
            initial={selectedValue.value}
            onPress={value => {
              setSelectedValue({value: value});
            }}
          />
        </View>
        <View style={styles.textInputView}>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textInputContainer}
            multiline={true}
            placeholder="Reason"
            autoCapitalize="words"
            onChangeText={value => setEnteredReason(value)}
            inputStyles={styles.inputStyles}
            editable={
              finalData[selectedValue.value]?.label === 'Other' ? true : false
            }
          />
        </View>
        <View style={[styles.row, {paddingBottom: moderateScale(10)}]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                props.disableIsVisible(false);
              }, 10);
            }}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={onSubmit}>
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CancelReasonList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
  },
  title: {
    fontSize: normalize(15),
    color: colors.black,
    padding: moderateScale(10),
  },
  inputStyles: {
    fontSize: normalize(13),
    lineHeight: normalize(15.5),
    color: colors.black,
  },
  textInputContainer: {
    height: heightScale(60),
    paddingLeft: widthScale(10),
    borderColor: colors.gray400,
    color: colors.black,
    borderWidth: 1,
  },
  titleContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  radioContainer: {
    marginLeft: widthScale(10),
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(14),
  },
  textInputView: {
    padding: normalize(10),
  },
  button: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    width: widthScale(100),
    height: heightScale(20),
    marginTop: heightScale(10),
    color: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(15),
    marginBottom: heightScale(10),
  },
});
