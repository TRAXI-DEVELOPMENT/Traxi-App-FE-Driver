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
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { getTripDriver, getTripDetail } from "@/api/Trip/Trip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trip, TripDetails } from "@/types/Trip";
import {
  formatCurrency,
  formatTime,
  roundToFirstDecimal,
} from "@/utils/format";

export default function History() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState<TripDetails | null>(null);
  const [rides, setRides] = useState<Trip[]>([]);
  const [rideDetails, setRideDetails] = useState<{
    [key: string]: TripDetails;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripHistory();
  }, []);

  const handleCardPress = (ride: Trip) => {
    setSelectedRide(rideDetails[ride.Id]);
    setModalVisible(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#12aae2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ImageBackground
          source={require("../../assets/images/bg_register.png")}
          style={styles.bgContainer}
        >
          <Text style={styles.header}>Lịch sử cuốc</Text>
          {rides.length > 0 ? (
            rides.map((ride, index) => (
              <TouchableOpacity
                key={ride.Id}
                style={styles.card}
                onPress={() => handleCardPress(ride)}
              >
                <View style={styles.cardContent}>
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
                  <View style={styles.cardText}>
                    <Text style={styles.bookingDate}>
                      {formatTime(ride.BookingDate)}
                    </Text>
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.price}>
                      {rideDetails[ride.Id]
                        ? formatCurrency(
                            rideDetails[ride.Id].TripDetail.TotalPrice
                          )
                        : "N/A"}
                    </Text>
                    <Text
                      style={[
                        styles.status,
                        {
                          color:
                            ride.Status === "Driving"
                              ? "orange"
                              : ride.Status === "Finished"
                              ? "green"
                              : "#555",
                        },
                      ]}
                    >
                      {ride.Status === "Driving"
                        ? "Đang di chuyển"
                        : ride.Status === "Finished"
                        ? "Hoàn thành"
                        : ride.Status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Chưa có cuốc xe nào</Text>
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
                  <View style={styles.detailRoadContainer}>
                    <View style={styles.detailRoad}>
                      <Ionicons
                        name="location"
                        size={20}
                        color="#FF6347"
                        style={styles.icon}
                      />
                      <View style={styles.detailTextContainerColumn}>
                        <Text style={styles.headTextColumn}>Khởi hành:</Text>
                        <Text
                          style={styles.detailTextColumn}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {selectedRide.TripDetail.StartLocation}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.detailRoad}>
                      <FontAwesome
                        name="location-arrow"
                        size={20}
                        color="#1E90FF"
                        style={styles.icon}
                      />
                      <View style={styles.detailTextContainerColumn}>
                        <Text style={styles.headTextColumn}>Điểm đến:</Text>
                        <Text
                          style={styles.detailTextColumn}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {selectedRide.TripDetail.EndLocation}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRoad}>
                      <FontAwesome
                        name="road"
                        size={20}
                        color="#32CD32"
                        style={styles.icon}
                      />
                      <View style={styles.detailTextContainerRow}>
                        <Text style={styles.headTextRow}>Lộ trình:</Text>
                        <Text
                          style={styles.detailTextRow}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >{`${roundToFirstDecimal(
                          selectedRide.TripDetail.Distance
                        )} km`}</Text>
                      </View>
                    </View>
                    <View style={styles.detailRoad}>
                      <Ionicons
                        name="time"
                        size={20}
                        color="black"
                        style={styles.icon}
                      />
                      <View style={styles.detailTextContainerRow}>
                        <Text style={styles.headTextRow}>Thời gian:</Text>
                        <Text
                          style={styles.detailTextRow}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {formatTime(selectedRide.TripDetail.StartTime)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountTitleBold}>Tổng thu:</Text>
                    <Text style={styles.amountValueBold}>
                      {formatCurrency(selectedRide.TripDetail.TotalPrice)}
                    </Text>
                  </View>
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountTitle}>Thanh toán:</Text>
                    <Text style={styles.amountValue}>Tiền mặt</Text>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
  },
  vehicleContainer: {
    flexDirection: "column",
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
    flex: 1,
    flexDirection: "column",
  },
  bookingDate: {
    fontFamily: "Averta",
    fontSize: 14,
    marginBottom: 60,
    color: "#555",
    alignSelf: "flex-end",
  },
  price: {
    fontFamily: "Averta",
    fontSize: 14,
    color: "#555",
    marginTop: 3,
    marginBottom: 40,
    alignSelf: "flex-end",
  },
  status: {
    fontSize: 14,
    fontFamily: "Averta",
    marginBottom: 3,
    alignSelf: "flex-end",
    color: "#555",
  },
  detailRoadContainer: {
    marginVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    width: "100%",
  },
  detailRoad: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderStyle: "dashed",
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  detailTextContainerColumn: {
    flex: 1,
    flexDirection: "column",
  },
  headTextColumn: {
    fontFamily: "Averta",
    fontSize: 14,
    color: "#333",
  },
  detailTextColumn: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  detailTextContainerRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  headTextRow: {
    fontFamily: "Averta",
    fontSize: 14,
    color: "#333",
  },
  detailTextRow: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    textAlign: "right",
  },
  detailTime: {
    marginTop: 10,
    marginBottom: 15,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
  },
  amountTitleBold: {
    fontFamily: "Averta",
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  amountValueBold: {
    fontFamily: "Averta",
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    textAlign: "right",
    flex: 1,
  },
  amountTitle: {
    fontFamily: "Averta",
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  amountValue: {
    fontFamily: "Averta",
    fontSize: 14,
    color: "#555",
    textAlign: "right",
    flex: 1,
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
});
