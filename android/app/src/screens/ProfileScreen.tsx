import React, {useCallback, useState} from 'react';
import {View, Image, Text, Alert, FlatList, StyleSheet} from 'react-native';
import {VideoUploaderComponent} from '../components/VideoUploaderComponent';
import {ActivityIndicator, IconButton, Provider} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {useUploadImage} from '../api/image/image';
import {useUserInfo} from '../api/user/user';
import {TouchableOpacity} from 'react-native';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';

type ProfileScreenProps = {
  setIndex: (index: number) => void;
  setShowSettings: (show: boolean) => void;
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  setShowSettings,
}) => {
  const navigation = useNavigation();
  const {data, isLoading, error, refetch} = useUserInfo();
  const userId = data?.user?.id;
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const uploadImageMutation = useUploadImage(
    res => {
      if (!res?.user) {
        Alert.alert('Upload failed', 'Invalid response from server');
        return;
      }
      Alert.alert('Success', 'Profile image uploaded successfully');
    },
    error => {
      Alert.alert('Error', 'Image upload failed');
      console.log('Upload error:', error);
    },
  );

  const handleMediaPick = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel || !response.assets?.length) return;

      const asset = response.assets[0];
      if (!asset.uri || !userId) return;

      const formData = new FormData();
      formData.append('profile_pic', {
        uri: asset.uri,
        name: asset.fileName ?? 'image.jpg',
        type: asset.type ?? 'image/jpeg',
      });

      uploadImageMutation.mutate({
        id: userId,
        payload: formData,
      });
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{color: 'white'}}>Failed to load videos</Text>
      </View>
    );
  }

  return (
    <Provider>
      <View className="flex-1 p-6 bg-white">
        <View className="flex w-full flex-col">
          <View className="w-full flex-row justify-end">
            <IconButton
              icon="cog"
              size={24}
              onPress={() => setShowSettings(true)}
              iconColor="#000"
              containerColor="#fff"
            />
          </View>
          <View className="flex-row gap-5 w-full">
            <View className="relative w-32 h-32">
              <View className="w-full h-full rounded-full border-4 border-gray-100 overflow-hidden">
                <Image
                  source={{uri: data?.user?.profile_pic}}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                <IconButton
                  icon="plus"
                  size={16}
                  onPress={handleMediaPick}
                  iconColor="#000"
                  containerColor="#fff"
                  style={{margin: 0}}
                />
              </View>
            </View>
            <View className="justify-center w-full">
              <Text className="text-[20px] font-semibold text-gray-800">
                {data?.user?.name || 'Your Name'}
              </Text>
              <Text className="text-[20px] font-semibold text-gray-600">
                {data?.user?.email || 'your@email.com'}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-8 mb-8 w-full">
          <VideoUploaderComponent />
        </View>

        <View className=" h-[1px] bg-gray-300 w-full" />
        <View className="flex-1 overflow-hidden">
          <View className="flex flex-row justify-center items-center">
            <IconButton
              icon="grid"
              size={20}
              iconColor="#000"
              containerColor="#fff"
            />
            <Text className="text-[17px] font-semibold">Posts</Text>
          </View>
          <View className="mt-4">
            <FlatList
              data={data?.user?.videos}
              keyExtractor={item => item.id}
              numColumns={3}
              refreshing={refreshing}
              onRefresh={onRefresh}
              contentContainerStyle={{paddingBottom: 60}}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                // justifyContent: 'space-between',
                justifyContent: 'flex-start',
                gap: 3,
                marginBottom: 10,
              }}
              renderItem={({item}) => {
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
                      (navigation as any).navigate('ProfileList', {
                        videoId: item.id,
                      });
                    }}>
                    {item.thumbnail ? (
                      <Image
                        source={{uri: item.thumbnail}}
                        style={{width: '100%', height: '100%', borderRadius: 8}}
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
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
