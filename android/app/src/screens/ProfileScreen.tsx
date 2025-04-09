import React from 'react';
import {Alert, PermissionsAndroid, Platform, View} from 'react-native';
import {Button} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {useUploadVideos} from '../api/user';

export function ProfileScreen() {
  const {mutate: uploadVideo} = useUploadVideos();

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version;

      let permissionsToRequest = [];

      if (apiLevel >= 33) {
        permissionsToRequest = [
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ];
      } else {
        permissionsToRequest = [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ];
      }

      try {
        const granted = await PermissionsAndroid.requestMultiple(
          permissionsToRequest,
        );
        const allGranted = Object.values(granted).every(
          value => value === PermissionsAndroid.RESULTS.GRANTED,
        );

        return allGranted;
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

    launchImageLibrary(
      {
        mediaType: 'video',
      },
      async response => {
        if (response.didCancel) {
          console.log('User cancelled picker');
        } else if (response.errorCode) {
          console.error('Picker Error:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const video = response.assets[0];
          const formData = new FormData();
          formData.append('title', 'Sample Title');
          formData.append('description', 'Uploaded via image picker');
          formData.append('video', {
            uri: video.uri!,
            type: video.type!,
            name: video.fileName || 'upload.mp4',
          });
          console.log('formData', formData);

          uploadVideo(formData);
        }
      },
    );
  };

  return (
    <View style={{padding: 20, marginTop: 50}}>
      <Button mode="contained" onPress={videoUploader}>
        Upload Video
      </Button>
    </View>
  );
}
