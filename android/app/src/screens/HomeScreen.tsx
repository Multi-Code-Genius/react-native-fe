import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuthStore} from '../store/authStore';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import {useUserStore} from '../store/userStore';
import {useUserInfo} from '../api/user/user';

const HomeScreen = () => {
  const {logout} = useAuthStore();
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const {data} = useUserInfo();
  const {loadUserData, setUserData} = useUserStore();

  useEffect(() => {
    setUserData(data?.user);
    loadUserData();
  }, []);

  const hideDialog = () => setVisible(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView className="">
      <Button onPress={showDialog}>Show Dialog</Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">This is simple dialog</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Text>Home Screen</Text>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={{width: '50%', margin: 'auto'}}>
        Logout
      </Button>
    </SafeAreaView>
  );
};

export default HomeScreen;
