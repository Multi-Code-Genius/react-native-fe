import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import {ActivityIndicator, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useRoute} from '@react-navigation/native';
import {useGetGameByIde} from '../api/games/useGame';
import {BlurView} from '@react-native-community/blur';

const screenWidth = Dimensions.get('window').width;

export function CourtDetailsScreen() {
  const [currentINdex, setCurrentIndex] = useState(0);
  const route = useRoute();
  const gameId = (route.params as {gameId?: any})?.gameId;
  const scrollY = useRef(new Animated.Value(0)).current;

  const {data: gameInfo, isLoading: gameDataLoading} = useGetGameByIde(gameId);

  const imageLength = gameInfo?.game?.images.length;

  const onViewRef = React.useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50});

  const renderImage = ({item}: any) => (
    <Image source={{uri: item}} style={styles.image} />
  );

  if (gameDataLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 80}}>
          <View>
            <FlatList
              data={gameInfo?.game?.images}
              renderItem={renderImage}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewConfigRef.current}
              snapToInterval={screenWidth}
              decelerationRate="fast"
              scrollEventThrottle={16}
            />

            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentINdex + 1} / {imageLength}
              </Text>
            </View>
          </View>

          <View style={{padding: 16, marginTop: 16, gap: 24}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.title}>{gameInfo?.game?.name}</Text>
                <Text style={styles.area}>
                  {gameInfo?.game?.location?.area}
                  {' , '}
                  {gameInfo?.game?.location?.city}
                </Text>
              </View>
              <Icon name="heart-outline" size={28} color={'white'} />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
                <Icon name="gamepad-circle" size={28} color={'white'} />
                <Text style={styles.gamename}>{gameInfo?.game?.category}</Text>
              </View>
              <Text className="text-white font-semibold">
                1hr Rates : ₹ {gameInfo?.game?.hourlyPrice}
              </Text>
            </View>

            <Divider style={{backgroundColor: '#343e4e'}} />

            <View style={{gap: 16}}>
              <Text style={styles.sectionTitle}>Address</Text>
              <Text style={styles.address}>{gameInfo?.game?.address}</Text>
              <TouchableOpacity activeOpacity={0.8}>
                <LinearGradient
                  colors={['#b2b7c2', '#35373f']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.button}>
                  <Text style={styles.text}>Get Location</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Divider style={{backgroundColor: '#343e4e'}} />

            <View style={styles.venueInfoContainer}>
              <Text style={styles.sectionTitle}>Venue Info</Text>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Capacity:</Text>
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    {gameInfo?.game?.capacity || 'N/A'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Ground:</Text>
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    {gameInfo?.game?.gameInfo?.surface || 'Unknown'} •{' '}
                    {gameInfo?.game?.gameInfo?.indoor === false
                      ? 'Outdoor'
                      : 'Indoor'}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Court:</Text>
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    {gameInfo?.game?.net || 'Unknown'}
                  </Text>
                </View>
              </View>
            </View>
            <Divider style={{backgroundColor: '#343e4e'}} />

            <View style={{gap: 16}}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.address}>{gameInfo?.game?.description}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.stickyButtonContainer}>
          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={['#466fc0', '#142e97']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.bookingButton}>
              <Text style={styles.text}>Book A Game</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  venueInfoContainer: {
    gap: 16,
    padding: 8,
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#d4d4d8',
    fontSize: 16,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: 15,
  },
  image: {
    width: screenWidth,
    height: 300,
    resizeMode: 'cover',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 14,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  area: {
    color: '#9ca3af',
    fontSize: 17,
  },
  gamename: {
    color: 'white',
    fontSize: 17,
  },
  rating: {
    color: 'white',
    fontSize: 14,
  },

  address: {
    color: '#9ca3af',
    fontSize: 17,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 24,
    width: 140,
    alignItems: 'center',
  },
  bookingButton: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  capacityContainer: {
    backgroundColor: 'rgba(44, 43, 43, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    width: 70,
    alignItems: 'center',
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#0b0c10',
    borderTopWidth: 1,
    borderTopColor: '#2c2c2e',
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
