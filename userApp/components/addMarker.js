import React from 'react';
import { Marker } from 'react-native-maps';

import {
    Image,
} from 'react-native';

const addMarker = ({ imageType, coordPosition, placeTitle, visitedTime }) => {
    return (
        <Marker
            coordinate={coordPosition}
            title={placeTitle}
            description={visitedTime}>
            <Image
                source={imageType}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
            />
        </Marker>
    );
};

export default addMarker;