import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import FormButton from '../components/FormButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { windowHeight, windowWidth } from '../utils/Dimensions';

import block from '../data/block.json';
import {
    Avatar,
    Title,
    Caption,
    TouchableRipple,
    Switch
} from 'react-native-paper';

const Drawer = createDrawerNavigator();

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();


const cur_date = year + '-' + month + '-' + day;

const HomeScreen = ({ navigation }) => {
    const [visited, setVisited] = useState(false);

    console.log("Block :", block);
    const BD = [];

    const getUser = () => {
        setTimeout(() => {
            AsyncStorage.getItem('USERDATA', (err, result) => {
                const user = JSON.parse(result);
                // buisnessData.push(user);
                console.log("firstAsync")
                console.log(user);
                BD.push(user["address"]);
            });
        }, 0);
        // console.log(buisnessData);
    }

    const checkAsync = () => {
        console.log("checkAsync");
        console.log(BD[0]);
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#B9E2FA" }}>
            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image
                        source={require('../assets/menu.png')}
                        style={{ width: 30, height: 30, left: 0 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <View style={styles.headerText}>
                    <Text style={{ fontSize: 15 }}>Track Me ????????????</Text>
                </View>
                <Image
                    source={require('../assets/home.png')}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                />
            </View>
            {/* <View style={styles.container}>

                <FormButton
                    buttonTitle="????????? ??????"
                    onPress={() => alert('')}
                />
                <FormButton
                    buttonTitle="???????????? ??????"
                    onPress={() => alert('')}
                />
                <FormButton
                    buttonTitle="??????"
                    onPress={() => alert('')}
                />
                <FormButton
                    buttonTitle="getUserData"
                    onPress={() => getUser()}
                />
            </View> */}
            <View style={styles.boxContainer}>
                <View style={styles.homeBox}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.image} />
                    <Text style={styles.titleText}>Track Me</Text>
                </View>
                <View style={styles.bodyBox}>
                    <Text style={styles.bodyText}>???????????? ???????????? ??? Track Me,</Text>
                    <Text style={styles.bodyText}>???????????? ??????, ?????? ?????? ????????????,</Text>
                    <Text style={styles.bodyText}>?????? ????????? ???????????? ???????????? ????????????!</Text>
                </View>
                <View style={styles.doctorImg}>
                    <Image
                        source={require('../assets/doctor.jpeg')}
                        style={{ width: 300, height: 280 }}
                        resizeMode="contain"
                    />
                </View>

            </View>
            <View style={styles.infoBoxWrapper}>
                <View style={[styles.infoBox, {
                    borderRightColor: '#0078FF',
                    borderRightWidth: 1,
                }]}>
                    <Title>{block[cur_date].blocks.length} ???</Title>
                    <Caption>????????? ????????? ???</Caption>
                </View>
                <View style={styles.infoBox}>
                    <Title style={{ color: visited ? "red" : "#668ffd" }}>{visited ? '????????? ??????' : '?????? ??????'}</Title>
                    <Caption>????????? ?????? ??????</Caption>
                </View>
            </View>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    boxContainer: {
        backgroundColor: "#E6F2FA",
        marginHorizontal: 20,
        marginVertical: 40,
        borderRadius: 15,
        shadowColor: '#1E3269',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    image: {
        width: 53,
        height: 53,
        resizeMode: "contain"
    },
    doctorImg: {
        alignItems: "center",
        shadowColor: '#222',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        marginBottom: 15,
    },
    infoBoxWrapper: {
        backgroundColor: "#EBFBFF",
        borderBottomColor: '#0078FF',
        borderBottomWidth: 1,
        borderTopColor: '#0078FF',
        borderTopWidth: 1,
        flexDirection: 'row',
        marginHorizontal: 10,
        height: 100,
        shadowColor: '#1E3269',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    infoBox: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeBox: {
        marginTop: 20,
        marginHorizontal: 30,
        marginVertical: 15,
        borderBottomColor: "#1E3269",
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    titleText: {
        fontSize: 30,
        fontWeight: "300",
        marginLeft: 14,
        color: "#1E3269"
    },
    bodyText: {
        fontWeight: "300",
        fontSize: 16,
        color: "#1E3269"
    },
    bodyBox: {
        marginHorizontal: 30
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20,
    },
    floatingHeader: {
        marginTop: Platform.OS === 'ios' ? 50 : 20,
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#1E3269',
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