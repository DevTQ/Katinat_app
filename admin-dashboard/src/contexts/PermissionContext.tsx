import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import authService from '../api/authService';
import { message } from 'antd';

interface PermissionContextType {
  // Danh sách mã quyền hiện tại của user
  permissions: string[];
  
  // Kiểm tra xem có quyền cụ thể không
  hasPermission: (permissionCode: string) => boolean;
  
  // Kiểm tra xem có ít nhất một quyền nào đó không
  hasAnyPermission: (permissionCodes: string[]) => boolean;
  
  // Kiểm tra role hiện tại
  hasRole: (role: string | string[]) => boolean;
  
  // Trạng thái loading
  isLoading: boolean;

  // Phương thức làm mới quyền
  refreshPermissions: () => void;
}

const PermissionContext = createContext<PermissionContextType>({
  permissions: [],
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasRole: () => false,
  isLoading: true,
  refreshPermissions: () => {}
});

export const usePermissions = () => useContext(PermissionContext);

export const PermissionProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [permissionCodes, setPermissionCodes] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState<string>('');
  
  // Tạo phương thức để tải permissions
  const loadPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Lấy role của người dùng
      const role = localStorage.getItem('role');
      if (role) {
        setUserRole(role);
      }
      
      // Kiểm tra cấu trúc và lấy quyền từ API response
      if (localStorage.getItem('permissions')) {
        // Nếu đã lưu permissions trong localStorage, sử dụng nó
        const permissionsStr = localStorage.getItem('permissions');
        const permissions = permissionsStr ? JSON.parse(permissionsStr) : [];
        setPermissionCodes(permissions);
      } else {
        const currentUser = authService.getCurrentUser();
        console.log('currentUser:', currentUser);
        
        if (!currentUser) {
          setPermissionCodes([]);
          return;
        }
        
        if (currentUser.permissions && Array.isArray(currentUser.permissions)) {
          // Trường hợp permissions là mảng trực tiếp
          console.log('Loaded permissions from user object (array):', currentUser.permissions);
          setPermissionCodes(currentUser.permissions);
          localStorage.setItem('permissions', JSON.stringify(currentUser.permissions));
        } else if (currentUser.permissions && typeof currentUser.permissions === 'object' && currentUser.permissions.permissions) {
          // Trường hợp permissions là object với thuộc tính permissions
          console.log('Loaded permissions from user object (object):', currentUser.permissions.permissions);
          setPermissionCodes(currentUser.permissions.permissions);
          localStorage.setItem('permissions', JSON.stringify(currentUser.permissions.permissions));
        } else {
          // Không có permissions
          console.warn('No permissions found in user object:', currentUser);
          setPermissionCodes([]);
        }
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      message.error('Không thể tải thông tin phân quyền');
      setPermissionCodes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Phương thức làm mới quyền
  const refreshPermissions = useCallback(() => {
    setAuthState(Date.now().toString());
  }, []);
  
  // Kiểm tra quyền khi component mount và khi authState thay đổi
  useEffect(() => {
    const checkAuthChanges = () => {
      const token = localStorage.getItem('accessToken');
      const permissions = localStorage.getItem('permissions');
      const role = localStorage.getItem('role');
      
      if (role) {
        setUserRole(role);
      } else {
        setUserRole('');
      }
      
      if (token && permissions) {
        loadPermissions();
      } else {
        setPermissionCodes([]);
      }
    };
    
    checkAuthChanges();
    
    // Thiết lập interval để kiểm tra sự thay đổi
    const interval = setInterval(checkAuthChanges, 5000);
    
    // Lắng nghe sự kiện storage để cập nhật khi có thay đổi (đặc biệt khi logout)
    const handleStorageChange = () => {
      checkAuthChanges();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadPermissions, authState]);
  
  useEffect(() => {
  }, [permissionCodes]);
  
  const hasPermission = useCallback((permissionCode: string): boolean => {
    return permissionCodes.includes(permissionCode);
  }, [permissionCodes]);
  
  const hasAnyPermission = useCallback((codes: string[]): boolean => {
    return codes.some(code => hasPermission(code));
  }, [hasPermission]);
  
  // Thêm hàm kiểm tra role
  const hasRole = useCallback((role: string | string[]): boolean => {
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  }, [userRole]);
  
  return (
    <PermissionContext.Provider 
      value={{ 
        permissions: permissionCodes, 
        hasPermission, 
        hasAnyPermission,
        hasRole,
        isLoading,
        refreshPermissions
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;