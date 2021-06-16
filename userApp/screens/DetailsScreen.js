import React, { useContext } from 'react';
import { Title, Caption } from 'react-native-paper';
import { StyleSheet, Text, View, Image, Platform, TouchableOpacity, } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';

const DetailsScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);

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
                    <Text style={{ fontSize: 15 }}>환경 설정</Text>
                </View>
                <Image
                    source={require('../assets/menu_setting.png')}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.mainView}>
                <View style={{ borderBottomColor: '#aaa', borderBottomWidth: 1, padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('../assets/menu_setting.png')}
                        style={{ width: 45, height: 45, right: 5, tintColor: "#777" }}
                        resizeMode="contain"
                    />
                    <Text style={{ fontSize: 32, fontWeight: '500' }}>환경 설정</Text>
                </View>
                <View style={{ padding: 10 }}>
                    <View style={styles.listItems}>
                        <Title>내 정보 관리</Title>
                        <Caption>{user.email}</Caption>
                    </View>
                    <View style={styles.listItems}>
                        <Title>일반</Title>
                        <Caption>Basic Settings</Caption>
                    </View>
                    <View style={styles.listItems}>
                        <Title>알림 설정</Title>
                        <Caption>Notifications</Caption>
                    </View>
                    <View style={styles.listItems}>
                        <Title>기기 인증 관리</Title>
                        <Caption>Device Informations</Caption>
                    </View>
                    <View style={styles.listItems}>
                        <Title>접근 및 권한</Title>
                        <Caption>Privacy Settings</Caption>
                    </View>
                    <View style={styles.listItems}>
                        <Title style={{ color: "#890000" }}>로그아웃</Title>
                        <Caption>Logout</Caption>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default DetailsScreen;

const styles = StyleSheet.create({
    mainView: {
        marginVertical: 20,
        marginHorizontal: 15,
    },
    listItems: {
        borderBottomColor: '#bbb',
        borderBottomWidth: 0.7,
        padding: 5
    },
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
});