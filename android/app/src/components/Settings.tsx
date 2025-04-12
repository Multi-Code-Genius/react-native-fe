import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, IconButton, Menu, Portal, Provider, useTheme } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';


type SettingsProps = {
    setIndex: (index: number) => void;
};

const Settings: React.FC<SettingsProps> = ({ setIndex }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const { logout } = useAuthStore();
    const navigation = useNavigation();
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    return (
        <View className='flex justify-end'>
            <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity onPress={openMenu}>
                        <IconButton
                            icon="cog"
                            size={20}
                            iconColor="#000"
                            style={{ margin: 0 }}
                        />
                    </TouchableOpacity>
                }>
                <Menu.Item
                    onPress={() => {
                        (navigation as any).navigate('Settings');
                    }}
                    title="Edit Profile"
                />
                <Menu.Item
                    onPress={() => {
                        closeMenu();
                        setDialogVisible(true);
                    }}
                    title="Log out"
                />
            </Menu>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
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
                                setIndex(0);
                            }}
                        >
                            Yes
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>
    )
}

export default Settings
