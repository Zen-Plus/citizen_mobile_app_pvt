import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import moment from 'moment';
import {Context} from '../providers/localization.js';
import {colors, scaling, fonts} from '../library';
import Config from 'react-native-config';
import RNFetchBlob from 'rn-fetch-blob';
import {getAsyncStorage} from '../utils/asyncStorage';
import Toast from 'react-native-simple-toast';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomButton from './CustomButton.js';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const Invoice = props => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails, common} = strings;

  const downloadReport = async () => {
    const authToken = await getAsyncStorage('authToken');
    try {
      if (Platform.OS === 'android') {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]).then(async result => {
          if (
            result['android.permission.READ_EXTERNAL_STORAGE'] &&
            result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
          ) {
            const url = `${Config.PAYMENT_BASE_URL}/documents/?uuid=${props.uuid}`;
            console.log(url, 'url');

            let DownloadDir = RNFS.DownloadDirectoryPath;

            let downloadPath =
              DownloadDir +
              `/invoice${moment(new Date()).format('DDMMYYYY')}${'.pdf'}`;

            let options = {
              //fileCache: true,
              path: downloadPath,
              addAndroidDownloads: {
                useDownloadManager: false,
                notification: true,
                title: `invoice${moment(new Date()).format(
                  'DDMMYYYY',
                )}${'.pdf'}`,
                description: 'Downloading file',
                mime: '.pdf',
              },
            };
            console.log(url, options);

            RNFetchBlob.config(options)
              .fetch('GET', url, {
                Authorization: `bearer ${authToken}`,
                'content-type': 'application/json',
              })
              .then(res => {
                console.log(JSON.stringify(res), 'response');
                Toast.showWithGravity(common.DownloadSuccess, Toast.LONG, Toast.TOP);
              })
              .catch(err => {
                Toast.showWithGravity(common.DownloadFail, Toast.LONG, Toast.TOP);
                Alert.alert('errorFetch', err.message);
                console.log(err, 'errorFetch');
              });
          } else {
            console.log(
              'Please Go into Settings -> Applications -> Ziqitza -> Permissions and Allow permissions to continue',
            );
          }
        });
      } else if (Platform.OS === 'ios') {
        const url = `${Config.PAYMENT_BASE_URL}/documents/?uuid=${props.uuid}`;
        const {fs} = RNFetchBlob;
        let DownloadDir = fs.dirs.DocumentDir;
        let options = {
          path:
            DownloadDir +
            `/invoice${moment(new Date()).format('DD,MM,YYYY')}${'.pdf'}`,
        };

        RNFetchBlob.config(options)
          .fetch(
            'GET',
            url,
            {
              Authorization: `bearer ${authToken}`,
              'content-type': 'application/json',
            }
          )
          .then(res => {
            Toast.showWithGravity(common.DownloadSuccess, Toast.LONG, Toast.TOP);
            RNFetchBlob.ios.openDocument(res.data);
          })
          .catch(err => {
            Toast.showWithGravity(common.DownloadFail, Toast.LONG, Toast.TOP);
            console.log(err);
            Alert.alert('errorFetch', err.message);
          });
      }
    } catch (err) {
      console.log(err);
      Alert.alert('error', err.message);
    }
  };

  return (
    <View>
      <CustomButton
        title={strings.TripDetails.downloadInvoice}
        onPress={downloadReport}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  downloadView: {
    flexDirection: 'row',
    width: 150,
    paddingVertical: heightScale(8),
    backgroundColor: colors.grayWhite4,
    marginBottom: heightScale(10),
    borderWidth: 0.5,
    borderColor: colors.tripGray,
  },
});

export default Invoice;
