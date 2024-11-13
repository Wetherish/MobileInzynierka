// app/Logs.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import MqttClient from '@/components/MqttClient';

interface Message {
  topic: string;
  content: string;
}

const Logs = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const mqttClient = new MqttClient();

  useEffect(() => {
    const handleNewMessage = (topic: string, content: string) => {
      setMessages((prevMessages) => [...prevMessages, { topic, content }]);
    };
    
    mqttClient.addTopic('Led', handleNewMessage);
    mqttClient.addTopic('Devices/0', handleNewMessage);
    mqttClient.addTopic('Devices/1', handleNewMessage);
    mqttClient.addTopic('Devices/2', handleNewMessage);
    mqttClient.addTopic('Devices/3', handleNewMessage);

    return () => {
      mqttClient.disconnect();
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Logs</Text>
      {messages.map((msg, index) => (
        <View key={index} style={styles.messageContainer}>
          <Text style={styles.topic}>Topic: {msg.topic}</Text>
          <Text style={styles.message}>Message: {msg.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  topic: {
    fontWeight: 'bold',
  },
  message: {
    marginTop: 4,
  },
});

export default Logs;
