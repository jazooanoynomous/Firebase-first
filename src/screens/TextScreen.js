import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TextScreen = () => {
  const [inputText, setInputText] = useState('');
  const [fetchedText, setFetchedText] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('texts')
      .doc('textDoc')
      .onSnapshot(documentSnapshot => {
        setFetchedText(documentSnapshot.data()?.content || '');
      });

    return () => unsubscribe();
  }, []);

  const handleSendText = () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter some text before sending.');
      return;
    }

    firestore()
      .collection('texts')
      .doc('textDoc')
      .set({ content: inputText })
      .then(() => {
        Alert.alert('Success', 'Text sent successfully!');
        setInputText(''); // Clear input after sending
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to send text. Please try again.');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write something..."
        value={inputText}
        onChangeText={setInputText}
      />
      <TouchableOpacity onPress={handleSendText} style={styles.button}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
      <Text style={styles.fetchedText}>Fetched Text: {fetchedText}</Text>
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
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width:'20px'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  fetchedText: {
    fontSize: 18,
    color: '#000',
  },
});

export default TextScreen;
