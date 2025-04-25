import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useUserByIdMutation} from '../api/user/user';
import {Avatar, IconButton, useTheme} from 'react-native-paper';
import {SceneMap, TabView} from 'react-native-tab-view';

const UserProfile = () => {
  const route = useRoute();
  const {id} = route.params as {id: string};
  const {mutate, data, isPending, error} = useUserByIdMutation();
  const theme = useTheme();
  const navigation = useNavigation();
  const userData = data?.user;
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    {key: 'posts', title: 'Posts'},
    {key: 'reels', title: 'Reels'},
  ]);

  useEffect(() => {
    if (id) {
      mutate(id);
    }
  }, [id]);
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
            // (navigation as any).navigate('SinglePostPhoto', {postId: item.id});
            const index = data?.user?.posts.findIndex(p => p.id === item.id);

            (navigation as any).navigate('fullPostViewer', {
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
      // refreshing={refreshing}
      // onRefresh={onRefresh}
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
      // refreshing={refreshing}
      // onRefresh={onRefresh}
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

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading user data</Text>;
  }
  const postCount =
    (data?.user?.posts?.length || 0) + (data?.user?.videos?.length || 0);

  const friendsCount = data?.user?.friends?.length || 0;
  return (
    <View className="flex-1 p-6 bg-white">
      <View className=" flex-row gap-10">
        {userData?.profile_pic ? (
          <Avatar.Image size={100} source={{uri: userData.profile_pic}} />
        ) : (
          <Avatar.Text
            size={100}
            label={userData?.name.slice(0, 2).toUpperCase() ?? ''}
            style={{backgroundColor: theme.colors.secondary}}
          />
        )}

        <View className="justify-center w-full gap-3">
          <Text className="text-[17px] font-semibold text-gray-800">
            {data?.user?.name || 'Your Name'}
          </Text>
          <View className="flex-row gap-8">
            <View>
              <Text>{postCount}</Text>
              <Text className="font-medium">Post</Text>
            </View>

            <View>
              <Text>{friendsCount}</Text>
              <Text className="font-medium">Friends</Text>
            </View>
          </View>
          <Text className="text-[15px] font-semibold text-gray-400">
            {data?.user?.email || 'your@email.com'}
          </Text>
        </View>
      </View>
      <View className=" h-[1px] bg-gray-300 w-full mt-4" />
      <View className="flex-row justify-around mt-4">
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
  );
};

export default UserProfile;
