import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/Home/HomePage';
import ContactPage from '../pages/Contact/ContactPage';
import LoginPage from '../pages/Login/LoginPage';
import StudentDashboard from '../pages/dashboards/StudentDashboard';
import OrganizerDashboard from '../pages/dashboards/OrganizerDashboard';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import NotFoundPage from '../pages/NotFoundPage';
import RoleRoute from './RoleRoute';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

/**
 * Top-level application routing declaration
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Pages */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Role-Protected Dashboard Destinations */}
        <Route
          path={ROUTES.STUDENT_DASHBOARD}
          element={
            <RoleRoute allowedRole={ROLES.STUDENT}>
              <StudentDashboard />
            </RoleRoute>
          }
        />

        <Route
          path={ROUTES.ORGANIZER_DASHBOARD}
          element={
            <RoleRoute allowedRole={ROLES.ORGANIZER}>
              <OrganizerDashboard />
            </RoleRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <RoleRoute allowedRole={ROLES.ADMIN}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* 404 Catch-All Page */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
