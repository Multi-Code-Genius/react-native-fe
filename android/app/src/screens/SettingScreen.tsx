import React, {useEffect, useState} from 'react';
import {Text, View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuthStore} from '../store/authStore';
import {userInfoData} from '../api/user';

const LabelBox = ({label, value}: {label: string; value?: string}) => (
  <View className="bg-gray-100 p-4 mb-3 rounded-lg">
    <Text className="text-lg text-gray-500 font-semibold mb-1">{label}</Text>
    <Text className="text-lg text-black">{value || ''}</Text>
  </View>
);

export function SettingScreen() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userInfoData();
        setUserData(data.user);
      } catch (err) {
        console.log('Error fetching user data', err);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{padding: 16}}>
        <Text className="text-xl font-bold mb-4">Settings</Text>

        <LabelBox label="Name" value={userData?.name} />
        <LabelBox label="Email" value={userData?.email} />
        <LabelBox label="Mobile Number" value={userData?.mobile || ''} />
        <LabelBox label="Location" value={userData?.location || ''} />
        <LabelBox label="Status" value={userData?.status || ''} />
        <LabelBox label="Date of Birth" value={userData?.dob || ''} />
      </ScrollView>
    </SafeAreaView>
  );
}
