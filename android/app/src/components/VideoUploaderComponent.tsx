import React, {useState} from 'react';
import {Alert, PermissionsAndroid, Platform, View, Text} from 'react-native';
import {Button, ActivityIndicator} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {useUploadVideos} from '../api/user/user';

export function VideoUploaderComponent() {
  const {mutate: uploadVideoMutation} = useUploadVideos();
  const [isUploading, setIsUploading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version;
      const permissionsToRequest =
        apiLevel >= 33
          ? [
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
              PermissionsAndroid.PERMISSIONS.CAMERA,
            ]
          : [
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              PermissionsAndroid.PERMISSIONS.CAMERA,
            ];

      try {
        const granted = await PermissionsAndroid.requestMultiple(
          permissionsToRequest,
        );
        return Object.values(granted).every(
          value => value === PermissionsAndroid.RESULTS.GRANTED,
        );
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const videoUploader = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission denied',
        'Please grant video upload permissions.',
      );
      return;
    }

    launchImageLibrary({mediaType: 'video'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled picker');
      } else if (response.errorCode) {
        console.error('Picker Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const video = response.assets[0];

        Alert.alert(
          'Upload Video',
          `Are you sure you want to upload ${video.fileName || 'this video'}?`,
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Upload',
              onPress: () => {
                const formData = new FormData();
                formData.append('title', 'Sample Title');
                formData.append('description', 'Uploaded via image picker');
                formData.append('video', {
                  uri: video.uri!,
                  type: video.type!,
                  name: video.fileName,
                });

                setIsUploading(true);
                uploadVideoMutation(formData, {
                  onSuccess: data => {
                    console.log('Uploaded:', data);
                    Alert.alert('Success', 'Video uploaded successfully!');
                    setIsUploading(false);
                  },
                  onError: error => {
                    console.error('Upload failed:', error);
                    Alert.alert('Error', 'Failed to upload video.');
                    setIsUploading(false);
                  },
                });
              },
            },
          ],
        );
      }
    });
  };

  return (
    <Button mode="contained" onPress={videoUploader} disabled={isUploading}>
      <View className="flex-row items-center justify-center gap-4">
        {isUploading && (
          <ActivityIndicator animating={true} size="small" color="white" />
        )}
        <Text style={{color: 'white'}}>Upload Video</Text>
      </View>
    </Button>
  );
}
