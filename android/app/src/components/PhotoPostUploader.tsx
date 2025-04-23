import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {Button} from 'react-native-paper';
import {useUploadPhoto} from '../api/photo/photo';

export function PhotoPostUploader() {
  const {mutate: uploadPhotoMutation, isPending} = useUploadPhoto();

  const [image, setImage] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handlePickImage = async () => {
    try {
      const pickedImage = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.8,
      });

      setImage(pickedImage);
      setModalVisible(true);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Image selection failed.');
      }
    }
  };

  const handleUpload = () => {
    if (!image?.path) return;

    const formData = new FormData();
    formData.append('description', description);
    formData.append('post', {
      uri: image.path,
      type: image.mime || 'image/jpeg',
      name: image.filename || 'photo.jpg',
    });

    uploadPhotoMutation(formData, {
      onSuccess: () => {
        Alert.alert('Success', 'Photo uploaded successfully!');
        reset();
      },
      onError: () => {
        Alert.alert('Error', 'Photo upload failed.');
      },
    });
  };

  const reset = () => {
    setImage(null);
    setDescription('');
    setModalVisible(false);
  };

  return (
    <View>
      <Button
        icon="image"
        mode="outlined"
        onPress={handlePickImage}
        disabled={isPending}>
        Upload Post
      </Button>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={reset}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
            }}>
            {image?.path && (
              <Image
                source={{uri: image.path}}
                style={{width: '100%', height: 200, borderRadius: 10}}
                resizeMode="cover"
              />
            )}
            <Text style={{marginVertical: 10, fontWeight: 'bold'}}>
              Write a caption
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description..."
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 6,
                padding: 10,
                marginBottom: 15,
              }}
              multiline
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button onPress={reset} mode="outlined" disabled={isPending}>
                Cancel
              </Button>
              <Button
                onPress={handleUpload}
                disabled={isPending}
                loading={isPending}>
                Upload
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
