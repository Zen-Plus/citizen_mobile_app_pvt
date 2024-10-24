import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, fonts, scaling} from '../../library';
import AntDesign from 'react-native-vector-icons/AntDesign';
const {normalize, heightScale, widthScale, moderateScale} = scaling;

const IndividualMsg = props => {
  const {type, msg, role, time, showTime, showTitle} = props;
  return (
    <>
      <View
        style={{
          ...styles.msgBoxView,
          ...(type === 'self' && styles.msgBoxViewSelf),
        }}>
        <View style={styles.msgLine}>
          <View>
            {showTitle && type === 'support' && role && (
              <Text style={styles.titleText}>{role}</Text>
            )}
            <View style={styles.msgLine}>
              <View
                style={{
                  ...styles.chatViewSelf,
                  ...(type === 'support' && styles.chatViewOther),
                }}>
                <Text style={styles.chatMsgSelf}>{msg}</Text>
                {showTime && time && (
                  <Text
                    style={{
                      ...styles.timeSelfext,
                      ...(type === 'support' && styles.timeOtherext),
                    }}>
                    {time}
                  </Text>
                )}
              </View>
            </View>
            {type === 'self' && showTime && time && (
              <AntDesign
                style={styles.icon}
                name={'checkcircleo'}
                size={moderateScale(10)}
              />
            )}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  msgBoxView: {
    width: widthScale(200),
    justifyContent: 'center',
    paddingHorizontal: widthScale(20),
  },
  msgBoxViewSelf: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    paddingLeft: widthScale(0),
  },
  titleText: {
    fontSize: normalize(11),
    color: colors.DimGray2,
    marginLeft: widthScale(5),
    marginBottom: heightScale(3),
  },
  msgLine: {
    flexDirection: 'row',
    alignItems: 'center',
    //borderWidth: 1,
  },
  chatViewSelf: {
    backgroundColor: colors.white,
    opacity: 0.5,
    paddingVertical: heightScale(5),
    borderBottomLeftRadius: normalize(12),
    borderTopLeftRadius: normalize(12),
    borderBottomRightRadius: normalize(5),
    borderTopRightRadius: normalize(12),
    marginHorizontal: widthScale(5),
    paddingHorizontal: widthScale(9),
    marginBottom: widthScale(5),
    //borderWidth: 1,
  },
  chatViewOther: {
    backgroundColor: colors.LightSteelBlue,
    borderBottomLeftRadius: normalize(12),
    borderTopLeftRadius: normalize(5),
    borderBottomRightRadius: normalize(12),
    borderTopRightRadius: normalize(12),
  },
  chatMsgSelf: {
    color: colors.black,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(13),
  },
  timeSelfext: {
    fontSize: normalize(8),
    color: '#999',
    marginBottom: heightScale(5),
    alignSelf: 'flex-start',
  },
  timeOtherext: {
    fontSize: normalize(8),
    color: '#999',
    marginBottom: heightScale(5),
    alignSelf: 'flex-end',
  },
  icon: {
    color: colors.SlateBlue,
    alignSelf: 'flex-end',
    marginHorizontal: widthScale(5),
    marginBottom: heightScale(3),
  },
  userIcon: {
    backgroundColor: '#F9EEEE',
    borderRadius: 10,
  },
});

export default IndividualMsg;
