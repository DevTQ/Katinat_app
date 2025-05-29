import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';

interface PermissionGuardProps {
  /**
   * Mã quyền cần kiểm tra
   */
  permissionCode?: string;
  
  /**
   * Danh sách mã quyền - chỉ cần có một quyền là đủ
   */
  anyPermission?: string[];
  
  /**
   * Component con được hiển thị nếu người dùng có quyền
   */
  children: React.ReactNode;
  
  /**
   * Component thay thế được hiển thị nếu người dùng không có quyền
   */
  fallback?: React.ReactNode;
}

/**
 * Component bảo vệ nội dung dựa trên quyền của người dùng
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permissionCode,
  anyPermission,
  children,
  fallback = null,
}) => {
  const { hasPermission, hasAnyPermission, isLoading } = usePermissions();
  
  // Đợi cho đến khi tải xong thông tin quyền
  if (isLoading) {
    return null;
  }
  
  // Kiểm tra quyền đơn lẻ
  if (permissionCode && hasPermission(permissionCode)) {
    return <>{children}</>;
  }
  
  // Kiểm tra danh sách quyền
  if (anyPermission && anyPermission.length > 0 && hasAnyPermission(anyPermission)) {
    return <>{children}</>;
  }
  
  // Không có quyền, hiển thị fallback
  if (!permissionCode && !anyPermission) {
    // Nếu không chỉ định quyền nào, luôn hiển thị children
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default PermissionGuard; 