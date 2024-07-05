import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { StyleSheet, View, Dimensions, Alert } from "react-native";
import * as Location from "expo-location";
import haversine from "haversine"; // Import thư viện để tính khoảng cách
import { getPosition } from "@/api/Trip/Position";
import { Position } from "@/types/Position";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MainScreen() {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [origin, setOrigin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }

        const loc = await Location.getCurrentPositionAsync();
        console.log(loc);
        setLocation(loc.coords);

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            1000
          ); // thời gian animation là 1000ms
        }

        // Gọi API để lấy vị trí
        const position: Position = await getPosition(
          "088E34AB-12BE-49F4-A14F-AB8BBBA82984"
        );
        console.log(JSON.stringify(position)); // Log dữ liệu dưới dạng chuỗi

        // Kiểm tra dữ liệu trả về từ API
        if (position && position.originLatLng) {
          // Lấy originLatLng từ API trả về và set state
          const [originLat, originLng] = position.originLatLng
            .replace("latitude: ", "")
            .replace("longitude: ", "")
            .split(", ")
            .map((coord) => parseFloat(coord.split(": ")[1]));
          setOrigin({ latitude: originLat, longitude: originLng });

          // Tính khoảng cách
          const distance = haversine(
            { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
            { latitude: originLat, longitude: originLng }
          );
          console.log(`Distance: ${distance} km`);
        } else {
          console.error("Invalid position data from API");
        }
      } catch (error) {
        Alert.alert(
          "An error occurred while trying to get location",
          (error as any).message
        );
        console.log(error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Current Location"
            description="You are here"
          />
        )}
        {origin && (
          <>
            <Marker
              coordinate={origin}
              title="Origin Location"
              description="Origin from API"
            />
            <Polyline
              coordinates={[
                {
                  latitude: location?.latitude || 0,
                  longitude: location?.longitude || 0,
                },
                origin,
              ]}
              strokeColor="#000"
              strokeWidth={3}
            />
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
