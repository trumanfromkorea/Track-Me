
import React, { useState, useEffect, useContext } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    NativeModules,
    NativeEventEmitter,
    View,
    Image,
    Platform,
    TouchableOpacity,
    PermissionsAndroid,
    FlatList,
    TouchableHighlight,
    Alert,
} from 'react-native';

import userVisited from "../data/userVisited.json";
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import BleManager from 'react-native-ble-manager';
import { windowHeight } from '../utils/Dimensions';
import axios from 'axios';
import blockchain from '../blockchains/blockchain';
import block from "../data/block.json";

const Blockchain = new blockchain();

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BluetoothScreen = ({ navigation, ...rest }) => {
    const { user, logout } = useContext(AuthContext);
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);
    const [storeID, setStoreID] = useState("연결된 매장 없음"); // 매장 uuid state
    const [storeName, setStoreName] = useState("연결된 매장 없음"); // 매장 이름 state
    const [selected, setSelected] = useState(); // flatlist 선택되면 색깔 표시되려고 쓰는 state

    let latitude;
    let longitude;

    function create_block() {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const day = new Date().getDate();
        const hours = new Date().getHours();
        const min = new Date().getMinutes();

        // 년-월-일-시-분
        const date = year + '-' + (month + 1) + '-' + day + '-' + hours + '-' + min;

        const store_id = storeName; // 매장명으로 변경했음
        const user_id = user.email;
        const pre_index = block.blocks.length;
        const index = (pre_index + 1).toString();

        Blockchain.checkIn(date, store_id, user_id);

        //2차 검증을 위하여 firestore에 블록 저장
        setTimeout(() => {
            console.log(block);
            var tmpDict = {};
            tmpDict[index] = block.blocks[block.blocks.length - 1].hash;
            console.log(tmpDict);
            firestore().collection("userBlock").doc(user_id).set(tmpDict)
                .then(() => {
                    console.log("firestore에 블록 추가 완료");
                })
        }, 500)

        const new_geopoint = {
            "latitude": latitude,
            "longitude": longitude,
            "placeTitle": store_id,
            "visitedTime": date,
        }
        userVisited.location[pre_index] = new_geopoint;
    }

    // 블루투스 스캔하는 함수
    const startScan = () => {
        if (!isScanning) {
            BleManager.scan([], 3, true).then((results) => {
                console.log('Scanning...');
                setIsScanning(true);
            }).catch(err => {
                console.error(err);
            });
        }
    }

    // 블루투스 스캔 끝
    const handleStopScan = () => {
        console.log('Scan is stopped');
        setIsScanning(false);
    }

    const handleDiscoverPeripheral = (peripheral) => {
        if (peripheral.name) {
            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
        }
    }

    const testPeripheral = (peripheral) => {
        if (peripheral) {
            if (peripheral.connected) {
                BleManager.disconnect(peripheral.id);
            } else {
                BleManager.connect(peripheral.id).then(() => {
                    let p = peripherals.get(peripheral.id);
                    if (p) {
                        p.connected = true;
                        peripherals.set(peripheral.id, p);
                        setList(Array.from(peripherals.values()));
                    }
                    console.log('Connected to ' + peripheral.id);

                    setStoreID(peripheral.id);
                    setSelected(peripheral.id);
                    setStoreName(peripheral.name);

                    // characteristic 이랑 service 로그찍는 부분. 
                    setTimeout(() => {
                        BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
                            console.log('Retrieved peripheral services');
                            console.log(peripheralData.characteristics[0].characteristic);
                            console.log(peripheralData.characteristics[0].service);
                        });
                    }, 0);
                    // 여기까지

                }).catch((error) => {
                    console.log('Connection error', error);
                });
            }
        }
    }

    const testFirestore = async () => {
        const test = await firestore()
            .collection('buisnessInfo')
            .where('buisnessName', '==', storeName)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    console.log('Check in : ', documentSnapshot.data().buisnessName);
                    latitude = documentSnapshot.data().latitude;
                    longitude = documentSnapshot.data().longitude;
                    // 체크인 할꺼냐고 물어보는 부분. 확인 누르면 disconnectDevice 함수로, 취소 누르면 아무것도 안함
                    Alert.alert(
                        "매장 체크인",
                        documentSnapshot.data().buisnessName + " 매장에 체크인 하시겠습니까?",
                        [
                            {
                                text: "취소",
                                onPress: () => Alert.alert("알림", "체크인이 취소되었습니다."),
                                style: "cancel"
                            },
                            { text: "확인", onPress: () => disconnectDevice() }
                        ]
                    );
                });
            });
    }

    const postBlock = () => {
        const blockArray = block.blocks;
        // URL 바꿔주기~
        axios.post('https://54eabe7d8cf9.ngrok.io', blockArray[blockArray.length - 1]);
    }

    const disconnectDevice = () => {
        create_block();
        BleManager.disconnect(storeID)
            .then(() => {
                // Success code
                console.log("Disconnect From ", storeID);
                setSelected(null);
                Alert.alert("알림", "체크인이 완료되었습니다.");
                setTimeout(() => postBlock(), 500);
            })
            .catch((error) => {
                // Failure code
                console.log(error);
            });

    }

    useEffect(() => {
        BleManager.start({ showAlert: false });

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }
    }, []);

    const renderItem = (item) => {
        const color = item.id === selected ? '#AFDDFA' : '#fff';
        const textColor = item.id === selected ? '#fff' : '#333';
        return (
            <TouchableHighlight onPress={() => testPeripheral(item)} style={styles.listStyle}>
                <View style={[styles.row, { backgroundColor: color, padding: 5, flexDirection: 'row', alignItems: 'center' }]}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={{ width: 30, height: 30, marginLeft: 5 }}
                        resizeMode="contain"
                    />
                    <Text style={{ fontSize: 18, fontWeight: '300', textAlign: 'left', color: textColor, padding: 10 }}>{item.name}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    return (
        <View style={{ backgroundColor: '#fff', flex: 1, }}>
            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                    <Image
                        source={require('../assets/menu.png')}
                        style={{ width: 30, height: 30, left: 0 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <View style={styles.headerText}>
                    <Text style={{ fontSize: 15 }}>블루투스 체크인</Text>
                </View>
                <Image
                    source={require('../assets/menu_check.png')}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                />
            </View>
            <View>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <View style={{ top: 0, flexDirection: "row", justifyContent: "center", }}>
                        <TouchableOpacity
                            style={isScanning ? styles.disabledBtn : styles.buttonContainer}
                            {...rest}
                            onPress={() => startScan()}>
                            <Text
                                style={isScanning ? styles.loadingButtonText : styles.buttonText}>
                                {isScanning ? '스캔 중...' : '매장 스캔하기'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={!selected ? styles.disabledBtn2 : styles.buttonContainer}
                            {...rest}
                            onPress={() => testFirestore()}>
                            <Text
                                style={!selected ? styles.loadingButtonText2 : styles.buttonText}>
                                체크인 하기
                        </Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>
                        {global.HermesInternal == null ? null : (
                            <View style={styles.engine}>
                                <Text style={styles.footer}>Engine: Hermes</Text>
                            </View>
                        )}

                        <View style={styles.body}>

                            {(list.length == 0) &&
                                <View style={{ flex: 1, marginTop: 150, alignItems: 'center' }}>
                                    <Image
                                        source={require('../assets/emptyList.png')}
                                        style={{ width: 100, height: 100, marginBottom: 15 }}
                                        resizeMode="contain"
                                    />
                                    <View style={{ marginHorizontal: 40, paddingBottom: 5 }}>
                                        <Text style={{ textAlign: 'center', fontSize: 26, fontWeight: '600', color: '#444' }}>체크인 매장이 없습니다.</Text>
                                        <Text style={{ top: 5, textAlign: 'center', fontSize: 20, fontWeight: '300', color: '#777' }}>좌측 상단의 매장 스캔하기 버튼을 눌러서 체크인 할 매장을 찾아보세요!</Text>
                                    </View>
                                </View>
                            }

                        </View>
                    </ScrollView>
                    <View>
                        <FlatList
                            style={{ marginTop: 10 }}
                            data={list}
                            renderItem={({ item }) => renderItem(item)}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <View>

                    </View>
                </SafeAreaView>

            </View>

        </View>
    )
}

export default BluetoothScreen;

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
    buttonContainer: {
        marginVertical: 5,
        marginHorizontal: 5,
        marginTop: 10,
        width: '40%',
        height: windowHeight / 18,
        backgroundColor: '#0088F7',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    disabledBtn: {
        marginVertical: 5,
        marginHorizontal: 5,
        marginTop: 10,
        width: '40%',
        height: windowHeight / 18,
        backgroundColor: '#B7DAF4',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    disabledBtn2: {
        marginVertical: 5,
        marginHorizontal: 5,
        marginTop: 10,
        width: '40%',
        height: windowHeight / 18,
        backgroundColor: '#ccc',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '300',
        color: '#ffffff',
    },
    loadingButtonText: {
        fontSize: 18,
        fontWeight: '300',
        color: '#005E99',
    },
    loadingButtonText2: {
        fontSize: 18,
        fontWeight: '300',
        color: '#eee',
    },
    listStyle: {
        marginVertical: 2,
        marginHorizontal: 10,
        borderBottomColor: "#ccc",
        borderBottomWidth: 0.7,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    }
});