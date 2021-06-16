import React, { useState, useEffect, useContext, useRef, } from 'react';
import { StyleSheet, useColorScheme, View, Image, ActivityIndicator, Platform, TextInput, TouchableOpacity, } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import Geocoder from 'react-native-geocoding';

import currentMarker from '../assets/currentMarker.png';
import cautionMarker from '../assets/cautionMarker.png';
import visitedMarker from '../assets/visitedMarker.png';
import NewMarker from '../components/addMarker';
import userVisited from '../data/userVisited.json';

Geocoder.init("AIzaSyCn87Xpx1GIsV871yYyMkloXJ3lvzk75mc");

const initialState = {
  latitude: null,
  longitude: null,
  latitudeDelta: 0.00922,
  longitudeDelta: 0.00421,
}

const MapScreen = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const [loaded, setLoaded] = useState(false);
  const [patientVisited, setPatientVisited] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [userRoute, setUserRoute] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(initialState);

  const cautionMarkersList = [];
  firestore().collection("patientVisited")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const cautionLatitude = doc.data().latitude;
        const cautionLongitude = doc.data().longitude;

        const cautionDict = { latitude: cautionLatitude, longitude: cautionLongitude };

        cautionMarkersList.push(<NewMarker
          coordPosition={cautionDict}
          imageType={cautionMarker}
          placeTitle={doc.data().buisnessName}
          visitedTime={doc.data().visitedTime}
        />);
      })
    });


  const visitedMarkersList = [];
  (userVisited.location).forEach((geopoint) => {
    visitedMarkersList.push(<NewMarker
      coordPosition={{ latitude: geopoint.latitude, longitude: geopoint.longitude }}
      imageType={visitedMarker}
      placeTitle={geopoint.placeTitle}
      visitedTime={geopoint.visitedTime}
    />);
  });

  useEffect(() => {
    setTimeout(() => {
      geolocation.getCurrentPosition(position => {
        const { longitude, latitude } = position.coords;
        setCurrentPosition({
          ...currentPosition,
          latitude,
          longitude
        })
      },
        error => alert(error.message),
        { timeout: 20000, maximumAge: 1000 }
      )
    }, 5000);

    if (!loaded) {
      setPatientVisited(cautionMarkersList);
    }
    setLoaded(true);

    if (currentPosition.latitude) {
      const polyPosition = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude
      }
      setUserRoute(userRoute.concat(polyPosition))
    }
  }, [currentPosition])
  // deps 에 currentPosition 넣어주면 실시간 동선추적 시작
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleRefresh = () => {
    setRefreshing(false);
    setTimeout(() => {
      setRefreshing(true)
    }, 1000);
  }

  return (currentPosition.latitude && refreshing) ? (
    <View style={{ flex: 1 }}>

      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{
          flex: 1
        }}
        initialRegion={currentPosition}
      >
        <Polyline
          coordinates={userRoute}
          strokeColor="#58B58B"
          strokeWidth={5}
        />

        <View style={{ zIndex: -100 }}>
          {patientVisited}
          {visitedMarkersList}
        </View>

        <View style={{ zIndex: 100 }}>

          <NewMarker
            coordPosition={currentPosition}
            imageType={currentMarker}
          />
        </View>

      </MapView>

      <View style={styles.searchBox}>

        <TouchableOpacity onPress={() => { navigation.openDrawer() }}>

          <Image
            source={require('../assets/menu.png')}
            style={{ width: 30, height: 30, left: 0 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TextInput
          placeholder="Search here"
          placeholderTextColor="#999"
          autoCapitalize="none"
          style={{ flex: 1, padding: 0, marginLeft: 10, fontSize: 15 }}
        />

        <Image
          source={require('../assets/search.png')}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />

      </View>

      <View>

        <TouchableOpacity onPress={() => handleRefresh()}
          style={{
            position: 'absolute',
            //borderWidth: 2,
            bottom: 110,
            right: 10,
            alignSelf: 'flex-end',
          }}>

          <Image
            source={require('../assets/refresh.png')}
            style={{ width: 70, height: 70 }}
            resizeMode="contain"
          />

        </TouchableOpacity>

      </View>

    </View>

  ) : <ActivityIndicator style={{ flex: 1 }} animating size="large" />
};

const styles = StyleSheet.create({
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },

});

export default MapScreen;