import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarActiveTintColor: "#5CE1E6",
          tabBarInactiveTintColor: "white",
          tabBarStyle: {
            backgroundColor: "#545454",
            height: 55, // Increase the height
            width: '90%',  // Match the live photo screen width
            alignSelf: 'center', // Center the navigator horizontally
            borderRadius: 15, // Rounded corners
            flexDirection: 'row', // Ensure icons are arranged horizontally
            justifyContent: 'space-around', // Center icons horizontally
            alignItems: 'center', // Center icons vertically
          },
        }}
      >
        <Tabs.Screen
          name='aid'
          options={{
            tabBarIcon: ({ size, color }) => (
              <Feather name="map-pin" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='index'
          options={{
            tabBarIcon: ({ size, color }) => <AntDesign name="upload" size={30} color={color} />
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // Ensures full height is utilized
  },
});
