import React from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import { windowHeight, windowWidth } from '../utils/Dimensions';


const FormInput = ({labelValue, placeholderText, imageType, ...rest}) => {
    return (
        <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
                {/* <AntDesign name={iconType} size={25} color="#666"/> */}
                <Image source={imageType} style={{width:30,height:30}} />
            </View>
            <TextInput
                value={labelValue}
                style={styles.input}
                placeholder={placeholderText}
                placeholderTextColor='#666'
                {...rest}
            />
        </View>
    );
};

export default FormInput;

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 5,
        marginBottom: 10,
        width: '100%',
        height: windowHeight / 15,
        borderColor: '#ccc',
        borderRadius: 3,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    iconStyle: {
        padding: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: '#ccc',
        borderRightWidth: 1,
        width: 50,
    },
    input: {
        padding:10,
        flex: 1,
        fontSize: 16,
        color: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputField: {
        padding: 10,
        marginTop: 5,
        marginBottom: 10,
        width: windowWidth / 1.5,
        height: windowHeight / 15,
        fontSize: 16,
        borderRadius: 8,
        borderWidth: 1
    }
});