
import React, { useState, useEffect, useContext } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { windowHeight } from '../utils/Dimensions';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';

import block from "../data/block.json";
import blockchain from '../blockchains/blockchain';
import axios from 'axios';

import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';

const Blockchain = new blockchain();

const SharingOption = ({ navigation, ...rest }) => {
    const { user } = useContext(AuthContext);

    const [privacySettings, setPrivacySettings] = useState(false);
    const [visitedSettings, setVisitedSettings] = useState(false);

    const postBlockToServer = () => {
        axios.post('https://54eabe7d8cf9.ngrok.io/sendID', { userID: user.email });
    }

    const updateToFirestore = () => {
        var tmpDict = {};

        (block.blocks).forEach((element) => {
            tmpDict[element.index] = JSON.stringify(element);
        })
        console.log(tmpDict);

        firestore().collection("tempConfirmedUserBlock")
            .doc(user.email)
            .set(tmpDict)
            .then(() => { console.log("added"); });
    }

    const sharingButton = () => {
        Blockchain.firstValidationChecking();
        updateToFirestore();

        setTimeout(() => {
            check_block();
        }, 10);

        postBlockToServer();
        Alert.alert("동선 공유 완료", "사용자의 지난 동선 정보가 공유되었습니다. 코로나 바이러스 역학조사에 도움을 주셔서 감사합니다.")
    }
    // 블록 검증
    // 일치하면 true 조작이 있으면 false 반환
    async function check_block() {
        const index = block.blocks.length;
        let ct = 0;

        //블록이 없는경우 1 반환
        if (index == 0) {
            Alert.alert("경고", "체크인 기록이 없습니다!");
        }

        // 검증은 데이터를 해싱한 것이 기존의 해시값과 일치하는지 + 다음 블록의 이전 해시값과 동일한지 여부 확인
        // 첫번째 인덱스 ~ 마지막 인덱스 -1 까지는 다음 블록의 이전 해시값과 동일 여부도 판단
        // 마지막 인덱스는 다음 블록이 없으므로 기존의 해시값과 일치 여부만 확인
        for (var i = 0; i < index; i++) {
            //2차 검증을 위하여 firestore에서 가져와서 비교
            if (checkList[i + 1] != block.blocks[i].hash) {
                ct++;
                console.log("increased");
            } else {
                console.log("nothing changed");
            }
        }
        setTimeout(() => {
            console.log("CT", ct);
            if (ct != 0) {
                alert('block changed!');
            }
        }, 500);
    }

    let checkList = {};

    const getFireStore = async () => {
        const firestore_block = await firestore()
            .collection("userBlock")
            .doc(user.email)
            .onSnapshot(doc => {
                console.log("Docdata", doc.data());
                checkList = doc.data();
            });

    }

    useEffect(() => {
        getFireStore();
    });

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
        lineHeight: 20,
        fontWeight: "200"
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
        fontWeight: "700"
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