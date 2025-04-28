import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useCommentVideo,
  useInfiniteVideos,
  useLikeVideo,
} from '../api/video/video';
import { ReelItem, ReelsScreenProps } from '../types/video';
import ReelCard from '../components/ReelCard';
import { videoStore } from '../store/videoStore';
import { useIsFocused } from '@react-navigation/native';

const ReelList: React.FC<ReelsScreenProps> = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const isFocused = useIsFocused();
  const flatListRef = useRef<FlatList>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    refetch,
    error,
  } = useInfiniteVideos();
  const insets = useSafeAreaInsets();
  const { mutate } = useLikeVideo();
  const { mutate: commentMutate } = useCommentVideo();
  const { updateVideoLikeStatus } = videoStore();

  const videos = data?.pages.flatMap(page => page.videos) ?? [];

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
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
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
      const clampedIndex = Math.max(0, Math.min(videos.length - 1, newIndex));

      if (clampedIndex !== currentIndex) {
        setCurrentIndex(clampedIndex);
      }
    },
    [currentIndex, usableHeight, videos.length],
  );

  const renderItem: ListRenderItem<ReelItem> = ({ item, index }) => {
    return (
      <ReelCard
        item={item}
        index={index}
        currentIndex={currentIndex}
        isActive={isFocused}
        appState={appState}
        usableHeight={usableHeight}
        onDoubleTap={(isNotDisabled: boolean) => {
          if (!isNotDisabled) {
            updateVideoLikeStatus(item.id);
            mutate({ videoId: item.id });
          }
        }}
        onComments={(text: string) => {
          commentMutate({ text, videoId: item.id });
        }}
      />
    );
  };

  // if (isLoading) {
  //   return (
  //     <View style={styles.loaderContainer}>
  //       <ActivityIndicator size="large" color="#fff" />
  //     </View>
  //   );
  // }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: 'white' }}>Failed to load videos</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videos}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshing={!isSuccess}
        onRefresh={() => refetch()}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        ref={flatListRef}
        keyExtractor={item => item.id}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        // removeClippedSubviews
        snapToInterval={usableHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: usableHeight,
          offset: usableHeight * index,
          index,
        })}
        contentContainerStyle={{ paddingBottom: 60 }}
      // getItemLayout={(_, index) => ({
      //   length: usableHeight,
      //   offset: usableHeight * index,
      //   index,
      // })}
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

    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReelList;
