import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#8E8E93', // light gray for inactive
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          height: 70,
          paddingBottom: 10,
          borderTopWidth: 0,
          borderRadius: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Helvetica Neue',
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size = 26 }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size = 26 }) => (
            <FontAwesome name="cog" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: 'Logger',
          tabBarIcon: ({ color, size = 26 }) => (
            <AntDesign name="message1" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="example"
        options={{
          title: 'Example',
          tabBarIcon: ({ color, size = 26 }) => (
            <AntDesign name="meh" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: 'Details',
          tabBarIcon: ({ color, size = 26 }) => (
            <AntDesign name="tool" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
