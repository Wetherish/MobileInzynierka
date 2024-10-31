// app/example.tsx

import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MqttClient from '@/components/MqttClient';

const Example = () => {
  // Initialize the MQTT client
  const mqttClient = new MqttClient();

  // Send a test message when the component mounts
  useEffect(() => {
    mqttClient.sendMessage('my/test/topic', 'Hello from example.tsx!');

    // Optionally disconnect on unmount
    return () => {
      mqttClient.disconnect();
    };
  }, []);

  const handleSend = () => {
    mqttClient.sendMessage('my/test/topic', 'Another  message');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MQTT Client Example</Text>
      <Button title="Send Message" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default Example;
