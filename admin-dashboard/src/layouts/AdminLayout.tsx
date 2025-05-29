import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Avatar, Space, Dropdown, Badge, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  AppstoreOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import authService from '../api/authService';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const user = authService.getCurrentUser();
  const userRole = localStorage.getItem('role') || 'STAFF'; // Mặc định là STAFF nếu không có role
  
  // Kiểm tra lại xác thực khi component mount hoặc location thay đổi
  useEffect(() => {
    const checkAuth = () => {
      const auth = authService.isAuthenticated();
      setIsAuthenticated(auth);
      if (!auth) {
        navigate('/login');
      }
    };
    
    checkAuth();
    
    // Lắng nghe sự kiện storage để kiểm tra khi đăng xuất từ tab khác
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate, location]);
  
  // Nếu không có xác thực, chuyển hướng về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Định nghĩa tất cả menu items có thể có
  const allMenuItems: Record<string, MenuItem> = {
    dashboard: {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan'
    },
    employees: {
      key: 'employees',
      icon: <TeamOutlined />,
      label: 'Nhân viên'
    },
    customers: {
      key: 'customers',
      icon: <UserOutlined />,
      label: 'Khách hàng'
    },
    orders: {
      key: 'option-order',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn hàng'
    },
    products: {
      key: 'products',
      icon: <InboxOutlined />,
      label: 'Sản phẩm'
    },
    categories: {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: 'Danh mục sản phẩm'
    },
    vouchers: {
      key: 'vouchers',
      icon: <GiftOutlined />,
      label: 'Voucher'
    }
  };

  // Tạo menu items dựa trên role
  const menuItems: MenuItem[] = (() => {
    switch (userRole) {
      case 'ADMIN':
        // Admin có quyền truy cập tất cả
        return Object.values(allMenuItems);
        
      case 'MANAGER':
        // Manager có quyền truy cập mọi thứ trừ một số tính năng quản lý nhân viên
        return [
          allMenuItems.dashboard,
          allMenuItems.employees, 
          allMenuItems.customers,
          allMenuItems.orders,
          allMenuItems.products,
          allMenuItems.categories,
          allMenuItems.vouchers
        ];
        
      case 'STAFF':
        return [allMenuItems.orders];
        
      default:
        // Mặc định hiển thị một số menu cơ bản
        return [allMenuItems.dashboard, allMenuItems.orders];
    }
  })();

  const userMenuItems: MenuItem[] = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />
    },
    {
      key: 'settings',
      label: 'Cài đặt',
      icon: <SettingOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true
    }
  ];

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      authService.logout();
      setIsAuthenticated(false);
      window.dispatchEvent(new Event('storage'));
      navigate('/login');
    } else {
      navigate(`/${key}`);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: token.colorBgContainer,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ 
          padding: '16px',
          textAlign: 'center',
          borderBottom: `1px solid ${token.colorBorder}`,
          marginBottom: '8px'
        }}>
          <Title level={collapsed ? 4 : 3} style={{ margin: 0, color: token.colorPrimary }}>
            {collapsed ? 'K' : 'KAT'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ border: 'none' }}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 24px',
          background: token.colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />

          <Space size="large">
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} shape="circle" />
            </Badge>
            
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => handleMenuClick(key)
              }}
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ display: 'inline-block', marginLeft: 8 }}>
                  {user?.fullname || user?.fullName || 'Người dùng'}
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ 
          margin: '24px',
          padding: 24,
          background: token.colorBgContainer,
          borderRadius: token.borderRadius,
          minHeight: 280
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
