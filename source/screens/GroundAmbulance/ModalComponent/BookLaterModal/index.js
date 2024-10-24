import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';

import {Context} from '../../../../providers/localization';
import {RadioButton} from 'react-native-paper';
import moment from 'moment';
import {BackArrow} from '../../../../components/BackArrow';
import CustomButton from '../../../../components/CustomButton';
import DatePicker from 'react-native-date-picker';

const {normalize, widthScale, heightScale} = scaling;

export const BookLaterModal = props => {
  const strings = useContext(Context).getStrings();
  const {groundAmbulance} = strings;
  const {} = props;
  const [checked, setChecked] = useState(true);
  const [dateTime, setDateTime] = useState(new Date());

  return (
    <View style={styles.modal}>
      <View style={styles.mainView}>
        <View style={styles.innerView}>
          <Text style={styles.title}>
            {groundAmbulance.ambulanceNeedMessage}
          </Text>
          <View style={styles.selectView}>
            <View style={styles.row}>
              <RadioButton
                status={!checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked);

                  setDateTime(moment().valueOf());
                }}
                color={colors.primary}
              />
              <Text style={!checked ? styles.boldText : styles.normalText}>
                {groundAmbulance.now}
              </Text>
            </View>
            <View style={styles.row}>
              <RadioButton
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => setChecked(!checked)}
                color={colors.primary}
              />
              <Text style={checked ? styles.boldText : styles.normalText}>
                {groundAmbulance.later}
              </Text>
            </View>
            <View style={styles.DateTimePicker}>
              <Text style={styles.dateText}>
                {moment(dateTime).format('dddd, DD MMMM, hh:mm A')}
              </Text>
            </View>

            <View style={[styles.DateTimePicker, {marginLeft: widthScale(10)}]}>
              <DatePicker date={dateTime} onDateChange={setDateTime} />
            </View>

            <View style={styles.buttonStyles}>
              <View style={styles.row}>
                <View style={styles.center}>
                  <BackArrow onPress={() => {}} style={{marginTop: 0}} />
                </View>
                <View style={styles.button}>
                  <CustomButton
                    title={groundAmbulance.bookAmbulance}
                    containerStyles={{flex: 0}}
                    leftIconContainerStyles={{flex: 0}}
                    rightIconContainerStyles={{flex: 0}}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  mainView: {
    justifyContent: 'flex-end',
    flex: 1,
    height: '50%',
  },
  innerView: {
    backgroundColor: colors.white,
    paddingTop: heightScale(34),
    paddingBottom: heightScale(40),
    paddingHorizontal: widthScale(15),
    borderTopRightRadius: normalize(20),
    borderTopLeftRadius: normalize(20),
  },
  title: {
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(15),
    color: colors.DarkGray,
    textAlign: 'center',
    marginBottom: heightScale(24),
  },
  selectView: {},
  row: {flexDirection: 'row', alignItems: 'center'},
  normalText: {
    fontFamily: fonts.calibri.regular,
    marginLeft: widthScale(10),
    color: colors.DimGray2,
    fontSize: normalize(15),
  },
  boldText: {
    fontFamily: fonts.calibri.bold,
    marginLeft: widthScale(10),
    color: colors.DarkGray,
    fontSize: normalize(15),
  },
  DateTimePicker: {
    marginTop: heightScale(22),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthScale(5),
  },
  dateTime: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#C5C5C5',
    borderWidth: 1,
    marginVertical: 10,
    height: 43,
  },
  selectDate: {
    marginLeft: widthScale(10),
    fontFamily: fonts.calibri.regular,
    marginLeft: widthScale(10),
    color: colors.DarkGray,
    fontSize: normalize(15),
  },
  dateText: {
    fontFamily: fonts.calibri.regular,
    color: colors.DimGray2,
    fontSize: normalize(14),
  },
  buttonStyles: {
    paddingHorizontal: widthScale(10),
    paddingTop: heightScale(22),
    backgroundColor: colors.white,
  },
  button: {
    marginLeft: widthScale(20),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {alignItems: 'center', justifyContent: 'center'},
});
