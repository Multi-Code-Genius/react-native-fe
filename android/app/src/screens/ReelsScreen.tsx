import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  Dimensions,
  FlatList,
  ListRenderItem,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  AppState,
  ActivityIndicator,
  Text,
} from 'react-native';
import Video from 'react-native-video';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useGetReelsData} from '../hooks/useGetReelsData';

type ReelItem = {
  id: string;
  video_files: {link: string}[];
};

type ReelsScreenProps = {
  isActive: boolean;
};

const {height, width} = Dimensions.get('window');

const ReelsScreen: React.FC<ReelsScreenProps> = ({isActive}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const flatListRef = useRef<FlatList>(null);
  const {reels, isLoading, error} = useGetReelsData(height);

  const videoData = reels?.videos || [];

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
      const newIndex = Math.round(offsetY / height);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    },
    [currentIndex],
  );

  const renderItem: ListRenderItem<ReelItem> = ({item, index}) => {
    const videoUrl = item.video_files?.[0]?.link;

    if (!videoUrl) return null;

    return (
      <View style={styles.videoContainer}>
        <Video
          source={{uri: videoUrl}}
          style={styles.video}
          resizeMode="cover"
          paused={index !== currentIndex || !isActive || appState !== 'active'}
          repeat
          muted={false}
          playWhenInactive={false}
          playInBackground={false}
          ignoreSilentSwitch="obey"
          controls
          controlsStyles={{
            hideDuration: true,
            hideForward: true,
            hideNext: true,
            hidePlayPause: true,
            hidePosition: true,
            hidePrevious: true,
            hideRewind: true,
            hideFullscreen: true,
            hideSettingButton: true,
          }}
        />
      </View>
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
        data={videoData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        snapToInterval={height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        removeClippedSubviews={true}
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
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    marginBottom: 150,
  },
});

export default ReelsScreen;
