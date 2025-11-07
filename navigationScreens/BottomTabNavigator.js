import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MatchesScreen from "../screens/MatchesScreen";
import ChannelsScreen from "../screens/ChannelsScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Channels" component={ChannelsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
