import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
// import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library
import Icon from 'react-native-vector-icons/FontAwesome';

const CHANNEL_ID = 'test-channel';

const NotificationScreen = () => {
  useEffect(() => {
    createChannel();
  }, []);

  const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: CHANNEL_ID,
        channelName: 'Test Channel',
        channelDescription: 'A channel for test notifications',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  };

  const handleSendNotification = () => {
    PushNotification.localNotification({
      channelId: CHANNEL_ID,
      title: "Test Notification",
      message: "This is a notification triggered by pressing the button!",
      importance: 'high',
      priority: 'high',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSendNotification} style={styles.button}>
        <Text style={styles.buttonText}>Send Notification</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NotificationScreen;