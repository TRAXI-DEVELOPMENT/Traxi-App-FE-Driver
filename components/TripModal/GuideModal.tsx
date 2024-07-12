import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";

interface GuideModalProps {
  visible: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ visible, onClose }) => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prevStep) => (prevStep === 1 ? 2 : 1));
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <View style={{ marginBottom: 30 }}>
          <Text style={styles.stepTitle}>Ngoại quang của xe</Text>
          <View style={styles.imageRow}>
            <Image
              source={require("../../assets/images/Outside_Car_image_1.jpg")}
              style={styles.sampleImage}
            />
            <Image
              source={require("../../assets/images/Outside_Car_image_2.jpg")}
              style={styles.sampleImage}
            />
          </View>
          <Text style={styles.sampleTitle}>Sample Document</Text>
          <View style={styles.requirementContainer}>
            <Ionicons name="checkmark-circle" size={24} color="green" />
            <Text style={styles.requirementTextTitle}>Yêu cầu:</Text>
          </View>
          <View style={styles.requirementDetailContainer}>
            <Ionicons
              name="ellipse"
              size={8}
              color="black"
              style={styles.bulletIcon}
            />
            <Text style={styles.requirementDetail}>
              Chụp theo hình chữ L để thấy rõ hai bên hông xe và biến số xe
            </Text>
          </View>
          <View style={styles.requirementDetailContainer}>
            <Ionicons
              name="ellipse"
              size={8}
              color="black"
              style={styles.bulletIcon}
            />
            <Text style={styles.requirementDetail}>
              Xe không bị móp méo; các thông số kỹ thuật ví dụ như màu sắc và
              biến số xe trùng khớp với thông tin trên Cavet/đăng ký xe
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.requirementContainer}>
            <Ionicons name="close-circle" size={24} color="red" />
            <Text style={styles.requirementTextTitle}>
              Hãy đảm bảo tài liệu không:
            </Text>
          </View>
          <View style={styles.requirementDetailContainer}>
            <Ionicons
              name="ellipse"
              size={8}
              color="black"
              style={styles.bulletIcon}
            />
            <Text style={styles.requirementDetail}>
              Không chụp ảnh qua màn hình. Ảnh chụp rõ nét, không lóa sáng,
              không can thiệp chỉnh sửa
            </Text>
          </View>
        </View>
      );
    } else if (step === 2) {
      return (
        <View style={{ marginBottom: 30 }}>
          <Text style={styles.stepTitle}>Nội thất của xe</Text>
          <View style={styles.imageRow}>
            <Image
              source={require("../../assets/images/Stay_Car_image_1.jpg")}
              style={styles.sampleImage}
            />
            <Image
              source={require("../../assets/images/Stay_Car_image_2.jpg")}
              style={styles.sampleImage}
            />
          </View>
          <Text style={styles.sampleTitle}>Upload Document</Text>
          <View style={styles.requirementContainer}>
            <Ionicons name="checkmark-circle" size={24} color="green" />
            <Text style={styles.requirementTextTitle}>Yêu cầu:</Text>
          </View>
          <View style={styles.requirementDetailContainer}>
            <Ionicons
              name="ellipse"
              size={8}
              color="black"
              style={styles.bulletIcon}
            />
            <Text style={styles.requirementDetail}>
              Xe không bị móp méo; các thông số kỹ thuật ví dụ như màu sắc và
              biến số xe trùng khớp với thông tin trên Cavet/đăng ký xe
            </Text>
          </View>
          <View style={styles.requirementDetailContainer}>
            <Ionicons
              name="ellipse"
              size={8}
              color="black"
              style={styles.bulletIcon}
            />
            <Text style={styles.requirementDetail}>
              Nội thất xe nguyên vẹn, sạch sẽ, không bị rách và phải đầy đủ dây
              an toàn
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.requirementContainer}>
            <Ionicons name="close-circle" size={24} color="red" />
            <Text style={styles.requirementTextTitle}>
              Hãy đảm bảo tài liệu không:
            </Text>
          </View>
          <View style={styles.requirementDetailContainer}>
            <Ionicons
              name="ellipse"
              size={8}
              color="black"
              style={styles.bulletIcon}
            />
            <Text style={styles.requirementDetail}>
              Không chụp ảnh qua màn hình. Ảnh chụp rõ nét, không lóa sáng,
              không can thiệp chỉnh sửa
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.stepContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          {renderStepContent()}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  stepContainer: {
    width: 350,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  stepTitle: {
    fontSize: 20,
    marginTop: 30,
    fontFamily: "Averta",
    textAlign: "center",
    marginBottom: 20,
    color: "#12aae2",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  sampleImage: {
    width: "45%",
    aspectRatio: 1.5,
    borderRadius: 10,
    marginBottom: 10,
  },
  sampleTitle: {
    fontSize: 18,
    fontFamily: "AvertaRegular",
    textAlign: "center",
    marginBottom: 20,
  },
  requirementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  requirementTextTitle: {
    fontFamily: "Averta",
    fontSize: 16,
    marginLeft: 10,
  },
  requirementText: {
    fontFamily: "AvertaRegular",
    fontSize: 16,
    marginLeft: 10,
  },
  requirementDetailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bulletIcon: {
    marginRight: 10,
  },
  requirementDetail: {
    fontSize: 16,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  button: {
    padding: 15,
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#12aae2",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  nextButton: {
    position: "absolute",
    bottom: 15,
    right: 10,
    zIndex: 10,
    backgroundColor: "#12aae2",
    borderRadius: 50,
    padding: 10,
  },
});

export default GuideModal;
