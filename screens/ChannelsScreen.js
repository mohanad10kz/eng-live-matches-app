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
import { Video } from "expo-av";
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
  {
    id: "3",
    name: "beIN Sports 3",
    logo: "https://images.seeklogo.com/logo-png/48/1/bein-sports-3-logo-png_seeklogo-481585.png",
    streamUrl: "https://102.38.4.226/live/gitest/gitest/6576.ts",
  },
  {
    id: "4",
    name: "beIN Sports 4",
    logo: "https://seeklogo.com/vector-logo/367812/bein-sports",
    streamUrl: "https://102.38.4.226/live/gitest/gitest/6577.ts",
  },
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
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);
  const videoRef = useRef(null);

  const openModal = (channel) => {
    setSelectedChannel(channel);
    setModalVisible(true);
    setIsVideoLoading(true);
    setVideoError(null);
  };

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.stopAsync();
    }
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
            <Video
              ref={videoRef}
              source={{ uri: selectedChannel.streamUrl }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay
              style={styles.video}
              useNativeControls
              onLoadStart={() => setIsVideoLoading(true)}
              onLoad={() => setIsVideoLoading(false)}
              onError={(e) => {
                setIsVideoLoading(false);
                setVideoError("Cannot play this stream right now.");
              }}
            />
            {isVideoLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
            {videoError && (
              <View style={styles.errorOverlay}>
                <Text style={styles.errorText}>{videoError}</Text>
              </View>
            )}
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
  logo: {
    width: "70%",
    height: "70%",
  },
  channelName: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
