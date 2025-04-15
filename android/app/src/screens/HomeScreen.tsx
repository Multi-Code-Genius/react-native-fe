import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Dialog, Portal, Text, useTheme} from 'react-native-paper';
import {useUserStore} from '../store/userStore';
import {useUserInfo} from '../api/user/user';
import Stories from '../components/Stories';

const HomeScreen = () => {
  // const [visible, setVisible] = React.useState(false);
  // const showDialog = () => setVisible(true);
  const {data} = useUserInfo();
  const {loadUserData, setUserData} = useUserStore();

  useEffect(() => {
    setUserData(data?.user);
    loadUserData();
  }, []);

  // const hideDialog = () => setVisible(false);
  // const theme = useTheme();

  return <Stories />;
};

export default HomeScreen;
