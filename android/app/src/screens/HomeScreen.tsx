import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Dialog, Portal, Text, useTheme} from 'react-native-paper';
import {useUserStore} from '../store/userStore';
import {useUserInfo} from '../api/user/user';

const HomeScreen = () => {
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const {data} = useUserInfo();
  const {loadUserData, setUserData} = useUserStore();

  useEffect(() => {
    setUserData(data?.user);
    loadUserData();
  }, []);

  const hideDialog = () => setVisible(false);
  const theme = useTheme();
  console.log('------>', theme.fonts.bodyLarge);

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
      <Text variant="displayLarge">Home Screen with custom fonts applied!</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
