import React, { useState } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geocoder from 'react-native-geocoding';

import RootStackScreen from './screens/RootStackScreen';
import AppStack from './navigation/AppStack';

import FormInput from './components/FormInput';
import FormButton from './components/FormButton';

Geocoder.init("AIzaSyCn87Xpx1GIsV871yYyMkloXJ3lvzk75mc");

const getLocation = (address) => {
  Geocoder.from(address)
    .then(json => {
      var location = json.results[0].geometry.location;
      console.log(location);
    })
    .catch(error => console.warn(error));
}


const App = () => {

  const [address, setAddress] = useState();

  // 주소 입력하면 위도경도 찍는 함수 만들어보기

  return (
    // 로그인 기능 구현해서 user? AppStack : RootStackScreen 해야함
    <NavigationContainer>
      <AppStack/>
    </NavigationContainer>

  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});