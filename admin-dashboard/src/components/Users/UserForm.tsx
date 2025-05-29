import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Radio,
  Divider,
  Row,
  Col,
  Card,
  Tooltip,
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { UserRole, CreateUserRequest} from '../../api/userService';

const { Option } = Select;

export interface UserFormProps {
  onSubmit: (values: CreateUserRequest) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<CreateUserRequest & { id?: string }>;
  currentUserRole: UserRole;
  loading?: boolean;
  formTitle?: string;
}

const positionOptions = [
  { label: 'Thu ngân', value: 'cashier' },
  { label: 'Pha chế', value: 'barista' },
  { label: 'Phục vụ', value: 'server' },
  { label: 'Quản lý ca', value: 'shift_manager' },
];

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  currentUserRole,
  loading = false,
  formTitle = 'Thêm người dùng mới',
}) => {
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialValues?.role || 'staff');
  
  // Reset form when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setSelectedRole(initialValues.role || 'staff');
    }
  }, [form, initialValues]);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    
    // Clear fields that are not relevant to the selected role
    if (role === 'admin') {
      form.setFieldsValue({ position: undefined });
    }
  };

  const generateRandomPassword = () => {
    // Generate a random password (8-12 characters, including letters, numbers, and symbols)
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const length = Math.floor(Math.random() * 5) + 8; // Random length between 8 and 12
    let password = "";
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    form.setFieldsValue({ password });
  };

  const handleFinish = async (values: any) => {
    try {
      await onSubmit(values as CreateUserRequest);
      form.resetFields();
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  // Define which roles the current user can create
  const canCreateAdmin = currentUserRole === 'admin';
  const canCreateManager = currentUserRole === 'admin';
  const canCreateStaff = ['admin', 'manager'].includes(currentUserRole);

  return (
    <Card title={formTitle}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ role: 'staff', ...initialValues }}
      >
        {/* Role Selection */}
        <Form.Item
          name="role"
          label="Loại tài khoản"
          rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản' }]}
        >
          <Radio.Group onChange={(e) => handleRoleChange(e.target.value)}>
            {canCreateAdmin && <Radio.Button value="admin">Admin</Radio.Button>}
            {canCreateManager && <Radio.Button value="manager">Quản lý</Radio.Button>}
            {canCreateStaff && <Radio.Button value="staff">Nhân viên</Radio.Button>}
          </Radio.Group>
        </Form.Item>

        <Divider>Thông tin cá nhân</Divider>
        
        {/* Personal Information */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="firstName"
              label="Họ"
              rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập họ" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="lastName"
              label="Tên"
              rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập tên" />
            </Form.Item>
          </Col>
        </Row>

        {(selectedRole === 'admin') && (
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email đăng nhập" />
          </Form.Item>
        )}

        {(selectedRole === 'manager' || selectedRole === 'staff') && (
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { 
                pattern: /^(0|\+84)(\d{9}|\d{10})$/,
                message: 'Số điện thoại không hợp lệ'
              }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại đăng nhập" />
          </Form.Item>
        )}

        {/* Optional contact info */}
        {selectedRole === 'admin' && (
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại (không bắt buộc)"
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại liên hệ" />
          </Form.Item>
        )}

        {(selectedRole === 'manager' || selectedRole === 'staff') && (
          <Form.Item
            name="email"
            label="Email (không bắt buộc)"
            rules={[
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email liên hệ" />
          </Form.Item>
        )}

        {/* Position (only for manager and staff) */}
        {(selectedRole === 'manager' || selectedRole === 'staff') && (
          <Form.Item
            name="position"
            label="Vị trí"
            rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
          >
            <Select placeholder="Chọn vị trí làm việc">
              {positionOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Divider>Thông tin đăng nhập</Divider>

        {/* Password */}
        <Form.Item
          name="password"
          label={
            <span>
              Mật khẩu
              <Tooltip title="Mật khẩu tạm thời sẽ được gửi tới người dùng và yêu cầu đổi khi đăng nhập lần đầu">
                <QuestionCircleOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Nhập mật khẩu tạm thời"
            addonAfter={
              <Button 
                type="link" 
                size="small" 
                onClick={generateRandomPassword}
              >
                Tạo ngẫu nhiên
              </Button>
            }
          />
        </Form.Item>

        {/* Form Actions */}
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues?.id ? 'Cập nhật' : 'Tạo tài khoản'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default UserForm; 