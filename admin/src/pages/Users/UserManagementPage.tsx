import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Drawer,
  message,
  Popconfirm,
  Typography,
  Select,
  Badge,
  Form,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UserOutlined,
  CheckCircleOutlined,
  StopOutlined,
  DownloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';
import userService, { User, UserRole, CreateUserRequest, UpdateUserRequest } from '../../api/userService';
import UserForm from '../../components/Users/UserForm';
import authService from '../../api/authService';
import { exportUsers } from '../../utils/exportService';
import UserStatistics from '../../components/Users/UserStatistics';
import PermissionGuard from '../../components/Permission/PermissionGuard';

const { Title } = Typography;
const { Option } = Select;

interface TableParams {
  pagination: TablePaginationConfig;
  filters: Record<string, FilterValue | null>;
}

interface AdvancedFilters {
  isActive?: boolean;
  position?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {},
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});

  const currentUser = authService.getCurrentUser();
  const currentUserRole = currentUser?.role as UserRole || 'staff';

  useEffect(() => {
    fetchUsers();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize, searchQuery, roleFilter, advancedFilters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Prepare additional filters
      const additionalFilters: Record<string, any> = {};
      
      if (advancedFilters.isActive !== undefined) {
        additionalFilters.isActive = advancedFilters.isActive;
      }
      
      if (advancedFilters.position) {
        additionalFilters.position = advancedFilters.position;
      }
      
      if (advancedFilters.lastLoginFrom || advancedFilters.lastLoginTo) {
        additionalFilters.lastLoginRange = {
          from: advancedFilters.lastLoginFrom,
          to: advancedFilters.lastLoginTo
        };
      }
      
      const response = await userService.getAll({
        page: tableParams.pagination.current as number - 1,
        limit: tableParams.pagination.pageSize,
        query: searchQuery,
        role: roleFilter,
        ...additionalFilters
      });
      
      setUsers(response.users);
      setTotalUsers(response.total);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.total,
        },
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      ...tableParams,
      pagination,
    });
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormVisible(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormVisible(true);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userService.delete(id);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Không thể xóa người dùng');
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await userService.toggleStatus(id, !isActive);
      message.success(`${isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} tài khoản thành công`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      message.error(`Không thể ${isActive ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản`);
    }
  };

  const handleSubmitForm = async (values: CreateUserRequest) => {
    try {
      if (editingUser) {
        // Update existing user
        const { id } = editingUser;
        const updateData: UpdateUserRequest = {
          id,
          ...values,
        };
        await userService.update(id, updateData);
        message.success('Cập nhật người dùng thành công');
      } else {
        // Create new user
        await userService.create(values);
        message.success('Thêm người dùng mới thành công');
      }
      setFormVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      message.error('Không thể lưu thông tin người dùng');
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!resetPasswordUserId) return;
    
    try {
      await userService.resetPassword({
        userId: resetPasswordUserId,
        newPassword,
      });
      message.success('Đặt lại mật khẩu thành công');
      setResetPasswordVisible(false);
    } catch (error) {
      console.error('Error resetting password:', error);
      message.error('Không thể đặt lại mật khẩu');
    }
  };

  const openResetPasswordModal = (userId: string) => {
    setResetPasswordUserId(userId);
    setResetPasswordVisible(true);
  };

  // Role label with colors
  const getRoleTag = (role: string) => {
    switch (role) {
      case 'admin':
        return <Tag color="red">Admin</Tag>;
      case 'manager':
        return <Tag color="blue">Quản lý</Tag>;
      case 'staff':
        return <Tag color="green">Nhân viên</Tag>;
      default:
        return <Tag>{role}</Tag>;
    }
  };

  const mapUserToFormValues = (user: User | null): Partial<CreateUserRequest & { id?: string }> | undefined => {
    if (!user) return undefined;
    
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || undefined,
      phoneNumber: user.phoneNumber || undefined,
      role: user.role,
      position: user.position
    };
  };

  // Define table columns
  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_: any, record: User) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {record.fullName}
        </span>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => getRoleTag(role),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string | null) => email || '-',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phone: string | null) => phone || '-',
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      render: (position: string | undefined) => position || '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        isActive 
          ? <Badge status="success" text="Đang hoạt động" /> 
          : <Badge status="error" text="Đã vô hiệu" />
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: User) => {
        // Only allow admins to edit/delete other admins
        const canEdit = currentUserRole === 'admin' || record.role !== 'admin';
        const canDelete = currentUserRole === 'admin' && record.id !== currentUser?.id;
        const canToggle = currentUserRole === 'admin' && record.id !== currentUser?.id;
        
        return (
          <Space size="small">
            <PermissionGuard permissionCode="user.edit" fallback={null}>
              {canEdit && (
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditUser(record)}
                  title="Chỉnh sửa"
                />
              )}
            </PermissionGuard>
            
            <PermissionGuard permissionCode="user.reset_password" fallback={null}>
              {canEdit && (
                <Button
                  type="text"
                  icon={<LockOutlined />}
                  onClick={() => openResetPasswordModal(record.id)}
                  title="Đặt lại mật khẩu"
                />
              )}
            </PermissionGuard>
            
            <PermissionGuard permissionCode="user.toggle_status" fallback={null}>
              {canToggle && (
                <Button
                  type="text"
                  danger={record.isActive}
                  icon={record.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
                  onClick={() => handleToggleStatus(record.id, record.isActive)}
                  title={record.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                />
              )}
            </PermissionGuard>
            
            <PermissionGuard permissionCode="user.delete" fallback={null}>
              {canDelete && (
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa người dùng này?"
                  onConfirm={() => handleDeleteUser(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    title="Xóa"
                  />
                </Popconfirm>
              )}
            </PermissionGuard>
          </Space>
        );
      },
    },
  ];

  // Add export function
  const handleExportUsers = async () => {
    setLoading(true);
    try {
      // Get all users for export
      const response = await userService.getAll({
        limit: 1000, // Large limit to get all users, can be adjusted
        role: roleFilter,
        query: searchQuery
      });
      
      if (response.users.length === 0) {
        message.info('Không có dữ liệu người dùng để xuất');
        return;
      }
      
      exportUsers(response.users, { 
        fileName: `danh-sach-nguoi-dung-${new Date().toISOString().split('T')[0]}`
      });
      
      message.success('Xuất dữ liệu thành công');
    } catch (error) {
      console.error('Error exporting users:', error);
      message.error('Không thể xuất dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedFiltersChange = (filters: AdvancedFilters) => {
    setAdvancedFilters(filters);
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setRoleFilter(undefined);
    setAdvancedFilters({});
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  // Advanced filter component
  const renderAdvancedFilters = () => {
    return (
      <Card 
        size="small" 
        title="Bộ lọc nâng cao" 
        style={{ marginBottom: 16, display: showAdvancedFilters ? 'block' : 'none' }}
        extra={<Button size="small" onClick={() => resetFilters()}>Xóa bộ lọc</Button>}
      >
        <Form layout="vertical" initialValues={advancedFilters}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Trạng thái">
                <Select
                  placeholder="Chọn trạng thái"
                  value={advancedFilters.isActive}
                  onChange={(value) => handleAdvancedFiltersChange({ ...advancedFilters, isActive: value })}
                  allowClear
                >
                  <Option value={true}>Đang hoạt động</Option>
                  <Option value={false}>Đã vô hiệu</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Vị trí">
                <Select
                  placeholder="Chọn vị trí"
                  value={advancedFilters.position}
                  onChange={(value) => handleAdvancedFiltersChange({ ...advancedFilters, position: value })}
                  allowClear
                >
                  <Option value="cashier">Thu ngân</Option>
                  <Option value="barista">Pha chế</Option>
                  <Option value="server">Phục vụ</Option>
                  <Option value="shift_manager">Quản lý ca</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Đăng nhập từ">
                <Input
                  type="date"
                  value={advancedFilters.lastLoginFrom}
                  onChange={(e) => handleAdvancedFiltersChange({ ...advancedFilters, lastLoginFrom: e.target.value })}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Đăng nhập đến">
                <Input
                  type="date"
                  value={advancedFilters.lastLoginTo}
                  onChange={(e) => handleAdvancedFiltersChange({ ...advancedFilters, lastLoginTo: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={3}>Quản lý người dùng</Title>
          
          <Space>
            {(currentUserRole === 'admin' || currentUserRole === 'manager') && (
              <>
                <PermissionGuard permissionCode="user.export">
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={handleExportUsers}
                  >
                    Xuất Excel
                  </Button>
                </PermissionGuard>
                
                <PermissionGuard permissionCode="user.create">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddUser}
                  >
                    Thêm người dùng
                  </Button>
                </PermissionGuard>
              </>
            )}
          </Space>
        </div>

        {/* User statistics */}
        <UserStatistics users={users} loading={loading} />
        
        <div style={{ marginTop: 24, marginBottom: 16 }}>
          <Typography.Text strong>Tìm kiếm và lọc</Typography.Text>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
          
          <Select
            placeholder="Lọc theo vai trò"
            style={{ width: 150 }}
            value={roleFilter}
            onChange={setRoleFilter}
            allowClear
          >
            <Option value="admin">Admin</Option>
            <Option value="manager">Quản lý</Option>
            <Option value="staff">Nhân viên</Option>
          </Select>
          
          <Button 
            icon={<FilterOutlined />} 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            type={showAdvancedFilters ? "primary" : "default"}
          >
            Lọc nâng cao
          </Button>
        </div>

        {/* Advanced filters */}
        {renderAdvancedFilters()}

        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            ...tableParams.pagination,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* User Form Modal */}
      <Drawer
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        width={600}
        open={formVisible}
        onClose={() => setFormVisible(false)}
        destroyOnClose
        maskClosable={false}
        footer={null}
      >
        <UserForm
          onSubmit={handleSubmitForm}
          onCancel={() => setFormVisible(false)}
          initialValues={mapUserToFormValues(editingUser)}
          currentUserRole={currentUserRole}
        />
      </Drawer>

      {/* Reset Password Modal */}
      <Modal
        title="Đặt lại mật khẩu"
        open={resetPasswordVisible}
        onCancel={() => setResetPasswordVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={(values: { password: string }) => handleResetPassword(values.password)}
        >
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementPage; 