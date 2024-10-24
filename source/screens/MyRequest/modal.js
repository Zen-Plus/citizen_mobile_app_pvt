import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {Context} from '../../providers/localization.js';
import {colors, scaling, fonts} from '../../library';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const Card = props => {
  const strings = React.useContext(Context).getStrings();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  return (
    <Modal
      isVisible={props.isVisibleModal}
      backdropOpacity={0.3}
      style={styles.modal}>
      <View style={styles.mainView}>
        <View style={styles.innerView}>
          <View style={styles.innerFlexViewUpper}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {strings.myRequestScreen.selectDateRange}
              </Text>
              <TouchableOpacity
                onPress={() => { props.setShowDateRangeModal(false); }}
              >
                <Ionicons
                  name="close-outline"
                  color={colors.DimGray2}
                  size={35}
                />
              </TouchableOpacity>
            </View>
            {/* ........Start Date....... */}
            <Text style={styles.datePickerHeader}>
              {strings.myRequestScreen.startDate}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.input}
              onPress={() => {
                setStartDateOpen(true);
              }}>
              <Text style={styles.dateTextStyle}>
                {moment(props.startDate).format('MMM D, YYYY')}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={startDateOpen}
              mode="date"
              date={props.startDate}
              title={strings.myRequestScreen.startDate}
              onConfirm={date => {
                props.setStartDate(date);
                setStartDateOpen(false);
              }}
              onCancel={() => {
                setStartDateOpen(false);
              }}
              maximumDate={new Date(props.endDate)}
            />

            {/* ........End Date....... */}
            <Text style={styles.datePickerHeader}>
              {strings.myRequestScreen.endDate}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.input}
              onPress={() => {
                setEndDateOpen(true);
              }}>
              <Text style={styles.dateTextStyle}>
                {moment(props.endDate).format('MMM D, YYYY')}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={endDateOpen}
              mode="date"
              title={strings.myRequestScreen.endDate}
              date={props.endDate}
              onConfirm={date => {
                props.setEndDate(date);
                setEndDateOpen(false);
              }}
              onCancel={() => {
                setEndDateOpen(false);
              }}
              minimumDate={new Date(props.startDate)}
              maximumDate={new Date()}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.applyButtons}
                onPress={props.handleApplyFilter}>
                <Text style={styles.applyButtonsText}>
                  {strings.common.yes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => { props.setShowDateRangeModal(false); }}
              >
                <Text style={styles.cancelButtonText}>{strings.common.no}</Text>
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
  },
  innerView: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: heightScale(24),
  },
  titleContainer: {
    marginBottom: heightScale(25),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(18),
    color: colors.DarkGray,
    fontFamily: fonts.calibri.semiBold,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  innerFlexViewUpper: {
    marginVertical: heightScale(20),
    paddingHorizontal: widthScale(16),
  },
  input: {
    paddingVertical: heightScale(8),
    marginTop: heightScale(4),
    paddingHorizontal: widthScale(12),
    borderColor: colors.LightGrey7,
    borderWidth: widthScale(1),
    borderRadius: moderateScale(100),
    marginBottom: heightScale(30),
  },
  dateTextStyle: {
    fontSize: normalize(14),
    color: colors.DarkGray,
    fontFamily: fonts.calibri.semiBold,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  datePickerHeader: {
    fontSize: normalize(13),
    color: colors.Charcoal2,
    fontFamily: fonts.calibri.medium,
  },
  buttonContainer: {
    marginTop: heightScale(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    height: heightScale(42),
    width: widthScale(132),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtons: {
    height: heightScale(42),
    width: widthScale(132),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonsText: {
    fontSize: normalize(14),
    color: colors.white,
    fontFamily: fonts.calibri.bold,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    fontSize: normalize(14),
    color: colors.primary,
    fontFamily: fonts.calibri.bold,
    fontWeight: 'bold',
  },
});

export default Card;
