import {useRoute} from '@react-navigation/native';
import React, {useRef} from 'react';
import {Dimensions, FlatList} from 'react-native';
import {ProfileSinglePost} from './ProfileSinglePost';

export function FullPostViewer() {
  const route = useRoute();
  const {posts, initialIndex} = route.params as {
    posts: any[];
    initialIndex: number;
  };

  const flatListRef = useRef(null);
  const screenHeight = Dimensions.get('window').height;

  return (
    <FlatList
      ref={flatListRef}
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({item, index}) => (
        <ProfileSinglePost postData={item} isFirst={index === 0} />
      )}
      showsVerticalScrollIndicator={false}
      getItemLayout={(_, index) => ({
        length: screenHeight,
        offset: screenHeight * index,
        index,
      })}
      initialScrollIndex={initialIndex}
    />
  );
}
