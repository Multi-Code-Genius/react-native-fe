import {useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, View, Image, Text, TouchableOpacity} from 'react-native';
import {useLikePhoto, useSinglePhoto} from '../../api/photo/photo';
import {Header} from './Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {photoStore} from '../../store/photoStore';
import {useUserStore} from '../../store/userStore';

export function ProfileSinglePost() {
  const {params} = useRoute();
  const {postId} = params as {postId: string};

  const {data, error, isLoading} = useSinglePhoto(postId);
  const {userData} = useUserStore();
  const {photoLikeStatus, addLikesPhoto, updatePhotoLikeStatus} = photoStore();
  const likePhotoMutation = useLikePhoto();

  // const hasLiked =
  //   photoLikeStatus.includes(postId) ||
  //   data?.video?.likes?.some((like: any) => like.userId === userData?.id);

  useEffect(() => {
    if (data?.video?.likes?.some((like: any) => like.userId === userData?.id)) {
      addLikesPhoto(postId);
    }
  }, [data?.video?.likes, userData?.id, postId]);

  if (error) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-black text-base">Failed to load image</Text>
      </View>
    );
  }

  if (isLoading || !data) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-black text-base">Loading...</Text>
      </View>
    );
  }

  const imageUrl = data?.video?.post;
  const likeCount = data?.video?.likes?.length || 0;

  const handleLikeToggle = () => {
    updatePhotoLikeStatus(postId);
    likePhotoMutation.mutate({photoId: postId});
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header data={data} />
      <View className="w-full h-full p-4">
        <View className="flex-row items-center gap-2 mb-2">
          <View className=" h-[45px] w-[45px] rounded-full border-4 border-gray-100 overflow-hidden">
            <Image
              source={{uri: data?.video?.user?.profile_pic}}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text className="font-semibold">{data?.video?.user?.name}</Text>
        </View>

        <Image
          source={{uri: imageUrl}}
          className="w-full h-[300px] rounded-xl mb-4"
          resizeMode="cover"
        />

        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={handleLikeToggle}>
          <Icon
            name="heart"
            size={28}
            color={
              userData?.id &&
              (photoLikeStatus.includes(postId) ||
                (data?.video?.likes?.length > 0 &&
                  data?.video?.likes.some(
                    (like: any) => like.userId === userData.id,
                  )))
                ? 'red'
                : 'grey'
            }
          />
          {/* <Icon name="heart" size={28} color={hasLiked ? 'red' : 'gray'} /> */}
          <Text className="text-black text-base font-bold">{likeCount}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
