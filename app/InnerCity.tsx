import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Swiper from "react-native-deck-swiper";
import { getAllTripsNoDriver } from "@/api/Trip/Trip";
import { TripItem } from "@/types/Trip";
import TripCard from "@/components/TripCard";

const InnerCity = () => {
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getAllTripsNoDriver();
        setTrips(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const handleSwipedAll = () => {
    setCardIndex(0);
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={trips}
        renderCard={(item) => <TripCard item={item} />}
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
});

export default InnerCity;
