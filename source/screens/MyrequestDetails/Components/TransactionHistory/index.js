import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Context} from '../../../../providers/localization';
import Table from '../../../../components/table';
import moment from 'moment';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const TransactionHistory = ({myRequestDetailsData}) => {
  const strings = React.useContext(Context).getStrings();
  const {TripDetails} = strings;
  const [icon, setIcon] = useState('down');
  const [collasable, setCollapsable] = useState(false);
  useEffect(() => {
    if (collasable) {
      setIcon('up');
    } else {
      setIcon('down');
    }
  }, [collasable]);

  const TABLEDATA = [
    {
      heading: TripDetails.refId,
      key: 'referenceNumber',
      component: (rowData, keyData, index) => {
        return leftAlign(keyData);
      },
    },
    {
      heading: TripDetails.amount,
      key: 'amount',
      component: (rowData, keyData, index) => {
        return rightAlign(keyData);
      },
    },
    {
      heading: TripDetails.paymentMode,
      key: 'transactionMode',
      component: (rowData, keyData, index) => {
        return naCheck(keyData?.name);
      },
    },
    {
      heading: TripDetails.transMode,
      key: 'paymentMode',
      component: (rowData, keyData, index) => {
        return naCheck(keyData?.name);
      },
    },
    {
      heading: TripDetails.transDateTime,
      key: 'transactionCompletedAt',
      component: (rowData, keyData, index) => {
        return formatDateAndTime(keyData);
      },
    },
  ];
  const formatDateAndTime = data => {
    return (
      <View style={styles.widthDateTime}>
        <Text style={styles.bodyText}>
          {data ? moment(data).format('DD/MM/YY | HH:mm:ss') : 'NA'}
        </Text>
      </View>
    );
  };
  const naCheck = data => {
    return (
      <View style={styles.widthDateTime}>
        <Text style={styles.bodyText}>{data ? data : 'NA'}</Text>
      </View>
    );
  };
  const rightAlign = data => {
    return (
      <View>
        <Text style={styles.bodyText}>
          {data ? parseFloat(data).toFixed(2) : 'NA'}
        </Text>
      </View>
    );
  };
  const leftAlign = data => {
    return (
      <View>
        <Text style={styles.bodyText} numberOfLines={2}>
          {data ? data : 'NA'}
        </Text>
      </View>
    );
  };

  const transactionHistory = myRequestDetailsData?.paymentsCollectedHistory || myRequestDetailsData?.paymentCollectedHistoryList
  const transactionHistoryWithoutWriteoff = transactionHistory?.filter(value => {
    return !value?.isWriteOffData
  })

  return (
    <View style={styles.mainView}>
      <TouchableOpacity
        onPress={() => {
          setCollapsable(!collasable);
        }}>
        <View style={styles.transactionHistory}>
          <Text style={styles.blackBoldText}>
            {TripDetails.transactionHistory}
          </Text>
          <AntDesign name={icon} size={18} color={colors.DarkGray} />
        </View>
      </TouchableOpacity>
      {collasable ? (
        <Table
          data={
            transactionHistoryWithoutWriteoff
              ? transactionHistoryWithoutWriteoff
              : null
          }
          tabelData={TABLEDATA}
          backgroundColor={colors.red}
          ListHeaderContainer={styles.ListHeaderContainer}
          headerText={styles.headerText}
          bodyText={styles.bodyText}
          ListContainer={styles.ListContainer}
          ListBody={styles.ListBody}
          index={true}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: colors.LightGrey7,
    paddingHorizontal: widthScale(18),
    paddingVertical: heightScale(15),
  },
  blackBoldText: {
    fontFamily: fonts.calibri.semiBold,
    fontSize: normalize(14),
    color: colors.DarkGray,
  },
  transactionHistory: {flexDirection: 'row', justifyContent: 'space-between'},
  ListHeaderContainer: {height: heightScale(44), alignItems: 'center'},
  headerText: {
    color: colors.DimGray2,
    fontFamily: fonts.calibri.medium,
    fontWeight: 'normal',
    fontSize: normalize(13),
    width: widthScale(120),
    width: widthScale(90),
  },
  bodyText: {
    color: colors.DarkGray,
    fontFamily: fonts.calibri.medium,
    fontWeight: 'normal',
    fontSize: normalize(13),
    width: widthScale(120),
    width: widthScale(90),
  },
  ListBody: {
    height: heightScale(44),
    paddingHorizontal: widthScale(0),
    paddingVertical: heightScale(0),
  },
  widthDateTime: {width: widthScale(70)},
});
export default TransactionHistory;
