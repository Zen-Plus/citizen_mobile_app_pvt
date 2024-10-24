import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {colors, scaling, fonts} from '../../library';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import AddOnsItem from './Items';
import {Context} from '../../providers/localization';
import {isNullOrUndefined} from '../../utils/validators'

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const AddOnModal = props => {
  const [addedAddons, setAddedAddons] = useState([]);
  const [isAnyErrorArray, setIsAnyErrorArray] = useState([]);
  const [doValidation, setDoValidation] = useState(false);
  const [isPriceLoading, setPriceLoading] = useState(false);
  const strings = React.useContext(Context).getStrings();
  const {AmbulenceAddOns} = strings;

  useEffect(() => {
    if (doValidation) {
      setDoValidation(false);
    }
  }, [doValidation]);


  useEffect(()=>{
    if (props.list) {
      const tempErrorArray = Array(props.list.length).fill(true);
      const tempArray = [...addedAddons]
      props.list?.forEach((obj, index) => {
        let tempObj;
        // eslint-disable-next-line no-cond-assign
        if (tempObj = tempArray.find((ele) => (ele.itemCode === obj.code))) {
          if (isNullOrUndefined(tempObj.quantity)) {
            tempErrorArray[index] = true;
          } else {
            tempErrorArray[index] = false;
          }
        } else {
          tempErrorArray[index] = false;
        }
      });
      setIsAnyErrorArray(tempErrorArray);
    }
  }, [props.list, addedAddons])

  const onPressSave = () => {
    if (!isPriceLoading) {
      if (isAnyErrorArray.find((e) => (e))) {
        setDoValidation(true);
      } else {
        props.newAddons(addedAddons);
        props.changeVisible(false);
      }
    }
  }

  return (
    <Modal
      style={styles.modalContainer}
      isVisible={props.isVisible}
      onBackdropPress={() => props.changeVisible(false)}>
        <View style={styles.innerView}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator>
            <View style={styles.centered}>
              <View style={styles.modalView}>
                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
                  <Text style={styles.boldText}>{AmbulenceAddOns.addAddOns}</Text>
                  <View style={styles.crossView}>
                    <AntDesign
                      name="close"
                      size={normalize(30)}
                      color={colors.justBlack}
                      onPress={() => props.changeVisible(false)}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      justifyContent: 'space-around',
                      alignSelf: 'stretch',
                      marginBottom: heightScale(12),
                      marginLeft: widthScale(12),
                    },
                  ]}>
                  <View>
                    <Text style={[styles.grayText, {textAlign: 'left'}]}>
                    {AmbulenceAddOns.name}
                    </Text>
                  </View>
                  <View style={{marginLeft: widthScale(63)}}>
                    <Text style={styles.grayText}>{AmbulenceAddOns.qty}</Text>
                  </View>
                  <View style={{marginLeft: widthScale(5)}}>
                    <Text style={styles.grayText}>{AmbulenceAddOns.cost} {'\u20B9'}</Text>
                  </View>
                  <View style={{marginRight: widthScale(10)}}>
                    <Text style={styles.grayText}>{AmbulenceAddOns.gst} {'\u20B9'}</Text>
                  </View>
                </View>
                <View style={{alignSelf: 'stretch'}}>
                  {props.list?.map((value, index, array) => {
                    return (
                      <AddOnsItem
                        acknowledgement={value.acknowledgement}
                        addedItems={(value, quantity) => {
                          let tempArray = addedAddons.filter(
                            (val, index, array) => {
                              return val?.itemCode != value?.itemCode;
                            },
                          );
                          let updatedValue = {...value, quantity: quantity};
                          let newArray = [...tempArray, updatedValue];

                          setAddedAddons(newArray);
                        }}
                        removeAddons={(value, quantity) => {
                          let tempArray = addedAddons.filter(
                            (val, index, array) => {
                              return val?.itemCode != value?.itemCode;
                            },
                          );

                          setAddedAddons(tempArray);
                        }}
                        setError={(errorStatus, index) => {
                          setIsAnyErrorArray(prevVal => {
                          const tempArray = [...prevVal];
                          tempArray[index] = errorStatus;
                          return tempArray
                          })
                        }}
                        addonName={value.description}
                        code={value.code}
                        quantity={value.quantity ? value.quantity : 0}
                        details={props.details}
                        index={index}
                        doValidation={doValidation}
                        isAnyErrorArray={isAnyErrorArray}
                        setPriceLoading={setPriceLoading}
                      />
                    );
                  })}
                  <View style={styles.horizontal} />
                </View>
                <Text style={[styles.descriptionText, {textAlign: 'left', paddingHorizontal: widthScale(11)}]}>
                  {AmbulenceAddOns.itIsImportantToProvideInputs}
                  <Text>{` (`}</Text>
                  <Text style={{color: colors.red}}>*</Text>
                  <Text>{`). `}</Text>
                  <Text>{AmbulenceAddOns.ifNotThenKeepQuantity}</Text>
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    onPressSave()
                  }}>
                  <View
                    style={[styles.button, {backgroundColor: colors.darkGreen2}]}>
                    <Text style={styles.buttonText}>{AmbulenceAddOns.save}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  astrik: {
    color: colors.red,
  },
  modalContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
  },
  innerView: {
    width: widthScale(295),
    backgroundColor: colors.white,
    borderRadius: moderateScale(5),
    borderWidth: 1,
    borderColor: colors.yellowLight2,
  },
  crossView: {
    position: 'absolute',
    right: widthScale(10),
  },
  centered: {
    marginVertical: heightScale(12),
  },
  row: {
    flexDirection: 'row',
  },
  modalView: {
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  boldText: {
    fontSize: normalize(18),
    fontFamily: fonts.calibri.bold,
    fontWeight: '700',
    marginBottom: widthScale(10),
  },
  grayText: {
    textAlign: 'center',
    color: colors.mediumLightGray,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
  },
  descriptionText: {
    textAlign: 'center',
    color: colors.black,
    fontSize: normalize(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '400',
  },
  input: {
    height: heightScale(25),
    width: widthScale(40),
    borderColor: colors.tripGray,
    borderWidth: 1,
    padding: 10,
  },
  horizontal: {
    marginVertical: heightScale(10),
    borderBottomColor: colors.tripGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    height: moderateScale(45),
    width: moderateScale(191),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightScale(18),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(100),
  },
  buttonText: {
    color: colors.gray97,
    fontFamily: fonts.calibri.bold,
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
  addOnsView: {
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: heightScale(10),
  },
  addOnsViewName: {
    flex: 4,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingText: {
    fontSize: normalize(16),
    color: colors.justBlack,
    fontFamily: fonts.calibri.bold,
    fontWeight: '700',
  },
});

export default AddOnModal;
