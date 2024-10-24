import {navigations, homePageTile} from '../../constants';
import {colors} from '../../library';
import {
  roadAmbulance,
  doctorAtHome,
  ambulanceForEvent,
  nearbyAmbulance,
  nearbyHospital,
} from '../../../assets';
import Toast from 'react-native-simple-toast';
import {Context} from '../../../../providers/localization';

const strings = React.useContext(Context).getStrings();

const widgetsData = [
  {
    color: colors.Gold,
    label: homePageTile.ROAD_AMBULANCE,
    image: roadAmbulance,
    onPress: navigation => {
      navigation.navigate(navigations.GroundAmbulance, {
        type: 'GROUND_AMBULANCE' 
      });
    },
    onPressCalled: navigation => {
      Toast.showWithGravity(strings.homeScreen.alreadyRequest, Toast.LONG, Toast.TOP);
    },
  },
  {
    color: colors.Orchid,
    label: homePageTile.DOCTOR_AT_HOME,
    image: doctorAtHome,
    onPress: navigation => {
      navigation.navigate(navigations.GroundAmbulance, {
        type: 'DOCTOR_AT_HOME'
      });
    },
  },
  {
    color: colors.DarkSeaGreen,
    label: homePageTile.AMBULANCE_FOR_EVENT,
    image: ambulanceForEvent,
    onPress: navigation => {
      navigation.navigate(navigations.Events, {
        heading: homePageTile.EVENTS,
      });
    },
  },
  {
    color: colors.IndianRed,
    label: homePageTile.NEAR_BY_BLOOD_BANK,
    image: nearbyAmbulance,
    onPress: navigation => {
      navigation.navigate(navigations.NearBy, {
        heading: homePageTile.NEAR_BY_BLOOD_BANK,
        masterDataType: 'BLOOD_BANK',
      });
    },
  },
  {
    color: colors.SteelBlue,
    label: homePageTile.NEAR_BY_HOSPITAL,
    image: nearbyHospital,
    onPress: navigation => {
      navigation.navigate(navigations.NearBy, {
        heading: homePageTile.NEAR_BY_HOSPITAL,
        masterDataType: 'HOSPITAL',
      });
    },
  },
];

export default widgetsData;
