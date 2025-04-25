import {useRoute} from '@react-navigation/native';
import React from 'react';
import {Dimensions, ScrollView} from 'react-native';
import {ProfileSinglePost} from './ProfileSinglePost';

export function FullPostViewer() {
  const route = useRoute();
  const {posts, initialIndex} = route.params as {
    posts: any[];
    initialIndex: number;
  };

  const screenHeight = Dimensions.get('window').height;

  return (
    <ScrollView
      contentOffset={{y: initialIndex * screenHeight, x: 0}}
      pagingEnabled={true}
      showsVerticalScrollIndicator={false}
      snapToInterval={screenHeight}
      decelerationRate="fast"
      snapToAlignment="start"
      overScrollMode="never">
      {posts.map((item, index) => (
        <ProfileSinglePost
          key={item.id}
          postData={item}
          isFirst={index === 0}
        />
      ))}
    </ScrollView>
  );
}
