import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import MatchesScreen from "./screens/MatchesScreen";
import ChannelsScreen from "./screens/ChannelsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Matches") {
              iconName = focused ? "football" : "football-outline";
            } else if (route.name === "Channels") {
              iconName = focused ? "tv" : "tv-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Matches" component={MatchesScreen} />
        <Tab.Screen name="Channels" component={ChannelsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
