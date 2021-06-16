import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Avatar, Title, Caption, Drawer, Text, TouchableRipple, Switch } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

export function DrawerContent(props) {
    const [userName, setUserName] = useState();
    const [userEmail, setUserEmail] = useState();
    const { user, logout } = useContext(AuthContext);

    const getUserInfo = async () => {
        const userInfo = await firestore()
            .collection('userInfo')
            .where('userEmail', '==', user.email)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    setUserName(documentSnapshot.data().userName);
                    setUserEmail(documentSnapshot.data().userEmail);
                })
            })
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ marginTop: 30, flexDirection: 'row' }}>
                            <Avatar.Image
                                source={require('../assets/me.png')}
                                size={70}
                            />
                        </View>
                        <View style={{ marginLeft: 0, flexDirection: 'column' }}>
                            <Title style={styles.title}>{userName}</Title>
                            <Caption style={styles.caption}>{userEmail}</Caption>
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
                            onPress={() => { props.navigation.navigate('Home') }}
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
                            label="내 프로필"
                            onPress={() => { props.navigation.navigate('Profile') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image
                                    name="menu_check"
                                    source={require('../assets/menu_check.png')}
                                    style={{ width: 30, height: 30 }}
                                    resizeMode="contain"
                                />
                            )}
                            label="체크인 기록"
                            onPress={() => { props.navigation.navigate('Visited') }}
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
                    <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => { toggleTheme() }}>
                            <View style={styles.preference}>
                                <Text>블루투스</Text>
                                <View pointerEvents="none">
                                    <Switch />
                                </View>
                            </View>
                        </TouchableRipple>
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