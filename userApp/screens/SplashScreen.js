import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const SplashScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Animatable.Image
                    animation="shake"
                    duration="10000"
                    source={require('../assets/logo_name.png')}
                    style={styles.logo}
                    resizeMode='contain'
                />
            </View>
            <Animatable.View
                style={styles.footer}
                animation="fadeInUpBig">
                <Text style={styles.title}>Welcome to Track Me!</Text>
                <Text style={styles.text}>Track Me 에 오신 것을 진심으로 환영합니다!</Text>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                        <LinearGradient
                            colors={['#668ffd', '#093E8E']}
                            style={styles.signIn}
                        >
                            <Text style={styles.buttonText}>Get Started!</Text>
                            <Image source={require('../assets/arrow_right.png')}
                                style={{
                                    width: 20, height: 20
                                }}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    )
}

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#B9D9F7',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: 255,
        height: height_logo
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold',
    },
    text: {
        color: '#093E8E',
        marginTop: 5,
        fontSize: 15
    },
    buttonText: {
        color: '#fff',
        marginTop: 0,
        fontSize: 15
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    }
});