import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

type Recipient = {
  name: string;
  phone: string;
};

interface RecipientModalProps {
  visible: boolean;
  initial?: Recipient;
  onClose: () => void;
  onSubmit: (data: Recipient) => void;
}

const RecipientModal: React.FC<RecipientModalProps> = ({
  visible,
  initial,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(initial?.name || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (visible) {
      setName(initial?.name || '');
      setPhone(initial?.phone || '');
      setNameError('');
      setPhoneError('');
    }
  }, [visible, initial]);

  const handleDone = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    let valid = true;

    if (!trimmedName) {
      setNameError('Vui lòng nhập tên người nhận');
      valid = false;
    }

    if (!trimmedPhone) {
      setPhoneError('Vui lòng nhập số điện thoại');
      valid = false;
    } else if (!/^\d{10,11}$/.test(trimmedPhone)) {
      setPhoneError('Số điện thoại không hợp lệ');
      valid = false;
    }

    if (!valid) return;
    onSubmit({ name: trimmedName, phone: trimmedPhone });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.containerWrapper}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Icon name="arrowleft" size={24} color="#104358" />
              </TouchableOpacity>
              <Text style={styles.title}>Người nhận</Text>
              <View style={styles.headerPlaceholder} />
            </View>

            <View style={styles.body}>
              <Text style={styles.label}>Tên người nhận *</Text>
              <TextInput
                style={styles.input}
                placeholder="Tên người nhận"
                value={name}
                onChangeText={text => {
                  setName(text);
                  setNameError('');
                }}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

              <Text style={styles.label}>Số điện thoại *</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={text => {
                  setPhone(text);
                  setPhoneError('');
                }}
              />
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

              <TouchableOpacity style={styles.button} onPress={handleDone} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  containerWrapper: {
    width: '100%',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  backButton: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#104358',
  },
  headerPlaceholder: {
    width: 32,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  label: {
    fontSize: 17,
    fontWeight: '500',
    color: '#104358',
    marginTop: 12,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  errorText: {
    marginTop: 5,
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#b49177',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default RecipientModal;