import React, {useCallback, useState} from 'react';
import {View, Image, Text, Alert, FlatList, StyleSheet} from 'react-native';
import {VideoUploaderComponent} from '../components/VideoUploaderComponent';
import {ActivityIndicator, Divider, IconButton} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {useUploadImage} from '../api/image/image';
import {TouchableOpacity} from 'react-native';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {PhotoPostUploader} from '../components/PhotoPostUploader';
import {SceneMap, TabView} from 'react-native-tab-view';
import {useUserListLogic} from '../hooks/useUserListLogic';

type ProfileScreenProps = {
  setIndex: (index: number) => void;
  setShowSettings: (show: boolean) => void;
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({}) => {
  const navigation = useNavigation();
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
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel || !response.assets?.length) {
        return;
      }

      const asset = response.assets[0];
      if (!asset.uri || !userId) {
        return;
      }

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
          backgroundColor: '#e5e7eb',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
        }}
        onPress={() => {
          if (type === 'reel') {
            (navigation as any).navigate('ProfileList', {videoId: item.id});
          } else {
            (navigation as any).navigate('SinglePostPhoto', {postId: item.id});
          }
        }}>
        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={{width: '100%', height: '100%', borderRadius: 8}}
            resizeMode="cover"
          />
        ) : (
          <Text className="text-sm text-gray-600 px-2 text-center">
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
        gap: 3,
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
        gap: 3,
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
      <View className="flex-1 p-6 bg-white">
        <View className="flex w-full flex-col">
          <View className="w-full flex-row justify-end">
            <IconButton
              icon="cog"
              size={24}
              onPress={() => navigation.navigate('Settings')}
              iconColor="#000"
              containerColor="#fff"
            />
          </View>
          <View className="flex-row gap-5 w-full">
            <View className="relative w-32 h-32">
              <View className="w-full h-full rounded-full border-4 border-gray-100 overflow-hidden">
                <Image
                  source={{uri: data?.user?.profile_pic}}
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
                  style={{margin: 0}}
                />
              </View>
            </View>
            <View className="justify-center w-full gap-3">
              <Text className="text-[17px] font-semibold text-gray-800">
                {data?.user?.name || 'Your Name'}
              </Text>
              <View className="flex-row gap-8">
                <View>
                  <Text>{postCount}</Text>
                  <Text className="font-medium">Post</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    (navigation as any).navigate('FriendsList');
                  }}>
                  <View>
                    <Text>{friendsCount}</Text>
                    <Text className="font-medium">Friends</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Text className="text-[15px] font-semibold text-gray-400">
                {data?.user?.email || 'your@email.com'}
              </Text>
            </View>
          </View>
        </View>
        <Divider style={{marginVertical: 20}} />
        <View className="flex-row justify-around">
          {routes.map((route, i) => (
            <TouchableOpacity
              key={route.key}
              onPress={() => setTabIndex(i)}
              className="flex-1 items-center pb-2">
              <Text
                className={`text-base font-semibold ${
                  tabIndex === i ? 'text-black' : 'text-gray-400'
                }`}>
                {route.title}
              </Text>
              {tabIndex === i && (
                <View className="h-[1px] w-[100px] bg-slate-500 mt-1 rounded-full" />
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
