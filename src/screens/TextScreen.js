import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TextScreen = () => {
  const [inputText, setInputText] = useState('');
  const [fetchedTexts, setFetchedTexts] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('texts')
      .onSnapshot(querySnapshot => {
        const texts = querySnapshot.docs.map(doc => doc.data().content);
        setFetchedTexts(texts);
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
      .add({ content: inputText })
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
      <Text style={{marginTop:20, fontSize:20, color: 'black',fontWeight: 'bold' }}> Your Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Write something..."
        value={inputText}
        onChangeText={setInputText}
      />
      <TouchableOpacity onPress={handleSendText} style={styles.button}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
      <Text style={{ fontSize:20, color: 'black', marginBottom:40, marginRight:130,fontWeight: 'bold' }}> Your  Existing Notes</Text>
      <ScrollView style={styles.scrollView}>
        {fetchedTexts.map((text, index) => (
          <Text key={index} style={styles.fetchedText}>{text}</Text>
        ))}
      </ScrollView>
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
    marginTop:50,
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
    marginBottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollView: {
    width: '100%',
  },
  fetchedText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
});

export default TextScreen;