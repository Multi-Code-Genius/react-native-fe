import React, { useEffect, useState } from 'react';
import { View, Image, Text, Alert, FlatList } from 'react-native';
import { VideoUploaderComponent } from '../components/VideoUploaderComponent';
import { useAuthStore } from '../store/authStore';
import { IconButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUploadImage } from '../api/image/image';
import { userInfoData } from '../api/user/user';
import { TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import { Menu, Provider, Dialog, Portal, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';



type ProfileScreenProps = {
  setIndex: (index: number) => void;
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ setIndex }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [userData, setUserData] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const { logout } = useAuthStore();
  const navigation = useNavigation();
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);


  const fetchUserData = async () => {
    try {
      const data = await userInfoData();
      setUserData(data.user);
    } catch (err) {
      console.log('Error fetching user data', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const userId = userData?.id;

  const uploadImageMutation = useUploadImage(
    res => {
      if (!res?.user) {
        Alert.alert('Upload failed', 'Invalid response from server');
        return;
      }
      setUserData(res.user);
      Alert.alert('Success', 'Profile image uploaded successfully');
    },
    error => {
      Alert.alert('Error', 'Image upload failed');
      console.log('Upload error:', error);
    },
  );

  const handleMediaPick = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel || !response.assets?.length) return;

      const asset = response.assets[0];
      if (!asset.uri || !userId) return;

      const formData = new FormData();
      formData.append('profile_pic', {
        uri: asset.uri,
        name: asset.fileName ?? 'image.jpg',
        type: asset.type ?? 'image/jpeg',
      });

      uploadImageMutation.mutate({
        id: userId,
        payload: formData,
      });
    });
  };

  return (
    <Provider>
      <View className="flex-1 p-6 bg-white">
        <View className='flex w-full flex-col'>
          <View className="flex w-full flex-row justify-end">
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
          </View>
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
          <View className="flex-row gap-5 w-full">
            <View className="relative w-32 h-32">
              <View className="w-full h-full rounded-full border-4 border-gray-100 overflow-hidden">
                <Image
                  source={{ uri: userData?.profile_pic }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                <IconButton
                  icon="plus"
                  size={16}
                  onPress={handleMediaPick}
                  iconColor="#000"
                  containerColor="#fff"
                  style={{ margin: 0 }}
                />
              </View>
            </View>
            <View className="justify-center w-full">
              <Text className="text-[20px] font-semibold text-gray-800">
                {userData?.name || 'Your Name'}
              </Text>
              <Text className="text-[20px] font-semibold text-gray-600">
                {userData?.email || 'your@email.com'}
              </Text>
            </View>
          </View>
        </View>


        <View className="mt-8 mb-8 w-full">
          <VideoUploaderComponent />
        </View>

        <View className=" h-[1px] bg-gray-300 w-full" />
        <View className="flex-1 overflow-hidden">
          <View className="flex flex-row justify-center items-center">
            <IconButton
              icon="grid"
              size={20}
              iconColor="#000"
              containerColor="#fff"
            />
            <Text className="text-[17px] font-semibold">Posts</Text>
          </View>
          <View className="mt-4">
            <FlatList
              data={userData?.videos}
              keyExtractor={item => item.id}
              numColumns={3}
              contentContainerStyle={{ paddingBottom: 60 }}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
              renderItem={({ item }) => {
                console.log('item', item);
                const screenWidth = Dimensions.get('window').width;
                const boxSize = (screenWidth - 48) / 3;
                const boxSizeHeight = (screenWidth - 48) / 2;

                return (
                  <TouchableOpacity
                    style={{
                      width: boxSize,
                      height: boxSizeHeight,
                      backgroundColor: '#e5e7eb',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      Alert.alert('Video', item.title);
                    }}>
                    {item.thumbnail ? (
                      <Image
                        source={{ uri: item.thumbnail }}
                        style={{ width: '100%', height: '100%', borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-sm text-gray-600 px-2 text-center">
                        {item.title}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </View>
    </Provider>

  );
}
