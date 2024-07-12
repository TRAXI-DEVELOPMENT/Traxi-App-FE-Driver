import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import BeforeTripModal from "./TripModal/BeforeTripModal";
import AfterTripModal from "./TripModal/AfterTripModal";
import GuideModal from "./TripModal/GuideModal";

interface MenuProps {
  toggleMenu: () => void;
  openModal: (type: string) => void;
  menuVisible: boolean;
  modalType: string;
  closeModal: () => void;
}

const Menu: React.FC<MenuProps> = ({
  toggleMenu,
  openModal,
  menuVisible,
  modalType,
  closeModal,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </TouchableOpacity>
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => openModal("before")}>
            <View style={styles.menuItem}>
              <Fontisto name="car" size={20} color="black" />
              <Text style={styles.menuItemText}>
                Tình trạng trước khi lên xe
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openModal("after")}>
            <View style={styles.menuItem}>
              <Ionicons name="checkmark-done" size={20} color="black" />
              <Text style={styles.menuItemText}>
                Tình trạng sau khi hoàn tất
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openModal("guide")}>
            <View style={styles.menuItem}>
              <Ionicons name="document-text" size={20} color="black" />
              <Text style={styles.menuItemText}>
                Hướng dẫn tải lên tài liệu
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {modalType === "before" && (
        <BeforeTripModal visible={true} onClose={closeModal} />
      )}
      {modalType === "after" && (
        <AfterTripModal visible={true} onClose={closeModal} />
      )}
      {modalType === "guide" && (
        <GuideModal visible={true} onClose={closeModal} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    right: 10,
    zIndex: 10,
  },
  menuButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  menu: {
    position: "absolute",
    top: 40,
    right: 25,
    backgroundColor: "white",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    minWidth: 250,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  menuItemText: {
    marginLeft: 10,
    fontFamily: "Averta",
  },
});

export default Menu;
