import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  SectionList,
} from 'react-native';
import {colors} from '../library';
import {Body} from '.';
import {Context} from '../providers/localization';
import Loader from './loader';
import {notificationEntityName} from '../utils/constants';
import {connect} from 'react-redux';
import {clearNotificationData} from '../redux/actions/app.actions';
import {scaling} from '../library';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const CustomSectionList = ({
  data,
  userRole,
  total,
  renderItem,
  renderSectionHeader,
  loading,
  getList,
  filters,
  currentPage = 0,
  currentPageSize = 10,
  horizontal = false,
  ...props
}) => {
  const strings = React.useContext(Context).getStrings();
  const {common} = strings;

  const [refreshing, setRefreshing] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const pageNo = useRef(0);
  const pageSize = useRef(10);

  useEffect(() => {
    pageNo.current = currentPage;
    pageSize.current = currentPageSize;
  }, [currentPage, currentPageSize]);

  useEffect(() => {
    if (!loading && (loadMore || refreshing)) {
      setRefreshing(false);
      setLoadMore(false);
    }
  }, [loading, loadMore, refreshing]);

  useEffect(() => {
    if (refreshing || loadMore) {
      getNotifications();
    }
  }, [refreshing, loadMore, getList, filters]);

  const getNotifications = async () => {
    getList &&
      getList({
        pageNo: pageNo.current,
        pageSize: pageSize.current,
        referenceName: notificationEntityName.USER,
        referenceId: props.userId,
        sortBy: 'triggeredOn',
        sortDirection: 'DESC',
      });
  };

  const _onRefresh = () => {
    if (!refreshing && !loading) {
      setRefreshing(true);
      props.clearNotificationData();
      pageNo.current = 0;
      currentPage.current = 0;
    }
  };

  const renderRefreshControl = () => {
    return (
      <RefreshControl
        refreshing={refreshing}
        colors={[colors.primary]}
        onRefresh={_onRefresh}
      />
    );
  };
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: colors.LightGrey7,
          marginHorizontal: widthScale(20),
        }}
      />
    );
  };
  const paginatedFooter = () => {
    if (!loadMore) {
      return null;
    }
    return (
      <View style={{marginVertical: 10}}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  const onListEndReach = () => {
    const endReached = data.length === total;
    if (endReached) {
      return null;
    }
    if (!loadMore && !loading) {
      setLoadMore(true);
      pageNo.current = pageNo.current + 1;
    }
  };
  const listEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Body>{common.noDataFound}</Body>
      </View>
    );
  };

  if (loading && data.length == 0) {
    return <Loader />;
  }
  return (
    <SectionList
      sections={data}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1}}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(_, index) => `${index}`}
      refreshControl={renderRefreshControl()}
      onEndReached={onListEndReach}
      onRefresh={_onRefresh}
      refreshing={refreshing}
      onEndReachedThreshold={0.5}
      ListFooterComponent={paginatedFooter}
      initialNumToRender={10}
      ListEmptyComponent={listEmpty}
      horizontal={horizontal}
      {...props}
    />
  );
};
const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const mapStateToProps = ({Auth, App}) => {
  const {userInfoSuccess} = Auth;
  const {getDeviceTypeSuccess, userId} = App;
  return {
    userInfoSuccess,
    getDeviceTypeSuccess,
    userId,
  };
};

const mapDispatchToProps = {
  clearNotificationData,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomSectionList);
