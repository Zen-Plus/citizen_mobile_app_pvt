import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  Platform,
  LayoutAnimation,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors, scaling, fonts} from '../../../../library';

const {normalize, widthScale, moderateScale} = scaling;

const Panel = props => {
  const [icon, setIcon] = useState('down');

  const [layoutHeight, setLayoutHeight] = useState(0);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const updateLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    props.updateExpanded(props.id);
  };

  useEffect(() => {
    if (props.isExpanded) {
      setLayoutHeight(null);
      setIcon('up');
    } else {
      setLayoutHeight(0);
      setIcon('down');
    }
  }, [props.isExpanded]);

  return (
    <View>
      <TouchableOpacity
        style={[styles.titleContainer]}
        activeOpacity={1}
        onPress={updateLayout}>
        <Text style={styles.title}>{props?.title}</Text>
        <View style={styles.button}>
          <AntDesign name={icon} style={styles.buttonImage} size={16} />
        </View>
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.body, {height: layoutHeight}]}>
          {props.children}
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  titleContainer: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.DarkGray,
    marginHorizontal: widthScale(5),
  },
  button: {},
  buttonImage: {
    justifyContent: 'flex-end',
    width: moderateScale(20),
    height: moderateScale(20),
  },
  body: {overflow: 'hidden'},
});

export default Panel;
