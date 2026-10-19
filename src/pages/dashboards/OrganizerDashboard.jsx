import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

export default function OrganizerDashboard() {
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
            <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-amber-600/20">
              {user?.name ? user.name[0] : 'O'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome, {user?.name || 'Organizer'}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  Organizer Portal
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {user?.society || 'Society Organizer'} • {user?.email}
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
          <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h2 className="text-sm font-semibold text-amber-900">
                  Society Organizer Workspace Destination
                </h2>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  You are authenticated with Society Organizer privileges. In the full platform,
                  you can propose new events, pick available seminar halls, track registrations
                  live, and conduct digital attendee check-ins.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Active Events</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">2</p>
              <span className="text-[11px] text-teal-600 font-medium">Currently published</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Pending Approvals</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">1</p>
              <span className="text-[11px] text-amber-600 font-medium">With admin office</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Total Attendees</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">340</p>
              <span className="text-[11px] text-slate-500 font-medium">Across past events</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
