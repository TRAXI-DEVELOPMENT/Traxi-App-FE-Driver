import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocalSearchParams, useNavigation } from "expo-router";
import axios from "axios";
import { getPosition } from "@/api/Trip/Position";
import { Position } from "@/types/Position";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { formatTime, roundToFirstDecimal } from "@/utils/format";
import { getCustomerInfo } from "@/api/Customer/Customer"; // Import hàm getCustomerInfo
import { CustomerInfo } from "@/types/Customer";
import { completeTrip, getDetailTrip } from "@/api/Trip/Trip";
import { TripDetail } from "@/types/Trip";
import Menu from "@/components/Menu";
import BeforeTripModal from "@/components/TripModal/BeforeTripModal";
import AfterTripModal from "@/components/TripModal/AfterTripModal";
import { RootStackParamList } from "@/types/Types";
import { StackNavigationProp } from "@react-navigation/native";

interface LatLng {
  latitude: number;
  longitude: number;
}

type DriverTripNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DriverTrip"
>;

const DriverTrip = () => {
  const { tripData } = useLocalSearchParams();
  const trip = JSON.parse(tripData as string);
  const [originLatLng, setOriginLatLng] = useState<LatLng | null>(null);
  const [destinationLatLng, setDestinationLatLng] = useState<LatLng | null>(
    null
  );
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<TripDetail["Vehicle"] | null>(
    null
  );

  const navigation = useNavigation<DriverTripNavigationProp>();

  const [modalType, setModalType] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const openModal = (type: string) => {
    setModalType(type);
    setMenuVisible(false);
  };

  const closeModal = () => {
    setModalType("");
  };

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const position: Position = await getPosition(trip.TripId);
        console.log("originLatLng not parse", position.originLatLng);
        console.log("destinationLatLng not parse", position.destinationLatLng);
        setOriginLatLng(parseLatLng(position.originLatLng));
        setDestinationLatLng(parseLatLng(position.destinationLatLng));
      } catch (error) {
        console.error("Error fetching position:", error);
      }
    };

    fetchPosition();
  }, [trip.TripId]);

  const parseLatLng = (latLngStr: string): LatLng => {
    const [latitudeStr, longitudeStr] = latLngStr.split(",");
    const latitude = parseFloat(latitudeStr.split(":")[1].trim());
    const longitude = parseFloat(longitudeStr.split(":")[1].trim());
    return { latitude, longitude };
  };

  useEffect(() => {
    if (originLatLng && destinationLatLng) {
      const fetchRoute = async () => {
        const apiKey = "AIzaSyAXEFa6r6g8ZRWEfvx1bToCuWSU-U8elhw";
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLatLng.latitude},${originLatLng.longitude}&destination=${destinationLatLng.latitude},${destinationLatLng.longitude}&key=${apiKey}`;

        try {
          const response = await axios.get(url);
          const points = decode(
            response.data.routes[0].overview_polyline.points
          );
          setRouteCoordinates(points);
        } catch (error) {
          console.error(error);
        }
      };

      fetchRoute();
    }
  }, [originLatLng, destinationLatLng]);

  const decode = (t: string, e: number = 5): LatLng[] => {
    let points: LatLng[] = [];
    for (let step = 0, lat = 0, lng = 0; step < t.length; ) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(step++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(step++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const info = await getCustomerInfo(trip.CustomerId);
        setCustomerInfo(info);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
      }
    };

    fetchCustomerInfo();
  }, [trip.CustomerId]);

  useEffect(() => {
    const fetchVehicleInfo = async () => {
      try {
        const detail = await getDetailTrip(trip.TripId);
        setVehicleInfo(detail.TripDetail.Vehicle);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin xe:", error);
      }
    };

    fetchVehicleInfo();
  }, [trip.TripId]);

  const handleCompleteTrip = async () => {
    try {
      const result = await completeTrip(trip.TripId);
      if (result) {
        console.log("Chuyến đi hoàn thành:", result);
        navigation.navigate("TripCompletion", { tripResult: result });
      } else {
        console.error("Dữ liệu trả về không hợp lệ:", result);
      }
    } catch (error) {
      console.error("Lỗi khi hoàn thành chuyến đi:", error);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (!originLatLng || !destinationLatLng) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Menu
        toggleMenu={toggleMenu}
        openModal={openModal}
        menuVisible={menuVisible}
        modalType={modalType}
        closeModal={closeModal}
      />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: (originLatLng.latitude + destinationLatLng.latitude) / 2,
          longitude: (originLatLng.longitude + destinationLatLng.longitude) / 2,
          latitudeDelta:
            Math.abs(originLatLng.latitude - destinationLatLng.latitude) + 0.05,
          longitudeDelta:
            Math.abs(originLatLng.longitude - destinationLatLng.longitude) +
            0.05,
        }}
      >
        <Marker
          coordinate={originLatLng}
          title="Điểm đón"
          description={truncateText(trip.StartLocation, 30)}
        >
          <View
            style={{
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_638/v1682350380/assets/2f/29d010-64eb-47ac-b6bb-97503a838259/original/UberX-%281%29.png",
              }}
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />
          </View>
        </Marker>
        <Marker
          coordinate={destinationLatLng}
          title="Điểm đến"
          description={truncateText(trip.EndLocation, 30)}
        >
          <View
            style={{
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: "https://img.upanh.tv/2024/07/12/origin.png" }}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </View>
        </Marker>
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#2a9ce8"
            strokeWidth={6}
          />
        )}
      </MapView>
      <ScrollView style={styles.tripList}>
        <View style={styles.tripCard}>
          <View style={styles.infoContainer}>
            <View style={styles.vehicleContainer}>
              {vehicleInfo && (
                <Image
                  source={{ uri: vehicleInfo.ImgURL }}
                  style={styles.vehicleImage}
                />
              )}
              <Text style={styles.vehicleMode}>{vehicleInfo?.Mode}</Text>
            </View>

            <View style={styles.ownerInfo}>
              {customerInfo && (
                <Image
                  source={{ uri: customerInfo.ImageURL }}
                  style={styles.ownerAvatar}
                />
              )}
              <View>
                <Text style={styles.ownerName}>{customerInfo?.FulllName}</Text>

                <Text style={styles.ownerPhone}>{customerInfo?.Phone}</Text>
              </View>
            </View>
          </View>

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
                  {trip.StartLocation}
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
                  {trip.EndLocation}
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
                >{`${roundToFirstDecimal(trip.Distance || 0)} km`}</Text>
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
                  {formatTime(trip.StartTime || "N/A")}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteTrip}
        >
          <Text style={styles.completeButtonText}>Hoàn thành chuyến đi</Text>
        </TouchableOpacity>
      </ScrollView>
      {modalType === "before" && (
        <BeforeTripModal
          visible={true}
          onClose={closeModal}
          vehicleId={vehicleInfo?.Id}
          tripId={trip?.Id}
        />
      )}
      {modalType === "after" && (
        <AfterTripModal
          visible={true}
          onClose={closeModal}
          vehicleId={vehicleInfo?.Id}
          tripId={trip?.Id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  tripList: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  tripCard: {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  tripText: {
    fontSize: 16,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
  },
  vehicleContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
  },
  ownerInfo: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    top: -7,
    justifyContent: "flex-end",
    marginVertical: 8,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  ownerName: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  ownerPhone: {
    fontSize: 12,
    textAlign: "center",
    color: "gray",
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
  completeButton: {
    backgroundColor: "#36b37e",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DriverTrip;
