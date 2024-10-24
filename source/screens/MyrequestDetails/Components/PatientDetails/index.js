import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, scaling, fonts} from '../../../../library';
import {Context} from '../../../../providers/localization';
import {requestTypeConstant} from '../../../../utils/constants';

const {normalize, widthScale, heightScale, moderateScale} = scaling;

const PatientDetails = ({medCondVal, myRequestDetailsData}) => {
  const strings = React.useContext(Context).getStrings();
  const {RequestDetailsScreen, TripDetails} = strings;
  const showMedicalCondition = () => {
    const medicalCondition = medCondVal.map(item => item.primaryComplaintName);
    return medicalCondition.join(', ');
  };

  return (
    <View style={styles.mainView}>
      {[requestTypeConstant.petVeterinaryAmbulance].includes(myRequestDetailsData?.requestType?.id) && (
        <>
          <View>
            <Text style={styles.grayText}>{RequestDetailsScreen.travellerDetails}</Text>
            <Text style={styles.blackText}>
              {myRequestDetailsData?.victimName}
            </Text>
            <Text style={styles.blackText}>
              {myRequestDetailsData?.victimPhoneNumber}
            </Text>
            <View style={styles.horizontalLine} />
          </View>
          <View>
            <Text style={styles.grayText}>{RequestDetailsScreen.category}</Text>
            <Text style={styles.blackText}>
              {myRequestDetailsData?.animalCategory}
            </Text>
            <View style={styles.horizontalLine} />
          </View>
          <View>
            <Text style={styles.grayText}>{RequestDetailsScreen.breed}</Text>
            <Text style={styles.blackText}>
              {myRequestDetailsData?.animalBreed}
            </Text>
            <View style={styles.horizontalLine} />
          </View>
        </>
      )}
      {[requestTypeConstant.GroundAmbulance, requestTypeConstant.airAmbulance, requestTypeConstant.doctorAtHome, requestTypeConstant.trainAmbulance].includes(myRequestDetailsData?.requestType?.id) && (
        <>
          <View style={styles.row}>
            <View style={{flex: 2}}>
              <Text style={styles.grayText}>
                {RequestDetailsScreen.name}
              </Text>
              <Text style={styles.blackText}>
                {myRequestDetailsData?.victimName}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.grayText}>{RequestDetailsScreen.Age}</Text>
              <Text style={styles.blackText}>{myRequestDetailsData.age || TripDetails.na}</Text>
            </View>
          </View>
          <View style={styles.horizontalLine} />
        </>
      )}
      <View style={styles.row}>
        <View style={{flex: 2}}>
          <Text style={styles.grayText}>{TripDetails.gender}</Text>
          <Text style={styles.blackText}>
            {myRequestDetailsData?.gender?.name
              ? myRequestDetailsData?.gender?.name
              : TripDetails.na}
          </Text>
        </View>
        {[requestTypeConstant.GroundAmbulance, requestTypeConstant.airAmbulance, requestTypeConstant.doctorAtHome, requestTypeConstant.trainAmbulance].includes(myRequestDetailsData?.requestType?.id) && (
          <View style={{flex: 1}}>
            <Text style={styles.grayText}>{TripDetails.bloodGroup}</Text>
            <Text style={styles.blackText}>
              {myRequestDetailsData?.bloodGroup?.name
                ? myRequestDetailsData?.bloodGroup?.name
                : TripDetails.na}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.horizontalLine} />
      <View>
        <Text style={styles.grayText}>{TripDetails.MedicalCondition}</Text>
        <Text style={styles.blackText}>
          {myRequestDetailsData?.victimMedicalConditions &&
          myRequestDetailsData?.victimMedicalConditions.length > 0
            ? showMedicalCondition()
            : TripDetails.na}
        </Text>
        <View style={styles.horizontalLine} />
      </View>
      {[requestTypeConstant.GroundAmbulance, requestTypeConstant.airAmbulance, requestTypeConstant.trainAmbulance].includes(myRequestDetailsData?.requestType?.id) ? (
        <View>
          <Text style={styles.grayText}>{TripDetails.accompany}</Text>
          <Text style={styles.blackText}>
            {myRequestDetailsData?.individualsWithPatient}
          </Text>
          <View style={styles.horizontalLine} />
        </View>
      ) : null}

      {myRequestDetailsData?.clientResource?.clientName && (
        <View>
          <Text style={styles.grayText}>{strings.homeScreen.clientName}</Text>
          <Text style={styles.blackText}>
            {myRequestDetailsData?.clientResource?.clientName}
          </Text>
          <View style={styles.horizontalLine} />
        </View>
      )}

      <View>
        <Text style={styles.grayText}>{TripDetails.instruction}</Text>
        <Text style={styles.blackText}>
          {myRequestDetailsData?.instruction
            ? myRequestDetailsData?.instruction
            : TripDetails.na}
        </Text>
      </View>
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
  horizontalLine: {
    borderBottomColor: colors.LightGrey7,
    borderBottomWidth: 1,
    marginVertical: heightScale(12),
  },
  grayText: {
    fontFamily: fonts.calibri.regular,
    fontSize: normalize(13),
    color: colors.Gray,
  },
  blackText: {
    fontFamily: fonts.calibri.medium,
    fontSize: normalize(14),
    color: colors.DarkGray,
  },
  row: {
    flexDirection: 'row',
  },
});
export default PatientDetails;
