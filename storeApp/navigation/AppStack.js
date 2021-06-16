import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import Visited from '../screens/Visited';
import Settings from '../screens/Settings';
import SharingOption from '../screens/SharingOption';
import Profile from '../screens/Profile';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from '../screens/DrawerContents';
import { NavigationContainer, StackActions } from '@react-navigation/native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

const AppStack = () => {
    return (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
            <RootStack.Screen name="SplashScreen" component={SplashScreen} />
            <RootStack.Screen name="SignInScreen" component={SignInScreen} />
            <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Drawer.Screen name="HomeScreen" component={HomeScreen} />
            <Drawer.Screen name="Visited" component={Visited} />
            <Drawer.Screen name="Settings" component={Settings} />
            <Drawer.Screen name="SharingOption" component={SharingOption} />
            <Drawer.Screen name="Profile" component={Profile} />
        </Drawer.Navigator>
    )
}

export default AppStack;