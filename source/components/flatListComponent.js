import React from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import EmptyListComponent from './emptyList';

const FlatlistComponent = ({
  currentPage,
  data,
  renderItem,
  reference,
  onPageChange,
  thresholdValue,
  totalItemCount,
  ItemSeparatorComponent,
  ...props
}) => {
  const incrementPage = () => {
    if (data.length < totalItemCount) {
      const incrementedPage = currentPage + 1;
      onPageChange(incrementedPage);
    }
  };

  return (
    <View>
      <FlatList
        ListEmptyComponent={EmptyListComponent}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        onEndReached={incrementPage}
        ref={reference}
        onEndReachedThreshold={thresholdValue}
        ItemSeparatorComponent={ItemSeparatorComponent}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
export default FlatlistComponent;
