import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Checkbox, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import authService, { LoginRequest } from '../../api/authService';
import { motion } from 'framer-motion';
import { usePermissions } from '../../contexts/PermissionContext';

const { Title, Text } = Typography;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(0|\+84)(\d{9}|\d{10})$/;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'unknown' | 'email' | 'phone'>('unknown');
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { refreshPermissions } = usePermissions();

  // Detect login type based on input
  const detectLoginType = (value: string) => {
    if (!value) {
      setLoginType('unknown');
      return;
    }

    if (emailRegex.test(value)) {
      setLoginType('email');
    } else if (phoneRegex.test(value)) {
      setLoginType('phone');
    } else {
      setLoginType('unknown');
    }
  };

  const onFinish = async (values: LoginRequest) => {
    try {
      setLoading(true);

      if (loginType === 'unknown') {
        message.error('Vui lòng nhập email hoặc số điện thoại hợp lệ');
        setLoading(false);
        return;
      }

      const res = await authService.login(values); 
      const { token, user, role, permissions } = res;

      // Lưu token và thông tin khác
      localStorage.setItem('accessToken', token);
      // Lưu permissions nếu có
      if (permissions && permissions.permissions) {
        localStorage.setItem('permissions', JSON.stringify(permissions.permissions));
      }
      
      if (role) {
        localStorage.setItem('role', role);
      }
      
      refreshPermissions();

      if (role === 'ADMIN') {
        message.success('Đăng nhập thành công với tư cách Admin!');
        navigate('/');
      } else if (role === 'MANAGER') {
        message.success('Đăng nhập thành công với tư cách Quản lý!');
        navigate('/');
      } else if (role === 'STAFF') {
        message.success('Đăng nhập thành công với tư cách Nhân viên!');
        navigate('/option-order');
      } else {
        message.warning('Tài khoản không có quyền truy cập hệ thống này');
      }

    } catch (error) {
      console.error("Login error:", error);
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div
        className="hidden lg:flex lg:w-1/2 relative"
        style={{
          backgroundColor: '#161927',
          overflow: 'hidden'
        }}
      >
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute w-96 h-96 rounded-full bg-blue-400 -top-10 -left-16"></div>
          <div className="absolute w-80 h-80 rounded-full bg-purple-500 bottom-48 right-10"></div>
          <div className="absolute w-72 h-72 rounded-full bg-pink-500 -bottom-10 left-32"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-center"
          >
            <div className="text-5xl font-bold mb-4">KAT Coffee</div>
            <div className="text-xl font-light mb-8">Quản lý cửa hàng đồ uống</div>

            {/* Decorative icon */}
            <div className="mb-10 flex justify-center">
              <svg width="180" height="180" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M168 152v-16a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-32a8 8 0 0 1-8-8Z" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M96 152v-16a8 8 0 0 0-8-8H56a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h32a8 8 0 0 0 8-8Z" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M208 152v24a32 32 0 0 1-32 32H80a32 32 0 0 1-32-32v-24" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M128 96V48M104 72h48M176 128V80M152 104h48M80 128V80M56 104h48" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="text-gray-300 max-w-md">
              {loginType === 'email' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="mb-2">Chào mừng, <strong>Admin</strong>!</p>
                  <p>Đăng nhập để quản lý toàn bộ hệ thống</p>
                </motion.div>
              )}

              {loginType === 'phone' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="mb-2">Chào mừng <strong>Quản lý, Nhân viên</strong>!</p>
                  <p>Đăng nhập để bắt đầu ca làm việc</p>
                </motion.div>
              )}

              {loginType === 'unknown' && (
                <p>Vui lòng đăng nhập để tiếp tục</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl font-bold">K</span>
              </div>
            </motion.div>
            <Title level={2} style={{ margin: '12px 0 8px', fontSize: '28px' }}>Đăng nhập</Title>
            <Text type="secondary">
              Đăng nhập với email (admin) hoặc số điện thoại (nhân viên)
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập thông tin đăng nhập!' }]}
                validateTrigger="onChange"
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Email hoặc số điện thoại"
                  autoComplete="username"
                  onChange={(e) => detectLoginType(e.target.value)}
                  suffix={
                    loginType !== 'unknown' ? (
                      <Tooltip title={loginType === 'email' ? 'Đăng nhập với tư cách Admin' : 'Đăng nhập với tư cách Nhân viên'}>
                        <InfoCircleOutlined
                          style={{ color: loginType === 'email' ? '#1890ff' : '#52c41a' }}
                        />
                      </Tooltip>
                    ) : null
                  }
                  style={{
                    height: '50px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    borderColor: loginType === 'email' ? '#1890ff' : loginType === 'phone' ? '#52c41a' : undefined
                  }}
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                  style={{
                    height: '50px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <a href="#" className="text-blue-600 hover:text-blue-800">Quên mật khẩu?</a>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LoginOutlined />}
                  style={{
                    width: '100%',
                    height: '50px',
                    borderRadius: '10px',
                    background: loginType === 'email'
                      ? 'linear-gradient(to right, #1a56db, #5465ff)'  // Blue for admin
                      : loginType === 'phone'
                        ? 'linear-gradient(to right, #059669, #10B981)' // Green for staff
                        : 'linear-gradient(to right, #6366F1, #8B5CF6)', // Default purple
                    border: 'none',
                    boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
                  }}
                >
                  {loginType === 'email'
                    ? (loading ? 'Đang đăng nhập...' : 'Đăng nhập với tư cách Admin')
                    : loginType === 'phone'
                      ? (loading ? 'Đang đăng nhập...' : 'Đăng nhập với tư cách Nhân viên')
                      : (loading ? 'Đang đăng nhập...' : 'Đăng nhập')}
                </Button>
              </Form.Item>

              <div className="pt-4 text-center">
                <Text type="secondary">© {new Date().getFullYear()} KAT Coffee Management System</Text>
              </div>
            </motion.div>
          </Form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage; 