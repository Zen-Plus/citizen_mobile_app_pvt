/**
 * @author Abhay Agrahary
 */
import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Context} from '../../providers/localization.js';
import {colors, scaling} from '../../library';
import {BottomModal} from '../../components';
import CustomSectionList from '../../components/CustomSectionList.js';
import {fonts} from '../../library';
import Autolink from 'react-native-autolink';
import moment from 'moment';

const {widthScale, heightScale} = scaling;

/**
 * Render notification list
 * @param {*} props
 */
const {normalize} = scaling;
const RenderList = props => {
  const strings = React.useContext(Context).getStrings();
  const {notificationContainer} = strings;

  const [itemData, setItemData] = useState();
  const [bottomModal, setBottomModal] = useState(false);
  /**
   * Function use to render list item card
   * @param {Object} data {item, index}
   */

  const converDateTime = item => {
    if (
      moment(item).format('DD MMMM YYYY') ===
      moment().startOf('day').format('DD MMMM YYYY')
    )
      return notificationContainer.today;
    else if (
      moment(item).format('DD MMMM YYYY') ===
      moment().subtract(1, 'days').startOf('day').format('DD MMMM YYYY')
    )
      return notificationContainer.yesterday;

    return moment(item).format('DD MMMM YYYY | hh:mm A');
  };
  const _renderSectionHeader = ({section: {title}}) => {
    return (
      <>
        <View
          style={{
            height: 1,
            backgroundColor: colors.LightGrey7,
            marginHorizontal: widthScale(20),
          }}
        />

        <Text style={styles.headerStyle}>{title}</Text>
      </>
    );
  };
  const _renderItem = ({item, index}) => {
    const isRead = Boolean(item.isRead || item.status == 'TRIGGERED');
    return (
      <TouchableOpacity
        key={index}
        style={
          isRead
            ? {...styles.listItemContainer}
            : {...styles.listItemReadContainer}
        }
        onPress={() => {
          setItemData(item);
          setBottomModal(true);
          if (props.isCustomNotification && !isRead) {
            props.readCustomNotifications({
              customNotificationId: item.id,
              customNotificationType: item.customNotificationType,
              isRead: true,
            });
          }
        }}>
        <View style={styles.row}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              styles.message,
              isRead
                ? {fontFamily: fonts.calibri.medium}
                : {fontFamily: fonts.calibri.regular},
            ]}>
            {item.content || item.message}
          </Text>
          <Text style={styles.time}>
            {moment(item?.createdAt).format('hh:mm A')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const {content = [], totalElements = 0} = props.data || {};
  return (
    <View
      style={styles.container}
      onTouchEnd={() => {
        if (bottomModal) {
          setBottomModal(false);
        }
      }}>
      <CustomSectionList
        total={totalElements}
        currentPage={props.currentPage}
        loading={props.loading}
        data={content}
        renderItem={_renderItem}
        renderSectionHeader={_renderSectionHeader}
        getList={data => {
          props.getList && props.getList(data);
        }}
      />

      {itemData ? (
        <BottomModal
          title={converDateTime(itemData?.createdAt || itemData?.generateOn)}
          setCloseBottomModal={setItemData}
          modal={bottomModal}
          titleStyle={styles.titleStyle}
          innerFlexViewUpper={{
            marginBottom: heightScale(24),
            paddingHorizontal: widthScale(16),
          }}>
          <Autolink
            text={itemData.content || itemData.message}
            url
            style={{color: 'black', fontSize: normalize(15)}}
          />
        </BottomModal>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: widthScale(25),
    marginVertical: heightScale(10),
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(14),
    elevation: normalize(5),
    shadowOffset: {width: -2, height: 4},
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.2,
    shadowRadius: normalize(3),
    borderRadius: normalize(10),
  },
  listItemReadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.GhostWhite,
    marginHorizontal: widthScale(25),
    marginVertical: heightScale(10),
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(14),
    borderRadius: normalize(10),
  },
  message: {
    color: colors.DarkGray,
    fontSize: normalize(12),
  },
  headerStyle: {
    fontSize: normalize(12),
    color: colors.DimGray2,
    fontFamily: fonts.calibri.regular,
    marginTop: heightScale(12),
    paddingHorizontal: widthScale(23),
  },
  titleStyle: {
    fontSize: normalize(14),
    color: colors.DimGray2,
    fontFamily: fonts.calibri.regular,
  },
  time: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(10),
    color: colors.DimGray2,
    marginTop: heightScale(4),
  },
  row: {flexDirection: 'column'},
});

export default RenderList;
