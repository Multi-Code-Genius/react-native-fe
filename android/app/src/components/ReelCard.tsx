// components/ReelCard.tsx
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import Video from 'react-native-video';
import {Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TapGestureHandler} from 'react-native-gesture-handler';
import {ReelItem} from '../types/video';
import CommentSheet from '../components/CommentSheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

interface Props {
  item: ReelItem;
  index: number;
  currentIndex: number;
  isActive: boolean;
  appState: string;
  usableHeight: number;
  onDoubleTap: () => void;
}

const ReelCard: React.FC<Props> = ({
  item,
  index,
  currentIndex,
  isActive,
  appState,
  usableHeight,
  onDoubleTap,
}) => {
  const videoUrl = item?.videoUrl;
  const likeCount = item.likes?.length || 0;
  const commentCount = item.comments?.length || 0;
  const user = item.user;
  const commentSheetRef = useRef<BottomSheetMethods>(null);

  const [isLoading, setIsLoading] = useState(true);

  if (!videoUrl) {
    return null;
  }

  const openCommentSheet = () => {
    console.log('Opening comment sheet');
    InteractionManager.runAfterInteractions(() => {
      commentSheetRef.current?.expand();
    });
  };

  return (
    <TapGestureHandler numberOfTaps={2} onActivated={onDoubleTap}>
      <View style={[styles.videoContainer, {height: usableHeight}]}>
        <Video
          source={{uri: videoUrl}}
          resizeMode="cover"
          repeat
          paused={index !== currentIndex || !isActive || appState !== 'active'}
          muted={false}
          style={StyleSheet.absoluteFill}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          playWhenInactive={false}
          playInBackground={false}
          ignoreSilentSwitch="obey"
        />

        {isLoading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

        <View style={styles.rightActions}>
          <TouchableOpacity onPress={onDoubleTap} style={styles.iconWrapper}>
            <Icon name="heart" size={28} color="red" />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={openCommentSheet}>
            <Icon name="comment-outline" size={28} color="white" />
            <Text style={styles.actionText}>{commentCount}</Text>
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
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {item.description || 'No description'}
          </Text>
        </View>
        <CommentSheet ref={commentSheetRef} />
      </View>
    </TapGestureHandler>
  );
};

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
    left: 16,
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
});

export default ReelCard;
