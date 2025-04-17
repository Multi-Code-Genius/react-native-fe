import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {interpolate} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const {width: screenWidth} = Dimensions.get('window');

const data = [
  {
    title: 'White Pocket Sunset',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat',
    image: 'https://picsum.photos/600/400?image=10',
  },
  {
    title: 'Mountain View',
    subtitle: 'Lorem ipsum dolor sit amet',
    image: 'https://picsum.photos/600/400?image=20',
  },
  {
    title: 'Desert Dunes',
    subtitle: 'Lorem ipsum dolor sit amet',
    image: 'https://picsum.photos/600/400?image=30',
  },
];

const RewardScreen = () => {
  const [mode, setMode] = React.useState<any>('horizontal-stack');
  const ITEM_WIDTH = screenWidth * 0.95;
  const ITEM_HEIGHT = 300;
  const CARD_PADDING = 20;

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        autoPlay={false}
        data={data}
        scrollAnimationDuration={2500}
        mode={mode}
        modeConfig={{
          snapDirection: 'left',
          // stackInterval: 40,
          stackInterval: mode === 'vertical-stack' ? 8 : 40,
          scaleInterval: 0.08,
          opacityInterval: 0.5,
          rotateZDeg: 0,
        }}
        renderItem={({item}) => (
          <View style={[styles.card, {marginHorizontal: CARD_PADDING}]}>
            <Image source={{uri: item.image}} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 5,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default RewardScreen;
