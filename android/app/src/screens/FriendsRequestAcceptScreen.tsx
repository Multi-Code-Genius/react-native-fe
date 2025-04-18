import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {useUserInfo} from '../api/user/user';
import {Appbar, Avatar, Searchbar, useTheme} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';
import {useAcceptRequest, useDeclineRequest} from '../api/request/request';
import {useNavigation} from '@react-navigation/native';

export function FriendsRequestAcceptScreen() {
  const {data, refetch} = useUserInfo();
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  const acceptedRequests = data?.user?.pendingRequests;

  console.log('data', data);

  useEffect(() => {
    refetch();
  }, [isSuccess, declineSuccess, refetch]);

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

      <FlatList
        data={acceptedRequests}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingHorizontal: 16}}
        renderItem={({item}) => (
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-2">
              {item?.sender?.profile_pic ? (
                <View style={{position: 'relative'}}>
                  <Image
                    source={{uri: item.sender.profile_pic}}
                    className="w-12 h-12 rounded-full "
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View style={{position: 'relative'}}>
                  <Avatar.Text
                    style={{backgroundColor: theme.colors.secondary}}
                    size={42}
                    label={item.sender?.name?.slice(0, 2).toUpperCase() ?? ''}
                  />
                </View>
              )}
              <Text className="text-white text-md font-medium">
                {item.sender.name}
              </Text>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-blue-500 px-3 py-1 rounded-md justify-center items-center"
                // onPress={() => acceptRequestMutation.mutate(item.id)}
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
                // onPress={() => deleteRequestMutation.mutate(item.id)}
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
          </View>
        )}
      />
    </SafeAreaView>
  );
}
