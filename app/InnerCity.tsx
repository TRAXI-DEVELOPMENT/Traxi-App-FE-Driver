import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  LogBox,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { getAllTripsNoDriver } from "@/api/Trip/Trip";
import { TripItem } from "@/types/Trip";
import TripCard from "@/components/TripCard";
import { useRouter } from "expo-router";

// Tắt cảnh báo
LogBox.ignoreLogs(["Warning: Encountered two children with the same key"]);

const InnerCity = () => {
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const router = useRouter();

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTripsNoDriver();
      if (data === null) {
        setTrips([]);
      } else {
        // Loại bỏ các phần tử trùng lặp dựa trên Id và kiểm tra Id hợp lệ
        const uniqueTrips = data.filter(
          (trip: TripItem, index: number, self: TripItem[]) =>
            trip.trip.Id !== undefined &&
            trip.trip.Id !== null &&
            index ===
              self.findIndex((t: TripItem) => t.trip.Id === trip.trip.Id)
        );
        setTrips(uniqueTrips);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    console.log(trips); // In ra dữ liệu trips để kiểm tra
  }, [trips]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#12aae2" />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (trips.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Hiện tại chưa có Cuốc xe nào</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={fetchTrips}>
          <Ionicons name="reload" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.buttonText}>Quay về trang chủ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSwipedAll = () => {
    setCardIndex(0);
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={trips}
        renderCard={(item, index) => (
          <TripCard key={`${item.trip.Id}-${index}`} item={item} />
        )}
        onSwiped={(index) => setCardIndex(index + 1)}
        onSwipedAll={handleSwipedAll}
        cardIndex={cardIndex}
        backgroundColor={"#4FD0E9"}
        stackSize={3}
        infinite
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  reloadButton: {
    backgroundColor: "#12aae2",
    padding: 10,
    borderRadius: 50,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12aae2",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
});

export default InnerCity;
