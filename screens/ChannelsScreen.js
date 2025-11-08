import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { VLCPlayer } from "react-native-vlc-media-player";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

// ... (بيانات القنوات DUMMY_CHANNELS و ChannelCard كما هي)
const DUMMY_CHANNELS = [
  {
    id: "1",
    name: "beIN Sports 1",
    logo: "https://i.imgur.com/qDUwm6i.jpeg",
    streamUrl: "https://102.38.4.226/live/gitest/gitest/6574.ts",
  },
  {
    id: "2",
    name: "beIN Sports 2",
    logo: "https://i.imgur.com/uJvMisQ.jpeg",
    streamUrl: "https://102.38.4.226/live/gitest/gitest/6575.ts",
  },
  {
    id: "3",
    name: "beIN Sports 3",
    logo: "https://i.imgur.com/uJvMisQ.jpeg",
    streamUrl: "https://102.38.4.226/live/gitest/gitest/6576.ts",
  },
  {
    id: "4",
    name: "beIN Sports 4",
    logo: "https://i.imgur.com/uJvMisQ.jpeg",
    streamUrl: "https://102.38.4.226/live/gitest/gitest/6577.ts",
  },
  // ... يمكنك إضافة المزيد
];

const ChannelCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.channelCard} onPress={() => onPress(item)}>
    <View style={styles.logoContainer}>
      <Image
        source={{ uri: item.logo }}
        style={{ width: 60, height: 60 }}
        contentFit="contain"
        transition={500}
      />
    </View>
    <Text style={styles.channelName} numberOfLines={1}>
      {item.name}
    </Text>
  </TouchableOpacity>
);

const ChannelsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isError, setIsError] = useState(false);

  // أهم جزء في هذه المحاولة: خيارات VLC النووية
  const vlcOptions = [
    "--network-caching=3000", // زيادة الكاش لتجنب التقطيع
    "--live-caching=3000",
    "--http-reconnect", // إعادة المحاولة بقوة
    "--rtsp-tcp", // استخدام TCP الأكثر استقراراً
    "--no-drop-late-frames",
    "--no-skip-frames",
    // هذه الخيارات هي الأمل الأخير لتجاوز مشاكل الشهادات (قد لا تعمل في كل إصدارات أندرويد)
    "--gnutls-cache-timeout=0", // محاولة تعطيل كاش الشهادات
    "--insecure", // (محاولة يائسة) بعض نسخ VLC القديمة تقبل هذا العلم
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DUMMY_CHANNELS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChannelCard
            item={item}
            onPress={(channel) => {
              setSelectedChannel(channel);
              setModalVisible(true);
              setIsError(false);
            }}
          />
        )}
        numColumns={2}
        contentContainerStyle={{ padding: 15 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      />

      {selectedChannel && (
        <Modal
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <VLCPlayer
              style={styles.video}
              source={{
                uri: selectedChannel.streamUrl,
                initOptions: vlcOptions, // تمرير الخيارات هنا
                // محاولة أخيرة لخداع السيرفر بالهيدرز أيضاً
                headers: {
                  "User-Agent": "VLC/3.0.18 LibVLC/3.0.18", // انتحال شخصية VLC الرسمي تماماً
                },
              }}
              autoAspectRatio={true}
              resizeMode="contain"
              onError={() => setIsError(true)}
            />

            {/* زر إغلاق بسيط */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setSelectedChannel(null);
              }}
            >
              <Text style={styles.closeText}>إغلاق</Text>
            </TouchableOpacity>

            {isError && (
              <View style={styles.errorOverlay}>
                <Text style={styles.errorText}>
                  تعذر تشغيل القناة (مشكلة شهادة أمنية)
                </Text>
              </View>
            )}
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (نفس الستايل السابق)
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  channelCard: {
    backgroundColor: "#fff",
    width: "48%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 10,
    elevation: 3,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  channelName: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  video: { width: "100%", height: "100%" },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(255,0,0,0.8)",
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  closeText: { color: "white", fontWeight: "bold" },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  errorText: { color: "white", fontSize: 18 },
});

export default ChannelsScreen;
