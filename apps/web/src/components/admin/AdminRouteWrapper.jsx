import React from 'react';
import { Outlet } from 'react-router-dom';

import AdminLayout from './AdminLayout.jsx';
import ProtectedAdminRoute from './ProtectedAdminRoute.jsx';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext.jsx';

const AdminRouteWrapper = () => {
    return (
        <AdminAuthProvider>
            <ProtectedAdminRoute>
                <AdminLayout>
                    <Outlet />
                </AdminLayout>
            </ProtectedAdminRoute>
        </AdminAuthProvider>
    );
};

export default AdminRouteWrapper;