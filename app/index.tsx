import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import MqttClient from '@/components/MqttClient';

export default function IoTDashboard() {
  const [isDeviceOn, setDeviceOn] = React.useState(true);
  const toggleDevice = () => {
    setDeviceOn(previousState => !previousState)
    handleSend(isDeviceOn ? 'Off' : 'On')
  };
  const ringColor = isDeviceOn ? "#4CAF50" : "#DDDDDD";
  const mqttClient = new MqttClient();

  const handleSend = (msg :string ) => {
    mqttClient.sendMessage('LightsHome', msg);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Smart Home Dashboard</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Device Card */}
      <View style={styles.deviceCard}>
        <View style={styles.deviceInfo}>
          <FontAwesome5 name="lightbulb" size={28} color={ringColor} />
          <Text style={styles.deviceTitle}>Living Room Light</Text>
        </View>

        {/* LED Ring Button */}
        <TouchableOpacity onPress={toggleDevice} style={[styles.ledRing, { borderColor: ringColor }]}>
          <View style={[styles.ledInner, { backgroundColor: ringColor }]} />
        </TouchableOpacity>
        <Text style={styles.deviceStatus}>{isDeviceOn ? 'On' : 'Off'}</Text>
      </View>

      {/* Chart Section */}
      <Text style={styles.chartTitle}>Temperature Over Time</Text>
      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{ data: [22, 24, 20, 23, 25, 24] }]
        }}
        width={320} // Adjust based on your view width
        height={200}
        yAxisSuffix="°C"
        chartConfig={chartConfig}
        style={styles.chart}
      />     
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: '#000',
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F9', paddingHorizontal: 20, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '600', color: '#333' },
  refreshButton: { padding: 8, backgroundColor: '#4CAF50', borderRadius: 8 },

  deviceCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: { flexDirection: 'column', alignItems: 'center' },
  deviceTitle: { fontSize: 18, fontWeight: '500', color: '#333', marginTop: 8 },
  deviceStatus: { fontSize: 14, color: '#777', marginTop: 10 },

  ledRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#DDDDDD',
  },
  ledInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDDDDD',
  },

  chartTitle: { fontSize: 18, fontWeight: '500', color: '#333', marginVertical: 20 },
  chart: { marginVertical: 8, borderRadius: 16 },
  
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: 'gray' },
});
