import React, {useRef, useMemo, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import {Avatar, Portal, TextInput, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {ReelItemProps} from '../types/video';
import {useUserStore} from '../store/userStore';
import {videoStore} from '../store/videoStore';
import {useNavigation} from '@react-navigation/native';
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
  const videoUrl = item?.videoUrl;
  const likeCount = item.likes?.length || 0;
  const commentCount = item.comments?.length || 0;
  const user = item.user;
  const {videoLikeStatus, addLikesReels} = videoStore();

  const {userData} = useUserStore();

  item.likes.forEach(i => {
    if (userData?.id === i.userId) {
      addLikesReels(i.id);
    }
  });

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [postComment, setPostComment] = useState('');
  const theme = useTheme();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '70%'], []);

  const openCommentSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  if (!videoUrl) {
    return null;
  }
  const handleSubmit = (id: string | undefined) => {
    (navigation as any).navigate('UserProfile', {id});
  };

  const handleSubmitComment = () => {
    console.log(postComment);
    onComments(postComment);
    setPostComment('');
  };

  return (
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
      <GestureHandlerRootView style={{flex: 1}}>
        <View style={[styles.videoContainer, {height: usableHeight}]}>
          <Video
            source={{uri: videoUrl}}
            resizeMode="cover"
            repeat
            paused={
              index !== currentIndex || !isActive || appState !== 'active'
            }
            muted={false}
            style={StyleSheet.absoluteFill}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            playWhenInactive={false}
            playInBackground={false}
            ignoreSilentSwitch="obey"
          />

          {/* {isLoading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )} */}

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
        <Portal>
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{backgroundColor: theme.colors.background}}
            handleIndicatorStyle={{backgroundColor: theme.colors.secondary}}>
            <BottomSheetScrollView
              contentContainerStyle={{
                backgroundColor: theme.colors.background,
              }}>
              <CommentSheet comments={item?.comments ?? []} />
            </BottomSheetScrollView>
            <View style={styles.inputContainer}>
              <View style={styles.avatarPlaceholderSmall}>
                <Icon name="account-circle" size={32} color="#555" />
              </View>
              <TextInput
                placeholder="Add a comment..."
                defaultValue={postComment}
                onChangeText={setPostComment}
                right={
                  <TextInput.Icon
                    icon="send"
                    onPress={handleSubmitComment}
                    disabled={!postComment.trim()}
                  />
                }
                style={{
                  width: '90%',
                  backgroundColor: 'transparent',
                }}
                underlineStyle={{display: 'none'}}
              />
            </View>
          </BottomSheet>
        </Portal>
      </GestureHandlerRootView>
    </TapGestureHandler>
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
    top: '75%',
    left: 20,
    right: 100,
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
});
