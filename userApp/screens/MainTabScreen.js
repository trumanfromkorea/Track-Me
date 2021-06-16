import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import MapScreen from './MapScreen';
import DetailsScreen from './DetailsScreen';
import ProfileScreen from './ProfileScreen';
import NoticeScreen from './NoticeScreen';
import BluetoothScreen from './BluetoothScreen';
import { Image, } from 'react-native';

const Tab = createBottomTabNavigator();

const MainTabScreen = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="#000"
            tabBarOptions={{
                showLabel: false,
                style: {
                    position: 'absolute',
                    bottom: 15,
                    left: 10,
                    right: 10,
                    borderRadius: 15,
                    shadowColor: '#222',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.5,
                    shadowRadius: 5,
                }
            }}
        >
            <Tab.Screen
                name="BT"
                component={BluetoothScreen}
                options={{
                    tabBarLabel: 'Check In',
                    tabBarColor: '#fff',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/bluetooth.png')}
                            style={{ width: 55, height: 55, top: 15, tintColor: focused ? '#668ffd' : '#999' }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={NoticeScreen}
                options={{
                    tabBarLabel: 'Notice',
                    tabBarColor: '#AECDFF',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/notice.png')}
                            style={{ width: 65, height: 65, top: 13, tintColor: focused ? '#668ffd' : '#999' }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Home"
                component={MapScreen}
                options={{
                    tabBarLabel: "Track Me",
                    tabBarColor: '#fff',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/logo_tab.png')}
                            style={{ width: 50, height: 50, marginTop: 27, tintColor: focused ? '#668ffd' : '#999' }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarColor: '#AECDFF',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/profile.png')}
                            style={{ width: 55, height: 55, top: 12, tintColor: focused ? '#668ffd' : '#999' }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={DetailsScreen}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarColor: '#fff',
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require('../assets/settings.png')}
                            style={{ width: 55, height: 55, top: 11, tintColor: focused ? '#668ffd' : '#999' }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default MainTabScreen;