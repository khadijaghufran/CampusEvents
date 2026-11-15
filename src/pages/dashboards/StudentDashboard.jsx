import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { eventService } from '../../api/eventService';
import { ROUTES } from '../../constants/routes';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshRegistrations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await eventService.getMyRegistrations(user.id || 'usr_student_01');
      setRegistrations(data || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function loadData() {
      if (!user) return;
      try {
        const data = await eventService.getMyRegistrations(user.id || 'usr_student_01');
        if (active) {
          setRegistrations(data || []);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error('Error fetching registrations:', err);
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  // Cancel registration via Facade Pattern
  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel your seat reservation for this event?')) {
      return;
    }

    setCancellingId(eventId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await eventService.cancelRegistration(eventId, user.id);
      setSuccessMsg(res.message || 'Registration cancelled. Your seat has been freed.');
      await refreshRegistrations();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to cancel registration.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-teal-600/20">
              {user?.name ? user.name[0] : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome, {user?.name || 'Fatima Noor'}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                  Student Portal
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {user?.email || 'fatimanoor8841@gmail.com'} • Student ID:{' '}
                {user?.studentId || 'STU-2026-8841'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to={ROUTES.HOME}>
              <Button variant="outline" size="sm">
                Browse Campus Events
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-100">
            <p className="text-xs font-medium text-teal-700">Confirmed Registrations</p>
            <p className="text-2xl font-bold text-teal-950 mt-1">{registrations.length}</p>
            <span className="text-[11px] text-teal-600">Reserved seminar seats</span>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
            <p className="text-xs font-medium text-indigo-700">Student Affiliation</p>
            <p className="text-sm font-bold text-indigo-950 mt-2 truncate">
              {user?.major || 'Software Engineering'}
            </p>
            <span className="text-[11px] text-indigo-600">Department verified</span>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100">
            <p className="text-xs font-medium text-amber-700">Registration Engine</p>
            <p className="text-sm font-bold text-amber-950 mt-2">Facade Pattern Active</p>
            <span className="text-[11px] text-amber-600">Atomic seat management</span>
          </div>
        </div>
      </div>

      {/* Global Alerts */}
      {successMsg && (
        <Alert variant="success" dismissible onDismiss={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert variant="error" dismissible onDismiss={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

      {/* My Confirmed Registrations Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Registered Campus Events</h2>
            <p className="text-sm text-slate-500 mt-1">
              Live seat bookings coordinated via the <strong>RegistrationFacade</strong> in MongoDB.
            </p>
          </div>
          <button
            onClick={refreshRegistrations}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800"
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <span className="text-3xl">🎟️</span>
            <p className="text-base font-semibold text-slate-800 mt-2">No active event registrations</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't reserved seats for any events yet. Explore published events and register directly online.
            </p>
            <Link to={ROUTES.HOME} className="inline-block mt-4">
              <Button variant="primary" size="sm">
                Explore Available Events
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => {
              const evt = reg.event || {};
              return (
                <div
                  key={reg.registrationId || reg._id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-teal-200 transition-all bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                        Confirmed Seat
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      🏛️ {evt.venue} • 📅 {evt.date} ({evt.startTime} – {evt.endTime})
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>Organized by: <strong className="text-slate-700">{evt.societyName}</strong></span>
                      <span>•</span>
                      <span>
                        Pass Code: <strong className="text-teal-700 font-mono">{reg.registrationCode || 'REG-2026-CONFIRMED'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleCancelRegistration(evt.id)}
                      disabled={cancellingId === evt.id}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-50 transition-colors"
                    >
                      {cancellingId === evt.id ? 'Cancelling...' : 'Cancel Reservation'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
