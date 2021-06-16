import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from "@react-native-firebase/firestore";
import * as Animatable from 'react-native-animatable';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import nameImg from '../assets/menu_profile.png';
import passwordImg from '../assets/locked.png';
import confirmImg from '../assets/unlocked.png';
import emailImg from '../assets/mail.png';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const [address, setAddress] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [birth, setBirth] = useState();

    const { register } = useContext(AuthContext);

    const addUser = () => {
        register(email, password);

        firestore().collection('userInfo').doc(email).set({
            userEmail: email,
            userName: name,
            userPhone: phoneNumber,
            userAddress: address,
            birth: birth,
        });
        Alert.alert("회원가입 완료!", "로그인하기")
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <Animatable.View
                style={styles.header}
                animation="fadeIn">
                <Text style={styles.text_header}>Create Your Account</Text>
            </Animatable.View>
            <Animatable.View
                style={styles.footer}
                animation="fadeInUpBig">
                <FormInput
                    labelValue={email}
                    onChangeText={(userEmail) => setEmail(userEmail)}
                    placeholderText="이메일"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    imageType={emailImg}
                />
                <FormInput
                    placeholderText="이름"
                    onChangeText={(name) => setName(name)}
                    autoCorrect={false}
                    imageType={nameImg}
                />
                <FormInput
                    labelValue={password}
                    onChangeText={(userPassword) => setPassword(userPassword)}
                    placeholderText="비밀번호"
                    keyboardType="numeric"
                    secureTextEntry={true}
                    imageType={passwordImg}
                />
                <FormInput
                    labelValue={confirmPassword}
                    onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                    placeholderText="비밀번호 확인"
                    keyboardType="numeric"
                    secureTextEntry={true}
                    imageType={confirmImg}
                />
                <FormInput
                    onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                    placeholderText="전화번호 ex)010XXXXXXXX"
                    keyboardType="numeric"
                    imageType={require('../assets/phone.png')}
                />
                <FormInput
                    onChangeText={(address) => setAddress(address)}
                    placeholderText="거주지 주소"
                    autoCorrect={false}
                    imageType={require('../assets/address.png')}
                />
                <FormInput
                    labelValue={Date}
                    onChangeText={(birth) => setBirth(birth)}
                    placeholderText="생년월일"
                    imageType={require('../assets/birth.png')}
                />
                <FormButton
                    buttonTitle="회원가입"
                    onPress={() => addUser()}
                />
            </Animatable.View>
        </View>
    )
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#619EEA',
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 50
    },
    footer: {
        flex: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 50,
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
    }
});