import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const PhotoScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false); // New state for image loading

  const requestCameraPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.CAMERA);
    return result === RESULTS.GRANTED;
  };

  const requestGalleryPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    return result === RESULTS.GRANTED;
  };

  const handleImageUpload = async (response) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage);
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      setUploading(true);
      setLoadingImage(true);  // Start loading image
      try {
        const reference = storage().ref(`/photos/${asset.fileName}`);
        await reference.putFile(asset.uri);
        const url = await reference.getDownloadURL();
        setImageUri(url);
        Alert.alert('Success', 'Image uploaded successfully');
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      launchCamera({ mediaType: 'photo', includeBase64: false }, handleImageUpload);
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
    }
  };

  const openGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (hasPermission) {
      launchImageLibrary({ mediaType: 'photo', includeBase64: false }, handleImageUpload);
    } else {
      Alert.alert('Permission Denied', 'Gallery permission is required to access photos.');
    }
  };

  const handleImageLoad = () => {
    setLoadingImage(false); // Stop loading image when it's fully loaded
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {loadingImage && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.spinner}
          />
        )}
        {imageUri && !loadingImage && (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
            onLoad={handleImageLoad} // Set loading state when image is fully loaded
          />
        )}
      </View>
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity onPress={openCamera} style={styles.button}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openGallery} style={styles.button}>
            <Text style={styles.buttonText}>Upload from Gallery</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default PhotoScreen;
