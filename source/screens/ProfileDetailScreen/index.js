import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

import { colors } from '../../library';
import { connect } from 'react-redux';
import {
  getProfile,
  editProfile,
  getPickist,
} from '../../redux/actions/app.actions';
import FirstComponent from './FirstComponent/index.js';


const ProfileDetails = props => {
  const { isMyProfile } = props.route.params ? props.route.params : false;
  console.log('getProfileSuccess=', props.getProfileSuccess);
  useEffect(() => {
    props.getPickist();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <FirstComponent navigation={props.navigation} isMyProfile={isMyProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

const mapStateToProps = ({ App }) => {
  const {
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    editProfileLoading,
    editProfileSuccess,
    editProfileFail,
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
  } = App;
  return {
    editProfileLoading,
    editProfileSuccess,
    editProfileFail,
    getProfileLoading,
    getProfileSuccess,
    getProfileFail,
    getPicklistLoading,
    getPicklistSuccess,
    getPicklistFail,
  };
};

const mapDispatchToProps = {
  getProfile,
  editProfile,
  getPickist,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetails);
