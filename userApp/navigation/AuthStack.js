import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SignupScreen from '../screens/SignUpScreen';
import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();

const AuthStack = () => {
    const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);
    let routeName;

    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then(value => {
            if (value == null) {
                AsyncStorage.setItem('alreadyLaunced', 'true');
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
            }
        });
    }, []);

    if (isFirstLaunch === null) {
        return null;
    } else if (isFirstLaunch == true) {
        routeName = 'Onboarding';
    } else {
        routeName = 'Login';
    }

    return (
        <Stack.Navigator initialRouteName={routeName}>
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name="SignInScreen"
                component={SignInScreen}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name="SignUpScreen"
                component={SignupScreen}
                options={{ header: () => null }}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;

