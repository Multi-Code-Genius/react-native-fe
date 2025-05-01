import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useGames} from '../api/games/useGame';
import {useNavigation} from '@react-navigation/native';

const SportsScreen = () => {
  const {data: gamesData} = useGames();
  const navigation = useNavigation();
  const renderItem = (item: any) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          (navigation as any).navigate('GameCourtDetails', {gameId: item.id});
        }}>
        <View className="flex flex-col gap-3 w-full rounded-sm">
          <Image
            source={{uri: item.images?.[0]}}
            style={{width: '100%', height: 250, borderRadius: 6}}
            resizeMode="cover"
          />
          <View className="flex flex-col gap-2">
            <Text className="text-white text-2xl font-medium">{item.name}</Text>
            <View className="flex flex-row gap-5 items-center">
              <Text className="text-white text-xl font-light">
                {item.location.city}
              </Text>
              <Text className="text-slate-400 text-base  font-normal">
                ₹ {item.hourlyPrice}/Hour
              </Text>
              <Text className="text-black text-base p-1 rounded font-medium bg-slate-300">
                {item.category}
              </Text>
            </View>
            <Text className="text-white w-full text-lg font-light">
              capacity: {item.capacity}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 15}}>
      <View className="mt-12 w-full">
        <Text className="w-full text-white flex text-2xl font-bold justify-center text-center">
          Sports
        </Text>
        <View className="w-[90%] mx-auto flex gap-5 mt-5">
          <FlatList
            scrollEnabled={false}
            data={gamesData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}) => renderItem(item)}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            contentContainerStyle={{paddingBottom: 30}}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SportsScreen;
