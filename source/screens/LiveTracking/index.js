import {View, StyleSheet} from 'react-native';
import React from 'react';
import LiveTracking from './Component/Tracking';
import BottomSheet from './Component/BottomSheet';
import {MapPinLine} from '../../../assets';
import {mapIcon} from '../../utils/constants';
import {colors} from '../../library';

const Tracking = props => {
  const {requestType} = props.route.params;
  return (
    <View style={styles.main}>
      <LiveTracking
        route={props.route}
        navigation={props.navigation}
        ambulanceIcon={mapIcon[requestType]}
        pointIcon={require('../../../assets/Images/Point.png')}
        DestinationIcon={MapPinLine}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
        <BottomSheet route={props.route} navigation={props.navigation} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

export default Tracking;
