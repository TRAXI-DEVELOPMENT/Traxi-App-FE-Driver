import React from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.2;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_LAT = 10.7948;
const INITIAL_LNG = 106.722;
const INITIAL_POSITION = {
  latitude: INITIAL_LAT,
  longitude: INITIAL_LNG,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
      />
      <View style={styles.searchBox}>
        <Text style={styles.searchBoxField}>Search Box</Text>
        <TextInput />
        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonLable}>Search</Text>
        </TouchableOpacity>
      </View>
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
  searchBox: {
    position: "absolute",
    width: "90%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    backgroundColor: "#fff",
   alignSelf: "center",
   marginTop: 60
  },
  searchBoxField: {

  },
  buttonContainer: {

  },
  buttonLable: {

  },
});
