import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';

import {Context} from '../../providers/localization.js';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {colors, scaling} from '../../library';
import {mobileAmbulance} from '../../../assets';
import {firstStart} from '../../redux/actions/app.actions.js';
import CustomButton from '../../components/CustomButton.js';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const GetStarted = props => {
  const strings = React.useContext(Context).getStrings();
  const {getStarted} = strings;

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.container}>
        <SafeAreaView />
        <LinearGradient colors={[colors.white, colors.PaleBlue]} style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={styles.container2}>
            <View style={styles.mainView}>
              <View style={{alignSelf: 'center'}}>
                <Image
                  source={mobileAmbulance}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={styles.text}>{getStarted.firstLine}</Text>
                <Text style={styles.text}>{getStarted.secondLine}</Text>
                <Text style={styles.text}>{getStarted.thirdLine}</Text>
              </View>

              <View style={styles.button}>
                <CustomButton
                  onPress={() => {
                    props.firstStart(true);
                  }}
                  title={getStarted.getStarted}
                  rightIcon={
                    <Ionicons
                      name="arrow-forward"
                      size={moderateScale(25)}
                      color={colors.white}
                    />
                  }
                />
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainView: {
    marginHorizontal: widthScale(27),
    marginBottom: heightScale(80),
  },
  container2: {
    flexGrow: 1,
  },
  headerContainer: {
    marginLeft: widthScale(25),
  },
  text: {
    color: colors.DarkGray,
    fontSize: normalize(24),
    textAlign: 'center',
  },
  logo: {
    height: heightScale(300),
    width: widthScale(250),
  },
  button: {
    marginTop: heightScale(40),
  },
});

const mapStateToProps = ({Auth, App}) => {
  const {} = Auth;
  const {} = App;

  return {};
};

const mapDispatchToProps = {firstStart};

export default connect(mapStateToProps, mapDispatchToProps)(GetStarted);
