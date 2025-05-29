import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
  Animated
} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AppBar, IconFunct } from "../../components/orders";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import productService from "src/services/productService";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";

const OrderScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const route = useRoute<RouteProp<RootStackParams, "Order">>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const CartProducts = useSelector((state: RootState) => state.cart.CartArr);
  const totalCartQuantity = CartProducts.reduce((sum, item) => sum + item.quantity, 0);
  const selectedVoucher = useSelector((state: RootState) => state.voucher.selectedVoucher);
  const justAppliedVoucher = route.params?.justAppliedVoucher;

  // 1. Lấy products (full list hoặc phân trang tuỳ backend)
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        // Build params object
        const params: any = { page: 0, limit: 99 };
        if (selectedCategory === "bestseller") params.bestSeller = true;
        else if (selectedCategory === "tryfood") params.tryFood = true;

        const res = await productService.getProducts(params);
        setProducts(res.data.products ?? res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selectedCategory]);

  // 2. Group theo categoryName
  const sections = useMemo(() => {
    const map: Record<string, any[]> = {};
    products.forEach(p => {
      map[p.categoryName] = map[p.categoryName] || [];
      map[p.categoryName].push(p);
    });
    return Object.entries(map).map(([title, data]) => ({ title, data }));
  }, [products]);

  const displayedSections = useMemo(() => {
    if (selectedCategory === "all") return sections;

    if (selectedCategory === "bestseller" || selectedCategory === "tryfood") {
      return sections;
    }

    // Trường hợp lọc theo 1 categoryName cụ thể
    return sections.filter(s => s.title === selectedCategory);
  }, [sections, selectedCategory]);

  const handleCartPress = () => {
    if (CartProducts.length === 0) {
      navigation.navigate("CartEmpty");
    } else {
      navigation.navigate("CartDetail");
    }
  };


  // 4. Render 1 card
  const renderCard = (item: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("productDetail", { productId: item.productId })}
      activeOpacity={1}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      <View style={styles.bottomCard}>
        <Text style={styles.price}>
          {Number(item.price).toFixed(3).replace(/\./g, ",")}đ
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log(`Thêm ${item.name}`)}
        >
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setToastVisible(false);
    });
  };

  useEffect(() => {
    if (justAppliedVoucher && selectedVoucher) {
      showToast(`Đã áp dụng mã ưu đãi này cho đơn hàng của bạn`);
      navigation.setParams?.({ justAppliedVoucher: undefined });
    } else if (justAppliedVoucher) {
      showToast("Đã áp dụng mã ưu đãi này cho đơn hàng của bạn");
      navigation.setParams?.({ justAppliedVoucher: undefined });
    }
  }, [justAppliedVoucher, selectedVoucher]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>KATINAT</Text>
          <Text style={styles.subTitle}>COFFEE & TEA HOUSE</Text>
        </View>

        <View style={styles.body}>

          <TouchableOpacity style={styles.input} activeOpacity={1} onPress={() => navigation.navigate("SearchScreen")}>
            <Image source={require('../../../assets/images/icons/icon-find.png')} style={styles.find} />
            <Text style={styles.searchText}>Katies muốn tìm gì?</Text>
          </TouchableOpacity>
          {/* Filter buttons */}
          <View style={styles.btnFunct}>
            <TouchableOpacity onPress={() => setSelectedCategory("all")}>
              <Text style={[styles.textBtn, selectedCategory === "all" && styles.activeBtn]}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedCategory("bestseller")}>
              <Text style={[styles.textBtn, selectedCategory === "bestseller" && styles.activeBtn]}>Best Seller</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedCategory("tryfood")}>
              <Text style={[styles.textBtn, selectedCategory === "tryfood" && styles.activeBtn]}>Món ngon phải thử</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.lineRow} />

          <View style={{ flex: 1, flexDirection: "row" }}>
            {/* Left sidebar icons */}
            <ScrollView style={styles.leftSection}
              showsVerticalScrollIndicator={false}
            >
              <IconFunct />
            </ScrollView>
            <View style={styles.lineCol} />

            {/* Products */}
            <View style={styles.rightSection}>
              {loading ? (
                <ActivityIndicator size="large" color="#104358" />
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {displayedSections.map(section => (
                    <View key={section.title} style={styles.sectionContainer}>
                      <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
                      <FlatList
                        data={section.data}
                        numColumns={2}
                        keyExtractor={item => item.productId.toString()}
                        columnWrapperStyle={styles.row}
                        renderItem={({ item }) => renderCard(item)}
                        scrollEnabled={false}
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>

          {/* Cart Button */}

          <TouchableOpacity style={styles.cart} activeOpacity={1}
            onPress={handleCartPress}>
            <Image
              source={require("../../../assets/images/icon-cart.png")}
              style={styles.iconCart}
            />
            {totalCartQuantity > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCartQuantity}</Text>
              </View>
            )}
          </TouchableOpacity>

        </View>
        {!searchFocused && <AppBar />}
        
        {toastVisible && (
          <Animated.View 
            style={[
              styles.toast, 
              { opacity: fadeAnim }
            ]}
          >
            <AntDesign name="checkcircle" size={22} color="#104358" style={styles.toastIcon} />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </Animated.View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#104358",
    padding: 25,
    alignItems: "center",
  },
  title: { fontSize: 35, color: "#fff", fontWeight: "bold" },
  subTitle: { fontSize: 10, color: "#fff" },
  body: { flex: 1 },
  btnFunct: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  textBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#ededed",
    color: "#c1cacc",
    fontWeight: "500",
  },
  activeBtn: {
    backgroundColor: "#104358",
    color: "#fff",
  },
  lineRow: {
    height: 1,
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
  leftSection: { width: "10%" },
  rightSection: { width: "85%", paddingHorizontal: 8 },
  lineCol: {
    width: 1,
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
  sectionContainer: { marginTop: 16 },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'burlywood',
    marginHorizontal: 8,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    width: 155,
    height: 280,
    backgroundColor: "#DCDCDC",
    borderRadius: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
  image: { width: "100%", height: 185, borderRadius: 5 },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 6,
    color: "#104358",
  },
  bottomCard: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontSize: 16, fontWeight: "500", color: "#104358" },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#104358",
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { fontSize: 18, fontWeight: "bold", color: "#104358" },
  cart: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#104358",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCart: { width: 25, height: 25 },
  searchText: { color: '#104358', },
  input: {
    flexDirection: 'row',      // hiển thị icon và text trên cùng hàng
    alignItems: 'center',      // căn giữa theo chiều dọc
    borderRadius: 15,
    borderColor: '#104358',
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 20,
    height: 45,
    paddingHorizontal: 20,
  },
  cartBadge: {
    position: 'absolute',
    right: 4,
    top: 8,
    backgroundColor: '#B7935F',
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'black',
    fontSize: 9,
    fontWeight: 'bold',
    padding: 0.5,
  },
  find: {
    width: 23,
    height: 23,
    marginRight: 15
  },
  toast: {
    position: 'absolute',
    bottom: 85,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastIcon: {
    marginRight: 5
  },
  toastText: {
    color: '#104358',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
    letterSpacing: -0.1
  }
});

export default OrderScreen;
