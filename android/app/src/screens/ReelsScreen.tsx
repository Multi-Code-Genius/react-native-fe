import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  ListRenderItem,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  AppState,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFetchVideos} from '../api/video/video';
import {Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ReelItem, ReelsScreenProps} from '../types/video';
import {TapGestureHandler} from 'react-native-gesture-handler';

const ReelsScreen: React.FC<ReelsScreenProps> = ({isActive}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const flatListRef = useRef<FlatList>(null);
  const {data, isLoading, error} = useFetchVideos();
  const insets = useSafeAreaInsets();

  const usableHeight =
    Dimensions.get('window').height - insets.top - insets.bottom;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: Array<{index: number | null}>}) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 90,
    minimumViewTime: 300,
  }).current;

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const newIndex = Math.round(offsetY / usableHeight);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    },
    [currentIndex, usableHeight],
  );

  const renderItem: ListRenderItem<ReelItem> = ({item, index}) => {
    const videoUrl = item?.videoUrl;
    const likeCount = item.likes?.length || 0;
    const commentCount = item.comments?.length || 0;
    const user = item.user;

    const DOUBLE_PRESS_DELAY = 300;

    const handleDoubleTap = () => {
      const now = Date.now();
      if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
        Alert.alert('Double Tap Detected');
      } else {
        lastTap.current = now;
      }
    };

    if (!videoUrl) {
      return null;
    }

    return (
      <TapGestureHandler
        numberOfTaps={2}
        onActivated={() => {
          console.log('Double tap!');
        }}>
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
            playWhenInactive={false}
            playInBackground={false}
            ignoreSilentSwitch="obey"
          />

          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.iconWrapper}>
              <Icon name="heart" size={28} color="red" />
              <Text style={styles.actionText}>
                {/* {likeCount} */}
                1.5M
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="comment-outline" size={28} color="white" />
              <Text style={styles.actionText}>
                {/* {commentCount} */}
                55k
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="share" size={28} color="white" />
              <Text style={styles.actionText}>
                {/* {commentCount} */}
                9K
              </Text>
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
        </View>
      </TapGestureHandler>
    );
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data?.videos}
        keyExtractor={item => item.id}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        removeClippedSubviews
        snapToInterval={usableHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        contentContainerStyle={{paddingBottom: 60}}
        getItemLayout={(_, index) => ({
          length: usableHeight,
          offset: usableHeight * index,
          index,
        })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    backgroundColor: 'black',
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

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 24,
    // backgroundColor: '',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReelsScreen;
