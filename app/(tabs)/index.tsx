import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera"; // Corrected import
import { FontAwesome6 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getDiagnosis } from "C:/Users/maxim/Desktop/SIGHTSENSEAI/lib/api.js"; // Your API for diagnosis

export default function Index() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back"); // Corrected facing type
  const [image, setImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false); // Track camera readiness

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Please grant camera roll permission");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        setModalVisible(true);
        setDiagnosis("Diagnosing...");

        const prediction = await getDiagnosis(uri);
        setDiagnosis(prediction.diagnosis || "Unable to diagnose");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const takePicture = async () => {
    if (!isCameraReady) return; // Ensure camera is ready before taking a picture

    const photo = await cameraRef.current?.takePictureAsync();
    if (photo?.uri) {
      setImage(photo.uri);
      setModalVisible(true);
      setDiagnosis("Diagnosing...");

      const prediction = await getDiagnosis(photo.uri);
      setDiagnosis(prediction.diagnosis || "Unable to diagnose. Please try again.");
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  if (!permission) return null; // Loading permissions
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need permission to use the camera</Text>
        <Pressable onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
        onCameraReady={() => setIsCameraReady(true)} // Mark camera as ready
      >
        <View style={styles.controls}>
          <Pressable onPress={takePicture}>
            <View style={styles.shutterOuter}>
              <View style={[styles.shutterInner, { backgroundColor: "white" }]} />
            </View>
          </Pressable>
          <Pressable onPress={toggleFacing} style={styles.rotateButton}>
            <FontAwesome6 name="rotate-left" size={30} color="white" />
          </Pressable>
        </View>
      </CameraView>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickImage}
        activeOpacity={0.6}
      >
        <Text style={styles.uploadButtonText}>Upload A Retinal Image 👀</Text>
      </TouchableOpacity>

      {/* Modal to display image and diagnosis */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle={Platform.OS === "ios" ? "formSheet" : "fullScreen"}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {image && (
              <>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: image }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                </View>

                {/* Show spinner and "Diagnosing..." text */}
                {diagnosis === "Diagnosing..." ? (
                  <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#5ce1e6" style={styles.spinner} />
                    <Text style={styles.diagnosingText}>Diagnosing...</Text>
                  </View>
                ) : (
                  <View style={styles.diagnosisContainer}>
                    <Text style={styles.diagnosisIntroText}>
                      After consideration, our model predicted: {diagnosis} 🔬
                    </Text>
                    <Text style={styles.diagnosisText}>
                      If you have any concerns, visit an eye clinic.
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 50,
  },
  permissionText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 12,
  },
  permissionButton: {
    padding: 12,
    backgroundColor: "#5ce1e6",
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  camera: {
    width: "90%",
    height: "85%",
    borderRadius: 12,
    overflow: "hidden",
  },
  controls: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterOuter: {
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: "white",
    width: 75,
    height: 75,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  rotateButton: {
    position: "absolute",
    right: 20,
  },
  uploadButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: "#5ce1e6",
    width: 320,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    minHeight: 600,
  },
  imageContainer: {
    width: 250,
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  diagnosisContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  diagnosisIntroText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  diagnosisText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 10,
  },
  spinnerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  spinner: {
    marginBottom: 10,
  },
  diagnosingText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
});