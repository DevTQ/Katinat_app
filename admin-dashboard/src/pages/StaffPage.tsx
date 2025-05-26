import React, { useEffect, useState,  } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Form,
  Typography,
  Tag,
  Modal,
  Select,
  Divider,
  Avatar,
  Badge,
  Row,
  Col,
  Switch,
  Tooltip,
  App,
  Dropdown,
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  FilterOutlined,
  MoreOutlined,
  TeamOutlined,
  ReloadOutlined,
  ExportOutlined,
  SettingOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { usePermissions } from '../contexts/PermissionContext';
import moment from 'moment';
import type { MenuProps } from 'antd';
import staffService, { StaffUser, StaffFilters } from '../api/staffService';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const StaffPage: React.FC = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [filters, setFilters] = useState<StaffFilters>({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [passwordForm] = Form.useForm();
  const { message: antMessage, notification: antNotification } = App.useApp();
  
  // Lấy các quyền từ context
  const { hasPermission, isLoading: permissionLoading, refreshPermissions } = usePermissions();
  
  // Lấy role của người dùng hiện tại
  const userRole = localStorage.getItem('role') || '';
  
  // Làm mới quyền khi component mount
  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);
  
  // Check quyền cụ thể
  const canViewStaff = hasPermission('VIEW_STAFF') || userRole === 'ADMIN' || userRole === 'MANAGER';
  const canAddStaff = (hasPermission('CREATE_STAFF') || userRole === 'ADMIN' || userRole === 'MANAGER');
  const canEditStaff = (hasPermission('EDIT_STAFF') || userRole === 'ADMIN' || userRole === 'MANAGER');
  const canDeleteStaff = hasPermission('DELETE_STAFF') || userRole === 'ADMIN';
  const canResetPassword = hasPermission('RESET_PASSWORD') || userRole === 'ADMIN' || userRole === 'MANAGER';

  const canCreateRoleAdmin = userRole === 'ADMIN';
  const canCreateRoleManager = userRole === 'ADMIN';
  const canCreateRoleStaff = userRole === 'ADMIN' || userRole === 'MANAGER';
  
  const [selectedRole, setSelectedRole] = useState<string>('STAFF');
  
  useEffect(() => {
    if (!permissionLoading) {
      if (!canViewStaff) {
        antMessage.error('Bạn không có quyền xem danh sách nhân viên');
        return;
      }
      fetchUsers();
    }
  }, [permissionLoading, canViewStaff, currentPage, pageSize, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Chuẩn bị tham số lọc
      const apiFilters = { ...filters };
      
      // Xử lý tham số tìm kiếm
      if (apiFilters.query) {
        apiFilters.fullName = apiFilters.query;
        delete apiFilters.query;
      }
      
      // Log để debug
      console.log("Đang gửi tham số lọc:", apiFilters);
      
      // Nếu có query tìm kiếm, sử dụng searchStaffs
      if (filters.query) {
        // Chuyển đổi filters để phù hợp với API
        const searchFilters = { ...apiFilters };
        
        // Đảm bảo có roles nếu không có role được chỉ định
        if (!searchFilters.roles && !searchFilters.role) {
          searchFilters.roles = ['STAFF', 'MANAGER'];
        }
        
        const response = await staffService.searchStaffs(currentPage, pageSize, searchFilters);
        console.log("Search response:", response);
        
        processAndSetUsers(response);
      } else {
        // Sử dụng getStaffs nếu không có query tìm kiếm
        const response = await staffService.getStaffs(currentPage, pageSize, apiFilters);
        console.log("Get response:", response);
        
        processAndSetUsers(response);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      if (error.response) {
        if (error.response.status === 403) {
          antMessage.error({
            content: 'Bạn không có quyền truy cập tính năng này. Vui lòng đăng nhập lại hoặc liên hệ quản trị viên.',
            duration: 5
          });
        } else if (error.response.status === 401) {
          antMessage.error({
            content: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            duration: 5
          });
          // Có thể chuyển hướng về trang đăng nhập ở đây nếu cần
          // history.push('/login');
        } else {
          antMessage.error(`Lỗi từ server: ${error.response.status} - ${error.response.data?.message || 'Không có thông tin chi tiết'}`);
        }
      } else if (error.request) {
        // Không nhận được response từ server
        antMessage.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối của bạn hoặc thử lại sau.');
      } else {
        // Lỗi khác
        antMessage.error(`Lỗi: ${error.message || 'Không rõ lỗi'}`);
      }
      
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý và cập nhật dữ liệu người dùng
  const processAndSetUsers = (response: any) => {
    if (response && (Array.isArray(response.staff) || Array.isArray(response))) {
      // Xử lý dữ liệu trả về
      const staffArray = Array.isArray(response.staff) ? response.staff : response;
      const processedUsers = staffArray.map((user: any) => {
        // Xác định role từ cấu trúc mới hoặc cũ
        let roleValue = '';
        if (typeof user.role === 'object' && user.role && 'name' in user.role) {
          roleValue = user.role.name;
        } else if (typeof user.role === 'string') {
          roleValue = user.role;
        }
        
        return {
          ...user,
          id: user.id || user.userId || 0,
          fullname: user.fullname || user.fullName || '',
          phone_number: user.phone_number || user.phoneNumber || '',
          active: user.active !== undefined ? user.active : user.enabled || false,
          created_at: user.created_at || (user.createdAt ? 
            `${user.createdAt[0]}-${user.createdAt[1]}-${user.createdAt[2]}` : ''),
          updated_at: user.updated_at || (user.updatedAt ? 
            `${user.updatedAt[0]}-${user.updatedAt[1]}-${user.updatedAt[2]}` : ''),
          role: roleValue
        };
      });
      
      setUsers(processedUsers);
      setTotal(response.totalItems || staffArray.length || 0);
      
      if (staffArray.length === 0) {
        antMessage.info('Không tìm thấy nhân viên nào');
      }
    } else {
      antMessage.error('Dữ liệu trả về không đúng định dạng');
      setUsers([]);
      setTotal(0);
    }
  };

  const resetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setFilters({...filters, query: value});
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: string | '') => {
    if (value === '') {
      const { role, roles, ...restFilters } = filters;
      setFilters(restFilters);
    } else {
      // Khi lọc theo vai trò, sử dụng cả role và roles để đảm bảo tương thích
      setFilters({
        ...filters, 
        roles: [value],
        role: value  // Giữ lại cho tương thích ngược
      });
    }
    setCurrentPage(1);
    
    // Log để debug
    console.log("Đã chọn lọc theo vai trò:", value);
  };

  const handleStatusFilterChange = (value: boolean | undefined) => {
    if (value === undefined) {
      const { isActive, active, ...restFilters } = filters;
      setFilters(restFilters);
    } else {
      // Sử dụng tham số active thay vì isActive
      setFilters({...filters, active: value});
    }
    setCurrentPage(1);
  };

  const handleAddUser = () => {
    if (!canAddStaff) {
      antMessage.error('Bạn không có quyền thêm nhân viên');
      return;
    }
    form.resetFields();
    form.setFieldsValue({
      gender: 'Nam',
      role: 'STAFF'
    });
    setSelectedRole('STAFF');
    setEditingUser(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: StaffUser) => {
    if (!canEditStaff) {
      antMessage.error('Bạn không có quyền chỉnh sửa nhân viên');
      return;
    }
    
    setEditingUser(user);
    form.setFieldsValue({
      firstName: (user.fullname || user.fullName || '').split(' ')[0],
      lastName: (user.fullname || user.fullName || '').split(' ')[1],
      email: user.email,
      phoneNumber: user.phone_number || user.phoneNumber || '',
      role: user.role,
      gender: user.gender,
      active: user.active !== undefined ? user.active : user.enabled || false
    });
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleViewUser = (user: StaffUser) => {
    setEditingUser(user);
    form.setFieldsValue({
      firstName: (user.fullname || user.fullName || '').split(' ')[0],
      lastName: (user.fullname || user.fullName || '').split(' ')[1],
      email: user.email,
      phoneNumber: user.phone_number || user.phoneNumber || '',
      role: user.role,
      gender: user.gender,
      active: user.active !== undefined ? user.active : user.enabled || false
    });
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (!canDeleteStaff) {
      antMessage.error('Bạn không có quyền xóa nhân viên');
      return;
    }
    
    try {
      await staffService.deleteStaff(id);
      antMessage.success('Xóa nhân viên thành công');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting staff:', error);
      antMessage.error('Không thể xóa nhân viên');
    }
  };

  const handleToggleStatus = async (id: number, active: boolean) => {
    if (!canEditStaff) {
      antMessage.error('Bạn không có quyền thay đổi trạng thái nhân viên');
      return;
    }
    
    try {
      await staffService.toggleStaffStatus(id, active);
      antMessage.success(`${active ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản thành công`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling staff status:', error);
      antMessage.error(`Không thể ${active ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản`);
    }
  };

  const showResetPasswordModal = (userId: number) => {
    if (!canResetPassword) {
      antMessage.error('Bạn không có quyền đặt lại mật khẩu');
      return;
    }
    
    setSelectedUserId(userId);
    passwordForm.resetFields();
    setResetPasswordModalVisible(true);
  };

  const handleResetPassword = async () => {
    try {
      await passwordForm.validateFields();
      const newPassword = passwordForm.getFieldValue('newPassword');
      
      await staffService.resetPassword(selectedUserId, newPassword);
      setResetPasswordModalVisible(false);
      antMessage.success('Đặt lại mật khẩu thành công');
    } catch (error) {
      console.error('Error resetting password:', error);
      antMessage.error('Không thể đặt lại mật khẩu');
    }
  };

  function getRoleIdFromRole(role: string) {
    switch (role) {
      case 'ADMIN': return 2;
      case 'MANAGER': return 4;
      case 'STAFF': return 3;
      default: return 1;
    }
  }

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        const updateData = {
          fullname: `${values.firstName} ${values.lastName}`.trim(),
          phone_number: values.phoneNumber,
          email: values.email || null,
          gender: values.gender,
          role: values.role,
          active: values.active
        };
        
        try {
          await staffService.updateStaff(editingUser.id, updateData);
          antMessage.success('Cập nhật nhân viên thành công');
          setIsModalOpen(false);
          fetchUsers();
        } catch (error) {
          console.error('Error updating staff:', error);
          antMessage.error('Không thể cập nhật nhân viên');
        }
      } else {
        const { password, confirmPassword, ...rest } = values;
        const newStaff = {
          fullname: `${values.firstName} ${values.lastName}`.trim(),
          phone_number: values.phoneNumber,
          email: values.email || null,
          gender: values.gender || 'Nam',
          referralCode: '',
          password: password,
          retype_password: values.confirmPassword,
          role_id: getRoleIdFromRole(values.role)
        };
        console.log("newStaff: " + newStaff);
      
        try {
          await staffService.createStaff(newStaff);
          antNotification.success({
            message: 'Thêm nhân viên thành công',
            description: `Nhân viên ${newStaff.fullname} đã được thêm vào hệ thống.`
          });
          setIsModalOpen(false);
          fetchUsers();
        } catch (error) {
          console.error('Error creating staff:', error);
          antMessage.error('Không thể thêm nhân viên mới');
        }
      }
    } catch (error) {
      console.error('Form validation error:', error);
      antMessage.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  const getRoleColor = (role: string) => {
    switch(role.toUpperCase()) {
      case 'ADMIN': return 'red';
      case 'MANAGER': return 'blue';
      case 'STAFF': return 'green';
      default: return 'default';
    }
  };

  // Cập nhật hàm getRoleLabel để khớp với API
  const getRoleLabel = (role: string) => {
    switch(role.toUpperCase()) {
      case 'ADMIN': return 'Quản trị viên';
      case 'MANAGER': return 'Quản lý';
      case 'STAFF': return 'Nhân viên';
      default: return role;
    }
  };

  const columns: ColumnsType<StaffUser> = [
    {
      title: 'Nhân viên',
      key: 'fullName',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ backgroundColor: (record.active !== undefined ? record.active : record.enabled) ? '#1890ff' : '#ccc' }}
            className="mr-3"
          />
          <div>
            <div className="font-medium">{record.fullname || record.fullName || ''}</div>
            <Text type="secondary" className="text-xs">
              {record.role === 'STAFF' ? 'Nhân viên' : record.role === 'MANAGER' ? 'Quản lý' : 'Quản trị viên'}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div>
          {record.email && <div>{record.email}</div>}
          {(record.phone_number || record.phoneNumber) && <div>{record.phone_number || record.phoneNumber}</div>}
          {!record.email && !(record.phone_number || record.phoneNumber) && <Text type="secondary">Chưa có thông tin</Text>}
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: any) => {
        // Kiểm tra nếu role là object
        let roleValue = role;
        if (typeof role === 'object' && role && 'name' in role) {
          roleValue = role.name;
        }
        return <Tag color={getRoleColor(roleValue)}>{getRoleLabel(roleValue)}</Tag>;
      },
      filters: [
        { text: 'Quản trị viên', value: 'ADMIN' },
        { text: 'Quản lý', value: 'MANAGER' },
        { text: 'Nhân viên', value: 'STAFF' },
      ],
      onFilter: (value, record) => {
        // Kiểm tra nếu role là object
        if (typeof record.role === 'object' && record.role && 'name' in record.role) {
          return record.role.name === value;
        }
        return record.role === value;
      },
    },
    {
      title: 'Trạng thái',
      key: 'active',
      render: (_, record) => {
        const isActive = record.active !== undefined ? record.active : record.enabled || false;
        return (
          <Badge
            status={isActive ? 'success' : 'error'}
            text={isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'}
          />
        );
      },
      filters: [
        { text: 'Đang hoạt động', value: true },
        { text: 'Vô hiệu hóa', value: false },
      ],
      onFilter: (value, record) => {
        const isActive = record.active !== undefined ? record.active : record.enabled || false;
        return isActive === value;
      },
    },
    {
      title: 'Ngày tạo',
      key: 'created_at',
      render: (_, record) => {
        const date = record.created_at || (record.createdAt ? 
          `${record.createdAt[0]}-${record.createdAt[1]}-${record.createdAt[2]}` : '');
        return <span>{date ? moment(date).format('DD/MM/YYYY') : 'N/A'}</span>;
      },
      sorter: (a, b) => {
        const dateA = a.created_at || (a.createdAt ? 
          new Date(a.createdAt[0], a.createdAt[1]-1, a.createdAt[2]) : new Date(0));
        const dateB = b.created_at || (b.createdAt ? 
          new Date(b.createdAt[0], b.createdAt[1]-1, b.createdAt[2]) : new Date(0));
        return dateA instanceof Date && dateB instanceof Date ? 
          dateA.getTime() - dateB.getTime() : 0;
      },
    },
    {
      title: 'Lần đăng nhập cuối',
      key: 'updated_at',
      render: (_, record) => {
        const date = record.updated_at || (record.updatedAt ? 
          `${record.updatedAt[0]}-${record.updatedAt[1]}-${record.updatedAt[2]}` : null);
        return date ? moment(date).format('DD/MM/YYYY HH:mm') : <Text type="secondary">Chưa đăng nhập</Text>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        // Đúng type cho menu items
        const items: MenuProps['items'] = [
          {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <EyeOutlined />,
          },
        ];
        
        if (canEditStaff) {
          items.push({
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <EditOutlined />,
          });
          
          items.push({
            key: 'toggle',
            label: record.active ? 'Vô hiệu hóa' : 'Kích hoạt',
            icon: record.active ? <LockOutlined /> : <UnlockOutlined />,
          });
        }
        
        if (canResetPassword) {
          items.push({
            key: 'reset',
            label: 'Đặt lại mật khẩu',
            icon: <LockOutlined />,
          });
        }
        
        if (canDeleteStaff) {
          items.push({
            key: 'delete',
            label: 'Xóa nhân viên',
            icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
            danger: true,
          });
        }
        
        const handleMenuClick: MenuProps['onClick'] = (info) => {
          switch(info.key) {
            case 'view':
              handleViewUser(record);
              break;
            case 'edit':
              handleEditUser(record);
              break;
            case 'toggle':
              handleToggleStatus(record.id || record.userId || 0, !record.active);
              break;
            case 'reset':
              showResetPasswordModal(record.id || record.userId || 0);
              break;
            case 'delete':
              Modal.confirm({
                title: 'Xác nhận xóa nhân viên',
                content: `Bạn có chắc chắn muốn xóa ${record.fullname || record.fullName || ''}?`,
                okText: 'Xóa',
                cancelText: 'Hủy',
                okButtonProps: { danger: true },
                onOk: () => handleDeleteUser(record.id || record.userId || 0),
              });
              break;
          }
        };
        
        return (
          <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <Card
        className="mb-6 shadow-xl rounded-2xl border-0 animate-fade-in"
        style={{ background: 'linear-gradient(135deg, #f0f5ff 60%, #fff1f7 100%)', boxShadow: '0 8px 32px #1890ff22' }}
        bodyStyle={{ borderRadius: 24 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title level={2} className="mb-1 flex items-center text-blue-700 animate-fade-in-up">
              <TeamOutlined className="mr-2 text-pink-500 animate-bounce" /> Quản lý nhân viên
            </Title>
            <Text type="secondary">
              Quản lý thông tin và phân quyền cho nhân viên trong hệ thống
            </Text>
          </div>
          {canAddStaff && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
              className="rounded-xl shadow-md bg-gradient-to-r from-blue-500 to-pink-400 border-0 hover:from-pink-400 hover:to-blue-500 animate-fade-in"
              style={{ fontWeight: 600 }}
            >
              Thêm nhân viên
            </Button>
          )}
        </div>

        <Divider />
        <div className="mb-4 flex justify-between flex-wrap">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <Search
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              onSearch={handleSearch}
              style={{ width: 300, borderRadius: 16, boxShadow: '0 2px 8px #1890ff11' }}
              allowClear
              className="rounded-xl"
            />
            <Tooltip title="Lọc nâng cao">
              <Button
                icon={<FilterOutlined className="text-blue-500" />}
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                type={Object.keys(filters).length > 0 ? "primary" : "default"}
                className="rounded-xl shadow-sm"
              />
            </Tooltip>
            {Object.keys(filters).length > 0 && (
              <Button
                icon={<ReloadOutlined className="text-pink-500" />}
                onClick={resetFilters}
                className="rounded-xl shadow-sm"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip title="Xuất dữ liệu">
              <Button icon={<ExportOutlined className="text-green-500" />} className="rounded-xl shadow-sm">Xuất Excel</Button>
            </Tooltip>
            <Tooltip title="Tùy chỉnh hiển thị">
              <Button icon={<SettingOutlined className="text-blue-400" />} className="rounded-xl shadow-sm" />
            </Tooltip>
          </div>
        </div>
        {isFilterVisible && (
          <div className="bg-gradient-to-r from-blue-50 to-pink-50 p-4 rounded-xl mb-4 border border-blue-100 animate-fade-in">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label={<span><UserOutlined className="mr-1 text-blue-400" /> Vai trò</span>} className="mb-0">
                  <Select
                    placeholder="Chọn vai trò"
                    style={{ width: '100%' }}
                    allowClear
                    onChange={handleRoleFilterChange}
                    value={filters.roles ? filters.roles[0] : filters.role || undefined}
                    className="rounded-xl"
                  >
                    <Option value="ADMIN">Quản trị viên</Option>
                    <Option value="MANAGER">Quản lý</Option>
                    <Option value="STAFF">Nhân viên</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={<span><UserOutlined className="mr-1 text-green-400" /> Trạng thái</span>} className="mb-0">
                  <Select
                    placeholder="Chọn trạng thái"
                    style={{ width: '100%' }}
                    allowClear
                    onChange={(value) => handleStatusFilterChange(value === undefined ? undefined : value)}
                    value={filters.active === undefined ? undefined : filters.active}
                    className="rounded-xl"
                  >
                    <Option value={true}>Đang hoạt động</Option>
                    <Option value={false}>Vô hiệu hóa</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={<span><HomeOutlined className="mr-1 text-orange-400" /> Chức vụ</span>} className="mb-0">
                  <Input
                    placeholder="Nhập chức vụ"
                    allowClear
                    onChange={(e) => {
                      if (e.target.value) {
                        setFilters({...filters, position: e.target.value});
                      } else {
                        const { position, ...restFilters } = filters;
                        setFilters(restFilters);
                      }
                    }}
                    value={filters.position || ''}
                    className="rounded-xl"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          className="rounded-xl shadow-lg animate-fade-in-up"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} nhân viên`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            }
          }}
        />
      </Card>
      {/* Modal thêm/sửa nhân viên */}
      <Modal
        title={
          isViewMode
            ? 'Thông tin nhân viên'
            : editingUser
            ? 'Chỉnh sửa nhân viên'
            : 'Thêm nhân viên mới'
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={isViewMode ? [
          <Button key="back" onClick={() => setIsModalOpen(false)} className="rounded-xl">
            Đóng
          </Button>
        ] : [
          <Button key="back" onClick={() => setIsModalOpen(false)} className="rounded-xl">
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleFormSubmit}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-pink-400 border-0 hover:from-pink-400 hover:to-blue-500"
          >
            {editingUser ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        ]}
        width={700}
        className="rounded-2xl animate-fade-in"
      >
        <Form
          form={form}
          layout="vertical"
          disabled={isViewMode}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label={<span><UserOutlined className="mr-1 text-blue-400" /> Họ</span>}
                rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
              >
                <Input placeholder="Nhập họ" className="rounded-xl" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label={<span><UserOutlined className="mr-1 text-blue-400" /> Tên</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              >
                <Input placeholder="Nhập tên" className="rounded-xl" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            {selectedRole === 'ADMIN' && (
              <Col span={12}>
                <Form.Item
                  name="email"
                  label={<span><MailOutlined className="mr-1 text-green-400" /> Email</span>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập email cho tài khoản Admin' },
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input placeholder="Nhập email" className="rounded-xl" />
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label={<span><PhoneOutlined className="mr-1 text-pink-400" /> Số điện thoại</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' }
                ]}
              >
                <Input placeholder="Nhập số điện thoại" className="rounded-xl" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="role"
                label={<span><UserOutlined className="mr-1 text-blue-400" /> Vai trò</span>}
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
              >
                <Select
                  placeholder="Chọn vai trò"
                  onChange={(value) => setSelectedRole(value)}
                  className="rounded-xl"
                >
                  {canCreateRoleAdmin && <Option value="ADMIN">Quản trị viên</Option>}
                  {canCreateRoleManager && <Option value="MANAGER">Quản lý</Option>}
                  {canCreateRoleStaff && <Option value="STAFF">Nhân viên</Option>}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                label={<span><UserOutlined className="mr-1 text-purple-400" /> Giới tính</span>}
                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
              >
                <Select placeholder="Chọn giới tính" className="rounded-xl">
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              {editingUser && (
                <Form.Item
                  name="active"
                  label={<span><UserOutlined className="mr-1 text-green-400" /> Trạng thái</span>}
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Đang hoạt động"
                    unCheckedChildren="Vô hiệu hóa"
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          {!editingUser && (
            <>
              <Form.Item
                name="password"
                label={<span><LockOutlined className="mr-1 text-blue-400" /> Mật khẩu</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Nhập mật khẩu" className="rounded-xl" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label={<span><LockOutlined className="mr-1 text-blue-400" /> Xác nhận mật khẩu</span>}
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" className="rounded-xl" />
              </Form.Item>
            </>
          )}
        </Form>
        {isViewMode && editingUser && (
          <div className="mt-4 bg-gradient-to-br from-blue-50 via-white to-pink-50 p-4 rounded-xl shadow-lg animate-fade-in">
            <Row gutter={24} align="middle">
              <Col span={8} className="text-center">
                <Avatar
                  size={90}
                  icon={<UserOutlined style={{ fontSize: 40, transition: 'color 0.3s' }} />}
                  style={{
                    background:
                      editingUser.active
                        ? 'linear-gradient(135deg, #1890ff 60%, #52c41a 100%)'
                        : 'linear-gradient(135deg, #ccc 60%, #f5f5f5 100%)',
                    marginBottom: 16,
                    boxShadow: editingUser.active ? '0 4px 24px #1890ff33' : '0 2px 12px #ccc',
                    border: editingUser.active ? '2px solid #52c41a' : '2px solid #ccc',
                    transition: 'all 0.3s',
                  }}
                  className="shadow-lg animate-bounce"
                />
                <div style={{ marginTop: 8 }}>
                  <Tag
                    color={editingUser.active ? 'success' : 'default'}
                    style={{
                      fontSize: 16,
                      padding: '4px 20px',
                      borderRadius: 20,
                      boxShadow: editingUser.active ? '0 2px 8px #52c41a33' : undefined,
                      letterSpacing: 1,
                      fontWeight: 500,
                      transition: 'all 0.3s',
                    }}
                    icon={editingUser.active ? <UserOutlined spin /> : <UserOutlined />}
                  >
                    {editingUser.active ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                  </Tag>
                </div>
              </Col>
              <Col span={16}>
                <Row gutter={[0, 16]}>
                  <Col span={12}>
                    <div style={{ color: '#888', fontSize: 13 }}><UserOutlined className="mr-1 text-blue-400" /> Họ tên</div>
                    <div className="font-medium text-lg text-blue-700 animate-fade-in-up">{editingUser.fullname || editingUser.fullName || ''}</div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#888', fontSize: 13 }}><PhoneOutlined className="mr-1 text-pink-400" /> Số điện thoại</div>
                    <div className="text-pink-700 font-semibold animate-fade-in-up">
                      <PhoneOutlined style={{ marginRight: 6, color: '#faad14' }} />
                      {editingUser.phone_number || editingUser.phoneNumber || ''}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#888', fontSize: 13 }}><MailOutlined className="mr-1 text-green-400" /> Email</div>
                    <div className="animate-fade-in-up">
                      {editingUser.email ? (
                        <span style={{ color: '#1890ff' }}>{editingUser.email}</span>
                      ) : (
                        <Text type="secondary">Chưa có</Text>
                      )}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#888', fontSize: 13 }}><UserOutlined className="mr-1 text-purple-400" /> Giới tính</div>
                    <div className="animate-fade-in-up">
                      <Tag color={editingUser.gender === 'Nam' ? 'blue' : editingUser.gender === 'Nữ' ? 'magenta' : 'purple'} style={{ fontWeight: 500 }}>
                        {editingUser.gender}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#888', fontSize: 13 }}><CalendarOutlined className="mr-1 text-orange-400" /> Ngày tạo</div>
                    <div className="animate-fade-in-up">
                      <Tag color="geekblue" style={{ fontWeight: 500 }}>
                        {editingUser.created_at ? 
                          moment(editingUser.created_at).format('DD/MM/YYYY') : 
                          editingUser.createdAt ? 
                            moment(`${editingUser.createdAt[0]}-${editingUser.createdAt[1]}-${editingUser.createdAt[2]}`).format('DD/MM/YYYY') : 
                            'N/A'}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#888', fontSize: 13 }}><CalendarOutlined className="mr-1 text-orange-400" /> Lần đăng nhập cuối</div>
                    <div className="animate-fade-in-up">
                      <Tag color="purple" style={{ fontWeight: 500 }}>
                        {editingUser.updated_at ? 
                          moment(editingUser.updated_at).format('DD/MM/YYYY HH:mm') : 
                          editingUser.updatedAt ? 
                            moment(`${editingUser.updatedAt[0]}-${editingUser.updatedAt[1]}-${editingUser.updatedAt[2]}`).format('DD/MM/YYYY') : 
                            'Chưa đăng nhập'}
                      </Tag>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
      {/* Modal đặt lại mật khẩu */}
      <Modal
        title="Đặt lại mật khẩu"
        open={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        onOk={handleResetPassword}
        okText="Đặt lại"
        cancelText="Hủy"
        className="rounded-2xl animate-fade-in"
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="newPassword"
            label={<span><LockOutlined className="mr-1 text-blue-400" /> Mật khẩu mới</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" className="rounded-xl" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={<span><LockOutlined className="mr-1 text-blue-400" /> Xác nhận mật khẩu</span>}
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" className="rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffPage; 