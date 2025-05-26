import React, { useEffect, useState } from 'react';
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
  Row,
  Col,
  Tooltip,
  App,
  Dropdown,
  Space,
  Statistic,
  Avatar,
} from 'antd';
import {
  UserOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExportOutlined,
  SettingOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PhoneOutlined,
  TeamOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import type { MenuProps } from 'antd';
import { usePermissions } from '../contexts/PermissionContext';
import customerService, { Customers, CustomerFilters } from '../api/customerService';

const { Title, Text } = Typography;
const { Option } = Select;

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customers[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customers | null>(null);
  const [form] = Form.useForm();
  const { message: antMessage } = App.useApp();
  const [isViewMode, setIsViewMode] = useState(false);

  const { hasPermission, isLoading: permissionLoading, refreshPermissions } = usePermissions();

  const userRole = localStorage.getItem('role') || '';
  console.log(userRole);

  const canViewCustomer = hasPermission('VIEW_CUSTOMER') || userRole === 'ADMIN' || userRole === 'MANAGER';
  const canEditCustomer = (hasPermission('EDIT_CUSTOMER') || userRole === 'ADMIN' || userRole === 'MANAGER');
  const canDeleteCustomer = hasPermission('DELETE_CUSTOMER') || userRole === 'ADMIN';
  
  // Làm mới quyền khi component mount
  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  useEffect(() => {
    if (!permissionLoading) {
      if (!canViewCustomer) {
        antMessage.error('Bạn không có quyền xem danh sách khách hàng');
        return;
      }
      fetchCustomers();
    }
  }, [permissionLoading, canViewCustomer, currentPage, pageSize, filters]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const filtersToSend: CustomerFilters = {
        ...filters,
        roles: 'USER',
      };
      if (filters.query) {
        filtersToSend.fullName = filters.query;
        delete filtersToSend.query;
        const response = await customerService.searchCustomers(currentPage, pageSize, filtersToSend);
        console.log("response: ",response);
        if (response) {
          // Nếu response là mảng trực tiếp
          if (Array.isArray(response)) {
            setCustomers(response);
            setTotal(response.length);
          } 
          // Nếu response có thuộc tính customer là mảng
          else if (Array.isArray(response.customer)) {
            setCustomers(response.customer);
            setTotal(response.totalItems || 0);
            if (response.customer.length === 0) {
              antMessage.info('Không tìm thấy khách hàng nào');
            }
          } 
          // Nếu không có cấu trúc phù hợp
          else {
            antMessage.error('Dữ liệu trả về không đúng định dạng');
            setCustomers([]);
            setTotal(0);
          }
        }
      } else {
        const response = await customerService.getCustomers(currentPage, pageSize, filtersToSend);
        console.log("response: ", response);
        
        if (response) {
          // Nếu response là mảng trực tiếp
          if (Array.isArray(response)) {
            setCustomers(response);
            setTotal(response.length);
          } 
          // Nếu response có thuộc tính customer là mảng
          else if (Array.isArray(response.customer)) {
            setCustomers(response.customer);
            setTotal(response.totalItems || 0);
            if (response.customer.length === 0) {
              antMessage.info('Không tìm thấy khách hàng nào');
            }
          } 
          // Nếu không có cấu trúc phù hợp
          else {
            antMessage.error('Dữ liệu trả về không đúng định dạng');
            setCustomers([]);
            setTotal(0);
          }
        }
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
      
      setCustomers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters({ ...filters, query: value });
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string | undefined) => {
    if (value) {
      setFilters({ ...filters, status: value });
    } else {
      const { status, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const showCustomerDetail = async (customer: Customers) => {
    setLoading(true);
    try {
      const detail = await customerService.getCustomerById(customer.id || customer.userId || 0);
      setSelectedCustomer(detail);
      setIsViewMode(true);
      setIsModalVisible(true);
    } catch (error) {
      antMessage.error('Không thể lấy thông tin khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = (customer: Customers) => {
    if (!canEditCustomer) {
      antMessage.error('Bạn không có quyền chỉnh sửa khách hàng');
      return;
    }
    setSelectedCustomer(customer);
    form.setFieldsValue({
      name: customer.fullName || customer.fullname || '',
      phone: customer.phoneNumber || customer.phone_number || '',
      email: customer.email || '',
      gender: customer.gender || '',
      status: customer.active ? 'active' : 'inactive'
    });
    setIsViewMode(false);
    setIsModalVisible(true);
  };

  const handleDeleteCustomer = async (id: number | undefined) => {
    if (!canDeleteCustomer) {
      antMessage.error('Bạn không có quyền chỉnh sửa khách hàng');
      return;
    }
    if (id === undefined) {
      antMessage.error('ID khách hàng không hợp lệ');
      return;
    }
    
    try {
      // TODO: Implement delete API call
      antMessage.success('Xóa khách hàng thành công');
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      antMessage.error('Không thể xóa khách hàng');
    }
  };

  const columns: ColumnsType<Customers> = [
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ backgroundColor: record.active ? '#1890ff' : '#ccc' }}
            className="mr-3"
          />
          <div>
            <div className="font-medium">{record.fullName || record.fullname}</div>
            <Text type="secondary" className="text-xs">
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      key: 'phone_number',
      render: (_, record) => (
        <span>
          <PhoneOutlined className="mr-2" />
          {record.phoneNumber || record.phone_number}
        </span>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => gender,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active) => (
        <Tag color={active ? 'success' : 'default'}>
          {active ? 'Đang hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tham gia',
      key: 'created_at',
      render: (_, record) => {
        const date = record.createdAt ? 
          `${record.createdAt[0]}-${record.createdAt[1]}-${record.createdAt[2]}` : 
          record.created_at;
        return moment(date).format('DD/MM/YYYY');
      },
      sorter: (a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt[0], a.createdAt[1]-1, a.createdAt[2]) : new Date(a.created_at || '');
        const dateB = b.createdAt ? new Date(b.createdAt[0], b.createdAt[1]-1, b.createdAt[2]) : new Date(b.created_at || '');
        return dateA.valueOf() - dateB.valueOf();
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        const items: MenuProps['items'] = [
          {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <EyeOutlined />,
            onClick: () => showCustomerDetail(record),
          },
          {
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <EditOutlined />,
            onClick: () => handleEditCustomer(record),
          },
          {
            key: 'delete',
            label: 'Xóa khách hàng',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Xác nhận xóa khách hàng',
                content: `Bạn có chắc chắn muốn xóa ${record.fullName || record.fullname}?`,
                okText: 'Xóa',
                cancelText: 'Hủy',
                okButtonProps: { danger: true },
                onOk: () => handleDeleteCustomer(record.id || record.userId),
              });
            },
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
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
              <TeamOutlined className="mr-2 text-pink-500 animate-bounce" /> Quản lý khách hàng
            </Title>
            <Text type="secondary">
              Quản lý thông tin và theo dõi hoạt động của khách hàng
            </Text>
          </div>
        </div>

        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card className="rounded-xl shadow-md border-0 bg-gradient-to-r from-blue-100 to-blue-50 animate-fade-in-up">
              <Statistic
                title={<span className="text-blue-700">Tổng khách hàng</span>}
                value={total}
                prefix={<TeamOutlined className="text-blue-500 animate-pulse" />}
                valueStyle={{ color: '#1890ff', fontWeight: 700, fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="rounded-xl shadow-md border-0 bg-gradient-to-r from-green-100 to-green-50 animate-fade-in-up">
              <Statistic
                title={<span className="text-green-700">Khách hàng hoạt động</span>}
                value={customers.filter((c: Customers) => c.active).length}
                valueStyle={{ color: '#3f8600', fontWeight: 700, fontSize: 28 }}
                prefix={<UserOutlined className="text-green-500 animate-pulse" />}
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        <div className="mb-4 flex justify-between flex-wrap">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <Input.Search
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

          <Space>
            <Tooltip title="Xuất dữ liệu">
              <Button icon={<ExportOutlined className="text-green-500" />} className="rounded-xl shadow-sm">Xuất Excel</Button>
            </Tooltip>
            <Tooltip title="Tùy chỉnh hiển thị">
              <Button icon={<SettingOutlined className="text-blue-400" />} className="rounded-xl shadow-sm" />
            </Tooltip>
          </Space>
        </div>

        {isFilterVisible && (
          <div className="bg-gradient-to-r from-blue-50 to-pink-50 p-4 rounded-xl mb-4 border border-blue-100 animate-fade-in">
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Trạng thái" className="mb-0">
                  <Select
                    placeholder="Chọn trạng thái"
                    style={{ width: '100%' }}
                    allowClear
                    onChange={handleStatusFilterChange}
                    value={filters.status}
                    className="rounded-xl"
                  >
                    <Option value="active">Đang hoạt động</Option>
                    <Option value="inactive">Không hoạt động</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          loading={loading}
          className="rounded-xl shadow-lg animate-fade-in-up"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} khách hàng`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            }
          }}
        />
      </Card>

      <Modal
        title={
          isViewMode
            ? 'Thông tin khách hàng'
            : selectedCustomer
            ? 'Chỉnh sửa khách hàng'
            : 'Thêm khách hàng mới'
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={!isViewMode ? () => form.submit() : undefined}
        okText={isViewMode ? 'Đóng' : selectedCustomer ? 'Lưu' : 'Thêm mới'}
        cancelText="Hủy"
        width={800}
        className="rounded-2xl animate-fade-in"
        footer={
          isViewMode
            ? [
                <Button key="close" onClick={() => setIsModalVisible(false)} className="rounded-xl">
                  Đóng
                </Button>,
              ]
            : undefined
        }
      >
        {isViewMode && selectedCustomer ? (
          <div
            className="p-4 bg-gradient-to-br from-blue-50 via-white to-pink-50 rounded-xl shadow-lg animate-fade-in"
            style={{ minHeight: 220 }}
          >
            <Row gutter={24} align="middle">
              <Col span={8} className="text-center">
                <Avatar
                  size={90}
                  icon={<UserOutlined style={{ fontSize: 40, transition: 'color 0.3s' }} />}
                  style={{
                    background:
                      selectedCustomer.active
                        ? 'linear-gradient(135deg, #1890ff 60%, #52c41a 100%)'
                        : 'linear-gradient(135deg, #ccc 60%, #f5f5f5 100%)',
                    marginBottom: 16,
                    boxShadow: selectedCustomer.active ? '0 4px 24px #1890ff33' : '0 2px 12px #ccc',
                    border: selectedCustomer.active ? '2px solid #52c41a' : '2px solid #ccc',
                    transition: 'all 0.3s',
                  }}
                  className="shadow-lg animate-bounce"
                />
                <div style={{ marginTop: 8 }}>
                  <Tag
                    color={selectedCustomer.active ? 'success' : 'default'}
                    style={{
                      fontSize: 16,
                      padding: '4px 20px',
                      borderRadius: 20,
                      boxShadow: selectedCustomer.active ? '0 2px 8px #52c41a33' : undefined,
                      letterSpacing: 1,
                      fontWeight: 500,
                      transition: 'all 0.3s',
                    }}
                    icon={selectedCustomer.active ? <UserOutlined spin /> : <UserOutlined />}
                  >
                    {selectedCustomer.active ? 'Đang hoạt động' : 'Không hoạt động'}
                  </Tag>
                </div>
              </Col>
              <Col span={16}>
                <Row gutter={[0, 16]}>
                  <Col span={12}>
                    <div style={{ color: '#888', fontSize: 13 }}><UserOutlined className="mr-1 text-blue-400" /> Họ tên</div>
                    <div className="font-medium text-lg text-blue-700 animate-fade-in-up">{selectedCustomer.fullName || selectedCustomer.fullname}</div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#888', fontSize: 13 }}><PhoneOutlined className="mr-1 text-pink-400" /> Số điện thoại</div>
                    <div className="text-pink-700 font-semibold animate-fade-in-up">
                      <PhoneOutlined style={{ marginRight: 6, color: '#faad14' }} />
                      {selectedCustomer.phoneNumber || selectedCustomer.phone_number}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#888', fontSize: 13 }}><MailOutlined className="mr-1 text-green-400" /> Email</div>
                    <div className="animate-fade-in-up">
                      {selectedCustomer.email ? (
                        <span style={{ color: '#1890ff' }}>{selectedCustomer.email}</span>
                      ) : (
                        <Text type="secondary">Chưa có</Text>
                      )}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#888', fontSize: 13 }}><UserOutlined className="mr-1 text-purple-400" /> Giới tính</div>
                    <div className="animate-fade-in-up">
                      <Tag color={selectedCustomer.gender === 'Nam' ? 'blue' : selectedCustomer.gender === 'Nữ' ? 'magenta' : 'purple'} style={{ fontWeight: 500 }}>
                        {selectedCustomer.gender}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#888', fontSize: 13 }}><CalendarOutlined className="mr-1 text-orange-400" /> Ngày tham gia</div>
                    <div className="animate-fade-in-up">
                      <Tag color="geekblue" style={{ fontWeight: 500 }}>
                        {selectedCustomer.createdAt ? 
                          moment(`${selectedCustomer.createdAt[0]}-${selectedCustomer.createdAt[1]}-${selectedCustomer.createdAt[2]}`).format('DD/MM/YYYY') : 
                          moment(selectedCustomer.created_at).format('DD/MM/YYYY')}
                      </Tag>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={async (values) => {
              try {
                if (selectedCustomer) {
                  await customerService.updateCustomer(String(selectedCustomer.id || selectedCustomer.userId), values);
                  antMessage.success('Cập nhật thông tin thành công');
                }
                setIsModalVisible(false);
                fetchCustomers();
              } catch (error) {
                console.error('Error saving customer:', error);
                antMessage.error('Không thể lưu thông tin khách hàng');
              }
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label={<span><UserOutlined className="mr-1 text-blue-400" /> Tên khách hàng</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
                >
                  <Input placeholder="Nhập tên khách hàng" className="rounded-xl" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label={<span><PhoneOutlined className="mr-1 text-pink-400" /> Số điện thoại</span>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" className="rounded-xl" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label={<span><MailOutlined className="mr-1 text-green-400" /> Email</span>}
                  rules={[
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input placeholder="Nhập email" className="rounded-xl" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label={<span><UserOutlined className="mr-1 text-purple-400" /> Giới tính</span>}
                >
                  <Select placeholder="Chọn giới tính" className="rounded-xl">
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label={<span><HomeOutlined className="mr-1 text-orange-400" /> Địa chỉ</span>}
            >
              <Input.TextArea placeholder="Nhập địa chỉ" rows={3} className="rounded-xl" />
            </Form.Item>

            {selectedCustomer && (
              <Form.Item
                name="status"
                label={<span><UserOutlined className="mr-1 text-green-400" /> Trạng thái</span>}
              >
                <Select className="rounded-xl">
                  <Option value="active">Đang hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                </Select>
              </Form.Item>
            )}
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default CustomerPage;