import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { ResetPasswordLinkParams } from '../types/auth';
import { useResetPasswordLink } from '../api/auth/auth';


const ResetPassword1 = () => {
    const [email, setEmail] = useState('');
    const { mutate: sendResetLink } = useResetPasswordLink();

    const handleSubmit = () => {
        if (!email) return;

        const payload: ResetPasswordLinkParams = {
            email,
        };

        sendResetLink(payload);
    };

    return (
        <View className='flex-1 bg-white px-6 justify-center gap-4'>
            <Text className="text-2xl font-bold text-center text-black mb-6">
                Reset Password
            </Text>

            <Text className="text-black font-semibold text-[17px]">Email:</Text>

            <TextInput
                placeholder="Enter your email address"
                className="border text-black border-gray-300 rounded-xl p-4 mb-4 text-base"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <View className='rounded-xl overflow-hidden'>
                <Button onPress={handleSubmit} title='Send Reset Password Link' />
            </View>
        </View>
    );
};

export default ResetPassword1;
