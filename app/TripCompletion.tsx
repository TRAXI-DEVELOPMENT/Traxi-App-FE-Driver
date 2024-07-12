import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  TripCompletion: { tripResult: any };
};

type TripCompletionRouteProp = RouteProp<RootStackParamList, 'TripCompletion'>;

const TripCompletion = () => {
  const route = useRoute<TripCompletionRouteProp>();
  const { tripResult } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chuyến đi hoàn thành</Text>
      <View style={styles.infoContainer}>
        <Image source={{ uri: tripResult.ImageUrl }} style={styles.image} />
        <Text style={styles.name}>{tripResult.FullName}</Text>
        <Text style={styles.phone}>{tripResult.Phone}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Điểm đón:</Text>
        <Text style={styles.value}>{tripResult.StartLocation}</Text>
        <Text style={styles.label}>Điểm đến:</Text>
        <Text style={styles.value}>{tripResult.EndLocation}</Text>
        <Text style={styles.label}>Khoảng cách:</Text>
        <Text style={styles.value}>{tripResult.Distance.toFixed(2)} km</Text>
        <Text style={styles.label}>Tổng giá:</Text>
        <Text style={styles.value}>{tripResult.TotalPrice.toFixed(2)} VND</Text>
        <Text style={styles.label}>Thời gian bắt đầu:</Text>
        <Text style={styles.value}>
          {new Date(tripResult.StartTime).toLocaleString()}
        </Text>
        <Text style={styles.label}>Thời gian kết thúc:</Text>
        <Text style={styles.value}>
          {new Date(tripResult.EndTime).toLocaleString()}
        </Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 16,
    color: "gray",
  },
  detailContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
});

export default TripCompletion;