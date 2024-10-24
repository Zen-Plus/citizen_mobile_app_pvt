import React from 'react';
import {View, StyleSheet, Image, ImageBackground} from 'react-native';
import {Context} from '../../providers/localization.js';
import {colors, scaling} from '../../library';
import {connect} from 'react-redux';
import {validateVersion} from '../../redux/actions/app.actions';
import {Button} from '../../components/button';
import {SplashImage} from '../../../assets';
import {Logo} from '../../../assets';

const {widthScale, heightScale} = scaling;

const Splash = props => {
  const strings = React.useContext(Context).getStrings();
  const {splash} = strings;

  return (
    <>
      <ImageBackground
        style={styles.splash}
        resizeMode="cover"
        source={SplashImage}>
        <View style={styles.logo}>
          <Image
            source={Logo}
            style={{height: heightScale(114), width: heightScale(124)}}
          />
        </View>
        <View style={styles.buttonView}>
          <Button
            title={splash.getStarted}
            color={colors.white}
            backgroundColor={colors.lightRed2}
            primary
            onPress={() => props.validateVersion({isVersionValid: true})}
          />
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  splash: {
    height: '100%',
    width: '100%',
  },
  buttonView: {
    position: 'absolute',
    bottom: heightScale(50),
    width: '100%',
    paddingHorizontal: widthScale(16),
  },
  logo: {
    position: 'absolute',
    marginTop: '50%',
    alignSelf: 'center',
  },
});

const mapDispatchToProps = {
  validateVersion,
};

export default connect(null, mapDispatchToProps)(Splash);
