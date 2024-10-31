import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MqttClient from './MqttClient';

const { width } = Dimensions.get('window');
const BUTTON_RADIUS = 30;
const RING_RADIUS = 120;

interface LED {
  id: number;
  isOn: boolean;
  color: string;
}

interface RingOfButtonsProps {
  buttonCount: number;
}

const RingOfButtons: React.FC<RingOfButtonsProps> = ({ buttonCount }) => {
  const mqttClient = new MqttClient();
  const [leds, setLeds] = useState<LED[]>(
    Array.from({ length: buttonCount }, (_, i) => ({
      id: i,
      isOn: false,
      color: '#4CAF50', // Default color when on
    }))
  );
  const [selectedColor, setSelectedColor] = useState('#4CAF50'); // Default color
  const [showColorPicker, setShowColorPicker] = useState(false);

  const toggleLed = (id: number) => {
    setLeds((prevLeds) =>
      prevLeds.map((led) =>
        led.id === id ? { ...led, isOn: !led.isOn, color: selectedColor } : led
      )
    );

  };

  const handleSend = (msg :string ) => {
    mqttClient.sendMessage('Led', msg);
  };
  

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <View style={styles.container}>
      {leds.map((led, i) => {
        const angle = (2 * Math.PI * i) / buttonCount;
        const x = RING_RADIUS * Math.cos(angle);
        const y = RING_RADIUS * Math.sin(angle);

        return (
          <TouchableOpacity
            key={led.id}
            style={[
              styles.button,
              {
                transform: [{ translateX: x }, { translateY: y }],
                backgroundColor: led.isOn ? led.color : '#888',
              },
            ]}
            onPress={() => {toggleLed(led.id), handleSend(String(led.id))}}
          >
            <FontAwesome name={led.isOn ? 'lightbulb-o' : 'power-off'} size={20} color="#fff" />
          </TouchableOpacity>
        );
      })}

      {/* Color Picker Toggle Button */}
      <TouchableOpacity
        style={styles.colorPickerButton}
        onPress={() => setShowColorPicker(!showColorPicker)}
      >
        <Text style={styles.buttonText}>Select Color</Text>
      </TouchableOpacity>

      {/* Color Picker */}
      {/* {showColorPicker && (
        <View style={styles.colorPickerContainer}>
        
            onColorSelected={(color) => {
              handleColorChange(color);
              setShowColorPicker(false);
            }}
            style={{ flex: 1, width: 200, height: 200 }}
          />
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: BUTTON_RADIUS * 2,
    height: BUTTON_RADIUS * 2,
    borderRadius: BUTTON_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  colorPickerButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  colorPickerContainer: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

export default RingOfButtons;
