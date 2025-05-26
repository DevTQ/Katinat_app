import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { User } from '../api/userService';

interface ExportOptions {
  fileName?: string;
  sheetName?: string;
}

export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
) => {
  const {
    fileName = 'exported-data',
    sheetName = 'Sheet1'
  } = options;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
  // Save file
  FileSaver.saveAs(fileData, `${fileName}.xlsx`);
};

export const exportUsers = (users: User[], options: ExportOptions = {}) => {
  // Transform users to flatten data for export
  const exportData = users.map(user => ({
    'ID': user.id,
    'Họ': user.firstName,
    'Tên': user.lastName,
    'Họ tên': user.fullName,
    'Email': user.email || '',
    'Số điện thoại': user.phoneNumber || '',
    'Vai trò': mapRoleToVietnamese(user.role),
    'Vị trí': mapPositionToVietnamese(user.position),
    'Trạng thái': user.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa',
    'Ngày tạo': new Date(user.createdAt).toLocaleDateString('vi-VN'),
    'Lần đăng nhập cuối': user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : '',
  }));

  const { fileName = 'danh-sach-nguoi-dung', ...restOptions } = options;
  
  exportToExcel(exportData, { fileName, ...restOptions });
};

// Helper functions
const mapRoleToVietnamese = (role: string): string => {
  switch (role) {
    case 'admin': return 'Quản trị viên';
    case 'manager': return 'Quản lý';
    case 'staff': return 'Nhân viên';
    default: return role;
  }
};

const mapPositionToVietnamese = (position?: string): string => {
  if (!position) return '';
  
  switch (position) {
    case 'cashier': return 'Thu ngân';
    case 'barista': return 'Pha chế';
    case 'server': return 'Phục vụ';
    case 'shift_manager': return 'Quản lý ca';
    default: return position;
  }
}; 