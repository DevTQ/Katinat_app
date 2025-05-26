// src/App.tsx
import React from 'react';
import AppRoutes from './routes/routes';
import PermissionProvider from './contexts/PermissionContext';
import { ConfigProvider, App as AntApp } from 'antd';
import viVN from 'antd/locale/vi_VN';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={viVN}>
      <AntApp>
        <PermissionProvider>
          <AppRoutes />
        </PermissionProvider>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;