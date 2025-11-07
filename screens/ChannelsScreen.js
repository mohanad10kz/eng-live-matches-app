import React, { useState, useRef } from "react";
import { Image } from "expo-image";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import Video from "react-native-video"; // <--- البطل الجديد
import { SafeAreaView } from "react-native-safe-area-context";

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
  // ... يمكنك إضافة المزيد
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // للتحميل
  const [isError, setIsError] = useState(false); // للخطأ
  const videoRef = useRef(null);

  const openModal = (channel) => {
    setSelectedChannel(channel);
    setModalVisible(true);
    setIsLoading(true);
    setIsError(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedChannel(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DUMMY_CHANNELS}
        renderItem={({ item }) => (
          <ChannelCard item={item} onPress={openModal} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 15 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      />
      {selectedChannel && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          supportedOrientations={["landscape", "portrait"]}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            {/* المشغل الجديد بكامل قوته */}
            <Video
              ref={videoRef}
              source={{
                uri: selectedChannel.streamUrl,
                // إضافة هيدرز مهمة جداً لسيرفرات IPTV
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
              }}
              style={styles.video}
              controls={true} // إظهار أزرار التحكم الأصلية
              resizeMode="contain" // الحفاظ على أبعاد الفيديو
              onLoadStart={() => {
                setIsLoading(true);
                setIsError(false);
              }}
              onLoad={() => setIsLoading(false)} // عندما يبدأ الفيديو فعلياً
              onBuffer={({ isBuffering }) => setIsLoading(isBuffering)} // إظهار التحميل عند التقطيع
              onError={(e) => {
                console.log("Video Error:", e);
                setIsLoading(false);
                setIsError(true);
              }}
            />

            {/* مؤشر التحميل */}
            {isLoading && !isError && (
              <View style={styles.centerOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}

            {/* رسالة الخطأ */}
            {isError && (
              <View style={styles.centerOverlay}>
                <Text style={styles.errorText}>
                  عذراً، البث غير متاح حالياً.
                </Text>
              </View>
            )}

            {/* زر الإغلاق */}
            <SafeAreaView style={styles.closeButtonContainer}>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

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
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  centerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1,
  },
  errorText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ChannelsScreen;
