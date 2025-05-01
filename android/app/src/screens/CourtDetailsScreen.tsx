import React from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator, Divider} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useGetGameByIde} from '../api/games/useGame';

const {width} = Dimensions.get('window');

export function CourtDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const gameId = (route.params as {gameId?: any})?.gameId;

  const {data: gameInfo, isLoading: gameDataLoading} = useGetGameByIde(gameId);

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
          <Carousel
            width={width}
            height={width}
            autoPlay
            data={gameInfo?.game?.images}
            renderItem={renderImage}
            mode="parallax"
          />

          <View style={{padding: 16, marginTop: 16, gap: 24}}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>{gameInfo?.game?.name}</Text>
                <Text style={styles.area}>
                  {gameInfo?.game?.location?.area},{' '}
                  {gameInfo?.game?.location?.city}
                </Text>
              </View>
              <Icon name="heart-outline" size={28} color={'white'} />
            </View>

            <View style={styles.rowBetween}>
              <View style={styles.row}>
                <Icon name="gamepad-circle" size={28} color={'white'} />
                <Text style={styles.gamename}>{gameInfo?.game?.category}</Text>
              </View>
              <Text style={styles.text}>
                1hr Rates : ₹ {gameInfo?.game?.hourlyPrice}
              </Text>
            </View>

            <Divider style={styles.divider} />

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

            <Divider style={styles.divider} />

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
                    {!gameInfo?.game?.gameInfo?.indoor ? 'Outdoor' : 'Indoor'}
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

            <Divider style={styles.divider} />

            <View style={{gap: 16}}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.address}>{gameInfo?.game?.description}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.stickyButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              (navigation as any).navigate('TestScreen', {gameId})
            }>
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
    width: width,
    height: width,
    resizeMode: 'cover',
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
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    backgroundColor: '#343e4e',
  },
});
