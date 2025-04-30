import React from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'


const sportsData = [
    { image: require('../assets/image/badminton.jpg'), label: 'Badminton' },
    { image: require('../assets/image/football.jpg'), label: 'Football' },
    { image: require('../assets/image/bascketball.jpg'), label: 'Basketball' },
    { image: require('../assets/image/tennis.jpg'), label: 'Tennis' },
    { image: require('../assets/image/cricket.jpg'), label: 'Cricket' },
    { image: require('../assets/image/swimming.jpg'), label: 'Swimming' },
    { image: require('../assets/image/padel.jpg'), label: 'Padel' },
    { image: require('../assets/image/pickleball.jpg'), label: 'Pickleball' },
];



const SportsScreen = () => {
    return (
        <View className='mt-12 w-full'>
            <Text className='w-full text-white flex text-2xl font-bold justify-center text-center'>Sports</Text>
            <View>
                <FlatList
                    data={sportsData}
                    keyExtractor={(_, index) => index.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                        <View className='flex flex-col gap-3 w-[50%]'>
                            <Image source={item.image} style={{ width: '100%', height: 200, borderRadius: 6 }} resizeMode="cover" />
                            <Text className='text-white text-xl text-center'>{item.label}</Text>
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