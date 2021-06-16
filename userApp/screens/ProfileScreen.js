
import React, { useState, useEffect, useContext } from 'react';
import block from '../data/block.json';
import { Avatar, Title, Caption, TouchableRipple, } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';

import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TouchableOpacity,
} from 'react-native';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const ProfileScreen = ({ navigation }) => {
    const [detected, setDetected] = useState(false);
    const [userName, setUserName] = useState();
    const [userEmail, setUserEmail] = useState();
    const [userAddress, setUserAddress] = useState();
    const [userPhone, setUserPhone] = useState();
    const [userBirth, setUserBirth] = useState();

    const [refreshing, setRefreshing] = useState();

    const { user } = useContext(AuthContext);

    const getUserInfo = async () => {
        const userInfo = await firestore()
            .collection('userInfo')
            .where('userEmail', '==', user.email)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    setUserName(documentSnapshot.data().userName);
                    setUserEmail(documentSnapshot.data().userEmail);
                    setUserAddress(documentSnapshot.data().userAddress);
                    setUserBirth(documentSnapshot.data().birth);
                    setUserPhone(documentSnapshot.data().userPhone);
                })
            })
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(500).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        getUserInfo();
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                    <Image
                        source={require('../assets/menu.png')}
                        style={{ width: 30, height: 30, left: 0 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <View style={styles.headerText}>
                    <Text style={{ fontSize: 15 }}>내 프로필</Text>
                </View>
                <Image
                    source={require('../assets/menu_profile.png')}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                />
            </View>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}>
                <View>
                    <View style={styles.userInfoSection}>
                        <View style={{ marginTop: 30, flexDirection: 'row' }}>
                            <Avatar.Image
                                source={require('../assets/me.png')}
                                size={70}
                            />
                        </View>
                        <View style={{ marginTop: 10, marginLeft: 0, flexDirection: 'column' }}>
                            <Title style={styles.title}>{userName}</Title>
                            <Caption style={styles.caption}>{userEmail}</Caption>
                        </View>
                    </View>
                    <View style={styles.userInfoSection}>
                        <View style={styles.row}>
                            <Image
                                source={require('../assets/address.png')}
                                style={{ width: 28, height: 28, left: 0, tintColor: "#444" }}
                                resizeMode="contain"
                            />
                            <Text style={{ color: "#777777", marginLeft: 20 }}>{userAddress}</Text>
                        </View>
                        <View style={styles.row}>
                            <Image
                                source={require('../assets/birth.png')}
                                style={{ width: 28, height: 28, left: 0, tintColor: "#444" }}
                                resizeMode="contain"
                            />
                            <Text style={{ color: "#777777", marginLeft: 20 }}>{userBirth}</Text>
                        </View>
                        <View style={styles.row}>
                            <Image
                                source={require('../assets/phone.png')}
                                style={{ width: 28, height: 28, left: 0, tintColor: "#444" }}
                                resizeMode="contain"
                            />
                            <Text style={{ color: "#777777", marginLeft: 20 }}>{userPhone}</Text>
                        </View>
                    </View>
                    <View style={styles.infoBoxWrapper}>
                        <View style={[styles.infoBox, {
                            borderRightColor: '#dddddd',
                            borderRightWidth: 1,
                        }]}>
                            <Title>{(block.blocks).length} 회</Title>
                            <Caption>방문 기록</Caption>
                        </View>
                        <View style={styles.infoBox}>
                            <Title style={{ color: detected ? "red" : "#668ffd" }}>{detected ? '접촉' : '미접촉'}</Title>
                            <Caption>접촉 여부</Caption>
                        </View>
                    </View>
                </View>
                <View style={styles.menuWrapper}>
                    <TouchableRipple onPress={() => { navigation.navigate('Visited') }}>
                        <View style={styles.menuItem}>
                            <Image
                                source={require('../assets/menu_check.png')}
                                style={{ width: 28, height: 28, left: 0, tintColor: "#444" }}
                                resizeMode="contain"
                            />
                            <Text style={styles.menuItemText}>체크인 기록</Text>
                        </View>
                    </TouchableRipple>
                    <TouchableRipple onPress={() => { }}>
                        <View style={styles.menuItem}>
                            <Image
                                source={require('../assets/share.png')}
                                style={{ width: 28, height: 28, left: 0, tintColor: "#444" }}
                                resizeMode="contain"
                            />
                            <Text style={styles.menuItemText}>친구에게 공유하기</Text>
                        </View>
                    </TouchableRipple>
                    <TouchableRipple onPress={() => { }}>
                        <View style={styles.menuItem}>
                            <Image
                                source={require('../assets/service.png')}
                                style={{ width: 28, height: 28, left: 0, tintColor: "#444" }}
                                resizeMode="contain"
                            />
                            <Text style={styles.menuItemText}>고객 센터</Text>
                        </View>
                    </TouchableRipple>
                    <TouchableRipple onPress={() => { navigation.navigate('Settings') }}>
                        <View style={styles.menuItem}>
                            <Image
                                source={require('../assets/menu_setting.png')}
                                style={{ width: 28, height: 28, left: 0, tintColor: "#444" }}
                                resizeMode="contain"
                            />
                            <Text style={styles.menuItemText}>환경 설정</Text>
                        </View>
                    </TouchableRipple>
                </View>
            </ScrollView>
        </View>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    floatingHeader: {
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
    headerText: {
        color: "black",
        flex: 1,
        padding: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 25,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: "center"
    },
    infoBoxWrapper: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 100,
    },
    infoBox: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuWrapper: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 30,
    },
    menuItemText: {
        color: '#777777',
        marginLeft: 20,
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 26,
    },
});
