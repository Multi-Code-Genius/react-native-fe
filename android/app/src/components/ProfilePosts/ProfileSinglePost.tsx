import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Portal, TextInput, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useCommentPhoto,
  useLikePhoto,
  useSinglePhoto,
} from '../../api/photo/photo';
import {photoStore} from '../../store/photoStore';
import {useUserStore} from '../../store/userStore';
import CommentSheet from '../CommentSheet';
import {Header} from './Header';

type ProfileSinglePostProps = {
  postData?: any;
  isFirst: boolean;
};

export function ProfileSinglePost({postData, isFirst}: ProfileSinglePostProps) {
  const theme = useTheme();
  const route = useRoute();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['70%'], []);
  const [postComment, setPostComment] = useState('');
  const [inputKey, setInputKey] = useState(0);

  const {userData} = useUserStore();
  const {photoLikeStatus, addLikesPhoto, updatePhotoLikeStatus} = photoStore();
  const likePhotoMutation = useLikePhoto();
  const commentPhototMutation = useCommentPhoto();

  const postId = postData?.id || (route.params as {postId?: string})?.postId;

  const {data, error} = useSinglePhoto(postId || '');

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
        style={{backgroundColor: theme.colors.backdrop}}
      />
    ),
    [theme.colors.backdrop],
  );

  const openCommentSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  useEffect(() => {
    if (data?.video?.likes?.some((like: any) => like.userId === userData?.id)) {
      addLikesPhoto(postId);
    }
  }, [data?.video?.likes, userData?.id, postId, addLikesPhoto]);

  const handleLikeToggle = () => {
    updatePhotoLikeStatus(postId);
    likePhotoMutation.mutate({photoId: postId});
  };

  const handleCommentSubmit = () => {
    if (!postComment.trim()) return;
    commentPhototMutation.mutate(
      {postId, text: postComment},
      {
        onSuccess: () => {
          setInputKey(prev => prev + 1);
          setPostComment('');
        },
      },
    );
  };

  if (!postId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Invalid post</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Failed to load image</Text>
      </View>
    );
  }

  const imageUrl = data?.video?.post;
  const likeCount = data?.video?.likes?.length || 0;
  const commentCount = data?.video?.comments?.length || 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {isFirst && <Header data={data} />}
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
        />

        <View className="flex-row items-center gap-2 mb-1">
          <TouchableOpacity
            onPress={handleLikeToggle}
            className="flex-row items-center gap-1">
            <Icon
              name="heart"
              size={28}
              color={
                userData?.id &&
                (photoLikeStatus.includes(postId) ||
                  data?.video?.likes?.some(
                    (like: any) => like.userId === userData.id,
                  ))
                  ? 'red'
                  : 'grey'
              }
            />
            <Text style={{marginLeft: 4}}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={openCommentSheet}>
            <Icon name="comment-outline" size={24} color="black" />
            <Text className="text-black text-base font-bold">
              {commentCount}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-2">
          <Text className="text-[14px] font-bold italic  ">
            {data?.video?.user?.name}
          </Text>
          <Text className="text-[14px]">{data?.video?.description}</Text>
        </View>
      </View>

      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          enablePanDownToClose
          backgroundStyle={{backgroundColor: theme.colors.background}}
          handleIndicatorStyle={{backgroundColor: theme.colors.secondary}}>
          <BottomSheetScrollView
            contentContainerStyle={{
              backgroundColor: theme.colors.background,
            }}>
            <CommentSheet comments={data?.video?.comments ?? []} />
          </BottomSheetScrollView>
          <View style={styles.inputContainer}>
            <Icon
              name="account-circle"
              size={32}
              color="#555"
              style={{marginRight: 12}}
            />
            <TextInput
              placeholder="Add a comment..."
              defaultValue={postComment}
              key={`comment-input-${inputKey}`}
              onChangeText={setPostComment}
              right={
                <TextInput.Icon
                  icon="send"
                  onPress={handleCommentSubmit}
                  disabled={!postComment.trim()}
                />
              }
              style={{flex: 1, backgroundColor: 'transparent'}}
              underlineStyle={{display: 'none'}}
            />
          </View>
        </BottomSheet>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    position: 'relative',
  },
  input: {
    width: '80%',
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
});
