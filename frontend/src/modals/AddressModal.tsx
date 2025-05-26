import React, { useEffect, useState } from 'react';
import { 
  View, Text, Modal, TextInput, TouchableOpacity, 
  FlatList, StyleSheet, Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from 'src/navigators/MainNavigator';

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAddress: (address: {
    id: string;
    label: string;
    isDefault: boolean;
    name: string;
    phone: string;
    address: string;
  }) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ visible, onClose, onSelectAddress }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string>('Đang lấy địa chỉ...');
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: '1',
      label: 'Nhà riêng',
      isDefault: true,
      name: 'Phạm Hồng Quân',
      phone: '0379753108',
      address: '35-37 Phố P. Hồng Mai, Phường Quỳnh Lôi, Quận Hai Bà Trưng, TP. Hà Nội',
    },
    {
      id: '2',
      label: 'Văn phòng',
      isDefault: false,
      name: 'Hoàng Văn Tới',
      phone: '0355452305',
      address: 'Xã Lợi Bác, Huyện Lộc Bình, Tỉnh Lạng Sơn',
    },
  ]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <AntDesign name="arrowleft" size={22} color="#104358" />
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.headerText}>Nhập địa chỉ</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nhập địa chỉ tìm kiếm"
          />

          <Text style={[styles.headerText, { marginLeft: 15, marginVertical: 10 }]}>Từ bản đồ</Text>
          <TouchableOpacity style={styles.optionButton}>
            <Icon name="my-location" size={30} color="#104358" />
            <Text style={styles.optionText}>Địa chỉ của bạn</Text>
          </TouchableOpacity>
          {address ? (
            <Text style={{ marginLeft: 20, marginTop: 5, color: '#104358', fontSize: 16 }}>
              {address}
            </Text>
          ) : null}

          <TouchableOpacity style={styles.optionButton}>
            <Icon name="map" size={30} color="#104358" />
            <Text style={styles.optionText}>Chọn trên bản đồ</Text>
            <Icon name="chevron-right" size={30} color="#104358" />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Địa chỉ đã lưu</Text>
          <FlatList
            data={savedAddresses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelectAddress(item)}>
                <View style={styles.addressItem}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.addressLabels}>
                      <Icon name="home" size={30} color="#104358" />
                      <Text style={styles.labelText}>{item.label}</Text>
                      {item.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>Mặc định</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ marginLeft: 35 }}>
                      <Text style={styles.dataText}>{item.name}</Text>
                      <Text style={styles.dataText}>{item.phone}</Text>
                      <Text style={styles.dataText}>{item.address}</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#B0B0B0', marginTop: 10 }} />
                  </View>
                  <TouchableOpacity>
                    <Icon name="edit" size={25} color="#104358" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={() => (
              <TouchableOpacity
                onPress={() => navigation.navigate("NewAddressModal")}
                style={styles.addButton}>
                <Icon name="add" size={30} color="#104358" />
                <Text style={styles.addButtonText}>Thêm địa chỉ mới</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: '90%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    padding: 15,
    borderColor: '#DCDCDC'
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    color: "#104358",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#104358',
    marginVertical: 5,
    marginLeft: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    width: '90%',
    marginHorizontal: 15,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E8E8E8',
    borderRadius: 15,
    marginVertical: 8,
    padding: 15,
    width: '90%',
    marginHorizontal: 15,
  },
  optionText: {
    fontSize: 20,
    flex: 1,
    fontWeight: '500',
    color: '#104358'
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginVertical: 10,
  },
  addressLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  labelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#104358',
    marginRight: 5,
  },
  defaultBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    paddingHorizontal: 5,
    padding: 8,
  },
  defaultText: {
    fontSize: 15,
    color: '#104358',
    fontWeight: '500',
  },
  dataText: {
    fontSize: 16,
    color: '#104358',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 15,
    marginLeft: 25,
  },
  addButtonText: {
    fontSize: 20,
    color: '#104358',
    fontWeight: '500',
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
});

export default AddressModal;
