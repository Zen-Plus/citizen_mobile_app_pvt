import {
    Platform,
    Alert,
    PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import Config from 'react-native-config';

function showAlert(title, message) {
    Alert.alert(
        title,
        message,
        [
            {
                text: "OK",
            },
        ],
    );
}

export const getAddressFromLatLong = (latitude, longitude) =>{
    return Geocoder.from({
        lat: latitude,
        lng: longitude,
    }).then(json => {
            var addressComponent = json.results[0].formatted_address;
            const index = addressComponent.indexOf(',');
            var addressComponent = addressComponent.substring(index + 1);
            const location = {
                latitude: latitude,
                longitude: longitude,
                address: addressComponent
            }
            return location;
        })
        .catch((err) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
            return location;
        });
}

function getPosition(isAddressRequired) {
    return new Promise((resolve, reject) => {
        Geocoder.init(`${Config.GOOGLE_MAP_API_KEY}`);
        Geolocation.getCurrentPosition(
            position => {
                if (isAddressRequired) {
                    getAddressFromLatLong(position.coords.latitude, position.coords.longitude)
                    .then(resolve)
                }
            },
            error => {
                if (error.code === 2) {
                    showAlert("Location Off", "Switch on the location");
                    reject("location off");
                }

                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    })
}

export const getCurrentLocation = (isAddressRequired = true)=>{
    return new Promise((resolve, reject) => {

        if (Platform.OS === 'android') {
            console.log(" request the permission");
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then((permissionStatus) => {
                if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
                    getPosition(isAddressRequired)
                        .then(resolve)
                        .catch(reject);
                } else {
                    showAlert("Denied", "Give Permissions");
                    reject("Permission not granted");
                }
            })
        } else {
            Geolocation.requestAuthorization('always')
                .then((permissionStatus) => {
                    if (permissionStatus === 'granted') {
                        getPosition(isAddressRequired)
                            .then(resolve)
                            .catch(reject);

                    } else {
                        showAlert("Denied", "Give Permissions");
                        reject("Permission not granted");
                    }

                })
        }
    })
};
