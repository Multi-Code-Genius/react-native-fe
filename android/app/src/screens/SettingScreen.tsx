import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView } from 'react-native';
import { userInfoData, useUpdateUserInfo } from '../api/user/user';
import {
  Button,
  TextInput,
  Card,
  Text,
  useTheme,
  Appbar,
  Portal,
  Dialog,
  ActivityIndicator,
} from 'react-native-paper';
import isEqual from 'lodash/isEqual';
import { pickBy } from 'lodash';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';

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
    <Card mode="contained" style={styles.labelBoxCard}>
      <Card.Content style={styles.cardContent}>
        <Text variant="labelLarge" style={{ color: theme.colors.secondary }}>
          {label}
        </Text>
        {isEditing ? (
          <TextInput
            mode="flat"
            value={value}
            onChangeText={text => onChange?.(field, text)}
            placeholder={`Enter ${label}`}
            style={styles.textInput}
            underlineColor={theme.colors.primary}
            activeUnderlineColor={theme.colors.primary}
            dense
          />
        ) : (
          <Text variant="bodyLarge" style={styles.valueText}>
            {value || 'Not specified'}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

export function SettingScreen() {
  const theme = useTheme();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { logout } = useAuthStore();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);
  const [editableUserData, setEditableUserData] = useState<any>({});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const { mutate: updateUser } = useUpdateUserInfo();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const data = await userInfoData();
        setUserData(data.user);
      } catch (err) {
        console.log('Error fetching user data', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (userData) {
      setEditableUserData(userData);
      if (userData.dob) {
        const parsed = new Date(userData.dob);
        if (!isNaN(parsed.getTime())) {
          setDate(parsed);
        }
      }
    }
  }, [userData]);

  const handleChange = (key: string, value: string) => {
    setEditableUserData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const changedData = pickBy(editableUserData, (value, key) => {
      return !isEqual(userData?.[key], value);
    });
    if (Object.keys(changedData).length > 0) {
      updateUser(changedData);
      setUserData((prev: any) => ({ ...prev, ...changedData }));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableUserData(userData);
    if (userData?.dob) {
      const parsed = new Date(userData.dob);
      if (!isNaN(parsed.getTime())) {
        setDate(parsed);
      }
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background }} mode="center-aligned">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
        {!isEditing ? (
          <Appbar.Action mode="contained" icon="content-save-edit" onPress={() => setIsEditing(true)} color={theme.colors.primary} />
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <Appbar.Action mode="contained" icon="content-save-check" onPress={handleSave} color={theme.colors.primary} />
            <Appbar.Action mode="contained" icon="close" onPress={handleCancel} color={theme.colors.error} />
          </View>
        )}
        <Button
          mode="elevated"
          icon="logout"
          contentStyle={{ flexDirection: 'row-reverse' }}
          onPress={() => setDialogVisible(true)}>
          Logout
        </Button>
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={{ backgroundColor: theme.colors.background }}>
        <Card mode="contained" style={styles.mainCard}>
          <Card.Content style={styles.mainCardContent}>
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
            <LabelBox label="Status" field="status" value={userData?.status} />
            <Card mode="contained" style={styles.labelBoxCard}>
              <Card.Content style={styles.cardContent}>
                <Text variant="labelLarge" style={{ color: theme.colors.secondary }}>
                  Date of Birth
                </Text>
                {isEditing ? (
                  <>
                    <Button onPress={() => setOpenDatePicker(true)}>
                      {date ? date.toDateString() : 'Select Date'}
                    </Button>
                    <DatePicker
                      modal
                      open={openDatePicker}
                      date={date}
                      mode="date"
                      onConfirm={(selectedDate) => {
                        setOpenDatePicker(false);
                        setDate(selectedDate);
                        handleChange('dob', selectedDate.toISOString());
                      }}
                      onCancel={() => setOpenDatePicker(false)}
                    />
                  </>
                ) : (
                  <Text variant="bodyLarge" style={styles.valueText}>
                    {editableUserData?.dob ? new Date(editableUserData.dob).toDateString() : 'Not specified'}
                  </Text>
                )}
              </Card.Content>
            </Card>
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to log out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>No</Button>
            <Button
              onPress={() => {
                logout();
                setDialogVisible(false);
              }}>
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 32,
  },
  mainCard: {
    borderRadius: 8,
  },
  mainCardContent: {
    paddingVertical: 8,
  },
  labelBoxCard: {
    marginBottom: 12,
    borderRadius: 4,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  cardContent: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  textInput: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    marginTop: 4,
  },
  valueText: {
    marginTop: 4,
    paddingVertical: 4,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
