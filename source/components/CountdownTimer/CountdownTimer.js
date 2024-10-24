import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {colors, scaling} from '../../library';

const {normalize, heightScale} = scaling;

function zeroPad(number, size = 2) {
  let val = String(number);
  while (val.length < size) {
    val = `0${val}`;
  }
  return val;
}

export function formatTime(seconds) {
  let remaining = seconds;
  const hh = parseInt(remaining / 3600, 10);

  remaining %= 3600;

  const mm = parseInt(remaining / 60, 10);
  const ss = parseInt(remaining % 60, 10);
  if (hh) {
    return `${zeroPad(hh)}h : ${zeroPad(mm)}m : ${zeroPad(ss)}s`;
  }
  return `${zeroPad(mm)}m : ${zeroPad(ss)}s`;
}

function CountdownTimer(props) {
  const { onChange = () => {}, initialValue = 0 } = props;
  const [time, setTime] = useState(initialValue);
  let intervalRef = null;

  useEffect(() => {
    intervalRef = setInterval(() => {
      setTime(((timeVal) => timeVal - 1));
    }, 1000);
    return () => {
      clearInterval(intervalRef);
    };
  }, []);

  useEffect(() => {
    if (time >= 0) {
      onChange(time);
    }
  }, [time]);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(time)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: heightScale(5),
  },
  timerText: {
    color: colors.primary,
    fontSize: normalize(14),
    fontWeight: '700',
  },
});

export default CountdownTimer;
