import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "@/types/Types";
import { formatCurrency } from "@/utils/format";
import { router } from "expo-router";

type TripCompletionRouteProp = RouteProp<RootStackParamList, "TripCompletion">;

const TripCompletion = () => {
  const route = useRoute<TripCompletionRouteProp>();
  const { tripResult } = route.params;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  if (!tripResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không có dữ liệu chuyến đi.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hoàn thành 🎉</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Thông tin chuyến đi</Text>
        <View style={styles.infoRow}>
          <MaterialIcons
            name="my-location"
            size={20}
            color="#ff6347"
            style={styles.icon}
          />
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Khởi hành</Text>
            <Text style={styles.value}>
              {truncateText(tripResult.StartLocation, 30)}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Icon
            name="map-marker"
            size={20}
            color="#4CAF50"
            style={styles.icon}
          />
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Điểm đến</Text>
            <Text style={styles.value}>
              {truncateText(tripResult.EndLocation, 30)}
            </Text>
          </View>
        </View>

        <View style={[styles.infoRow, styles.distance]}>
          <Text style={styles.distanceText}>
            {tripResult.Distance.toFixed(2)} km
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Icon name="calendar" size={20} color="#FFC107" style={styles.icon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Ngày hoàn thành chuyến</Text>
            <Text style={styles.value}>
              {new Date(tripResult.EndTime).toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Icon
            name="credit-card"
            size={20}
            color="#FF5722"
            style={styles.icon}
          />
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Phương thức thanh toán</Text>
            <Text style={styles.value}>Tiền mặt</Text>
          </View>
        </View>

        <View style={styles.payment}>
          <Text style={styles.paymentValue}>
            {formatCurrency(tripResult.TotalPrice)}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
          <Text style={styles.buttonText}>Trở Về</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.historyButton]}
          onPress={() => router.push("/history")}
        >
          <Text style={styles.buttonText}>Lịch Sử Cuốc</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "Averta",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Averta",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    width: 30,
    textAlign: "center",
  },
  infoTextContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  distance: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  distanceText: {
    fontSize: 18,
    fontFamily: "Averta",
  },
  divider: {
    borderBottomColor: "#d3d3d3",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  payment: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
  },

  paymentValue: {
    fontSize: 18,
    fontFamily: "Averta",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    backgroundColor: "#000",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  historyButton: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TripCompletion;