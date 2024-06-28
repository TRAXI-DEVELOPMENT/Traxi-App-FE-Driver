import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ImageBackground,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { getTripDriver, getTripDetail } from "@/api/Trip/Trip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trip, TripDetail } from "@/types/Trip";
import {
  formatCurrency,
  formatTime,
  roundToFirstDecimal,
} from "@/utils/format";

export default function History() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState<TripDetail | null>(null);
  const [rides, setRides] = useState<Trip[]>([]);
  const [rideDetails, setRideDetails] = useState<{ [key: string]: TripDetail }>(
    {}
  );

  useEffect(() => {
    const fetchTripHistory = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("USER_INFO");
        const driverInfo = userInfo ? JSON.parse(userInfo) : null;
        const driverId = driverInfo?.id;

        const data = await getTripDriver(driverId);
        if (data && data.result) {
          setRides(data.result);

          const details = await Promise.all(
            data.result.map(async (ride: Trip) => {
              const detailData = await getTripDetail(ride.Id);
              return { [ride.Id]: detailData.result };
            })
          );

          const detailsObject = details.reduce(
            (acc, detail) => ({ ...acc, ...detail }),
            {}
          );
          setRideDetails(detailsObject);
        }
      } catch (error) {
        console.error("Error fetching trip history:", error);
      }
    };

    fetchTripHistory();
  }, []);

  const handleCardPress = (ride: Trip) => {
    setSelectedRide(rideDetails[ride.Id]);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/bg_register.png")}
        style={styles.bgContainer}
      >
        <Text style={styles.header}>Lịch sử chuyến</Text>
        {rides.length > 0 ? (
          rides.map((ride) => (
            <TouchableOpacity
              key={ride.Id}
              style={styles.card}
              onPress={() => handleCardPress(ride)}
            >
              <View style={styles.cardContent}>
                {rideDetails[ride.Id]?.TripDetail?.Vehicle?.ImgURL && (
                  <View style={styles.vehicleContainer}>
                    <Image
                      source={{
                        uri:
                          rideDetails[ride.Id]?.TripDetail?.Vehicle?.ImgURL ||
                          "https://img.upanh.tv/2024/03/09/vecteezy_car-icon-car-icon-vector-car-icon-simple-sign_5576332.jpg",
                      }}
                      style={styles.vehicleImage}
                    />
                    <Text style={styles.vehicleMode}>
                      {rideDetails[ride.Id]?.TripDetail?.Vehicle?.Mode || "N/A"}
                    </Text>
                  </View>
                )}
                <View style={styles.cardText}>
                  <Text style={styles.bookingDate}>
                    {formatTime(ride.BookingDate)}
                  </Text>
                  <Text style={styles.price} numberOfLines={1} ellipsizeMode="tail">
                    {rideDetails[ride.Id]
                      ? formatCurrency(
                          rideDetails[ride.Id].TripDetail.TotalPrice
                        )
                      : "N/A"}
                  </Text>
                </View>
                <Text style={styles.status}>{ride.Status}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Không có lịch sử chuyến đi</Text>
        )}

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
                <Text style={styles.modalText}>Thông tin chuyến đi</Text>
                <View style={styles.detailRoad}>
                  <Text style={styles.detail}>
                    <Ionicons name="location" size={13} color="red" />
                    {`${selectedRide.TripDetail.StartLocation}`}
                  </Text>
                  <Text style={styles.detail}>
                    <FontAwesome name="location-arrow" size={13} color="blue" />
                    {`${selectedRide.TripDetail.EndLocation}`}
                  </Text>
                </View>
                <Text style={styles.detail}>
                  <Ionicons name="alarm" size={14} color="black" />
                  {`Lộ trình: ${roundToFirstDecimal(
                    selectedRide.TripDetail.Distance
                  )} km`}
                </Text>
                <View style={styles.detailTime}>
                  <Text style={styles.detail}>
                    <Ionicons
                      name="time"
                      size={13}
                      color="black"
                      style={styles.icon}
                    />
                    {`Bắt đầu:  ${formatTime(
                      selectedRide.TripDetail.StartTime
                    )}`}
                  </Text>
                  <Text style={styles.detail}>
                    {`Kết thúc: ${formatTime(selectedRide.TripDetail.EndTime)}`}
                  </Text>
                </View>
                <Text
                  style={styles.amount}
                >{`Tổng thu khách hàng: ${formatCurrency(
                  selectedRide.TripDetail.TotalPrice
                )}`}</Text>
                <Text
                  style={styles.amount}
                >{`Phương thức thanh toán: Tiền mặt`}</Text>
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
    backgroundColor: "#f0f4f7",
  },
  bgContainer: {
    backgroundColor: "#f0f4f7",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  vehicleContainer: {
    alignItems: "center",
  },
  vehicleImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  vehicleMode: {
    marginTop: 5,
    fontSize: 12,
    color: "#555",
  },
  cardText: {
    marginLeft: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingDate: {
    fontFamily: "Averta",
    fontSize: 14,
    alignSelf: "flex-start",
    color: "#555",
  },
  price: {
    fontFamily: "Averta",
    fontSize: 14,
    color: "#555",
    flexShrink: 1,
    textAlign: "right",
  },
  status: {
    fontFamily: "Averta",
    fontSize: 14,
    marginBottom: 3,
    alignSelf: "flex-end",
    color: "#555",
  },
  detailRoad: {
    marginTop: 10,
    marginBottom: 15,
  },
  detailTime: {
    marginTop: 10,
    marginBottom: 15,
  },
  detail: {
    fontFamily: "AvertaRegular",
    fontSize: 14,
    marginBottom: 3,
    color: "#555",
  },
  amount: {
    fontFamily: "Averta",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-end",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
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
    fontSize: 26,
    color: "#333",
  },
  icon: {
    marginTop: 5,
  },
});
