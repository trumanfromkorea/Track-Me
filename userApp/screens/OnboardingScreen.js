import React from 'react';
import { Text, TouchableOpacity, Button, StyleSheet, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const Skip = ({ ...props }) => (
    <Button
        title='건너뛰기'
        color="#000000"
        {...props}
    />
)

const Next = ({ ...props }) => (
    <Button
        title='다음'
        color="#000000"
        {...props}
    />
)

const Done = ({ ...props }) => (
    <TouchableOpacity
        style={{ marginHorizontal: 10 }}
        {...props}
    >
        <Text style={{ fontSize: 16 }}>완료</Text>
    </TouchableOpacity>
)

const OnboardingScreen = ({ navigation }) => {
    return (
        <Onboarding
            SkipButtonComponent={Skip}
            NextButtonComponent={Next}
            DoneButtonComponent={Done}

            onSkip={() => navigation.replace("SplashScreen")}
            onDone={() => navigation.navigate("SplashScreen")}
            pages={[
                {
                    backgroundColor: '#b9e2fa',
                    image: <Image source={require('../assets/onboarding1.png')} style={styles.imgContainer} />,
                    title: '더 편리한 체크인',
                    subtitle: '블루투스를 활성화하여 더 편리하게 이용해보세요.',
                },
                {
                    backgroundColor: '#ffefbf',
                    image: <Image source={require('../assets/onboarding2.png')} style={styles.imgContainer} />,
                    title: '한 눈에 보는 동선',
                    subtitle: '지도 내에서 당신과 확진자의 동선을 확인하세요.',
                },
                {
                    backgroundColor: '#ccffbf',
                    image: <Image source={require('../assets/onboarding3.png')} style={styles.imgContainer} />,
                    title: '내 건강은 내가',
                    subtitle: '지금 Track Me 와 함께해보세요!',
                },
            ]}
        />
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgContainer: {
        width: 200,
        height: 200,
        resizeMode: 'contain'
    }
});