import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, Image, Platform, ScrollView, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";


import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

import * as Animatable from 'react-native-animatable';

import Geocoder from 'react-native-geocoding';

const buisnessData = {}

const SignUpScreen = ({ navigation }) => {
    const [buisnessID, setBuisnessID] = useState();
    const [buisnessEmail, setBuisnessEmail] = useState();
    const [storeName, setStoreName] = useState();
    const [address, setAddress] = useState();
    const [phone, setPhone] = useState();
    // 상세주소를 따로 입력해넣어야 합니다!

    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    // const { register } = useContext(AuthContext);


    const setUser = (ID, storeName, address, password, { navigation }) => {
        buisnessData["buisnessID"] = ID;
        buisnessData["storeName"] = storeName;
        buisnessData["address"] = address;
        buisnessData["password"] = password;

        auth().createUserWithEmailAndPassword(buisnessEmail, password);

        let location;
        Geocoder.from(address)
            .then(json => {
                location = json.results[0].geometry.location;
                // console.log(location);
                buisnessData["latitude"] = location["lat"];
                buisnessData["longitude"] = location["lng"];
            })
            .catch(error => console.warn(error));

        console.log(buisnessData);

        setTimeout(() => {
            firestore().collection('buisnessInfo').doc(buisnessName).set({
                buisnessEmail: buisnessEmail,
                buisnessAddress: address,
                buisnessID: ID,
                buisnessName: storeName,
                buisnessPW: password,
                buisnessPhone: phone,
                latitude: buisnessData["latitude"],
                longitude: buisnessData["longitude"]
            });
            Alert.alert("회원가입 완료!", "로그인하기")
            navigation.goBack();
        }, 500);

    }

    return (
        <View style={styles.container}>
            <Animatable.View
                style={styles.header}
                animation="fadeIn">
                <Text style={styles.text_header}>회원가입을 완료하세요.</Text>
            </Animatable.View>
            <Animatable.View
                style={styles.footer}
                animation="fadeInUpBig">
                <ScrollView>
                    <View style={styles.input}>
                        <Text style={styles.label}>사업자등록번호</Text>
                        <FormInput
                            placeholderText="10자리 숫자"
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={(buisnessID) => setBuisnessID(buisnessID)}
                        />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>사업자 이메일</Text>
                        <FormInput
                            placeholderText="비즈니스 계정"
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={(buisnessEmail) => setBuisnessEmail(buisnessEmail)}
                        />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>매장 이름</Text>
                        <FormInput
                            placeholderText="사용자에게 보여질 매장 이름"
                            autoCorrect={false}
                            onChangeText={(storeName) => setStoreName(storeName)}
                        />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>매장 주소</Text>
                        <FormInput
                            placeholderText="정확한 주소를 입력해주세요."
                            onChangeText={(userAddress) => setAddress(userAddress)}
                        />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>매장 전화번호</Text>
                        <FormInput
                            placeholderText="전화번호를 입력해주세요."
                            onChangeText={(phone) => setPhone(phone)}
                        />
                    </View>
                    <View style={styles.input}>
                        <Text style={styles.label}>비밀번호</Text>
                        <FormInput
                            labelValue={password}
                            placeholderText="비밀번호"
                            keyboardType="numeric"
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                        />
                        <FormInput
                            labelValue={confirmPassword}
                            placeholderText="비밀번호 확인"
                            secureTextEntry={true}
                        />
                    </View>

                    <FormButton
                        buttonTitle="회원가입"
                        onPress={() => setUser(buisnessID, storeName, address, password, { navigation })}
                    />
                </ScrollView>

            </Animatable.View>
        </View>
    )
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#619EEA'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        //alignItems: 'center'
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    navButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2e64e5',
        marginTop: 20
    },
    QButtonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#90AFFF',
        marginTop: 40
    },
    signUpButton: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    text: {
        color: '#fff',
    },
    label: {
        left: 5,
        fontSize: 20
    },
    input: {
        marginBottom: 5
    }
});