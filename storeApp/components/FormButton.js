import React from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { windowHeight, windowWidth } from '../utils/Dimensions';

const FormButton = ({buttonTitle, ...rest}) => {
    return (
        <TouchableOpacity style={styles.buttonContainer} {...rest}>
            <Text style={styles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
    );
};

export default FormButton;

const styles = StyleSheet.create({
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
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});