import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

/**
 * Route guard restricting access to specific campus role.
 *
 * @param {Object} props
 * @param {string} props.allowedRole - Role permitted to access the route.
 * @param {React.ReactNode} props.children - Target component.
 */
export default function RoleRoute({ allowedRole, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  // If user role does not match the allowed role, redirect to their proper dashboard
  if (user.role !== allowedRole) {
    let targetDashboard = ROUTES.HOME;
    if (user.role === ROLES.ADMIN) targetDashboard = ROUTES.ADMIN_DASHBOARD;
    else if (user.role === ROLES.ORGANIZER) targetDashboard = ROUTES.ORGANIZER_DASHBOARD;
    else if (user.role === ROLES.STUDENT) targetDashboard = ROUTES.STUDENT_DASHBOARD;

    return <Navigate to={targetDashboard} replace />;
  }

  return children;
}
