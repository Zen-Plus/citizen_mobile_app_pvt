import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {colors, fonts} from '../../../library';
import CustomButton from '../../../components/CustomButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Context} from '../../../providers/localization';

const InstructionModal = ({
  isVisible,
  closeInstructionModal,
  setInstructionValue,
  text,
}) => {
  const strings = useContext(Context).getStrings();

  const [value, setValue] = useState(text);
  const {bottom} = useSafeAreaInsets();

  return (
    <Modal visible={isVisible} transparent={true} style={styles.modal}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalInner,
              {
                paddingBottom: bottom + 10,
              },
            ]}>
            <Text style={styles.modalHeading}>
              {strings.bookingFlow.instructions}
            </Text>
            <TextInput
              multiline={true}
              value={value}
              placeholder={strings.bookingFlow.instructionPlaceholder}
              placeholderTextColor={colors.DimGray2}
              onChangeText={text => {
                setValue(text);
              }}
              style={styles.textInput}
            />
            <CustomButton
              onPress={() => {
                setInstructionValue(value);
                closeInstructionModal();
              }}
              title={strings.bookingFlow.done}
              titleTextStyles={{fontSize: 16}}
              containerStyles={styles.customButton}
              leftIconContainerStyles={{flex: 0}}
              rightIconContainerStyles={{flex: 0}}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default InstructionModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {flex: 1},
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.Black5,
  },
  modalInner: {
    backgroundColor: colors.white,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 16,
    paddingTop: 20,
  },
  customButton: {
    flex: 0,
    marginTop: 31,
    alignSelf: 'center',
    width: '95%',
  },
  modalHeading: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.black,
    fontFamily: fonts.calibri.medium,
  },
  textInput: {
    color: colors.black,
    minHeight: 83,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginTop: 12,
    borderColor: colors.LightGrey7,
    borderRadius: 12,
  },
});
