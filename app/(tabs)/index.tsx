import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableHighlight,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserInfo = async () => {
      const userInfo = await AsyncStorage.getItem("USER_INFO");
      if (!userInfo) {
        router.replace("/signin");
      }
    };

    checkUserInfo();
  }, []);

  const goToInnerCity = () => {
    router.push("/InnerCity");
  };

  const toggleSwitch = () => {
    if (isEnabled) {
      setModalVisible(true);
    } else {
      setIsEnabled(!isEnabled);
    }
  };

  const handleConfirm = () => {
    setIsEnabled(false);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleViewAllPress = () => {
    console.log("Xem tất cả pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/Traxi_logo_white.png")}
          style={styles.logo}
        />
        <TouchableOpacity>
          <EvilIcons name="bell" style={styles.notificationIcon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.textIntroduce}>Chào mừng bạn trở lại</Text>
      <Text style={styles.textIntroduce2}>Một ngày làm việc năng động nhé</Text>

      <View style={styles.middleSection}>
        <Text style={styles.textChoose}>Hôm nay bạn sẽ</Text>
        <View style={styles.innerRectangle}>
          <View style={styles.squareContainer}>
            <TouchableOpacity
              disabled={!isEnabled}
              onPress={() => isEnabled && console.log("Đi tỉnh")}
              style={[!isEnabled && styles.disabledSquare]}
            >
              <View style={styles.square}>
                <Image
                  source={require("../../assets/images/checkdistance.png")}
                  style={styles.squareImageDis}
                />
              </View>
              <Text style={styles.squareText}>Đi tỉnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!isEnabled}
              onPress={() => isEnabled && goToInnerCity()}
              style={[!isEnabled && styles.disabledSquare]}
            >
              <View style={styles.square}>
                <Image
                  source={require("../../assets/images/city.png")}
                  style={styles.squareImage}
                />
              </View>
              <Text style={styles.squareText}>Nội Thành</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.statusText}>Trạng thái hoạt động</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#E8E8E8" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.toggleSwitch}
          />
          <Text
            style={[
              styles.statusText,
              isEnabled ? styles.statusTextOn : styles.statusTextOff,
            ]}
          >
            {isEnabled ? "Đang hoạt động" : "Tạm nghỉ"}
          </Text>
        </View>
      </View>

      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Lịch sử cuốc đã nhận</Text>
          <TouchableOpacity onPress={handleViewAllPress}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.historyItem}>
            <Text style={styles.customerName}>Tên Khách hàng</Text>
            <Text style={styles.destination}>Địa điểm đến</Text>
          </View>
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Bạn có muốn tắt trạng thái hoạt động?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableHighlight
                style={{ ...styles.openButton }}
                onPress={handleConfirm}
              >
                <Text style={styles.textStyleAccept}>Đồng ý</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.openButton }}
                onPress={handleCancel}
              >
                <Text style={styles.textStyleCancel}>Hủy</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#12aae2",
    flex: 1,
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    marginTop: 40,
    marginLeft: 10,
    width: 130,
    height: 35,
  },
  notificationIcon: {
    color: "white",
    marginTop: 40,
    marginRight: 10,
    fontSize: 40,
  },
  textIntroduce: {
    color: "white",
    marginTop: 10,
    marginHorizontal: 13,
    fontFamily: "Averta",
    fontSize: 16,
  },
  textIntroduce2: {
    color: "white",
    marginHorizontal: 13,
    fontFamily: "Averta",
    fontSize: 16,
    marginBottom: 10,
  },
  middleSection: {
    marginBottom: 20,
    marginTop: 20,
    marginHorizontal: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  textChoose: {
    fontFamily: "Averta",
    textAlign: "center",
    marginTop: 10,
    fontSize: 20,
  },
  innerRectangle: {
    width: "100%",
    padding: 10,
  },
  squareContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
  },
  square: {
    width: 160,
    height: 160,
    borderRadius: 100,
    backgroundColor: "#A1E3F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  squareImage: {
    width: 130,
    height: 130,
  },
  squareImageDis: {
    width: 100,
    height: 100,
  },
  disabledSquare: {
    opacity: 0.5,
  },
  squareText: {
    fontFamily: "Averta",
    textAlign: "center",
  },
  toggleSwitch: {
    alignSelf: "center",
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
    marginTop: 10,
  },
  statusText: {
    fontFamily: "AvertaRegular",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
  switchText: {
    fontFamily: "AvertaRegular",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
  statusTextOn: {
    color: "green",
  },
  statusTextOff: {
    color: "#C60000",
  },
  scrollView: {
    backgroundColor: "white",
  },
  historySection: {
    height: "100%",
    backgroundColor: "white",
    padding: 19,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyTitle: {
    fontFamily: "Averta",
    fontSize: 20,
    marginBottom: 10,
  },
  viewAllText: {
    marginBottom: 10,
    fontFamily: "Averta",
    fontSize: 16,
    color: "#12aae2",
  },
  historyItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  customerName: {
    fontFamily: "Averta",
    fontSize: 16,
    marginBottom: 5,
  },
  destination: {
    fontFamily: "AvertaRegular",
    color: "#666",
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontFamily: "Averta",
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    marginLeft: 110,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "50%",
    color: "white",
  },
  openButton: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },
  textStyleAccept: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
  },
  textStyleCancel: {
    fontSize: 16,
    color: "#C60000",
    fontWeight: "bold",
    textAlign: "center",
  },
});
