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
import { useGames } from '../api/games/useGame';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import ScreenWithHeader from '../components/ScreenWithHeader';

const SportsScreen = () => {
    const { data: gamesData } = useGames();
    const navigation = useNavigation();
    const theme = useTheme();

    const renderItem = (item: any) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    (navigation as any).navigate('GameCourtDetails', { gameId: item.id });
                }}>
                <View className="flex flex-col gap-3 w-full rounded shadow-md p-3" style={{ backgroundColor: theme.colors.elevation.level2 }}>
                    <Image
                        source={{ uri: item.images?.[0] }}
                        style={{ width: '100%', height: 250, borderRadius: 6 }}
                        resizeMode="cover"
                    />
                    <View className="flex flex-col gap-2">
                        <Text className="text-2xl font-medium" style={{ color: theme.colors.onSurface }}>{item.name}</Text>
                        <View className="flex flex-row gap-2 items-center flex-wrap">
                            <Text className="text-lg font-light" style={{ color: theme.colors.onSurface }}>
                                {item.location.city}
                            </Text>
                            <Text style={{ color: theme.colors.secondary }}>•</Text>
                            <Text className="text-base font-normal" style={{ color: theme.colors.onSurface }}>
                                ₹ {item.hourlyPrice}/Hour
                            </Text>
                            <Text style={{ color: theme.colors.secondary }}>•</Text>
                            <Text
                                className="text-base p-1 rounded font-medium"
                                style={{ color: theme.colors.onSurface, backgroundColor: theme.colors.outline }}
                            >
                                {item.category}
                            </Text>
                        </View>
                        <Text className="w-full text-lg font-light" style={{ color: theme.colors.onSurface }}>
                            capacity: {item.capacity}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity >
        );
    };

    return (
        <ScreenWithHeader>
            <ScrollView
                showsVerticalScrollIndicator={false}>
                <View className="w-[90%] mx-auto flex gap-5">
                    <FlatList
                        scrollEnabled={false}
                        data={gamesData}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => renderItem(item)}
                        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                        contentContainerStyle={{ paddingBottom: 30 }} />
                </View>
            </ScrollView>
        </ScreenWithHeader>

    );

};

export default SportsScreen;

