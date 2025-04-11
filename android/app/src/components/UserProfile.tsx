import React, { useEffect } from 'react';
import { Alert, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useUserByIdMutation } from '../api/user/user';
import { IconButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';

const UserProfile = () => {
    const route = useRoute();
    const { id } = route.params as { id: string };
    const { mutate, data, isPending, error } = useUserByIdMutation();
    const userData = data?.user;
    useEffect(() => {
        if (id) {
            mutate(id);
        }
    }, [id]);

    if (isPending) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error loading user data</Text>;
    }

    const renderItem = ({ item }: { item: any }) => (
        <View >
            <Text>Title: {item.title}</Text>
            <Text>Description: {item.description}</Text>

        </View>
    );

    return (
        <View className="flex-1 p-6 bg-white">
            <View className="mt-10 flex-row  gap-10">
                <View className="relative w-32 h-32">
                    <View className="w-full h-full rounded-full border-4 border-gray-100 overflow-hidden">
                        <Image
                            source={{ uri: userData?.profile_pic }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                </View>
                <View className="justify-center">
                    <Text className="text-[20px] font-semibold text-gray-800">
                        {userData?.name || 'Your Name'}
                    </Text>
                    <Text className="text-[20px] font-semibold text-gray-600">
                        {userData?.email || 'your@email.com'}
                    </Text>
                </View>
            </View>
            <View className=" h-[1px] bg-gray-300 w-full mt-4" />
            <View className="flex">
                <View className="flex flex-row justify-center items-center">
                    <IconButton
                        icon="grid"
                        size={20}
                        iconColor="#000"
                        containerColor="#fff"
                    />
                    <Text className="text-[17px] font-semibold">Posts</Text>
                </View>
            </View>
            <View className="mt-4">
                <FlatList
                    data={userData?.videos}
                    keyExtractor={item => item.id}
                    numColumns={3}
                    contentContainerStyle={{ paddingBottom: 60 }}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        marginBottom: 10,
                    }}
                    renderItem={({ item }) => {
                        console.log('item', item);
                        const screenWidth = Dimensions.get('window').width;
                        const boxSize = (screenWidth - 48) / 3;
                        const boxSizeHeight = (screenWidth - 48) / 2;

                        return (
                            <TouchableOpacity
                                style={{
                                    width: boxSize,
                                    height: boxSizeHeight,
                                    backgroundColor: '#e5e7eb',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 8,
                                }}
                                onPress={() => {
                                    Alert.alert('Video', item.title);
                                }}>
                                {item.thumbnail ? (
                                    <Image
                                        source={{ uri: item.thumbnail }}
                                        style={{ width: '100%', height: '100%', borderRadius: 8 }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text className="text-sm text-gray-600 px-2 text-center">
                                        {item.title}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </View>
    );
};


export default UserProfile;
