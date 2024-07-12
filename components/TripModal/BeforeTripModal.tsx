import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { uploadImageVehicle } from "@/api/Upload/UpLoadImage";
import { saveTripImage } from "@/api/Trip/Vehicle";
import Dialog from "@/components/Dialog";

interface BeforeTripModalProps {
  visible: boolean;
  onClose: () => void;
  vehicleId?: string;
  tripId?: string;
  customerId?: string;
}

const BeforeTripModal: React.FC<BeforeTripModalProps> = ({
  visible,
  onClose,
  vehicleId,
  tripId,
  customerId,
}) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState<"success" | "error">("error");

  const handleImagePick = async (index: number) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = await uploadImageVehicle(result.assets[0].uri);
      const newImages = [...images];
      newImages[index] = imageUrl;
      setImages(newImages);
    }
  };

  const handleSend = async () => {
    if (images.length < 4 || images.some((img) => !img)) {
      setDialogMessage("Vui lòng chụp đủ 4 hình trước khi gửi.");
      setDialogType("error");
      setDialogVisible(true);
      return;
    }

    setIsSending(true);
    try {
      const listImg = images.map((img) => ({ Img: img }));
      await saveTripImage({
        VehicleId: vehicleId!,
        TripId: tripId!,
        Type: "START",
        ListImg: listImg,
        Note: note,
      });
      setDialogMessage("Tải lên thành công");
      setDialogType("success");
      setDialogVisible(true);
      setTimeout(() => {
        setDialogVisible(false);
        onClose();
      }, 2000); // Tự động tắt modal sau 2 giây
    } catch (error) {
      console.error("Lỗi khi tải lên:", error);
      setDialogMessage("Lỗi khi tải lên. Vui lòng thử lại.");
      setDialogType("error");
      setDialogVisible(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Tình trạng trước khi lên xe</Text>
            {["Mặt trước", "Mặt sau", "Băng ghế trước", "Băng ghế sau"].map(
              (label, index) => (
                <View key={index} style={styles.uploadContainer}>
                  <Text style={styles.uploadText}>
                    {label} <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => handleImagePick(index)}
                  >
                    {images[index] ? (
                      <Image
                        source={{ uri: images[index] }}
                        style={styles.uploadedImage}
                      />
                    ) : (
                      <Ionicons
                        name="cloud-upload-outline"
                        size={32}
                        color="gray"
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )
            )}
            <TouchableOpacity onPress={() => setShowNoteInput(!showNoteInput)}>
              <Text style={styles.noteText}>
                {showNoteInput ? "Đóng ghi chú" : "Ghi chú"}
              </Text>
            </TouchableOpacity>
            {showNoteInput && (
              <TextInput
                style={styles.noteInput}
                placeholder="Nhập ghi chú..."
                value={note}
                onChangeText={setNote}
              />
            )}
            <TouchableOpacity
              style={[styles.sendButton, isSending && styles.disabledButton]}
              onPress={handleSend}
              disabled={isSending}
            >
              <Text style={styles.sendButtonText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Dialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title={dialogType === "success" ? "Thành công" : "Lỗi"}
        message={dialogMessage}
        type={dialogType}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 350,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Averta",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    color: "#12aae2",
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Averta",
  },
  required: {
    color: "red",
  },
  uploadBox: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  noteText: {
    fontSize: 16,
    fontFamily: "Averta",
    marginBottom: 10,
  },
  noteInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  sendButton: {
    backgroundColor: "#12aae2",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Averta",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
  },
});

export default BeforeTripModal;
