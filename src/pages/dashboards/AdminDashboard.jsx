import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { eventService } from '../../api/eventService';
import { ROUTES } from '../../constants/routes';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all'
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Rejection Modal State
  const [rejectingEvent, setRejectingEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  const refreshAdminData = async () => {
    setLoading(true);
    try {
      const [allEvents, allVenues] = await Promise.all([
        eventService.getAllEvents(),
        eventService.getVenues(),
      ]);
      setEvents(allEvents || []);
      setVenues(allVenues || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const [allEvents, allVenues] = await Promise.all([
          eventService.getAllEvents(),
          eventService.getVenues(),
        ]);
        if (active) {
          setEvents(allEvents || []);
          setVenues(allVenues || []);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error('Error fetching admin data:', err);
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  // State Pattern transition: Approve Event
  const handleApprove = async (eventId) => {
    setActionLoadingId(eventId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await eventService.updateEventStatus(eventId, 'approve');
      setSuccessMsg(res.message || 'Event proposal approved and published successfully!');
      await refreshAdminData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to approve event.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // State Pattern transition: Reject Event
  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError('A formal justification reason is required to reject a proposal.');
      return;
    }

    setActionLoadingId(rejectingEvent.id);
    setRejectionError('');
    try {
      const res = await eventService.updateEventStatus(
        rejectingEvent.id,
        'reject',
        rejectionReason.trim()
      );
      setSuccessMsg(res.message || 'Event proposal rejected with justification recorded.');
      setRejectingEvent(null);
      setRejectionReason('');
      await refreshAdminData();
    } catch (err) {
      setRejectionError(err.message || 'Failed to reject event.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingEvents = events.filter((e) => e.status === 'pending');
  const totalRegisteredSeats = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-slate-900/20">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome, {user?.name || 'Prof. Dr. Tariq Mehmood'}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                  University Administration
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {user?.department || 'Directorate of Student Affairs'} • {user?.email} • ID:{' '}
                {user?.adminId || 'ADM-2026-1102'}
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

        {/* Milestone 50% Control Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-100">
            <p className="text-xs font-medium text-purple-700">Pending Review Queue</p>
            <p className="text-2xl font-bold text-purple-950 mt-1">{pendingEvents.length}</p>
            <span className="text-[11px] text-purple-600">Requires Admin decision</span>
          </div>
          <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-100">
            <p className="text-xs font-medium text-teal-700">Managed Seminar Halls</p>
            <p className="text-2xl font-bold text-teal-950 mt-1">{venues.length || 5}</p>
            <span className="text-[11px] text-teal-600">Auditoriums & halls</span>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-100">
            <p className="text-xs font-medium text-amber-700">Active Registrations</p>
            <p className="text-2xl font-bold text-amber-950 mt-1">{totalRegisteredSeats}</p>
            <span className="text-[11px] text-amber-600">Allocated student seats</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mt-8 gap-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>⏳ Pending Approval Queue</span>
            {pendingEvents.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-rose-500 text-white font-bold">
                {pendingEvents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🏛️ All Campus Events & Venues ({events.length})
          </button>
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

      {/* TAB 1: Pending Proposals Queue */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Admin Approval Workflow</h2>
              <p className="text-sm text-slate-500 mt-1">
                Enforcing the <strong>State Pattern</strong>: Review event proposals, check seminar hall bookings, and approve or reject with reasons.
              </p>
            </div>
            <button
              onClick={refreshAdminData}
              className="text-xs font-semibold text-purple-700 hover:text-purple-800"
            >
              🔄 Refresh Queue
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : pendingEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-base font-semibold">🎉 The approval queue is clean!</p>
              <p className="text-xs mt-1">No event proposals are currently pending review.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-6 rounded-2xl border border-purple-100 bg-purple-50/20 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          Pending Approval
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          Category: {evt.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1.5">{evt.title}</h3>
                      <p className="text-xs font-semibold text-purple-700 mt-0.5">
                        Proposed by {evt.societyName} ({evt.organizerName || 'Society Organizer'} • {evt.organizerEmail})
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(evt.id)}
                        disabled={actionLoadingId === evt.id}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                      >
                        {actionLoadingId === evt.id ? 'Publishing...' : '✓ Approve & Publish'}
                      </button>
                      <button
                        onClick={() => {
                          setRejectingEvent(evt);
                          setRejectionReason('');
                          setRejectionError('');
                        }}
                        disabled={actionLoadingId === evt.id}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-sm"
                      >
                        ✕ Reject Proposal
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                    {evt.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Requested Venue:</span>
                      <strong className="text-slate-800">{evt.venue}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Proposed Date:</span>
                      <strong className="text-slate-800">{evt.date}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Time Window:</span>
                      <strong className="text-slate-800">
                        {evt.startTime} – {evt.endTime}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Requested Capacity:</span>
                      <strong className="text-slate-800">{evt.capacity} students</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: All Campus Events */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">All University Events ({events.length})</h2>
            <button
              onClick={refreshAdminData}
              className="text-xs font-semibold text-purple-700 hover:text-purple-800"
            >
              🔄 Refresh Data
            </button>
          </div>

          <div className="space-y-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{evt.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        evt.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : evt.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : evt.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    🏛️ {evt.venue} • 📅 {evt.date} • 👥 {evt.registeredCount || 0} / {evt.capacity} seats taken
                  </p>
                </div>

                <div className="text-xs font-semibold text-slate-500">
                  {evt.societyName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Modal Dialog */}
      {rejectingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Reject Event Proposal: {rejectingEvent.title}
              </h3>
              <button
                onClick={() => setRejectingEvent(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Per university governance rules, the <strong>State Pattern</strong> requires a formal reason
              recorded in the database when transitioning an event to the <code>Rejected</code> state.
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Rejection Justification Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows="3"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Venue capacity conflict with scheduled semester exam, or incomplete faculty sponsor clearance..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-rose-500 focus:outline-none"
              ></textarea>
              {rejectionError && (
                <p className="text-xs text-rose-500 mt-1">{rejectionError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingEvent(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={actionLoadingId === rejectingEvent.id}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {actionLoadingId === rejectingEvent.id
                  ? 'Recording Rejection...'
                  : 'Confirm Formal Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
