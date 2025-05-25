import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";

const vouchers = {
  usable: [
    {
      id: '1',
      type: 'product',
      title: 'ƯU ĐÃI 30K CHO HÓA ĐƠN TỪ 250K',
      description: 'Áp dụng cho tất cả sản phẩm',
      expiry: 'HSD: 30/06/2025 21:30',
    },
    {
      id: '2',
      type: 'product',
      title: 'ƯU ĐÃI 50K CHO HÓA ĐƠN TỪ 350K',
      description: 'Áp dụng cho tất cả sản phẩm',
      expiry: 'HSD: 30/06/2025 21:30',
    },
    {
      id: '3',
      type: 'shipping',
      title: 'FREESHIP',
      description: 'Cho hóa đơn từ 150K',
    },
  ],
  unusable: [],
};

export default function VoucherScreen() {
  const [tab, setTab] = useState('usable');
  const [selected, setSelected] = useState(null);
  const [inputCode, setInputCode] = useState('');
const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const renderVoucher = ({ item }) => (
    
    <View style={styles.voucherCard}>
        
      <View style={[styles.voucherLeft, { backgroundColor: item.type === 'product' ? '#85B343' : '#1F3C5C' }]}>
        <Text style={styles.voucherTypeText}>
          {item.type === 'product' ? '"Kung" ƯU ĐÃI' : '"Free" SHIP'}
        </Text>
      </View>
      <View style={styles.voucherRight}>
        <Text style={styles.voucherTitle}>{item.title}</Text>
        <Text style={styles.voucherDescription}>{item.description}</Text>
        {item.expiry && <Text style={styles.voucherExpiry}>{item.expiry}</Text>}
        <TouchableOpacity
          style={styles.chooseButton}
          onPress={() => setSelected(item.id)}
        >
          <Text style={styles.chooseText}>Chọn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      
      <Text style={styles.emptyText}>Bạn chưa có ưu đãi nào</Text>
      <TouchableOpacity style={styles.exchangeButton}>
        <Text style={styles.exchangeText}>Đổi ưu đãi ngay</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={22} color="black" />

        </TouchableOpacity>
      <Text style={styles.header}>Ưu đãi của bạn</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nhập mã ưu đãi..."
          value={inputCode}
          onChangeText={setInputCode}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'usable' && styles.tabActive]}
          onPress={() => setTab('usable')}
        >
          <Text style={[styles.tabText, tab === 'usable' && styles.tabTextActive]}>Khả dụng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'unusable' && styles.tabActive]}
          onPress={() => setTab('unusable')}
        >
          <Text style={[styles.tabText, tab === 'unusable' && styles.tabTextActive]}>Không khả dụng</Text>
        </TouchableOpacity>
      </View>

      {vouchers[tab].length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={vouchers[tab]}
          keyExtractor={(item) => item.id}
          renderItem={renderVoucher}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyText}>Áp dụng</Text>
      </TouchableOpacity>
    </View>
  );
}
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
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchButton: {
    backgroundColor: '#073642',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  searchIcon: {
    color: '#fff',
    fontSize: 16,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#003B4A',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  voucherCard: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 16,
    overflow: 'hidden',
  },
  voucherLeft: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  voucherTypeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  voucherRight: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  voucherTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  voucherDescription: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  voucherExpiry: {
    fontSize: 12,
    color: '#B22222',
    marginBottom: 4,
  },
  chooseButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#D2B48C',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  chooseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  applyButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#D2B48C',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 80,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#888',
  },
  exchangeButton: {
    backgroundColor: '#D2B48C',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  exchangeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
