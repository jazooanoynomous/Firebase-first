import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import storage from '@react-native-firebase/storage';

const ImageGalleryScreen = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Reference to the /photos folder in Firebase Storage
        const reference = storage().ref('/photos');

        // List all files in the /photos folder
        const result = await reference.listAll();

        // Get the download URLs of the files
        const urls = await Promise.all(
          result.items.map((item) => item.getDownloadURL())
        );

        // Set the fetched URLs to the state
        setImageUrls(urls);
        setLoading(false);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load images');
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.title}>Image Gallery</Text>
          <FlatList
            data={imageUrls}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3} // Adjust the number of columns for grid layout
            contentContainerStyle={styles.imageList}
          />
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  imageList: {
    alignItems: 'center',
  },
  imageContainer: {
    margin: 10,
    width: 100,
    height: 100,
    overflow: 'hidden',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default ImageGalleryScreen;
