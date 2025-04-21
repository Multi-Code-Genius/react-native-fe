// import React, {useRef, useState, useEffect, useCallback} from 'react';
// import {
//   View,
//   FlatList,
//   ListRenderItem,
//   StyleSheet,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
//   AppState,
//   ActivityIndicator,
//   Text,
//   Dimensions,
// } from 'react-native';
// import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
// import {
//   useCommentVideo,
//   useInfiniteVideos,
//   useLikeVideo,
// } from '../api/video/video';
// import {ReelItem, ReelsScreenProps} from '../types/video';
// import ReelCard from '../components/ReelCard';
// import {videoStore} from '../store/videoStore';

// const ReelList: React.FC<ReelsScreenProps> = ({isActive}) => {
//   const [currentIndex, setCurrentIndex] = useState<number>(0);
//   const [appState, setAppState] = useState(AppState.currentState);
//   const flatListRef = useRef<FlatList>(null);
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     refetch,
//     error,
//   } = useInfiniteVideos();
//   const insets = useSafeAreaInsets();
//   const {mutate} = useLikeVideo();
//   const {mutate: commentMutate} = useCommentVideo();
//   const {updateVideoLikeStatus} = videoStore();

//   const videos = data?.pages.flatMap(page => page.videos) ?? [];

//   const usableHeight =
//     Dimensions.get('window').height - insets.top - insets.bottom;

//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       setAppState(nextAppState);
//     });
//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   const onViewableItemsChanged = useRef(
//     ({viewableItems}: {viewableItems: Array<{index: number | null}>}) => {
//       if (viewableItems.length > 0 && viewableItems[0].index !== null) {
//         setCurrentIndex(viewableItems[0].index);
//       }
//     },
//   ).current;

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 90,
//     minimumViewTime: 300,
//   }).current;

//   const handleScrollEnd = useCallback(
//     (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//       const offsetY = event.nativeEvent.contentOffset.y;
//       const newIndex = Math.round(offsetY / usableHeight);
//       if (newIndex !== currentIndex) {
//         setCurrentIndex(newIndex);
//       }
//     },
//     [currentIndex, usableHeight],
//   );

//   const renderItem: ListRenderItem<ReelItem> = ({item, index}) => {
//     return (
//       <ReelCard
//         item={item}
//         index={index}
//         currentIndex={currentIndex}
//         isActive={isActive}
//         appState={appState}
//         usableHeight={usableHeight}
//         onDoubleTap={(isNotDisabled: boolean) => {
//           if (!isNotDisabled) {
//             updateVideoLikeStatus(item.id);
//             mutate({videoId: item.id});
//           }
//         }}
//         onComments={(text: string) => {
//           commentMutate({text, videoId: item.id});
//         }}
//       />
//     );
//   };

//   // if (isLoading) {
//   //   return (
//   //     <View style={styles.loaderContainer}>
//   //       <ActivityIndicator size="large" color="#fff" />
//   //     </View>
//   //   );
//   // }

//   if (error) {
//     return (
//       <View style={styles.loaderContainer}>
//         <Text style={{color: 'white'}}>Failed to load videos</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={videos}
//         onEndReached={() => {
//           if (hasNextPage && !isFetchingNextPage) {
//             fetchNextPage();
//           }
//         }}
//         onEndReachedThreshold={0.5}
//         refreshing={isLoading}
//         onRefresh={() => refetch()}
//         ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
//         ref={flatListRef}
//         keyExtractor={item => item.id}
//         pagingEnabled
//         horizontal={false}
//         showsVerticalScrollIndicator={false}
//         renderItem={renderItem}
//         removeClippedSubviews
//         snapToInterval={usableHeight}
//         decelerationRate="fast"
//         onMomentumScrollEnd={handleScrollEnd}
//         viewabilityConfig={viewabilityConfig}
//         onViewableItemsChanged={onViewableItemsChanged}
//         initialNumToRender={1}
//         maxToRenderPerBatch={1}
//         windowSize={3}
//         contentContainerStyle={{paddingBottom: 60}}
//         getItemLayout={(_, index) => ({
//           length: usableHeight,
//           offset: usableHeight * index,
//           index,
//         })}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   loaderContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoContainer: {
//     width: '100%',
//     backgroundColor: 'black',
//   },

//   rightActions: {
//     position: 'absolute',
//     right: 16,
//     top: '50%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   actionButton: {
//     marginBottom: 20,
//     alignItems: 'center',
//   },

//   actionText: {
//     color: 'white',
//     fontSize: 12,
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   bottomInfo: {
//     position: 'absolute',
//     top: '75%',
//     left: 16,
//     right: 100,
//   },
//   userRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   userName: {
//     color: 'white',
//     marginLeft: 8,
//     fontWeight: '600',
//   },
//   description: {
//     color: 'white',
//     fontSize: 14,
//   },

//   iconWrapper: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginBottom: 24,
//     // backgroundColor: '',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default ReelList;

import React, {useEffect} from 'react';
import {View, Text, FlatList, TextInput, Button} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useSocketStore} from '../store/socketStore';
import {useGetMessages} from '../api/message/useMessages';

const loggedInUserId = '3cf5033f-b1bb-4816-aca0-fe4a59a4d445';
const receiverId = 'fdeae825-1c0a-400a-9a5c-86bc2c32eb1e';

const ReelList = () => {
  const isFocused = useIsFocused();
  const {socket, connectSocket, disconnectSocket} = useSocketStore();
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<any[]>([]);

  const {data: chatHistory} = useGetMessages({
    userId: loggedInUserId,
    withUserId: receiverId,
  });

  useEffect(() => {
    if (chatHistory) {
      return setMessages(chatHistory);
    }
  }, [chatHistory]);

  useEffect(() => {
    if (isFocused) {
      connectSocket(loggedInUserId);
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isFocused, connectSocket, disconnectSocket]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('newMessage', newMsg => {
      setMessages(prev => [...prev, newMsg]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket]);

  const sendMessage = () => {
    if (!message.trim() || !socket) {
      return;
    }
    console.log('trigger');

    socket.emit('sendMessage', {
      senderId: loggedInUserId,
      receiverId,
      content: message,
    });

    setMessage('');
  };

  return (
    <View style={{flex: 1, padding: 16}}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({item}) => (
          <Text style={{padding: 8, backgroundColor: '#eee', marginBottom: 4}}>
            {item.content}
          </Text>
        )}
      />

      <View style={{flexDirection: 'row', marginTop: 8}}>
        <TextInput
          style={{flex: 1, borderWidth: 1, marginRight: 8, padding: 8}}
          value={message}
          onChangeText={setMessage}
          placeholder="Type message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ReelList;
