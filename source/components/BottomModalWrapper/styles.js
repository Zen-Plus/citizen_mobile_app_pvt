import {StyleSheet} from 'react-native';
import {colors} from '../../library';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.Black5,
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropSpace: {flex: 1},
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default styles;
