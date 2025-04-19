import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Appbar, Avatar, Searchbar, useTheme} from 'react-native-paper';
import {useUserInfo} from '../api/user/user';
import {useDeclineRequest} from '../api/request/request';

export function FreindsListScreen() {
  const {data} = useUserInfo();
  const theme = useTheme();
  const navigation = useNavigation();

  const {
    mutate: deleteRequestMutation,
    isSuccess: declineSuccess,
    isPending: declinePending,
  } = useDeclineRequest();

  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const acceptedRequests = data?.user?.acceptedRequests;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between px-1 py-2">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Appbar.BackAction color="white" />
        </TouchableOpacity>

        <View className="absolute left-0 right-0 items-center">
          <Text className="text-base text-gray-400 font-semibold">
            {data?.user?.name}
          </Text>
          <Text className="text-xl text-white font-bold">FRIENDS</Text>
        </View>
      </View>
      <View className=" h-[1px] bg-gray-300 w-full " />
      <Searchbar
        placeholder="Search"
        placeholderTextColor="#666"
        onChangeText={setSearchQuery}
        value={searchQuery}
        inputStyle={{color: 'white'}}
        style={{
          backgroundColor: '#1a1a1a',
          marginHorizontal: 16,
          marginBottom: 12,
          marginTop: 12,
        }}
        iconColor="white"
      />

      <FlatList
        data={acceptedRequests}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingHorizontal: 16}}
        renderItem={({item}) => (
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-4">
              {item.sender.profile_pic ? (
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
            <View>
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
                      Remove
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
