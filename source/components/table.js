import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList, ScrollView} from 'react-native';
import {colors, scaling, fonts} from '../library';
import {Context} from '../providers/localization';
const {normalize, widthScale, heightScale, moderateScale} = scaling;

const Table = props => {
  const strings = useContext(Context).getStrings();
  const {common} = strings;
  const ListHeader = data => {
    return (
      <View
        style={[
          styles.ListContainer,
          styles.ListHeaderContainer,
          props.ListHeaderContainer,
        ]}>
        {data.map(e => {
          if (e.headerComponent) {
            return (
              <View style={[styles.ListBody, props.ListBody]}>
                {e.headerComponent(e.heading)}
              </View>
            );
          }
          return (
            <View style={[styles.ListBody, props.ListBody]}>
              <Text style={[styles.headerText, props.headerText]}>
                {e.heading}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {props?.data?.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <FlatList
            data={props.data}
            ListHeaderComponent={() => ListHeader(props.tabelData)}
            stickyHeaderIndices={[0]}
            renderItem={({item, index}) => {
              const backgroundColor =
                index % 2 === 0 || props.index ? colors.white : colors.primary;
              return (
                <View
                  style={[
                    styles.ListContainer,
                    props.ListContainer,
                    {backgroundColor: backgroundColor},
                  ]}>
                  {props.tabelData.map(e => {
                    if (e.component) {
                      return (
                        <View style={[styles.ListBody, props.ListBody]}>
                          {e.component(item, item[e.key], index)}
                        </View>
                      );
                    }

                    return (
                      <View style={[styles.ListBody, props.ListBody]}>
                        <Text style={[styles.bodyText, props.bodyText]}>
                          {item[e.key]}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            }}
            keyExtractor={(i, index) => index}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            onEndReached={props.onEndReached}
          />
        </ScrollView>
      ) : (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>{common.noRecordsFound}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ListContainer: {
    flexDirection: 'row',
  },
  ListBody: {
    width: widthScale(90),
    marginRight: widthScale(30),
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: heightScale(10),
    paddingHorizontal: widthScale(8),
  },

  ListHeaderContainer: {
    backgroundColor: colors.grayWhite2,
    borderColor: colors.lightGrey2,
  },
  headerText: {
    color: colors.Black1,
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(14),
    fontWeight: '700',
  },
  bodyText: {
    color: colors.Black1,
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
    fontWeight: '400',
  },
  emptyListContainer: {
    alignItems: 'center',
    marginTop: heightScale(30),
  },
  emptyListText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(14),
  },
});

export default Table;
