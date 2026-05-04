import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import LandingPage from './modules/auth/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import useAuthStore from './store/useAuthStore';
import { getDashboardRoute, isRouteProtected } from './utils/routeUtils';
import './i18n';

// Lazy loaded components
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const VendorDashboard = lazy(() => import('./pages/vendor/VendorDashboard'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const ProfilePage = lazy(() => import('./pages/shared/ProfilePage'));
const AddressPage = lazy(() => import('./pages/user/AddressPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const OrderHistoryPage = lazy(() => import('./pages/user/OrderHistoryPage'));
const VendorOrdersPage = lazy(() => import('./pages/vendor/VendorOrdersPage'));

const PageLoader = () => (
  <Center h="100vh">
    <Loader color="orange" size="lg" type="bars" />
  </Center>
);

const ProtectedRoute = ({ children, useLayout = true }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return useLayout ? <DashboardLayout>{children}</DashboardLayout> : children;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const targetRoute = getDashboardRoute(user.role);
      const currentPath = window.location.pathname;
      
      if (currentPath === '/' && targetRoute !== '/') {
        navigate(targetRoute, { replace: true });
      }
    }
  }, [user, isAuthenticated, navigate]);
  
  return (
    <div className="App">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Dashboards */}
          <Route 
            path="/superadmin/dashboard" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['SUPER_ADMIN']}>
                  <SuperAdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <UserManagementPage />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor/dashboard" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['VENDOR']}>
                  <VendorDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor/menu" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['VENDOR']}>
                  <VendorDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/menu" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor/orders" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['VENDOR']}>
                  <VendorOrdersPage />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/dashboard" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['USER']}>
                  <UserDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['USER']}>
                  <OrderHistoryPage />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
          
          {/* Shared Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addresses" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['USER']}>
                  <AddressPage />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;