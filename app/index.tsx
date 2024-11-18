import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const App = () => {
    const [humidityData, setHumidityData] = useState([0, 0, 0, 0, 0]);
    const [temperatureData, setTemperatureData] = useState([0, 0, 0, 0, 0]);

    useEffect(() => {
        // Fetch data from the server
        axios.get('http://raspberrypi:8080/latest-data')
            .then(response => {
                const data = response.data;

                if (Array.isArray(data)) {
                    // Separate the temperature and humidity values
                    const humidity = data.filter(item => item.humidity !== undefined).map(item => item.humidity);
                    const temperature = data.filter(item => item.temperature !== undefined).map(item => item.temperature);

                    // Update state only if valid data exists, otherwise retain mock data
                    setHumidityData(humidity.length > 0 ? humidity : [0, 0, 0, 0, 0]);
                    setTemperatureData(temperature.length > 0 ? temperature : [0, 0, 0, 0, 0]);
                } else {
                    console.error("Unexpected data format:", data);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                // Retain the default mock data on error
                setHumidityData([0, 0, 0, 0, 0]);
                setTemperatureData([0, 0, 0, 0, 0]);
            });
    }, []);

  // Create datasets for the LineCharts
  const humidityChartData = {
    labels: Array.from({ length: humidityData.length }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        data: humidityData,
        color: () => 'rgba(134, 65, 244, 0.6)', // Color for humidity
        strokeWidth: 2
      }
    ],
    legend: ["Humidity"]
  };

  const temperatureChartData = {
    labels: Array.from({ length: temperatureData.length }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        data: temperatureData,
        color: () => 'rgba(244, 85, 100, 0.6)', // Color for temperature
        strokeWidth: 2
      }
    ],
    legend: ["Temperature"]
  };

  return (
      <ScrollView>
        <View style={{ marginVertical: 20 }}>
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Humidity Chart</Text>
          <LineChart
              data={humidityChartData}
              width={Dimensions.get('window').width - 16} // Width of the chart
              height={220} // Height of the chart
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#f5f5f5',
                backgroundGradientTo: '#e5e5e5',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: '3', strokeWidth: '1', stroke: '#ffa726' }
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>

        <View style={{ marginVertical: 20 }}>
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Temperature Chart</Text>
          <LineChart
              data={temperatureChartData}
              width={Dimensions.get('window').width - 16} // Width of the chart
              height={220} // Height of the chart
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#f5f5f5',
                backgroundGradientTo: '#e5e5e5',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: '3', strokeWidth: '1', stroke: '#ffa726' }
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>
      </ScrollView>
  );
};

export default App;
