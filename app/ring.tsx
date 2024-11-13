import React from 'react';
import { View, StyleSheet } from 'react-native';
import RingOfButtons from '../components/RingOfButtons';
import MqttClient from "@/components/MqttClient";

const SettingsScreen: React.FC = () => {
  const mqttClient = new MqttClient();  return (
    <View style={styles.container}>
      <RingOfButtons mqttClient={mqttClient}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default SettingsScreen;
