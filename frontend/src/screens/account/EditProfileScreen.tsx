import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Platform, Alert, ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { userService } from '../../services/userService';

const EditProfileScreen = () => {
  // Lấy thông tin người dùng từ Redux store  
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [name, setName] = useState(currentUser?.fullname || '');
  const phone = currentUser?.phone_number || '';
  const [gender, setGender] = useState(currentUser?.gender || '');
  const [birthDate, setBirthDate] = useState(new Date(currentUser?.birth_date || Date.now()));
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [selectedCity, setSelectedCity] = useState(currentUser?.city || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const cities = [
    "An Giang", "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cần Thơ",
    "Cao Bằng",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "TP. Hồ Chí Minh",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái"
  ];

  const formatDate = (date) => {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityPicker(false);
  };

  const isFormValid = name.trim() !== '' && selectedCity !== '' && gender !== '' && birthDate;


  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return;
    }

    if (!selectedCity) {
      Alert.alert('Lỗi', 'Vui lòng chọn tỉnh/thành');
      return;
    }

    try {
      setIsLoading(true);

      await userService.updateProfile({
        fullname: name,
        gender: gender,
      });

      Alert.alert('Thành công', 'Cập nhật thông tin thành công');
      navigation.goBack();
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Lỗi', 'Cập nhật thông tin thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={22} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Chỉnh sửa trang cá nhân</Text>

      {/* Số điện thoại */}
      <Text style={styles.label}>Số điện thoại *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#777" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={phone}
          keyboardType="phone-pad"
          editable={false}
        />

      </View>

      {/* Họ tên */}
      <Text style={styles.label}>Họ và tên *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#777" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập họ và tên"
        />
      </View>

      {/* Giới tính */}
      <Text style={styles.label}>Giới tính *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(value) => setGender(value)}
          style={styles.picker}
        >
          <Picker.Item label="Nam" value="Nam" />
          <Picker.Item label="Nữ" value="Nữ" />
          <Picker.Item label="Khác" value="Khác" />
        </Picker>
      </View>

      {/* Ngày sinh */}
      <Text style={styles.label}>Ngày sinh *</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={20} color="#777" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={formatDate(birthDate)}
          editable={false}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()} // Không cho chọn ngày trong tương lai
        />
      )}

      {/* Tỉnh thành */}
      <Text style={styles.label}>Tỉnh thành *</Text>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowCityPicker(true)}
      >
        <Ionicons name="location-outline" size={20} color="#777" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={selectedCity}
          placeholder="Chọn tỉnh/thành"
          placeholderTextColor="#a9a9a9"
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {/* Modal chọn tỉnh thành */}
      <Modal
        visible={showCityPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCityPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={cities}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => handleCitySelect(item)}
                >
                  <Text style={styles.cityText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>

      {/* Cập nhật */}
      <TouchableOpacity
        style={[
          styles.updateButton,
          isFormValid && !isLoading && styles.updateButtonActive
        ]}
        onPress={handleUpdateProfile}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[
            styles.updateButtonText,
            isFormValid && !isLoading && styles.updateButtonTextActive
          ]}>Cập nhật</Text>
        )}
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 4,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingLeft: 10,
    fontSize: 14,

  },
  inputIcon: {
    marginRight: 8,
  },
  updateButtonActive: {
    backgroundColor: '#bb946b', // hoặc màu chủ đạo của bạn
  },
  updateButtonTextActive: {
    color: '#fff',
  },
  checkIcon: {
    marginLeft: 8,
  },
  calendarIcon: {
    marginLeft: 10,
  },
  verifyText: {
    fontSize: 12,
    color: '#0080ff',
    marginBottom: 10,
  },
  pickerContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    height: 40, // Thêm chiều cao cố định
    justifyContent: 'center', // Căn giữa theo chiều dọc
  },
  picker: {
    width: '100%', // Chiếm toàn bộ chiều rộng
  },
  updateButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  deleteText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  cityItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cityText: {
    fontSize: 16,
  }
});
export default EditProfileScreen;
