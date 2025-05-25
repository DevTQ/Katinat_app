import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";


const App = () => {
  const referralCode = 'AFF0343785';
  const referralLink = 'https://share.katinat.vn/Affiliate/Ka';
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const handleShare = async () => {
    // Xử lý chia sẻ (có thể sử dụng Share API của React Native)
    const message = `Mã giới thiệu: ${referralCode}\nLiên kết: ${referralLink}`;
    try {
      await Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${referralLink}&quote=${message}`);
    } catch (error) {
      console.error('Lỗi khi chia sẻ:', error);
    }
  };

  return (
    <View style={styles.container}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={22} color="black" />

        </TouchableOpacity>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Giới thiệu bạn bè</Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>1</Text>
          <Text style={styles.instructionText}>
            Chia sẻ mã giới thiệu hoặc Liên kết cho bạn bè
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>2</Text>
          <Text style={styles.instructionText}>
            Mời bạn bè tải ứng dụng và đăng ký tài khoản
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>3</Text>
          <Text style={styles.instructionText}>
            Tận hưởng ưu đãi tại mục "Ưu đãi của bạn" {'\n'}
            (Chương trình được áp dụng với trường hợp giới thiệu thành công lần đầu tiên)
          </Text>
        </View>
      </View>

      {/* Referral Code and Link */}
      <View style={styles.referralSection}>
        <Text style={styles.sectionTitle}>Mã giới thiệu</Text>
        <View style={styles.referralCodeContainer}>
          <Text style={styles.referralCode}>{referralCode}</Text>
          {/* Placeholder cho biểu tượng sao chép */}
          <View style={styles.copyIcon}>
            <Text style={styles.placeholderText}>[Copy]</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Liên kết</Text>
        <View style={styles.referralLinkContainer}>
          <Text style={styles.referralLink}>{referralLink}</Text>
          {/* Placeholder cho biểu tượng sao chép */}
          <View style={styles.copyIcon}>
            <Text style={styles.placeholderText}>[Copy]</Text>
          </View>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>Khác (Instagram, Zalo, ...)</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Note */}
      <Text style={styles.note}>
        Bạn đã có mã giới thiệu từ lời mời của bạn bè
      </Text>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>
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
  instructions: {
    padding: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  instructionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4A90E2',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 16,
    marginRight: 10,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  referralSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  referralCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  referralLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  referralLink: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  copyIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 14,
    marginHorizontal: 10,
  },
  note: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#A9B6C2',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;