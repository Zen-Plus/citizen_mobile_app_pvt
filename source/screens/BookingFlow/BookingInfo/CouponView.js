import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import Input from '../../../components/Input';
import {colors, scaling, fonts} from '../../../library';
import {Context} from '../../../providers/localization';

const {normalize} = scaling;

const CouponView = ({
  coupon,
  appliedCouponAmount,
  setCoupon,
  handleRemoveButtonClick,
  handleApplyButtonClick,
  vehiclePrice,
  couponMessage,
}) => {
  const strings = useContext(Context).getStrings();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Input
            isSecondaryButton={true}
            editable={!appliedCouponAmount}
            placeholder={strings.EventRequest.enter}
            inputBoxStyle={styles.inputTextStyle}
            value={coupon}
            onChangeText={val => {
              setCoupon(val);
            }}
          />
        </View>
        {appliedCouponAmount ? (
          <TouchableOpacity
            onPress={() => {
              handleRemoveButtonClick();
            }}>
            <Text style={styles.applyButtonText}>
              {strings.bookingFlow.remove}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              handleApplyButtonClick();
            }}
            disabled={vehiclePrice}>
            <Text
              style={[
                styles.applyButtonText,
                {
                  color: vehiclePrice ? colors.Gainsboro : colors.primary,
                },
              ]}>
              {strings.bookingFlow.apply}
            </Text>
          </TouchableOpacity>
        )}

        {/* </View> */}
      </View>
      <Text
        style={[
          styles.couponErrorText,
          {
            color:
              couponMessage.errorColor === 'Error' ? colors.red : colors.green,
          },
        ]}>
        {couponMessage?.errorText ?? ''}
      </Text>
    </>
  );
};

export default CouponView;

const styles = StyleSheet.create({
  inputTextStyle: {
    color: colors.black,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
  },

  applyButtonText: {
    color: colors.primary,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.semiBold,
    fontWeight: '600',
  },
  container: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginRight: 12,
  },
  couponErrorText: {
    marginTop: 8,
    marginLeft: 8,
  },
});
