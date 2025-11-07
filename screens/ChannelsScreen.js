import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { VLCPlayer, VlCPlayerView } from "react-native-vlc-media-player";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

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
        style={styles.logo}
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
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

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
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <VLCPlayer
              style={styles.video}
              videoAspectRatio="16:9"
              source={{ uri: selectedChannel.streamUrl }}
              onBuffering={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setIsError(true);
              }}
            />
            {isLoading && !isError && (
              <View style={styles.centerOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
            {isError && (
              <View style={styles.centerOverlay}>
                <Text style={styles.errorText}>
                  عذراً، البث غير متاح حالياً.
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  channelCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "48%",
    aspectRatio: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  logoContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 50, height: 50 },
  channelName: { fontWeight: "bold", marginTop: 8, textAlign: "center" },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  video: { width: "100%", height: "100%" },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  errorText: { color: "white", fontSize: 18, fontWeight: "bold" },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});

export default ChannelsScreen;
