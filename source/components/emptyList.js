import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, scaling, fonts } from "../library";
import { Context } from "../providers/localization";

const { normalize, widthScale, heightScale, moderateScale } = scaling;

const EmptyListComponent = (props) => {

  const strings = React.useContext(Context).getStrings();
  const { common } = strings;

  return (
      <View style={styles.mainContainer}>
          <Text style={styles.noDataFound}>{common.noDataFound}</Text>
      </View>
  );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        marginTop: heightScale(70),
        justifyContent: 'center', 
        alignSelf: 'center'
    },
    noDataFound: {
        fontSize: heightScale(14),
        color: colors.greyishBrownTwo
    }
});

export default EmptyListComponent;