import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import Panel from './components/Panel';
import Header from '../../components/header';
import {Context} from '../../providers/localization.js';
import {colors, fonts, scaling} from '../../library';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {faq} from '../../redux/actions/app.actions';
import FlatlistComponent from '../../components/flatListComponent';
import Loader from '../../components/loader';
import {debounce} from 'lodash';
import {faqCategories, navigations} from '../../constants';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const FAQ = props => {
  const strings = React.useContext(Context).getStrings();
  const [states, setStates] = useState({pageNo: 0, forceUpdate: false});
  const [currentIndex, setCurrentIndex] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [faqData, setFaqData] = useState([]);
  const flatListRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    props.faq({
      category: [
        props?.route?.params?.type && faqCategories[props?.route?.params?.type]
          ? faqCategories[props?.route?.params?.type]
          : faqCategories.GROUND_AMBULANCE,
      ],
      pageNo: states.pageNo,
      pageSize: 25,
      searchText: searchText,
    });
  }, [states, props?.route?.params?.type]);

  useEffect(() => {
    inputRef.current = debounce(getSearchData, 800);
  }, []);

  useEffect(() => {
    if (props.faqSuccess) {
      setCurrentIndex(null);
      let temp = [...props.faqSuccess?.data?.content];

      if (states.pageNo > 0) {
        setFaqData([...faqData, ...temp]);
      } else {
        setFaqData(temp);
      }
    }
  }, [props.faqSuccess]);
  useEffect(() => {
    if (props.faqFail) {
      console.log('Fail :', JSON.stringify(props.faqFail));
    }
  }, [props.faqFail]);
  const seperator = () => {
    return <View style={styles.seperatorView} />;
  };
  const getSearchData = () => {
    setStates(prevStates => {
      return {...prevStates, forceUpdate: !prevStates.forceUpdate, pageNo: 0};
    });
    setStates({...states, pageNo: 0});
  };

  const callSupport = () => {
    Linking.openURL(`tel:${props.supportNumber}`);
  };

  const updateFaqData = index => {
    if (currentIndex === index) {
      setCurrentIndex(null);
    } else {
      setCurrentIndex(index);
    }
    flatListRef.current.scrollToIndex({
      animated: true,
      index: index,
      viewPosition: 0.2,
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.panelView}>
        <Panel
          title={item?.question}
          id={index}
          isExpanded={currentIndex === index ? true : false}
          updateExpanded={index => updateFaqData(index)}>
          <View style={styles.answerView}>
            <Text style={styles.bodyTextStyle}>{item?.answer}</Text>
          </View>
        </Panel>
      </View>
    );
  };
  return (
    <View style={styles.main}>
      <SafeAreaView style={{backgroundColor: colors.grayWhite2}} />
      <Header
        screenName={strings.FAQ.faqSupport}
        leftIconPress={props.navigation.goBack}
        backArrow={true}
        rightIcon={true}
        rightIconPress={() => {
          props.navigation.navigate(navigations.Notifications);
        }}
      />
      {props.faqLoading ? <Loader /> : null}
      <View style={styles.searchView}>
        <View style={styles.searchBar}>
          <View style={styles.searchImageView}>
            <AntDesign
              name={'search1'}
              size={moderateScale(18)}
              color={colors.DimGray2}
            />
          </View>
          <TextInput
            style={styles.searchTextView}
            value={searchText}
            placeholder={strings.FAQ.searchQuery}
            placeholderTextColor={colors.DimGray2}
            onChangeText={value => {
              inputRef.current(value);
              setSearchText(value);
            }}
          />
        </View>
      </View>
      <View style={styles.mainPadding}>
        <FlatlistComponent
          reference={flatListRef}
          style={styles.flatlistStyle}
          showsVerticalScrollIndicator={false}
          data={faqData}
          thresholdValue={0.8}
          ItemSeparatorComponent={seperator}
          renderItem={renderItem}
          currentPage={states.pageNo}
          onPageChange={value => {
            setStates({...states, pageNo: value});
          }}
          totalItemCount={props.faqSuccess?.data?.totalElements}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flatlistStyle: {
    marginBottom: moderateScale(20),
  },
  mainPadding: {
    flex: 1,
    paddingHorizontal: moderateScale(25),
    paddingTop: moderateScale(25),
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: heightScale(10),
    backgroundColor: colors.white,
  },
  buttonCall: {
    flexDirection: 'row',
    height: moderateScale(45),
    width: moderateScale(147),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grassGreen,
    borderRadius: moderateScale(50),
  },
  buttonText: {
    fontFamily: fonts.calibri.medium,
    fontWeight: '700',
    fontSize: normalize(16),
    color: colors.white,
    marginLeft: widthScale(5),
  },
  buttonChat: {
    flexDirection: 'row',
    height: moderateScale(45),
    width: moderateScale(147),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.tripGray,
    borderRadius: moderateScale(50),
  },
  searchBar: {
    flexDirection: 'row',
    borderRadius: moderateScale(12),
    height: moderateScale(45),
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  searchView: {
    marginTop: heightScale(10),
    padding: moderateScale(22),
    backgroundColor: colors.primary,
  },
  searchImageView: {
    justifyContent: 'center',
    marginLeft: widthScale(18),
  },
  searchTextView: {
    flex: 1,
    marginLeft: widthScale(10),
    fontFamily: fonts.calibri.medium,
    fontWeight: '600',
    color: colors.black,
    fontSize: normalize(14),
  },
  seperatorView: {
    borderBottomColor: colors.grayWhite3,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  panelView: {
    paddingVertical: heightScale(25),
  },
  bodyTextStyle: {
    fontSize: normalize(14),
    fontFamily: fonts.calibri.regular,
    color: colors.DarkGray,
  },
  answerView: {
    backgroundColor: colors.WhiteSmoke1,
    padding: normalize(14),
    borderRadius: normalize(12),
  },
});

const mapStateToProps = ({App, Auth}) => {
  const {faqLoading, faqSuccess, faqFail, supportNumber} = App;
  return {faqLoading, faqSuccess, faqFail, supportNumber};
};

const mapDispatchToProps = {faq};

export default connect(mapStateToProps, mapDispatchToProps)(FAQ);
