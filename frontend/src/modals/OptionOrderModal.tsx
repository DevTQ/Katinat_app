import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const options = [
  { key: "pickup", label: 'Đến lấy' },
  { key: 'delivery', label: 'Giao hàng' },
];
const DeliveryMethodModal = ({ visible, onClose, selected, onSelect}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Icon name="arrowleft" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Hình thức giao hàng</Text>
            <View style={styles.headerPlaceholder} />
          </View>
          <Text style={styles.optionOrderText}>Chọn loại đơn hàng</Text>
          <FlatList
            data={options}
            keyExtractor={item => item.key}
            renderItem={({ item }) => {
              const isSelected = item.key === selected;
              return (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => onSelect(item.key)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                  <View style={isSelected ? styles.radioOuter : styles.radioOuterUnselected}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
    height: '60%'
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
    justifyContent: 'center',
    alignItems: 'center',
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
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  optionText: {
    fontSize: 16,
    color: '#004C56',
    fontWeight: '500'
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#004C56',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#004C56',
  },
  radioOuterUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  optionOrderText: {
    color: '#104358',
    fontSize: 17,
    fontWeight: '500',
    paddingHorizontal: 24,
    marginTop: 20,
  }
});

export default DeliveryMethodModal;
