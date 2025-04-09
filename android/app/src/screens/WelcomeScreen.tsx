import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native"
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const WelcomeScreen = () => {
    const navigation = useNavigation();
    return (
        <ImageBackground
            source={require('../assets/image/welcome.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View className='flex justify-center items-center'>
                <LottieView
                    source={require('../assets/Animationdata12.json')}
                    autoPlay
                    loop
                    style={styles.animation}
                />
            </View>
            <View className='flex items-center h-[300px] justify-between'>
                <View className='flex gap-5'>
                    <Text className='text-3xl font-bold text-white'>MULTI CODE GENIUS</Text>
                    <Text className='text-lg text-[#e6dbdb] text-center'>Welcome To Multi Code Genius</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => (navigation as any).navigate('Login')}>
                    <Text style={styles.buttonText}>Get Started for Free</Text>
                    <Icon name="chevron-right" size={20} color="#000" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center'
    },
    animation: {
        width: 300,
        height: 300
    },
    button: {
        backgroundColor: "white",
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: "#1A2238",
        fontSize: 16,
        fontWeight: "600",
        marginRight: 8,
    },
    icon: {
        marginLeft: 4,
    },
})

export default WelcomeScreen