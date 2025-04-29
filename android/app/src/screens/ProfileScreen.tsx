import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  ActivityIndicator,
  Divider,
  IconButton,
  useTheme,
} from 'react-native-paper';
import {SceneMap, TabView} from 'react-native-tab-view';
import {useUploadImage} from '../api/image/image';
import {useUserListLogic} from '../hooks/useUserListLogic';

type ProfileScreenProps = {
  setIndex: (index: number) => void;
  setShowSettings: (show: boolean) => void;
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const {
    data,
    profileRefetch: refetch,
    profileLoading: isLoading,
    profileError: error,
  } = useUserListLogic();

  const userId = data?.user?.id;
  const [refreshing, setRefreshing] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    {key: 'posts', title: 'Posts'},
    {key: 'reels', title: 'Reels'},
  ]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const uploadImageMutation = useUploadImage(
    res => {
      if (!res?.user) {
        Alert.alert('Upload failed', 'Invalid response from server');
        return;
      }
      Alert.alert('Success', 'Profile image uploaded successfully');
    },
    error => {
      Alert.alert('Error', 'Image upload failed');
      console.log('Upload error:', error);
    },
  );

  const handleMediaPick = () => {
    if (!userId) return;

    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: true,
    })
      .then(image => {
        const formData = new FormData();
        formData.append('profile_pic', {
          uri: image.path,
          name: 'image.jpg',
          type: image.mime,
        });

        uploadImageMutation.mutate({
          id: userId,
          payload: formData,
        });
      })
      .catch(err => {
        console.log('Image pick error:', err);
      });
  };

  const renderItem = (item: any, type: any) => {
    const screenWidth = Dimensions.get('window').width;
    const boxSize = (screenWidth - 48) / 3;
    const boxSizeHeight = (screenWidth - 48) / 2;

    const imageUrl = type === 'post' ? item.post : item.thumbnail;

    return (
      <TouchableOpacity
        style={{
          width: boxSize,
          height: boxSizeHeight,
          backgroundColor: '#1f2937',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
        }}
        onPress={() => {
          if (type === 'reel') {
            (navigation as any).navigate('ProfileList', {videoId: item.id});
          } else {
            const index = data?.user?.posts.findIndex(p => p.id === item.id);
            (navigation as any).navigate('Posts', {
              posts: data?.user?.posts,
              initialIndex: index,
            });
          }
        }}>
        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={{width: '100%', height: '100%', borderRadius: 8}}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              padding: 8,
              textAlign: 'center',
            }}>
            {item.title}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const PostsRoute = () => (
    <FlatList
      data={data?.user?.posts}
      keyExtractor={item => item.id}
      numColumns={3}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={{paddingBottom: 60}}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{
        justifyContent: 'flex-start',
        gap: 8,
        marginBottom: 10,
      }}
      renderItem={({item}) => renderItem(item, 'post')}
    />
  );

  const ReelsRoute = () => (
    <FlatList
      data={data?.user?.videos}
      keyExtractor={item => item.id}
      numColumns={3}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={{paddingBottom: 60}}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{
        justifyContent: 'flex-start',
        gap: 8,
        marginBottom: 10,
      }}
      renderItem={({item}) => renderItem(item, 'reel')}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{color: 'white'}}>Failed to load videos</Text>
      </View>
    );
  }

  const postCount =
    (data?.user?.posts?.length || 0) + (data?.user?.videos?.length || 0);

  const friendsCount = data?.user?.friends?.length || 0;

  return (
    <>
      <View
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: theme.colors.background,
        }}>
        <View className="flex w-full flex-col">
          <View className="w-full flex-row justify-end">
            <IconButton
              icon="cog"
              size={24}
              onPress={() => {
                if (navigation && navigation.navigate) {
                  navigation.navigate('Settings');
                }
              }}
              iconColor="#fff"
            />
          </View>
          <View className="flex-row gap-5 w-full">
            <View className="relative w-32 h-32">
              <View className="w-full h-full rounded-full border-4 border-gray-800 overflow-hidden">
                <Image
                  source={{uri: data?.user?.profile_pic}}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <IconButton
                icon="plus"
                size={16}
                onPress={handleMediaPick}
                iconColor="#fff"
                containerColor="#000"
                style={{
                  margin: 0,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#000',
                  borderRadius: '100%',
                  padding: 2,
                }}
              />
            </View>
            <View className="justify-center w-full gap-3">
              <Text className="text-[17px] font-semibold text-white">
                {data?.user?.name || 'Your Name'}
              </Text>
              <View className="flex-row gap-8">
                <View>
                  <Text className="text-white">{postCount}</Text>
                  <Text className="font-medium text-gray-400">Post</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    (navigation as any).navigate('FriendsList');
                  }}>
                  <View>
                    <Text className="text-white">{friendsCount}</Text>
                    <Text className="font-medium text-gray-400">Friends</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Text className="text-[15px] font-semibold text-gray-400">
                {data?.user?.email || 'your@email.com'}
              </Text>
            </View>
          </View>
        </View>

        <Divider style={{marginVertical: 20, backgroundColor: '#374151'}} />

        <View className="flex-row justify-around">
          {routes.map((route, i) => (
            <TouchableOpacity
              key={route.key}
              onPress={() => setTabIndex(i)}
              className="flex-1 items-center pb-2">
              <Text
                className={`text-base font-semibold ${
                  tabIndex === i ? 'text-white' : 'text-gray-400'
                }`}>
                {route.title}
              </Text>
              {tabIndex === i && (
                <View className="h-[1px] w-[100px] bg-white mt-1 rounded-full" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TabView
          navigationState={{index: tabIndex, routes}}
          renderScene={SceneMap({
            posts: PostsRoute,
            reels: ReelsRoute,
          })}
          onIndexChange={setTabIndex}
          renderTabBar={() => null}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
