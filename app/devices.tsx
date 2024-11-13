import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import MqttClient from '@/components/MqttClient';

type Device = {
  id: string;
  name: string;
  status: 'online' | 'offline';
};

const TIMEOUT_INTERVAL = 5000;

const DeviceStatusScreen = () => {
  const mqttClient = new MqttClient();
  const [deviceStatuses, setDeviceStatuses] = useState<{ [key: string]: 'online' | 'offline' }>({
    '0': 'offline',
    '1': 'offline',
    '2': 'offline',
    '3': 'offline',
  });

  const timeouts: { [key: string]: NodeJS.Timeout | null } = {};

  const handleMQTTMessage = (topic: string, message: string) => {
    const deviceId = topic.split('/')[1];

    if (deviceStatuses.hasOwnProperty(deviceId)) {
      if (timeouts[deviceId]) {
        clearTimeout(timeouts[deviceId]!);
      }

      setDeviceStatuses(prevStatuses => ({
        ...prevStatuses,
        [deviceId]: message === 'online' ? 'online' : 'offline',
      }));

      timeouts[deviceId] = setTimeout(() => {
        setDeviceStatuses(prevStatuses => ({
          ...prevStatuses,
          [deviceId]: 'offline',
        }));
        Alert.alert('Device Offline', `Device ${parseInt(deviceId) + 1} is offline due to timeout.`);
      }, TIMEOUT_INTERVAL);
    } else {
      console.log(`Device with ID ${deviceId} not recognized`);
    }
  };

  const checkStatus = () => {
    mqttClient.sendMessage('This device', 'check');
  };

  useEffect(() => {
    checkStatus();
    mqttClient.addTopic('Devices/0', handleMQTTMessage);
    mqttClient.addTopic('Devices/1', handleMQTTMessage);
    mqttClient.addTopic('Devices/2', handleMQTTMessage);
    mqttClient.addTopic('Devices/3', handleMQTTMessage);

    return () => {
      Object.values(timeouts).forEach(timeout => timeout && clearTimeout(timeout));
      mqttClient.disconnect();
    };
  }, []);

  const devices: Device[] = Object.keys(deviceStatuses).map(id => ({
    id,
    name: `Device ${parseInt(id) + 1}`,
    status: deviceStatuses[id],
  }));

  const renderDeviceItem = ({ item }: { item: Device }) => (
      <View style={styles.deviceItem}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={[styles.deviceStatus, item.status === 'online' ? styles.online : styles.offline]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
  );

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Device Status</Text>
        <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={renderDeviceItem}
        />
        <Button title="Check Status" onPress={checkStatus} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '500',
  },
  deviceStatus: {
    fontSize: 16,
    fontWeight: '500',
  },
  online: {
    color: 'green',
  },
  offline: {
    color: 'red',
  },
});

export default DeviceStatusScreen;
