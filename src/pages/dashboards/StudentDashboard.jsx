import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

export default function StudentDashboard() {
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
            <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-teal-600/20">
              {user?.name ? user.name[0] : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome, {user?.name || 'Student'}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                  Student Portal
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {user?.email} • Student ID: {user?.studentId || 'STU-2026-8841'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to={ROUTES.HOME}>
              <Button variant="outline" size="sm">
                Browse Events
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>

        {/* Dashboard Placeholder Content */}
        <div className="mt-8 space-y-6">
          <div className="p-5 rounded-xl bg-teal-50/60 border border-teal-100">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"
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
                <h2 className="text-sm font-semibold text-teal-900">
                  Student Dashboard Destination
                </h2>
                <p className="text-xs text-teal-800 mt-1 leading-relaxed">
                  You are successfully authenticated into the Student zone. In the complete
                  system, this section hosts your confirmed registrations, attendance QR passes,
                  event feedback forms, and downloadable participation certificates.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Registered Events</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">3</p>
              <span className="text-[11px] text-teal-600 font-medium">Seats reserved</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Attended Events</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">7</p>
              <span className="text-[11px] text-slate-500 font-medium">Verified by organizer</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Earned Certificates</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">5</p>
              <span className="text-[11px] text-amber-600 font-medium">Ready to download</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
