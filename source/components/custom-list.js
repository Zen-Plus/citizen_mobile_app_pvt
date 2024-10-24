import React, { useState, useRef, useEffect } from "react"
import {
  View,
  FlatList as RNFlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
import { colors } from "../library"
import { Body } from "."
import { Context } from "../providers/localization"
import Loader from "./loader";

export const CustomList = ({
  data,
  total,
  renderItem,
  loading,
  getList,
  filters,
  currentPage = 0,
  currentPageSize = 10,
  horizontal = false,
  ...props
}) => {
  const strings = React.useContext(Context).getStrings();
  const { common } = strings;

  const [refreshing, setRefreshing] = useState(false)
  const [loadMore, setLoadMore] = useState(false)
  const pageNo = useRef(0)
  const pageSize = useRef(10)

  useEffect(() => {
    pageNo.current = currentPage
    pageSize.current = currentPageSize
  }, [currentPage, currentPageSize])

  useEffect(() => {
    if (!loading && (loadMore || refreshing)) {
      setRefreshing(false)
      setLoadMore(false)
    }
  }, [loading, loadMore, refreshing])

  useEffect(() => {
    if (refreshing || loadMore) {
      getList &&
        getList({ pageNo: pageNo.current, pageSize: pageSize.current, filters })
    }
  }, [refreshing, loadMore, getList, filters])

  const _onRefresh = () => {
    if (!refreshing && !loading) {
      setRefreshing(true)
      pageNo.current = 0
    }
  }

  const renderRefreshControl = () => {
    return (
      <RefreshControl
        refreshing={refreshing}
        colors={[colors.primary]}
        onRefresh={_onRefresh}
      />
    )
  }
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: 'rgba(122, 122, 122, 0.1)'
        }}
      />
    )
  }
  const paginatedFooter = () => {
    if (!loadMore) {
      return null
    }
    return (
      <View style={{ marginVertical: 10 }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  const onListEndReach = () => {
    const endReached = data.length === total
    if (endReached) {
      return null
    }
    if (!loadMore && !loading) {
      setLoadMore(true)
      pageNo.current = pageNo.current + 1
    }
  }
  const listEmpty = () => {
    if (loading) return null
    return (
      <View style={styles.emptyContainer}>
        <Body>{common.noDataFound}</Body>
      </View>
    )
  }

  if (loading && data.length == 0) {
    return <Loader />
  }

  return (
    <RNFlatList
      data={data}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      renderItem={renderItem}
      keyExtractor={(_, index) => `${index}`}
      refreshControl={renderRefreshControl()}
      onEndReached={onListEndReach}
      onRefresh={_onRefresh}
      refreshing={refreshing}
      ItemSeparatorComponent={renderSeparator}
      onEndReachedThreshold={0.5}
      ListFooterComponent={paginatedFooter}
      initialNumToRender={10}
      ListEmptyComponent={listEmpty}
      horizontal={horizontal}
      {...props}
    />
  )
}
const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})
