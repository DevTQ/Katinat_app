import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { AntDesign, Entypo, Fontisto } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import { OrderHistoryDTO } from '../../dtos/orderHistoryDTO';
import { OrderHistoryService } from '../../services/orderHistory';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const OrderHistoryScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [orders, setOrders] = useState<OrderHistoryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Lưu đánh giá từng đơn hàng (orderId -> rating)
  const [ratings, setRatings] = useState<{ [orderId: string]: number }>({});

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        const data = await OrderHistoryService.getOrderHistoryByUser(String(user.id));
        setOrders(data);
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử đặt hàng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);

  const handleRating = (orderId: string, rating: number) => {
  setRatings(prev => ({
    ...prev,
    [orderId]: rating,
  }));

  if (rating <= 3) {
    Alert.alert("Cảm ơn bạn!", "Cảm ơn bạn đã đánh giá, chúng tôi sẽ cải thiện thêm.");
  } else {
    Alert.alert("Cảm ơn bạn!", `Bạn đã đánh giá ${rating} sao cho đơn hàng.`);
  }
  }

  const renderOrderItem = ({ item }: { item: OrderHistoryDTO }) => {
    // Xác định màu status đơn hàng
    let statusStyle = styles.statusDefault;
    if (item.status.includes('hoàn tất')) {
      statusStyle = styles.statusSuccess;
    } else if (item.status.includes('hủy')) {
      statusStyle = styles.statusFailed;
    } else if (item.status.includes('giao hàng') || item.status.includes('sẵn sàng')) {
      statusStyle = styles.statusPending;
    }

    const currentRating = ratings[item.id] || 0;

    return (
      <View style={styles.orderCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          {
            item.orderType.toLowerCase().includes("cửa hàng") ? (
              <Entypo name="shop" size={16} color="#333" style={{ marginRight: 6 }} />
            ) : (
              <Fontisto name="motorcycle" size={16} color="#333" style={{ marginRight: 6 }} />
            )
          }
          <Text style={{ fontWeight: '500', color: '#333' }}>{item.orderType}</Text>
        </View>

        <Text style={styles.storeName}>{item.storeName}</Text>

        <View style={styles.infoRow}>
          <View style={{ flex: 1 }}>
            <Text style={{ marginVertical: 2 }}>
              {(item.amount)}đ ({item.paymentMethod}) - {item.itemCount} món
            </Text>
            <Text style={{ color: '#555' }}>{item.time}</Text>
          </View>

          <TouchableOpacity style={styles.reorderBtn} onPress={() => navigation.navigate("Order")}>
            <Text style={styles.reorderText}>Đặt lại</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.status, statusStyle]}>
          {item.status}
        </Text>

        {/* Đánh giá 5 sao */}
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleRating(item.id, star)}
              activeOpacity={0.7}
            >
              <AntDesign
                name="star"
                size={24}
                color={star <= currentRating ? "#ffd700" : "#ccc"}
                style={{ marginRight: 6 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={22} color="black" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerText}>Đánh giá đơn hàng</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#d2b48c" />
        ) : orders.length === 0 ? (
          <>
            <Text style={styles.message}>Bạn chưa có đơn hàng nào hoạt động</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Order")}>
              <Text style={styles.buttonText}>MUA NGAY</Text>
            </TouchableOpacity>
          </>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderOrderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#d2b48c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  statusSuccess: {
    color: 'green',
  },
  statusFailed: {
    color: 'red',
  },
  statusPending: {
    color: 'orange',
  },
  statusDefault: {
    color: '#555',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  reorderBtn: {
    backgroundColor: '#eeddcc',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 10,
  },
  reorderText: {
    fontSize: 14,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
});

export default OrderHistoryScreen;
