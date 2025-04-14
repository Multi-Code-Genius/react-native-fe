import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {userInfoData, useUpdateUserInfo} from '../api/user/user';
import {
  Button,
  TextInput,
  Card,
  Text,
  useTheme,
  Appbar,
} from 'react-native-paper';
import isEqual from 'lodash/isEqual';
import {pickBy} from 'lodash';
import {useAuthStore} from '../store/authStore';

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
}) => {
  const theme = useTheme();

  return (
    <Card mode="contained" style={{marginBottom: 12}}>
      <Card.Content>
        <Text variant="labelLarge" style={{color: theme.colors.secondary}}>
          {label}
        </Text>
        {isEditing ? (
          <TextInput
            mode="flat"
            value={value}
            onChangeText={text => onChange?.(field, text)}
            placeholder={`Enter ${label}`}
            style={{backgroundColor: 'transparent', paddingHorizontal: 0}}
            underlineColor={theme.colors.primary}
            activeUnderlineColor={theme.colors.primary}
            dense
          />
        ) : (
          <Text variant="bodyLarge" style={{marginTop: 4}}>
            {value || 'Not specified'}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

type SettingScreenProps = {
  setIndex: (index: number) => void;
  setShowSettings: (show: boolean) => void;
};

export function SettingScreen({setIndex, setShowSettings}: SettingScreenProps) {
  const theme = useTheme();
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
    <>
      <Appbar.Header style={{backgroundColor: theme.colors.background}}>
        <Appbar.BackAction onPress={() => setShowSettings(false)} />

        <Appbar.Content title="Settings" />
        {!isEditing ? (
          <Appbar.Action
            icon="pencil"
            onPress={() => setIsEditing(true)}
            color={theme.colors.primary}
          />
        ) : (
          <Appbar.Action
            icon="close"
            onPress={handleCancel}
            color={theme.colors.error}
          />
        )}
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={{padding: 16}}
        style={{backgroundColor: theme.colors.background}}>
        <Card mode="contained">
          <Card.Content>
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
              value={editableUserData?.mobileNumber}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <LabelBox
              label="Location"
              field="location"
              value={editableUserData?.location}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <LabelBox label="Status" field="status" value={userData?.status} />
            <LabelBox
              label="Date of Birth"
              field="dob"
              value={editableUserData?.dob}
              isEditing={isEditing}
              onChange={handleChange}
            />

            {isEditing && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 16,
                }}>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  style={{flex: 1, marginRight: 8}}
                  textColor={theme.colors.error}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={{flex: 1, marginLeft: 8}}
                  buttonColor={theme.colors.secondary}>
                  Save Changes
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
}
