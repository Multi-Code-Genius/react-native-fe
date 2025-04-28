import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {Avatar, Portal, TextInput, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import {useUserStore} from '../store/userStore';
import {videoStore} from '../store/videoStore';
import {ReelItemProps} from '../types/video';
import CommentSheet from './CommentSheet';

const ReelCard: React.FC<ReelItemProps> = ({
  item,
  index,
  currentIndex,
  isActive,
  appState,
  usableHeight,
  onDoubleTap,
  onComments,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [postComment, setPostComment] = useState('');

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['70%'], []);

  const videoUrl = item?.videoUrl;
  const likeCount = item.likes?.length || 0;
  const commentCount = item.comments?.length || 0;
  const user = item.user;
  const {videoLikeStatus, addLikesReels} = videoStore();
  const [inputKey, setInputKey] = useState(0);

  const {userData} = useUserStore();

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
    if (!item || !userData?.id) return;

    item.likes.forEach(like => {
      if (like.userId === userData.id) {
        addLikesReels(like.id);
      }
    });
  }, [item.likes, userData?.id, addLikesReels]);

  if (!videoUrl) {
    return null;
  }
  const handleSubmit = (id: string | undefined) => {
    (navigation as any).navigate('UserProfile', {id});
  };

  const handleSubmitComment = () => {
    if (!postComment.trim() || !userData?.id) return;

    const newComment = {
      id: Date.now().toString(),
      text: postComment,
      userId: userData.id,
      user: userData,
    };

    videoStore.getState().addVideoComment(item.id, newComment);
    onComments(postComment);
    setPostComment('');
    setInputKey(prev => prev + 1);
  };

  const isPaused = index !== currentIndex || appState !== 'active' || !isActive;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <TapGestureHandler
        numberOfTaps={2}
        onActivated={() =>
          userData?.id &&
          onDoubleTap(
            videoLikeStatus.includes(item.id) ||
              (item.likes.length > 0 &&
                item.likes.some(like => userData.id === like.userId)),
          )
        }>
        <View style={[styles.videoContainer, {height: usableHeight}]}>
          <Video
            source={{uri: videoUrl}}
            resizeMode="cover"
            repeat
            paused={isPaused}
            muted={false}
            style={StyleSheet.absoluteFill}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            playWhenInactive={false}
            playInBackground={false}
            ignoreSilentSwitch="obey"
          />

          <View style={styles.rightActions}>
            <TouchableOpacity
              onPress={() => onDoubleTap(false)}
              style={styles.iconWrapper}>
              <Icon
                name="heart"
                size={28}
                color={
                  userData?.id &&
                  (videoLikeStatus.includes(item.id) ||
                    (item.likes.length > 0 &&
                      item.likes.some(like => like.userId === userData.id)))
                    ? 'red'
                    : 'white'
                }
              />
              <Text style={styles.actionText}>{likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={openCommentSheet}>
              <Icon name="comment-outline" size={28} color="white" />
              <Text style={styles.actionText}> {commentCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="share" size={28} color="white" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomInfo}>
            <View style={styles.userRow}>
              {user?.profile_pic ? (
                <Avatar.Image size={32} source={{uri: user.profile_pic}} />
              ) : (
                <Avatar.Icon size={32} icon="account" />
              )}
              <TouchableOpacity onPress={() => handleSubmit(user?.id)}>
                <Text style={styles.userName}>{user?.name}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {item.description || 'No description'}
            </Text>
          </View>
        </View>
      </TapGestureHandler>
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          enablePanDownToClose
          enableBlurKeyboardOnGesture
          enableContentPanningGesture
          enableHandlePanningGesture
          enableOverDrag
          enableDynamicSizing
          backgroundStyle={{backgroundColor: theme.colors.background}}
          handleIndicatorStyle={{backgroundColor: theme.colors.secondary}}>
          <BottomSheetScrollView
            contentContainerStyle={{
              backgroundColor: theme.colors.background,
            }}>
            <CommentSheet comments={item?.comments ?? []} />
          </BottomSheetScrollView>

          <View style={styles.inputContainer}>
            <Icon
              name="account-circle"
              size={32}
              color="#555"
              style={{marginRight: 12}}
            />
            <View style={{flex: 1, position: 'relative'}}>
              <TextInput
                placeholder="Add a comment..."
                value={postComment}
                onChangeText={setPostComment}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  paddingRight: 40,
                }}
                underlineStyle={{display: 'none'}}
              />

              <TouchableOpacity
                onPress={handleSubmitComment}
                disabled={!postComment.trim()}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: [{translateY: -12}],
                  opacity: postComment.trim() ? 1 : 0.5,
                }}>
                <Icon name="send" size={24} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
      </Portal>
    </GestureHandlerRootView>
  );
};

export default ReelCard;

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000060',
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    top: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    marginBottom: 20,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: '16%',
    marginHorizontal: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  description: {
    color: 'white',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  avatarPlaceholderSmall: {
    marginRight: 12,
  },
  inputPlaceholder: {
    color: '#888',
    flex: 1,
    fontSize: 14,
  },
  input: {
    height: 40,
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
