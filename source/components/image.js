import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {getAsyncStorage} from '../utils/asyncStorage';
import Config from 'react-native-config';
import {scaling} from '../library';

const {normalize} = scaling;

export const RNImage = ({style, uuid, ...props}) => {
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    getAuthToken();
    async function getAuthToken() {
      const authToken = await getAsyncStorage('authToken');
      setAuthToken(authToken);
    }
  }, []);

  return (
    <FastImage
      style={[styles.imageStyle, style]}
      source={{
        uri: `${Config.BASE_URL}/documents/?uuid=${uuid}`,
        headers: {
          Authorization: `bearer ${authToken}`,
          'ziqitza-api-key': `${Config.API_KEY}`,
        },
      }}
      resizeMode={FastImage.resizeMode.stretch}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  imageStyle: {
    height: 130,
    borderWidth: 0,
    borderRadius: normalize(10),
    overflow: 'hidden',
  },
});
