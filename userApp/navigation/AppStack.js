import React from 'react';
import MainTabScreen from '../screens/MainTabScreen';
import VisitedScreen from '../screens/VisitedScreen';
import SharingOption from '../screens/SharingOption';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from '../screens/DrawerContents';

const Drawer = createDrawerNavigator();

const AppStack = () => {
    return (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="Map" component={MainTabScreen} />
            <Drawer.Screen name="Visited" component={VisitedScreen} />
            <Drawer.Screen name="SharingOption" component={SharingOption} />
        </Drawer.Navigator>
    )
}

export default AppStack;