import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Button,
} from "react-native";
import { TripDetails, TripItem } from "@/types/Trip";
import { getDetailTrip } from "@/api/Trip/Trip";
import { getCustomerInfo } from "@/api/Customer/Customer";
import { CustomerInfo } from "@/types/Customer";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  formatCurrency,
  formatTime,
  roundToFirstDecimal,
} from "@/utils/format";

interface TripCardProps {
  item: TripItem;
}

const TripCard: React.FC<TripCardProps> = ({ item }) => {
  const [tripDetails, setTripDetails] = useState<TripDetails>();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>();

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const details = await getDetailTrip(item.trip.Id);
        setTripDetails(details);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchTripDetails();
  }, [item.trip.Id]);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        if (tripDetails) {
          const info = await getCustomerInfo(tripDetails.CustomerId);
          setCustomerInfo(info);
        }
      } catch (error) {
        console.error("Error fetching customer info:", error);
      }
    };

    if (tripDetails) {
      fetchCustomerInfo();
    }
  }, [tripDetails]);

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: tripDetails?.TripDetail.Vehicle?.ImgURL }}
        style={styles.vehicleImage}
      />
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>
          {tripDetails?.TripDetail.Vehicle?.Mode}
        </Text>
        <Text style={styles.price}>
          {formatCurrency(tripDetails?.TripDetail.TotalPrice || 0)}
        </Text>
      </View>

      <View style={styles.ownerInfo}>
        <Image
          source={{ uri: customerInfo?.ImageURL }}
          style={styles.ownerAvatar}
        />
        <View>
          <Text style={styles.ownerName}>{customerInfo?.FulllName}</Text>
          <Text style={styles.ownerPhone}>{customerInfo?.Phone}</Text>
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
              {tripDetails?.TripDetail.StartLocation}
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
              {tripDetails?.TripDetail.EndLocation}
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
              tripDetails?.TripDetail.Distance || 0
            )} km`}</Text>
          </View>
        </View>

        <View style={styles.detailRoad}>
          <Ionicons name="time" size={20} color="black" style={styles.icon} />
          <View style={styles.detailTextContainerRow}>
            <Text style={styles.headTextRow}>Thời gian:</Text>
            <Text
              style={styles.detailTextRow}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatTime(tripDetails?.TripDetail.StartTime || "N/A")}
            </Text>
          </View>
        </View>
      </View>

      <Button
        title="Nhận cuốc"
        onPress={() => {
          /* handle accept trip */
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height - 170,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  vehicleImage: {
    width: "100%",
    height: 200,
  },
  vehicleInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#4C9FED",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ownerPhone: {
    fontSize: 14,
    color: "gray",
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
});

export default TripCard;
