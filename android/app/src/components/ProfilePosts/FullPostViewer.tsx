import {useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView, FlatList, View} from 'react-native';
import {ProfileSinglePost} from './ProfileSinglePost';
import {ActivityIndicator} from 'react-native-paper';

export function FullPostViewer() {
  const route = useRoute();
  const {posts, initialIndex} = route.params as {
    posts: any[];
    initialIndex: number;
  };

  const screenHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
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
