import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ImageBackground,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function History() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  const rides = [
    {
      id: 1,
      name: "Tên khách hàng",
      from: "Địa điểm đi",
      to: "Địa điểm đến",
      start: new Date().toLocaleString(),
      end: new Date().toLocaleString(),
      time: new Date().toLocaleTimeString(),
      code: "Mã vận đơn",
      amount: "000vnd",
    },
    {
      id: 2,
      name: "Tên khách hàng",
      from: "Địa điểm đi",
      to: "Địa điểm đến",
      start: new Date().toLocaleString(),
      end: new Date().toLocaleString(),
      time: new Date().toLocaleTimeString(),
      code: "Mã vận đơn",
      amount: "000vnd",
    },
    {
      id: 3,
      name: "Tên khách hàng",
      from: "Địa điểm đi",
      to: "Địa điểm đến",
      start: new Date().toLocaleString(),
      end: new Date().toLocaleString(),
      time: new Date().toLocaleTimeString(),
      code: "Mã vận đơn",
      amount: "000vnd",
    },
    {
      id: 4,
      name: "Tên khách hàng",
      from: "Địa điểm đi",
      to: "Địa điểm đến",
      start: new Date().toLocaleString(),
      end: new Date().toLocaleString(),
      time: new Date().toLocaleTimeString(),
      code: "Mã vận đơn",
      amount: "000vnd",
    },
    {
      id: 5,
      name: "Tên khách hàng",
      from: "Địa điểm đi",
      to: "Địa điểm đến",
      start: new Date().toLocaleString(),
      end: new Date().toLocaleString(),
      time: new Date().toLocaleTimeString(),
      code: "Mã vận đơn",
      amount: "000vnd",
    },
  ];

  const handleCardPress = (ride) => {
    setSelectedRide(ride);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
        <ImageBackground
          source={require("../../assets/images/bg_register.png")}
          style={styles.bgContainer}
        >
      <Text style={styles.header}>Lịch sử chuyến</Text>
      {rides.map((ride) => (
        <TouchableOpacity
          key={ride.id}
          style={styles.card}
          onPress={() => handleCardPress(ride)}
        >
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.name}>{ride.name}</Text>
              <Text style={styles.detail}>
                <Ionicons name="location" size={12} color="red" />
                {"  "}
                {ride.from}
              </Text>
              <Text style={styles.detail}>
                <Ionicons name="locate-outline" size={12} color="blue" />
                {"  "}
                {ride.to}
              </Text>
              <Text style={styles.detail}>{ride.code}</Text>
            </View>
            <Text style={styles.amount}>Tổng tiền: {ride.amount}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {selectedRide && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalText}>{selectedRide.code}</Text>
              <Text style={styles.name}>{`${selectedRide.name}`}</Text>
              <View style={styles.detailRoad}>
                <Text style={styles.detail}>
                  <Ionicons name="location" size={13} color="red" />{" "}
                  {`${selectedRide.from}`}
                </Text>
                <Text style={styles.detail}>
                  <Ionicons name="locate-outline" size={13} color="blue" />{" "}
                  {`${selectedRide.to}`}
                </Text>
              </View>
              <View style={styles.detailTime}>
              <Text style={styles.detail}>
                <Ionicons
                  name="time"
                  size={13}
                  color="black"
                  style={styles.icon}
                />{" "}
                {`Bắt đầu:  ${selectedRide.start}`}
              </Text>
              <Text style={styles.detail}>
                {"     "}
                {`Kết thúc: ${selectedRide.end}`}
              </Text>
              <Text style={styles.detail}>
                <Ionicons name="alarm" size={14} color="black" />{" "}
                {`Tổng thời gian đi: ${selectedRide.time}`}
              </Text>
              </View>
              <Text
                style={styles.amount}
              >{`Tổng tiền: ${selectedRide.amount}`}</Text>
            </View>
          </View>
        </Modal>
      )}
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    padding: 20,
    backgroundColor: "#e1fffe"
  },
  bgContainer: {
    backgroundColor: "#e1fffe",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontFamily: "Averta",
    fontSize: 16,
    marginBottom: 5,
  },
  detailRoad:{
    marginTop: 10,
    marginBottom: 15,
  },
  detailTime:{
    marginTop: 10,
    marginBottom: 15,
  },
  detail: {
    fontFamily: "AvertaRegular",
    fontSize: 14,
    marginBottom: 3,
  },
  amount: {
    fontFamily: "Averta",
    fontSize: 14,
    alignSelf: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    fontFamily: "Averta",
    fontSize: 30,
  },
  icon: {
    marginTop: 5,
  },
});
