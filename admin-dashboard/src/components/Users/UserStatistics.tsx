import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { UserOutlined, TeamOutlined, SolutionOutlined} from '@ant-design/icons';
import { User, UserRole } from '../../api/userService';

interface UserStatisticsProps {
  users: User[];
  loading: boolean;
}

const UserStatistics: React.FC<UserStatisticsProps> = ({ users, loading }) => {
  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  
  // Count users by role
  const countByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<UserRole, number>);
  
  // Calculate percentages
  const adminPercentage = totalUsers > 0 ? Math.round(((countByRole.admin || 0) / totalUsers) * 100) : 0;
  const managerPercentage = totalUsers > 0 ? Math.round(((countByRole.manager || 0) / totalUsers) * 100) : 0;
  const staffPercentage = totalUsers > 0 ? Math.round(((countByRole.staff || 0) / totalUsers) * 100) : 0;
  
  // Get last login date of the most recent user
  const lastLoginDates = users
    .filter(user => user.lastLogin)
    .map(user => new Date(user.lastLogin as string).getTime());
  
  const mostRecentLoginDate = lastLoginDates.length > 0
    ? new Date(Math.max(...lastLoginDates))
    : null;
    
  return (
    <Row gutter={[16, 16]} className="user-statistics">
      <Col xs={24} md={6}>
        <Card loading={loading}>
          <Statistic
            title="Tổng số người dùng"
            value={totalUsers}
            prefix={<TeamOutlined />}
          />
          <Progress
            percent={activePercentage}
            status="active"
            format={() => `${activeUsers} đang hoạt động`}
          />
        </Card>
      </Col>
      
      <Col xs={24} md={6}>
        <Card loading={loading}>
          <Statistic
            title="Admin"
            value={countByRole.admin || 0}
            prefix={<UserOutlined style={{ color: '#f5222d' }} />}
            valueStyle={{ color: '#f5222d' }}
          />
          <Progress percent={adminPercentage} strokeColor="#f5222d" showInfo={false} />
        </Card>
      </Col>
      
      <Col xs={24} md={6}>
        <Card loading={loading}>
          <Statistic
            title="Quản lý"
            value={countByRole.manager || 0}
            prefix={<SolutionOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
          <Progress percent={managerPercentage} strokeColor="#1890ff" showInfo={false} />
        </Card>
      </Col>
      
      <Col xs={24} md={6}>
        <Card loading={loading}>
          <Statistic
            title="Nhân viên"
            value={countByRole.staff || 0}
            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
          />
          <Progress percent={staffPercentage} strokeColor="#52c41a" showInfo={false} />
        </Card>
      </Col>
    </Row>
  );
};

export default UserStatistics; 