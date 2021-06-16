
import React, { useState, useEffect, useContext } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import geolocation from '@react-native-community/geolocation';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import CheckBox from '@react-native-community/checkbox';
import FormButton from '../components/FormButton';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import { sha256 } from "react-native-sha256";

import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import block from '../data/block.json';

import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';

const timer = ms => new Promise(res => setTimeout(res, ms));

const Drawer = createDrawerNavigator();

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();

const cur_date = year + '-' + month + '-' + day;

const SharingOption = ({ navigation, ...rest }) => {
    const [privacySettings, setPrivacySettings] = useState(false);
    const [visitedSettings, setVisitedSettings] = useState(false);
    const [patientID, setPatientID] = useState();

    const sharingButton = async () => {
        Alert.alert("공유 완료", "확진자와 자가격리자 정보가 공유되었습니다. 코로나 바이러스 역학조사에 도움을 주셔서 감사합니다.")

        const response = await axios.post('https://3f6a6203d8e7.ngrok.io/receiveID');
        console.log(response.data);
        setPatientID(response.data);
        updateToFirestore();
        setTimeout(() => {
            getQuarantine(response.data);
            Alert.alert("공유 완료", "확진자와 자가격리자 정보가 공유되었습니다. 코로나 바이러스 역학조사에 도움을 주셔서 감사합니다.")
        }, 1000);
    }
    function updateToFirestore() {
        // date_index는 현재 저장된 블록들의 날짜 총개수
        const date_index = block.length;
        var testDict = {};
        for (var key in block) {
            var block_index = block[key].blocks;
            //console.log(block_index);
            (block[key].blocks).forEach((element) => {
                if (element.user_id == patientID) {
                    testDict[element.index] = element.hash;
                    firestore().collection("tempConfirmedStoreBlock")
                        .doc(patientID)
                        .set(testDict)
                        .then(() => {
                            console.log("ADDED");
                        })
                }
            })
        }
    }

    const getQuarantine = async (findID) => {
        const find = block[cur_date].blocks;
        // console.log(find);
        let patientID;
        let patientVisitedTime;
        let querySize = 0;
        let quarantineID = [];

        find.forEach((element) => {
            console.log(element);
            if (element.user_id == findID) {
                patientID = element.user_id;
                console.log(patientID);
                patientVisitedTime = (element.date).split('-').map(x => Number(x));
            }
        })
        await firestore().collection('quarantineInfo').get().then((query) => querySize = query.size);
        find.forEach((element) => {
            let flag = false;

            if (element.user_id == findID) {
                return true;
            }
            const findDate = (element.date).split('-').map(x => Number(x));
            console.log(querySize);
            if (findDate[3] == patientVisitedTime[3]) {
                if (findDate[4] >= patientVisitedTime[4] - 10 && findDate[4] <= patientVisitedTime[4] + 10) {
                    flag = true;
                }
            }
            else if (findDate[3] - 1 == patientVisitedTime[3] && findDate[4] + 50 <= patientVisitedTime[4]) {
                flag = true;
            }
            else if (findDate[3] + 1 == patientVisitedTime[3] && findDate[4] - 50 >= patientVisitedTime[4]) {
                flag = true;
            }

            if (flag) {
                firestore().collection('quarantineInfo').doc(element.user_id).set({
                    checkedConfirm: false,
                    checkedRelease: false,
                    quarantinedNum: querySize++,
                    quarantinedTime: cur_date,
                })
            }
        })
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                    <Image
                        source={require('../assets/menu.png')}
                        style={{ width: 30, height: 30, left: 0 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <View style={styles.headerText}>
                    <Text style={{ fontSize: 15 }}>공유 옵션</Text>
                </View>
                <Image
                    source={require('../assets/menu_share.png')}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.scrollViewContainer}>
                <ScrollView>
                    <View style={{ top: 20, left: 20, marginRight: 40, bottom: 30 }}>
                        <Text style={styles.title}>
                            개인정보 처리방침
                </Text>
                        <View style={styles.lines}></View>
                        <Text style={styles.paragraph}>
                            당사는 서비스 이용과 코로나-19 바이러스 확진 정보 및 밀접 접촉자 분류를 위해 필요한 최소한의 개인정보만을 수집합니다.
                            확진 시 사용자의 이름, 생년월일, 성별, 거주지 등의 개인 정보는 보건 당국에 공유될 수 있는것을 알려드립니다.
                            2주 간의 동선 정보 외에 (이하 방문장소 공유안내에 자세하게 명시함) 사용자의 정보는 안전하게 보호되며 바이러스 치료 외 목적으로 사용되지 않는 것을 알려드립니다.
                </Text>
                        <View style={{ flexDirection: "row", marginTop: 20, alignItems: "center" }}>
                            <View style={styles.checkbox}>
                                <CheckBox
                                    hideBox
                                    style={{ height: 20, width: 20 }}
                                    value={privacySettings}
                                    onValueChange={(newValue) => setPrivacySettings(newValue)}
                                />
                            </View>
                            <View>
                                <Text style={styles.agreeText}> {"개인정보 처리방침을 숙지하였으며,\n 이에 동의합니다."} </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ top: 50, left: 20, marginRight: 40, bottom: 30 }}>
                        <Text style={styles.title}>
                            방문장소 공유안내
                </Text>
                        <View style={styles.lines}></View>
                        <Text style={styles.paragraph}>
                            확진 판정 시, 확진자의 2주 간 동선 정보를 서비스의 모든 사용자에게 공개하는 것을 알려드립니다.
                            확진자의 방문장소는 방문 시간대 기준 순차적으로 2주 간 모든 사용자에게 공개되며 이는 역학조사 시 밀접접촉자 분류 외에 그 어떤 의도로도 사용되지 않는 것을 알려드립니다.
                            확진자의 개인정보는 철저히 안전하게 보장되는 것을 다시 한번 알려드리며, 개인 혹은 집단의 사적 이익을 위하여 동선 정보를 거짓으로 명시하는 행위는 법적으로 처벌될 수 있음을 알려드립니다.
                </Text>
                        <View style={{ flexDirection: "row", marginTop: 20, alignItems: "center" }}>
                            <View style={styles.checkbox}>
                                <CheckBox
                                    hideBox
                                    style={{ height: 20, width: 20 }}
                                    value={visitedSettings}
                                    onValueChange={(newValue) => setVisitedSettings(newValue)}
                                />
                            </View>
                            <View>
                                <Text style={styles.agreeText}> {"방문장소 공유안내를 숙지하였으며,\n 이에 동의합니다."} </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ top: 70, left: 20, marginRight: 40, bottom: 30, }}>
                        <TouchableOpacity
                            disabled={!privacySettings || !visitedSettings ? true : false}
                            style={!privacySettings || !visitedSettings ? styles.disabledBtn : styles.buttonContainer}
                            {...rest}
                            onPress={() => sharingButton()}>
                            <Text style={styles.buttonText}>개인정보 및 동선정보 공유하기</Text>
                        </TouchableOpacity>
                        <View style={{ height: 100 }}></View>
                    </View>
                    
                </ScrollView>
            </View>
        </View>
    )
}

export default SharingOption;

const styles = StyleSheet.create({
    scrollViewContainer: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginVertical: 20,
        marginBottom: 100,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#222',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
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
    lines: {
        marginTop: 10,
        marginBottom: 7,
        borderBottomWidth: 0.7,
        borderBottomColor: "#999"
    },
    headerText: {
        color: "black",
        flex: 1,
        padding: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
    },
    paragraph: {
        fontSize: 15,
        top: 5,
        textAlign: 'justify',
        lineHeight: 20
    },
    checkbox: {
        borderWidth: 1,
        borderColor: "#999",
        height: 22,
        width: 22,
        borderRadius: 100,
    },
    agreeText: {
        marginTop: 3,
        color: "#0064FF",
        marginLeft: 10,
        fontWeight: "bold"
    },
    buttonContainer: {
        marginTop: 10,
        width: '100%',
        height: windowHeight / 15,
        backgroundColor: '#668FFD',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    disabledBtn: {
        marginTop: 10,
        width: '100%',
        height: windowHeight / 15,
        backgroundColor: '#ccc',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});