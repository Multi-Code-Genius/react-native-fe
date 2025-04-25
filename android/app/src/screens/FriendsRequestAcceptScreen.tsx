import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import {Appbar, Avatar, Searchbar, useTheme} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';
import {useAcceptRequest, useDeclineRequest} from '../api/request/request';
import {useNavigation} from '@react-navigation/native';
import {RefreshControl} from 'react-native-gesture-handler';
import {useUserListLogic} from '../hooks/useUserListLogic';
import {SceneMap, TabView} from 'react-native-tab-view';

export function FriendsRequestAcceptScreen() {
  const {data, profileRefetch: refetch} = useUserListLogic();
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    {key: 'receiverequest', title: 'Receive Requests'},
    {key: 'sentrequest', title: 'Sent Requests'},
  ]);

  const navigation = useNavigation();
  const {
    mutate: acceptRequestMutation,
    isSuccess,
    isPending,
  } = useAcceptRequest();

  const {
    mutate: deleteRequestMutation,
    isSuccess: declineSuccess,
    isPending: declinePending,
  } = useDeclineRequest();
  const theme = useTheme();

  const receivedRequests = data?.user?.receivedRequests;
  const sentRequests = data?.user?.sentRequests;

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

  useEffect(() => {
    refetch();
  }, [isSuccess, declineSuccess, refetch]);

  const renderItem = (item: any, type: any) => {
    return (
      <View className="flex-row items-center justify-between py-3">
        <View className="flex-row items-center gap-2">
          {(
            type === 'receiverequest'
              ? item?.sender?.profile_pic
              : item?.receiver?.profile_pic
          ) ? (
            <View style={{position: 'relative'}}>
              <Image
                source={{
                  uri:
                    type === 'receiverequest'
                      ? item.sender?.profile_pic
                      : item.receiver?.profile_pic,
                }}
                className="w-12 h-12 rounded-full"
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={{position: 'relative'}}>
              <Avatar.Text
                style={{backgroundColor: theme.colors.secondary}}
                size={42}
                label={
                  type === 'receiverequest'
                    ? item.sender?.name?.slice(0, 2).toUpperCase() ?? ''
                    : item.receiver?.name?.slice(0, 2).toUpperCase() ?? ''
                }
              />
            </View>
          )}
          <Text className="text-white text-md font-medium">
            {/* {item.sender.name} */}
            {type === 'receiverequest' ? item.sender.name : item.receiver.name}
          </Text>
        </View>

        {type === 'receiverequest' && (
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="bg-blue-500 px-3 py-1 rounded-md justify-center items-center"
              onPress={() => {
                setLoadingId(item.id);
                acceptRequestMutation(item.id, {
                  onSettled: () => setLoadingId(null),
                });
              }}
              disabled={isPending}
              style={{minHeight: 28, minWidth: 70}}>
              {loadingId === item.id ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-xs font-semibold">
                  Confirm
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-700 px-3 py-1 rounded-md justify-center items-center"
              onPress={() => {
                setDeletingId(item.id);
                deleteRequestMutation(item.id, {
                  onSettled: () => setDeletingId(null),
                });
              }}
              disabled={declinePending}
              style={{minHeight: 28, minWidth: 70}}>
              <Text className="text-white text-xs font-semibold">
                {deletingId === item.id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-xs font-semibold">
                    Delete
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {type === 'sentrequest' && (
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="bg-orange-400 px-3 py-1 rounded-md justify-center items-center"
              style={{minHeight: 28, minWidth: 70}}>
              <Text className="text-white text-xs font-semibold">Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-700 px-3 py-1 rounded-md justify-center items-center"
              onPress={() => {
                setDeletingId(item.id);
                deleteRequestMutation(item.id, {
                  onSettled: () => setDeletingId(null),
                });
              }}
              disabled={declinePending}
              style={{minHeight: 28, minWidth: 70}}>
              <Text className="text-white text-xs font-semibold">
                {deletingId === item.id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-xs font-semibold">
                    Delete
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const ReceivedRequestRoute = () => (
    <FlatList
      data={receivedRequests}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{paddingHorizontal: 16}}
      renderItem={({item}) => renderItem(item, 'receiverequest')}
    />
  );

  const SentRequestRoute = () => (
    <FlatList
      data={sentRequests}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{paddingHorizontal: 16}}
      renderItem={({item}) => renderItem(item, 'sentrequest')}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-4">
        <View className="flex-row items-center ">
          <Appbar.BackAction onPress={() => navigation.goBack()} />

          <Text className="text-center text-[20px] text-base text-gray-400 font-semibold">
            Friends requests
          </Text>
        </View>

        <View className=" h-[1px] bg-gray-300 w-full " />
      </View>
      <Searchbar
        placeholder="Search User"
        placeholderTextColor="#666"
        onChangeText={setSearchQuery}
        value={searchQuery}
        inputStyle={{color: 'white'}}
        style={{
          backgroundColor: '#1a1a1a',
          marginHorizontal: 16,
          marginBottom: 12,
        }}
        iconColor="white"
      />
      <View className="flex-row justify-around m-4">
        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            onPress={() => setTabIndex(i)}
            className="flex-1 items-center pb-2">
            <Text className={`text-base font-semibold text-gray-400 `}>
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
          receiverequest: ReceivedRequestRoute,
          sentrequest: SentRequestRoute,
        })}
        onIndexChange={setTabIndex}
        renderTabBar={() => null}
      />
    </SafeAreaView>
  );
}
