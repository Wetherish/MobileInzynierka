import React, {useEffect, useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import ColorPicker, { Panel1, Swatches, colorKit, PreviewText, HueCircular } from 'reanimated-color-picker';
import { FontAwesome } from '@expo/vector-icons';
import MqttClient from './MqttClient';

const BUTTON_RADIUS = 25;
const RING_RADIUS = 150;
interface LED {
  id: number;
  isOn: boolean;
  color: string;
}

interface MergedComponentProps {
  mqttClient: MqttClient;
}

const MergedComponent: React.FC<MergedComponentProps>  = (mqttClient) => {
  const [showModal, setShowModal] = useState(false);
  const [leds, setLeds] = useState<LED[]>(
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      isOn: false,
      color: '#4CAF50',
    }))
  );
  const customSwatches = new Array(6).fill('#fff').map(() => colorLed);
  const selectedColor = useSharedValue(customSwatches[0]);
  const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));

  const toggleLed = (id: number, command: string) => {
    setLeds((prevLeds) =>
        prevLeds.map((led) =>
            led.id === id
                ? { ...led, isOn: command === "on", color: selectedColor.value }
                : led
        )
    );
    console.log("number: "+ id + " command: ", command)
  };
  function extractCommandAndNumber(input: string): { command: string, id: number | null } | null {
    const match = input.match(/^([a-zA-Z]+)\/(\d+)$/);
    if (match) {
      const command = match[1];
      const id = parseInt(match[2], 10);
      console.log(`Extracted command: ${command}, id: ${id}`); // Debug log
      return { command, id };
    }
    console.error("Failed to parse input:", input); // Debug log for failed parsing
    return null;
  }
  useEffect(() => {
    const handleLedResponse = (topic: string, content: string) => {
      const result = extractCommandAndNumber(content)
      if (result && result.id !== null && result.command){
        toggleLed(result.id, result.command)
      }

    };

    mqttClient.mqttClient.addTopic('LedResponse', handleLedResponse);
  }, []);
  const handleSendColor = () => {
    mqttClient.mqttClient.sendMessage('color', selectedColor.value);
  };

  const onColorSelect = (color: any) => {
    selectedColor.value = color.hex;
  };

  return (
    <View style={styles.container}>
      {leds.map((led, i) => {
        const angle = (2 * Math.PI * i) / 16;
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
            onPress={() => {
              toggleLed(led.id);
              mqttClient.mqttClient.sendMessage('Led', String(led.id));
            }}
          >
            <FontAwesome name={led.isOn ? 'lightbulb-o' : 'power-off'} size={20} color="#fff" />
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity style={styles.colorPickerButton} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>Select Color</Text>
      </TouchableOpacity>

      <Modal onRequestClose={() => setShowModal(false)} visible={showModal} animationType='slide'>
        <Animated.View style={[styles.colorPickerContainer, backgroundColorStyle]}>
          <View style={styles.pickerContainer}>
            <ColorPicker value={selectedColor.value} sliderThickness={20} thumbSize={24} onChange={onColorSelect} boundedThumb>
              <HueCircular containerStyle={styles.hueContainer} thumbShape='pill'>
                <Panel1 style={styles.panelStyle} />
              </HueCircular>
              <Swatches style={styles.swatchesContainer} swatchStyle={styles.swatchStyle} colors={customSwatches} />
              <View style={styles.previewTxtContainer}>
                <PreviewText style={{ color: '#707070' }} colorFormat='hsl' />
              </View>
            </ColorPicker>
          </View>

          <View style={styles.sendContainer}>
            <View style={[styles.colorPreview, { backgroundColor: selectedColor.value }]} />
            <Pressable style={styles.sendButton} onPress={handleSendColor}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
            </Pressable>
          </View>

          <Pressable style={styles.closeButton} onPress={() => setShowModal(false)}>
            <Text style={{ color: '#707070', fontWeight: 'bold' }}>Close</Text>
          </Pressable>
        </Animated.View>
      </Modal>
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
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'orange',
  },
  pickerContainer: {
    alignSelf: 'center',
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  hueContainer: {
    justifyContent: 'center',
  },
  panelStyle: {
    width: '70%',
    height: '70%',
    alignSelf: 'center',
    borderRadius: 16,
  },
  previewTxtContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#bebdbe',
  },
  swatchesContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#bebdbe',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MergedComponent;
