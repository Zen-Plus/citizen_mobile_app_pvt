import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useMemo} from 'react';
import MenuIcons from './MenuIcons';
import {colors, fonts, scaling} from '../../library';
import {openContact} from '../../components/functions';
import {Context} from '../../providers/localization';
import CustomButton from '../../components/CustomButton';
import Feather from 'react-native-vector-icons/Feather';
import {GreyCrossIcon} from '../../../assets';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const {width: WIDTH} = Dimensions.get('window');
const {normalize, heightScale, widthScale, moderateScale} = scaling;

const ROW_WIDTH = WIDTH - 16 * 2;
const ROW_CELL_WIDTH = Math.floor(ROW_WIDTH / 4);
const MAX_WIDTH = ROW_CELL_WIDTH * 4;

const ShimmerMenuIcon = props => {
  return (
    <View style={{width: ROW_CELL_WIDTH}}>
      <View style={{alignSelf: 'center', height: 110}}>
        <ShimmerPlaceHolder
          style={{
            height: ROW_CELL_WIDTH * 0.6,
            width: ROW_CELL_WIDTH * 0.6,
            borderRadius: 50,
            marginTop: 8,
            alignSelf: 'center',
          }}
        />
        <ShimmerPlaceHolder
          style={{marginTop: 12, width: ROW_CELL_WIDTH * 0.65, borderRadius: 5}}
        />
      </View>
    </View>
  );
};

const SelectionItemsRow = ({
  props,
  widgetsData,
  widgetsOrder,
  isBookingVisible,
  vehicleType,
  handleClickOnAmbulance,
  selectedWidget,
  closeAmbulanceDescriptionModal,
  requestType,
  handleBookNowPress,
}) => {
  const strings = React.useContext(Context).getStrings();
  const {homeScreen} = strings;

  const getPosition = index => {
    if (index === 0) return 'left';
    if (index === widgetsOrder.length - 1) return 'right';
    return 'middle';
  };

  let shimmerComponentArray = useMemo(() => {
    return new Array(4)
      .fill()
      .map((_, index) => <ShimmerMenuIcon key={index} />);
  }, []);

  const getBorderRadius = () => {
    return styles.middleAssistanceBorderRadius;
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          width: MAX_WIDTH,
          alignSelf: 'center',
          justifyContent: 'flex-start',
        }}>
        {Object.keys(widgetsData).length > 0 && widgetsOrder?.length
          ? widgetsOrder.map((id, index) => {
              const item = widgetsData[id];
              return (
                <MenuIcons
                  maxWidth={ROW_CELL_WIDTH}
                  label={item?.label}
                  id={item?.id}
                  image={item?.image}
                  navigation={props.navigation}
                  onPress={() => handleClickOnAmbulance(item)}
                  isBookingVisible={isBookingVisible}
                  vehicleType={vehicleType}
                  position={getPosition(index)}
                />
              );
            })
          : shimmerComponentArray}
      </View>
      {isBookingVisible && (
        <View style={[styles.bookingModal, {width: MAX_WIDTH}]}>
          <View style={[styles.assistanceView, getBorderRadius()]}>
            <View style={styles.closeIconView}>
              <TouchableOpacity onPress={closeAmbulanceDescriptionModal}>
                <Image source={GreyCrossIcon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.assistanceText}>
              {widgetsData[vehicleType?.id]?.description}
            </Text>
            <CustomButton
              title={strings.groundAmbulance.bookNow}
              titleTextStyles={styles.titleTextStyles}
              onPress={() => { handleBookNowPress(requestType); }}
            />
          </View>
          <View
            style={{
              marginTop: heightScale(25),
            }}>
            <TouchableOpacity
              onPress={() => {
                openContact(props.supportNumber);
              }}>
              <View style={styles.supportButton}>
                <Feather
                  name="phone-call"
                  size={20}
                  color={colors.Gainsboro}
                  style={styles.phoneIcon}
                />
                <Text style={styles.orText}>{homeScreen.talkNow}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default SelectionItemsRow;

const styles = StyleSheet.create({
  bookingModal: {
    alignSelf: 'center',
    marginTop: -1,
    marginBottom: 20,
  },
  assistanceView: {
    backgroundColor: colors.white,
    paddingHorizontal: widthScale(12),
    paddingVertical: widthScale(18),
  },
  assistanceText: {
    marginBottom: heightScale(16),
    color: colors.DimGray2,
    fontSize: normalize(12),
    fontFamily: fonts.calibri.regular,
    fontWeight: '400',
    lineHeight: normalize(22),
  },
  closeIconView: {
    alignSelf: 'flex-end',
    bottom: heightScale(8),
  },
  titleTextStyles: {fontSize: normalize(16)},
  supportButton: {
    backgroundColor: colors.black,
    marginHorizontal: widthScale(25),
    paddingVertical: heightScale(10),
    borderRadius: moderateScale(25),
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  phoneIcon: {marginRight: widthScale(10)},
  orText: {
    fontSize: normalize(17),
    color: colors.white,
    fontFamily: fonts.calibri.medium,
    lineHeight: normalize(25),
    fontSize: normalize(14),
    textAlign: 'center',
  },
  firstAssistanceBorderRadius: {
    borderTopLeftRadius: 0,
  },
  lastAssistanceBorderRadius: {
    borderTopRightRadius: 0,
  },
  middleAssistanceBorderRadius: {
    borderRadius: normalize(8),
  },
});
