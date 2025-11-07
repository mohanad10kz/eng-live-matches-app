import React from "react";
import { Image } from "expo-image";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking, // <--- استيراد مهم جداً
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DUMMY_CHANNELS = [
  {
    id: "1",
    name: "beIN Sports 1",
    logo: "https://i.imgur.com/qDUwm6i.jpeg",
    // تأكد من أن هذا الرابط يعمل حقاً عند فتحه في VLC يدوياً
    streamUrl: "https://102.38.4.226/live/gitest/gitest/6574.ts",
  },
  // ... باقي قنواتك
  {
    id: "2",
    name: "beIN Sports 2",
    logo: "https://i.imgur.com/uJvMisQ.jpeg",
    streamUrl: "https://102.38.4.226/live/gitest/gitest/6575.ts",
  },
  // ...
];

const ChannelCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.channelCard} onPress={() => onPress(item)}>
    <View style={styles.logoContainer}>
      <Image
        source={{ uri: item.logo }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
        contentFit="cover"
        transition={1000}
      />
    </View>
    <Text style={styles.channelName}>{item.name}</Text>
  </TouchableOpacity>
);

const ChannelsScreen = () => {
  // دالة جديدة لفتح الرابط في مشغل خارجي
  const openInExternalPlayer = async (channel) => {
    try {
      // محاولة فتح الرابط. نظام أندرويد سيعرض المشغلات المتاحة (VLC, MX Player, etc.)
      const supported = await Linking.canOpenURL(channel.streamUrl);

      if (supported) {
        await Linking.openURL(channel.streamUrl);
      } else {
        Alert.alert(
          "Error",
          "Cannot open this stream link. You might need a video player app like VLC."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while trying to open the stream."
      );
      console.error("Linking Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DUMMY_CHANNELS}
        renderItem={({ item }) => (
          <ChannelCard item={item} onPress={openInExternalPlayer} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 15 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      />
    </SafeAreaView>
  );
};

// ... نفس الـ styles السابقة تماماً، يمكنك حذف styles المودال والفيديو لأننا لم نعد نحتاجها
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  channelCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    aspectRatio: 1,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  channelName: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});

export default ChannelsScreen;
