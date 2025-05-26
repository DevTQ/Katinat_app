import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from "../layouts/AdminLayout"
import DashboardPage from '../pages/DashboardPage'
import CustomerPage from '../pages/CustomerPage'
import OrderPage from '../pages/OrderPage'
import CategoryPage from '../pages/CategoryPage'
import ProductPage from '../pages/ProductPage'
import ProductForm from '../pages/Product/ProductForm'
import OrderDetailPage from '../pages/OrderDetailPage'
import OrderPaidPage from '../pages/OrderPaidPage'
import OptionOrder from '../pages/OptionOrder';
import OrderPaidListPage from '../pages/OrderPaidListPage';
import OrderConfirmedListPage from '../pages/OrderConfirmedListPage'
import OrderConfirmedPage from '../pages/OrderConfirmedPage'
import LoginPage from '../pages/Auth/LoginPage'
import PrivateRoute from '../components/PrivateRoute'
import authService from '../api/authService'
import StaffPage from '../pages/StaffPage';
export default function AppRoutes() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } />
        
        {/* Protected routes */}
        <Route path="/" element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="employees" element={<StaffPage />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="orders/:id/paid" element={<OrderPaidPage />} />
          <Route path="orders/:id/confirmed" element={<OrderConfirmedPage />} />
          <Route path="option-order" element={<OptionOrder />} />
          <Route path="orders/paid" element={<OrderPaidListPage />} />
          <Route path="orders/confirmed" element={<OrderConfirmedListPage />} />
        </Route>
        
        <Route path="*" element={
          <Navigate to={isAuthenticated ? "/" : "/login"} replace />
        } />
      </Routes>
    </BrowserRouter>
  )
}
