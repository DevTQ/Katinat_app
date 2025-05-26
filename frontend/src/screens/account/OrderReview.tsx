import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";

const App = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={22} color="black" />

        </TouchableOpacity>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Lịch sửa đặt hàng</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Illustration Placeholder */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>[Illustration]</Text>
        </View>

        {/* Message */}
        <Text style={styles.message}>
          Bạn chưa có đơn hàng nào hoạt động
        </Text>

        {/* Buy Now Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>MUA NGAY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 10,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#d2b48c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;