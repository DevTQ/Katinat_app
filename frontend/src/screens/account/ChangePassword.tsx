import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import { userService } from 'src/services/userService';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const isDisabled =
    !oldPassword ||
    !newPassword ||
    !confirmPassword ||
    newPassword !== confirmPassword ||
    newPassword.length < 6 ||
    loading;

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,

      });
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Đổi mật khẩu</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Old Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu hiện tại</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showOldPassword}
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowOldPassword(!showOldPassword)}
              >
                <Ionicons
                  name={showOldPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu mới</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {newPassword.length > 0 && (
              <View style={styles.passwordStrength}>
                <View style={[
                  styles.strengthBar,
                  {
                    width: `${Math.min((newPassword.length / 10) * 100, 100)}%`,
                    backgroundColor: newPassword.length < 6 ? '#ff5252' :
                      newPassword.length < 8 ? '#ffb142' : '#4cd137'
                  }
                ]} />
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <Text style={styles.errorText}>Mật khẩu không khớp</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={isDisabled}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đổi mật khẩu</Text>
            )}
          </TouchableOpacity>


        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginTop: Platform.OS === 'ios' ? 0 : 30, // Adjust for Android status bar

  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#333',
    paddingVertical: 14,
  },
  eyeIcon: {
    padding: 8,
  },
  passwordStrength: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#ff5252',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#bb946b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#4267B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#d3c4b2',
    shadowOpacity: 0,
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePassword;
