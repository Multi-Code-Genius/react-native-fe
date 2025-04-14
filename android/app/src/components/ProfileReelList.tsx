import React from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useVideoById} from '../api/video/video';
import ReelCard from '../components/ReelCard';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

export function ProfileReelList() {
  const {params} = useRoute();
  const {videoId} = params as {videoId: string};
  const {data, error} = useVideoById(videoId);
  const insets = useSafeAreaInsets();
  const usableHeight =
    Dimensions.get('window').height - insets.top - insets.bottom;

  //   if (isLoading) {
  //     return (
  //       <View style={styles.loader}>
  //         <ActivityIndicator size="large" color="white" />
  //       </View>
  //     );
  //   }

  if (error || !data) {
    return (
      <View style={styles.loader}>
        <Text style={{color: 'white'}}>Loading...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[data.video]}
        keyExtractor={item => item.id}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <ReelCard
            item={item}
            index={0}
            currentIndex={0}
            isActive={true}
            appState="active"
            usableHeight={usableHeight}
            onDoubleTap={() => {}}
          />
        )}
        getItemLayout={(_, index) => ({
          length: usableHeight,
          offset: usableHeight * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loader: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
