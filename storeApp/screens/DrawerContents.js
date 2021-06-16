import React, { Component, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';


export function DrawerContent(props) {
    
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ marginLeft: 0, flexDirection: 'column' }}>
                            <Title style={styles.title}>미식반점</Title>
                            <Caption style={styles.caption}>서울특별시 광진구 군자로 70</Caption>
                        </View>
                    </View>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image
                                    name="home"
                                    source={require('../assets/home.png')}
                                    style={{ width: 30, height: 30 }}
                                    resizeMode="contain"
                                />
                            )}
                            label="홈"
                            onPress={() => { props.navigation.navigate('HomeScreen') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image
                                    name="menu_profile"
                                    source={require('../assets/menu_profile.png')}
                                    style={{ width: 30, height: 30 }}
                                    resizeMode="contain"
                                />
                            )}
                            label="사업자 등록정보"
                            onPress={() => { props.navigation.navigate('Profile') }}
                        />
                        {/* <DrawerItem
                            icon={({ color, size }) => (
                                <Image
                                    name="menu_route"
                                    source={require('../assets/menu_route.png')}
                                    style={{ width: 30, height: 30 }}
                                    resizeMode="contain"
                                />
                            )}
                            label="지난 동선"
                            onPress={() => { props.navigation.navigate('Footprint')  }}
                        /> */}
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image
                                    name="menu_check"
                                    source={require('../assets/menu_check.png')}
                                    style={{ width: 30, height: 30 }}
                                    resizeMode="contain"
                                />
                            )}
                            label="방문자 기록"
                            onPress={() => {  props.navigation.navigate('Visited')  }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image
                                    name="menu_share"
                                    source={require('../assets/menu_share.png')}
                                    style={{ width: 30, height: 30 }}
                                    resizeMode="contain"
                                />
                            )}
                            label="공유 옵션"
                            onPress={() => { props.navigation.navigate('SharingOption') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image
                                    name="menu_setting"
                                    source={require('../assets/menu_setting.png')}
                                    style={{ width: 30, height: 30 }}
                                    resizeMode="contain"
                                />
                            )}
                            label="환경 설정"
                            onPress={() => { props.navigation.navigate('Settings') }}
                        />
                    </Drawer.Section>
                    
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Image
                            name="exit-to-app"
                            source={require('../assets/logout.png')}
                            style={{ width: 30, height: 30 }}
                            resizeMode="contain"
                        />
                    )}
                    label="로그아웃"
                    onPress={() => logout()}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        top: 20
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});