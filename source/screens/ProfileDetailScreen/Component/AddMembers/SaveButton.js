import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';

import { Context } from '../../../../providers/localization';
import { BackArrow } from '../../../../components/BackArrow';
import CustomButton from '../../../../components/CustomButton';
import { colors ,scaling} from '../../../../library';
const {normalize, widthScale, heightScale} = scaling;

const SaveButton = props => {
  const strings = useContext(Context).getStrings();
  const {common} = strings;

  return (
    <View style={styles.bottomLocationView}>
      <View style={styles.footerButtonContainer}>
        <View
          style={{
            marginRight: widthScale(20),
            ...styles.footerSubButtonContainerContainer,
          }}>
          <BackArrow
            onPress={() => {
              props.navigation.goBack();
            }}
            style={{marginTop: 0}}
          />
        </View>
        <View
          style={{
            flex: 1,
            ...styles.footerSubButtonContainerContainer,
          }}>
          <CustomButton
            onPress={() => {
              props.handleSubmit();
            }}
            title={props.title ? props.title : common.save}
            titleTextStyles={{fontSize: normalize(16)}}
            containerStyles={{flex: 0}}
            leftIconContainerStyles={{flex: 0}}
            rightIconContainerStyles={{flex: 0}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerSubButtonContainerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLocationView: {
    padding: heightScale(25),
    backgroundColor: colors.white,
  },
  footerButtonContainer: {
    flexDirection: 'row',
  },
  footerSubButtonContainerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SaveButton;
