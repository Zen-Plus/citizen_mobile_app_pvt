import React, {useState, useRef} from 'react';
import {View, StyleSheet, SafeAreaView, Linking} from 'react-native';
import Header from '../../components/header';
import {colors, scaling} from '../../library';
import {connect} from 'react-redux';
import {Context} from '../../providers/localization.js';
import {termsAndConditions} from '../../redux/actions/auth.actions';
import Loader from '../../components/loader';
import {WebView} from 'react-native-webview';
import {TERMSCONDITIONSURL} from '../../utils/constants';

const {widthScale} = scaling;

const TermsAndConditions = props => {
  const strings = React.useContext(Context).getStrings();
  const [webViewLoader, setWebViewLoader] = useState(false);

  const webView = useRef();

  return (
    <View style={styles.main}>
      <SafeAreaView />
      <Header
        leftIconPress={() => {
          if (props.route.params?.fromDrawer) {
            props.navigation.toggleDrawer();
          } else {
            props.navigation.goBack();
          }
        }}
        screenName={strings.common.termsAndConditions}
        backArrow={!props.route.params?.fromDrawer}
        menu={props.route.params?.fromDrawer}
      />
      {webViewLoader ? <Loader /> : null}

      <WebView
        ref={webView}
        onLoadStart={() => {
          setWebViewLoader(true);
        }}
        onLoadEnd={() => {
          setWebViewLoader(false);
        }}
        source={{uri: TERMSCONDITIONSURL}}
        onShouldStartLoadWithRequest={request => {
          if (request.url !== TERMSCONDITIONSURL) {
            webView.current.stopLoading();
            Linking.openURL(request.url);
            return false;
          } else return true;
        }}
      />
    </View>
  );
};

const mapStateToProps = ({Auth}) => {
  const {
    termsAndConditionsLoading,
    termsAndConditionsSuccess,
    termsAndConditionsFail,
  } = Auth;

  return {
    termsAndConditionsLoading,
    termsAndConditionsSuccess,
    termsAndConditionsFail,
  };
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    justifyContent: 'center',
    backgroundColor: colors.white,
    alignItems: 'center',
    marginHorizontal: widthScale(20),
  },
});
const mapDispatchToProps = {termsAndConditions};

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndConditions);
