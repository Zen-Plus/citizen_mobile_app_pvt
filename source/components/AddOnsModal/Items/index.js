import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {colors, scaling, fonts} from '../../../library';
import CheckBox from '@react-native-community/checkbox';
import {debounce} from 'lodash';
import {getCostApi} from '../../../redux/api/app.api';
import { connect } from 'react-redux';
import { validateNumeric } from '../../../utils/validators';
import {Context} from '../../../providers/localization';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const AddOnsItem = props => {
  const [states, setStates] = useState({
    toggleCheckBox: props.acknowledgement || props.quantity ? true : false,
    text: props.quantity
      ? props.quantity.toString()
      : props.acknowledgement
      ? ''
      : '',
    totalCost: 0,
    gst: 0,
    submitEditing: false,
  });
  const inputRef = useRef();
  const strings = React.useContext(Context).getStrings();
  const {AmbulenceAddOns} = strings;
  const [addonsResponse, setAddonsResponse] = useState(null);
  const [quantityError, setQuantityError] = useState(false);

  useEffect(() => {
    getCost(states.text);
  }, []);

  useEffect(() => {
    inputRef.current = debounce(getCost, 800);
  }, []);

  useEffect(() => {
    if (
      states.toggleCheckBox &&
      states.totalCost >= 0 &&
      addonsResponse &&
      states.text !== ''
    ) {
      props.addedItems(addonsResponse.data, states.text);
    }
    if (
      !states.toggleCheckBox &&
      states.totalCost >= 0 &&
      addonsResponse &&
      states.text !== ''
    ) {
      props.removeAddons(addonsResponse.data, states.text);
      setQuantityError(false);
      props.setError(false, props.index);
    }
  }, [states.totalCost, states.toggleCheckBox, addonsResponse, states.text]);

  useEffect(() => {
    if (!states.toggleCheckBox) {
      setStates({...states, totalCost: 0, gst: 0, text: ''});
      setQuantityError(false);
      props.setError(false, props.index);
    } else {
      if (!states.text && !props.quantity>=0) {
        props.setError(true, props.index);
      }
    }
  }, [states.toggleCheckBox, states.text]);

  useEffect(() => {
    if (props.acknowledgement && states.text == '' && states.submitEditing) {
      setStates({...states, text: '0', submitEditing: false});
    }
  }, [states.text, states.submitEditing]);

  useEffect(() => {
    if (props.doValidation) {
      if (props.isAnyErrorArray[props.index]) {
        setQuantityError(true);
      }
    }
  }, [props.doValidation])

  useEffect(()=> {
    if (props.acknowledgement && !props.quantity>=0) {
      props.setError(true, props.index);
    }
  }, [props.acknowledgement])

  const getCost = text => {
    props.setPriceLoading(true);
    let object = {
      addonsCode: props.code,
      allowanceAmount: 0,
      areaCode: props.details?.areaCode,
      areaType: props.details?.areaType,
      discountPercentage: 0,
      isDeleted: false,
      quantity: text,
      tripPriceItemType: 'ADDONS',
      vehicleType: props.details?.vehicleType,
      tripDurationMinutes: Number((props.details.duration / 60).toFixed(3)),
      tripKm: props.details?.distance / 1000,
    };
    getCostApi(object)
      .then((res) => {
        const {data} = res.data;
        setAddonsResponse(res.data);
        setStates(prev => {
          return {
            ...prev,
            totalCost: data?.priceExcludingGst||0,
            gst:
              (data?.igstAmount||0) +
              (data?.sgstAmount ||0)+
              (data?.cgstAmount||0),
          };
        });
        props.setPriceLoading(false);
      })
      .catch((err) => {
        props.setPriceLoading(false);
        console.log(err);
      });
  };

  const onChangeText = (value) => {
    if (value && validateNumeric(value)) {
      setStates(prev => {
        return {...prev, text: value};
      });
      inputRef.current(value);
      setQuantityError(false);
      props.setError(false, props.index);
    } else if(!value) {
      setStates(prev => {
        return {...prev, text: ''};
      });
      inputRef.current('');
      props.setError(true, props.index);
    }
  }

  return (
    <>
    <View style={[styles.addOnsView, { backgroundColor: colors.white}]}>
      <View style={styles.addOnsViewName}>
        <CheckBox
          disabled={props.acknowledgement}
          value={states.toggleCheckBox}
          onValueChange={newValue => {
            setStates({...states, toggleCheckBox: newValue});
          }}
          boxType={'square'}
          onCheckColor={colors.primary}
          tintColors={{
            true: colors.primary,
            false: colors.primary,
          }}
        />
        <Text
          numberOfLines={2}
          style={[styles.grayText, {color: colors.Black1, textAlign: 'left'}]}>
          {props.addonName}
          <Text style={styles.astrik}>{`${
            props.acknowledgement ? ' *' : ''
          }`}</Text>
        </Text>
      </View>

      <View>

      <TextInput
        maxLength={3}
        editable={states.toggleCheckBox}
        onSubmitEditing={() => setStates({...states, submitEditing: true})}
        style={[
          styles.input,
          {fontWeight: states.toggleCheckBox ? '700' : '500'},
        ]}
        onChangeText={value => {
          onChangeText(value)
        }}
        value={states.text}
        keyboardType="number-pad"
        returnKeyType="done"
      />
      </View>
      <View style={{width: '15%', marginLeft: widthScale(12)}}>
        <Text
          style={[
            styles.grayText,
            {
              fontWeight: states.toggleCheckBox ? '700' : '300',
              color: states.toggleCheckBox ? colors.black : colors.mediumLightGray,
            },
          ]}>
          {states.totalCost
            ? states.totalCost?.toFixed(2)
            : states.totalCost === 0
            ? '0'
            : 'NA'}
        </Text>
      </View>
      <View
        style={{
          marginRight: widthScale(15),
          width: '15%',
        }}>
        <Text
          style={[
            styles.grayText,
            {
              fontWeight: states.toggleCheckBox ? '700' : '300',
              color: states.toggleCheckBox ? colors.black : colors.tripGray,
            },
          ]}>
          {states.gst ? states.gst.toFixed(2) : states.gst === 0 ? '0' : 'NA'}
        </Text>
      </View>
    </View>
    <Text style={styles.mendatoryErrorsText}>{quantityError ? AmbulenceAddOns.provideValidInput : ''}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  addOnsView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: heightScale(5),
  },
  astrik: {
    color: colors.lightRed3,
  },
  addOnsViewName: {
    flexDirection: 'row',
    width: '40%',
    alignItems: 'center',
    paddingLeft: widthScale(7),
  },
  grayText: {
    textAlign: 'center',
    color: colors.tripGray,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
    width: '90%',
  },
  input: {
    height: moderateScale(40),
    width: moderateScale(35),
    borderColor: colors.tripGray,
    borderWidth: moderateScale(1),
    textAlign: 'center',
    fontSize: normalize(10),
    marginLeft: widthScale(12),
    color: colors.Black1,
  },
  checkBox: {
    height: moderateScale(5),
    widthScale: moderateScale(5),
  },
  mendatoryErrorsText: {
    fontSize: normalize(10),
    fontFamily: fonts.calibri.regular,
    color: colors.red,
    fontWeight: '400',
    textAlign: 'center',
  },
});

const mapStateToProps = ({App}) => {
  const {} = App;
  return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddOnsItem);
