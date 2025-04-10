import React, {useEffect, useState} from 'react';
import {Text, View, ScrollView, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuthStore} from '../store/authStore';
import {userInfoData, useUpdateUserInfo} from '../api/user/user';
import {Button, IconButton} from 'react-native-paper';
import isEqual from 'lodash/isEqual';
import {pickBy} from 'lodash';

const LabelBox = ({
  label,
  value,
  isEditing,
  onChange,
  field,
}: {
  label: string;
  value?: string;
  isEditing?: boolean;
  onChange?: (key: string, text: string) => void;
  field: string;
}) => (
  <View className="bg-gray-100 p-4 mb-3 rounded-lg">
    <Text className="text-lg text-gray-500 font-semibold mb-1">{label}</Text>
    {/* <Text className="text-lg text-black">{value || ''}</Text> */}
    {isEditing ? (
      <TextInput
        className="text-lg text-black border-b border-gray-400 pb-0"
        value={value}
        onChangeText={text => onChange?.(field, text)}
        placeholder={`Enter ${label}`}
      />
    ) : (
      <Text className="text-lg text-black">{value || ''}</Text>
    )}
  </View>
);

export function SettingScreen() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [userData, setUserData] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);
  const [editableUserData, setEditableUserData] = useState<any>({});

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
  console.log('userData', userData);
  useEffect(() => {
    if (userData) {
      setEditableUserData(userData);
    }
  }, [userData]);

  const handleChange = (key: string, text: string) => {
    setEditableUserData((prev: any) => ({
      ...prev,
      [key]: text,
    }));
  };
  const {mutate: updateUser} = useUpdateUserInfo();

  const handleSave = () => {
    const changedData = pickBy(editableUserData, (value, key) => {
      return !isEqual(userData?.[key], value);
    });
    if (Object.keys(changedData).length > 0) {
      updateUser(changedData);
      setUserData((prev: any) => ({...prev, ...changedData}));
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableUserData(userData);
    setIsEditing(false);
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{padding: 16}}>
        <View className="flex-row justify-between">
          <Text className="text-xl font-bold mb-4">Settings</Text>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => setIsEditing(prev => !prev)}
            iconColor="#000"
          />
        </View>

        <LabelBox
          label="Name"
          field="name"
          value={editableUserData?.name}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <LabelBox
          label="Email"
          field="email"
          value={editableUserData?.email}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <LabelBox
          label="Mobile Number"
          field="mobileNumber"
          value={editableUserData?.mobileNumber || ''}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <LabelBox
          label="Location"
          field="location"
          value={editableUserData?.location || ''}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <LabelBox
          label="Status"
          field="status"
          value={userData?.status || ''}
        />
        <LabelBox
          label="Date of Birth"
          field="dob"
          value={editableUserData?.dob || ''}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <View>
          {isEditing && (
            <View className="flex-row justify-between mt-4">
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={{flex: 1, marginRight: 8}}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={{flex: 1, marginLeft: 8}}>
                Save
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
