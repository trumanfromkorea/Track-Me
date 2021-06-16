import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import emailImg from '../assets/menu_profile.png';
import passwordImg from '../assets/locked.png';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const { login } = useContext(AuthContext);

    const testLogin = () => {
        login(email, password);
    }

    return (
        <View style={styles.container}>
            <Animatable.View
                style={styles.header}
                animation="fadeIn">
                <Text style={styles.text_header}>Track Me</Text>
            </Animatable.View>
            <Animatable.View
                style={styles.footer}
                animation="fadeInUpBig">
                <FormInput
                    labelValue={email}
                    onChangeText={(userEmail) => setEmail(userEmail)}
                    placeholderText="이메일을 입력하세요."
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    imageType={emailImg}
                />
                <FormInput
                    labelValue={password}
                    onChangeText={(userPassword) => setPassword(userPassword)}
                    placeholderText="비밀번호를 입력하세요."
                    secureTextEntry={true}
                    imageType={passwordImg}
                />
                <FormButton
                    buttonTitle="로그인"
                    onPress={() => testLogin()}
                />
                <TouchableOpacity style={styles.forgotButton} onPress={() => { }}>
                    <Text style={styles.navButtonText}>비밀번호를 잊으셨나요?</Text>
                </TouchableOpacity>
                <Text style={styles.QButtonText}>아직 계정이 없으시다면</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUpScreen')}
                    style={{ marginTop: 10 }}>
                    <LinearGradient
                        colors={['#86A5FF', '#90AFFF']}
                        style={styles.signUpButton}
                    >
                        <Text style={styles.text}>회원가입하기</Text>
                        <Image source={require('../assets/arrow_right.png')}
                            style={{
                                width: 20, height: 20
                            }}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    )
}

export default SignInScreen;

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
        flex: 1.5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center'
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 40,
        left: 10,
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