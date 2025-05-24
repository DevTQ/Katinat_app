import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from "react-native";
import axiosClient from "src/services/axiosClient";
import * as Location from 'expo-location';
import AntDesign from "@expo/vector-icons/AntDesign";
import IconStore from "../../assets/images/icon-stores.jpeg";

const StoresModal = ({ visible, onClose, onSelectStore }) => {
  const [stores, setStores] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    };
    getLocation();
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axiosClient.get("/stores", {
          params: { page: 0, limit: 10 },
        });
        let storeData = response.data.stores;

        if (location) {
          storeData = storeData.map((store) => {
            const distance = calculateDistance(
              location.coords.latitude, location.coords.longitude,
              store.latitude, store.longitude
            );
            return { ...store, distance: distance.toFixed(2) + " km" };
          });

          storeData.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        }

        setStores(storeData);
      } catch (error) {
        console.error("Lỗi khi lấy cửa hàng:", error);
      }
    };
    fetchStores();
  }, [location]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredStores = stores.filter((store) =>
    store.storeName.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.storeItem}
      onPress={() => {
        onSelectStore(item);
      }}
    >
        <Image source={IconStore} style={{ width: 50, height: 50 }} />
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{item.storeName}</Text>
        <Text style={styles.storeAddress}>{item.storeAddress}</Text>
        {item.distance && <Text style={styles.distance}>Cách đây {item.distance}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <View style={{padding: 20}}>
                <Text style={styles.titleText}>Chọn cửa hàng giao đến bạn</Text>
            </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm cửa hàng..."
            value={searchText}
            onChangeText={handleSearch}
          />
          <FlatList
            data={filteredStores}
            keyExtractor={(item, index) => item.store_id ? item.store_id.toString() : index.toString()}
            renderItem={renderItem}
          />
        </View>
      </View>
    </Modal>
  );
};

export default StoresModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: 'flex-end',
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 25,
    height: 50,
    marginBottom: 10,
  },
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingLeft: 15,
  },
  storeInfo: {
    marginLeft: 20,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#104358'
  },
  storeAddress: {
    fontSize: 15,
    color: "#104358",
    flexWrap: 'wrap',
    width: 300
  },
  distance: {
    fontSize: 14,
    color: "#C1AA88",
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  titleText: {fontSize: 20, fontWeight: 'bold', color: '#104358', textAlign: 'center',}
});
