import React from 'react';
import { View, StyleSheet } from 'react-native';
import RingOfButtons from '../components/RingOfButtons';

const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Render the ring of buttons in the center of the screen */}
      <RingOfButtons buttonCount={8} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Match the background color in your image
  },
});

export default SettingsScreen;
