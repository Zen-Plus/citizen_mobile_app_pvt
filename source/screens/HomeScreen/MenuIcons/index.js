import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {colors, fonts} from '../../../library';
import {
  SelectedBackground
} from '../../../../assets';

const MenuIcons = props => {
  const {
    label,
    onPress,
    style,
    image,
    navigation,
    isBookingVisible,
    vehicleType,
    id,
    position,
    maxWidth,
  } = props;

  const {selectedBackground, notSelectedBackground} = useMemo(() => {
    return {
      selectedBackground: SelectedBackground,
    };
  }, [position]);

  return (
    <View>
      <ImageBackground
        source={selectedBackground}
        imageStyle={{
          opacity: isBookingVisible && vehicleType?.id === id ? 1 : 0,
        }}
        style={[styles.backgroundImage, {width: maxWidth}]}
        resizeMode="stretch">
        <TouchableOpacity
          style={
            isBookingVisible && vehicleType?.id === id
              ? [styles.container]
              : [styles.container, style]
          }
          onPress={() => {
            onPress(navigation);
          }}>
          <Image
            source={image}
            style={[
              styles.img,
              {height: maxWidth * 0.6, width: maxWidth * 0.6},
            ]}
            resizeMode="contain"
          />
          <View style={styles.parentStyle}>
            <Text
              style={[
                styles.txt,
                {width: maxWidth * 0.65},
                isBookingVisible && vehicleType?.id === id
                  ? {fontWeight: '700'}
                  : {},
              ]}>
              {label}
            </Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    height: 110,
  },
  labelStyle: {
    fontSize: 12,
    color: colors.black,
    textAlign: 'center',
  },
  img: {
    marginTop: 8,
    alignSelf: 'center',
  },
  txt: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: fonts.calibri.medium,
    color: colors.DarkGray,
  },
  parentStyle: {
    marginTop: 12,
    justifyContent: 'center',
  },
  selectedContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  backgroundImage: {},
  imageBackground: {},
});

export default MenuIcons;
