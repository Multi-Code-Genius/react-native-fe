import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, ImageBackground, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { ResetPasswordLinkParams } from '../types/auth';
import { useResetPasswordLink } from '../api/auth/auth';
import { Animated } from 'react-native';

const ResetPassword1 = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const {
        mutate: sendResetLink } = useResetPasswordLink();
    const slideAnim = useRef(new Animated.Value(500)).current;


    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            delay: 100,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleSubmit = () => {
        if (!email) return;
        const payload: ResetPasswordLinkParams = { email };

        sendResetLink(payload, {
            onSuccess: (data) => {
                console.log('Response:', data);
                setMessage(data?.message || 'Reset password link has been sent to your email.');
            },
            onError: (error: any) => {
                console.error('Error:', error);
                setMessage('Failed to send reset link. Please try again.');
            },
        });
    };

    return (
        <ImageBackground
            source={require('../assets/image/backgroundimage.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
                    <Text className="text-2xl font-bold text-center text-white mb-6">
                        Reset Password
                    </Text>
                    <View className='flex gap-7'>
                        <View className='flex gap-3'>
                            <Text className="text-white font-semibold text-[14px]">Email:</Text>
                            <TextInput
                                placeholder="Enter your email address"
                                className="border text-white placeholder:text-white border-gray-300 rounded-xl p-4 mb-4 text-base"
                                onChangeText={setEmail}
                                value={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View className='flex gap-3 justify-start'>
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.loginButtonText}>Send Reset Password Link</Text>
                            </TouchableOpacity>
                            {message !== '' && (
                                <Text style={{ color: 'green', textAlign: 'center', fontSize: 15 }}>
                                    {message}
                                </Text>
                            )}
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </ImageBackground>

    );
};

export default ResetPassword1;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    content: {
        backgroundColor: 'rgba(29, 24, 24, 0.877)',
        padding: 30,
        borderRadius: 16,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});