import * as ImagePicker from 'expo-image-picker';

import { Platform } from 'react-native';

export const getDiagnosis = async (imageUri) => {
  try {
    const formData = new FormData();

    formData.append('file', {
      uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    const response = await fetch('http://192.168.1.210:5000/predict', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      throw new Error(`Server responded with status ${response.status}`);
    }
  } catch (error) {
    console.error('Prediction error:', error);
    return { diagnosis: 'Unable to diagnose' };
  }
};


export const pickImage = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert('Please grant permission to access your media library.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    allowsEditing: true,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  } else {
    return null;
  }
};
