import React from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { useGames } from '../api/games/useGame';

const SportsScreen = () => {
    const { data: gamesData } = useGames();

    console.log('gamesData???', gamesData);

    return (
        <View className='mt-12 w-full'>
            <Text className='w-full text-white flex text-2xl font-bold justify-center text-center'>Sports</Text>
            <View className='w-[90%] mx-auto'>
                <FlatList
                    data={gamesData}
                    keyExtractor={(_, index) => index.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                        <View className="flex flex-col gap-3 w-full rounded-sm">
                            <Image
                                source={{ uri: item.images?.[0] }}
                                style={{ width: '100%', height: 250, borderRadius: 6 }}
                                resizeMode="cover"
                            />
                            <View>
                                <Text className="text-white text-2xl font-medium">{item.name}</Text>
                                <View className='flex flex-row gap-5'>
                                    <Text className="text-white text-xl font-light">{item.location.city}</Text>
                                    <Text className="text-slate-400 text-lg font-normal">₹ {item.hourlyPrice}/Hour</Text>
                                    <Text className="text-white text-xl font-light">{item.category}</Text>
                                </View>
                            </View>

                        </View>
                    )}
                />
            </View>
        </View>
    )
}

export default SportsScreen;


const styles = StyleSheet.create({
    row: {
        flex: 1,
        width: "100%",
        gap: 10,
        marginTop: 20,
    }
})