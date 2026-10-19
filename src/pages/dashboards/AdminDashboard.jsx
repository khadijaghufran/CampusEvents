import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-slate-900/20">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome, {user?.name || 'Administrator'}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                  University Administration
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {user?.department || 'Office of Student Affairs'} • {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to={ROUTES.HOME}>
              <Button variant="outline" size="sm">
                View Public Site
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>

        {/* Dashboard Placeholder Content */}
        <div className="mt-8 space-y-6">
          <div className="p-5 rounded-xl bg-purple-50/60 border border-purple-200">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <h2 className="text-sm font-semibold text-purple-900">
                  University Administrator Control Destination
                </h2>
                <p className="text-xs text-purple-800 mt-1 leading-relaxed">
                  You are authenticated with Master Administrator privileges. In the full platform,
                  you can review pending proposals, inspect seminar hall bookings to prevent venue
                  clashes, approve or reject events with formal justification, and inspect university-wide analytics.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Pending Reviews</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">4</p>
              <span className="text-[11px] text-amber-600 font-medium">Awaiting decision</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Managed Venues</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">12</p>
              <span className="text-[11px] text-teal-600 font-medium">Auditoriums & halls</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Total Registered Societies</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">28</p>
              <span className="text-[11px] text-slate-500 font-medium">Active chapters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
