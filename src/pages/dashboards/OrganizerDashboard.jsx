import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { eventService } from '../../api/eventService';
import { ROUTES } from '../../constants/routes';

export default function OrganizerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('propose'); // 'propose' | 'proposals'
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [checkingConflict, setCheckingConflict] = useState(false);
  const [conflictResult, setConflictResult] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    societyName: user?.society || 'ACM & IEEE Student Chapter',
    venue: '',
    date: '',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    capacity: 100,
    category: 'Technology & Research',
  });

  const [formErrors, setFormErrors] = useState({});

  const refreshOrganizerData = async () => {
    setLoading(true);
    try {
      const [venueList, eventList] = await Promise.all([
        eventService.getVenues(),
        eventService.getAllEvents(),
      ]);
      setVenues(venueList || []);
      setEvents(eventList || []);
    } catch (err) {
      console.error('Error loading organizer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const [venueList, eventList] = await Promise.all([
          eventService.getVenues(),
          eventService.getAllEvents(),
        ]);
        if (active) {
          setVenues(venueList || []);
          setEvents(eventList || []);
          if (venueList && venueList.length > 0) {
            setFormData((prev) => (prev.venue ? prev : { ...prev, venue: venueList[0].name }));
          }
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error('Error loading organizer data:', err);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setConflictResult(null); // Reset conflict verification on edit
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Run Thread-based Venue Availability Check
  const handleCheckConflict = async () => {
    if (!formData.venue || !formData.date || !formData.startTime || !formData.endTime) {
      setErrorMsg('Please select venue, date, start time, and end time to verify availability.');
      return;
    }

    setCheckingConflict(true);
    setErrorMsg('');
    try {
      const res = await eventService.checkVenueAvailability({
        venue: formData.venue,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      setConflictResult(res);
    } catch (err) {
      setErrorMsg(err.message || 'Worker thread failed to verify venue availability.');
    } finally {
      setCheckingConflict(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Event title cannot be empty.';
    if (!formData.description.trim()) errors.description = 'Event description cannot be empty.';
    if (!formData.societyName.trim()) errors.societyName = 'Society name is required.';
    if (!formData.venue) errors.venue = 'Please select a seminar hall or venue.';
    if (!formData.date) errors.date = 'Event date is required.';

    const cap = Number(formData.capacity);
    if (!cap || cap <= 0) {
      errors.capacity = 'Capacity must be a positive number.';
    } else {
      const selectedVenue = venues.find((v) => v.name === formData.venue);
      if (selectedVenue && cap > selectedVenue.capacity) {
        errors.capacity = `Configured capacity exceeds venue maximum (${selectedVenue.capacity} seats).`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        organizerId: user?.organizerId || 'ORG-2026-5521',
        organizerName: user?.name || 'Muhammad Bilal',
        organizerEmail: user?.email || 'muhammadbilal5521@gmail.com',
      };

      const response = await eventService.createEventProposal(payload);
      setSuccessMsg(
        response.message || 'Event proposal submitted successfully for Administrator approval!'
      );
      setConflictResult(null);

      // Reset form
      setFormData({
        title: '',
        description: '',
        societyName: user?.society || 'ACM & IEEE Student Chapter',
        venue: venues[0]?.name || '',
        date: '',
        startTime: '10:00 AM',
        endTime: '02:00 PM',
        capacity: 100,
        category: 'Technology & Research',
      });

      // Refresh events
      await refreshOrganizerData();
      setActiveTab('proposals');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit event proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter my society events
  const myEvents = events.filter(
    (evt) =>
      evt.organizerEmail === user?.email ||
      evt.societyName === (user?.society || 'ACM & IEEE Student Chapter')
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-amber-600/20">
              {user?.name ? user.name[0] : 'O'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome, {user?.name || 'Muhammad Bilal'}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  Society Organizer
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {user?.society || 'ACM & IEEE Student Chapter'} • {user?.email} • ID:{' '}
                {user?.organizerId || 'ORG-2026-5521'}
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

        {/* Milestone 50% Notice Banner */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 via-teal-50 to-indigo-50 border border-amber-200/80">
          <div className="flex items-start gap-3">
            <span className="text-lg">🏛️</span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                50% Milestone Complete: Seminar Hall Management & Event Proposal Lifecycle
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                As a society organizer, you can propose events by reserving official seminar halls.
                Every request triggers a <strong>Node.js Worker Thread</strong> to prevent double-booking,
                and routes the proposal through the <strong>State Pattern workflow</strong> to the Admin.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mt-8 gap-4">
          <button
            onClick={() => setActiveTab('propose')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'propose'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ➕ Propose New Event & Book Venue
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'proposals'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 My Society Proposals ({myEvents.length})
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

      {/* TAB 1: Propose New Event */}
      {activeTab === 'propose' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Create Event Proposal</h2>
            <p className="text-sm text-slate-500 mt-1">
              Select an approved seminar hall, specify timing, and submit for Administrator approval.
            </p>
          </div>

          <form onSubmit={handleProposalSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Event Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. National Autonomous Robotics Championship"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    formErrors.title
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100'
                  }`}
                />
                {formErrors.title && <p className="text-xs text-rose-500 mt-1">{formErrors.title}</p>}
              </div>

              {/* Society Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Society Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="societyName"
                  value={formData.societyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Event Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Technology & Research">Technology & Research</option>
                  <option value="Coding & Hackathon">Coding & Hackathon</option>
                  <option value="Robotics & Hardware">Robotics & Hardware</option>
                  <option value="Finance & Entrepreneurship">Finance & Entrepreneurship</option>
                  <option value="Arts & Media">Arts & Media</option>
                  <option value="Science & Biotech">Science & Biotech</option>
                </select>
              </div>

              {/* Seminar Hall / Venue Selection */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Seminar Hall / Venue <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400">Enforces capacity limits</span>
                </div>
                <select
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-amber-500 focus:outline-none font-medium text-slate-800"
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name} (Max Capacity: {v.capacity} seats) — {v.building}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Event Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${
                    formErrors.date
                      ? 'border-rose-400'
                      : 'border-slate-200 focus:border-amber-500'
                  }`}
                />
                {formErrors.date && <p className="text-xs text-rose-500 mt-1">{formErrors.date}</p>}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Target Seating Capacity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="10"
                  max="500"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${
                    formErrors.capacity
                      ? 'border-rose-400'
                      : 'border-slate-200 focus:border-amber-500'
                  }`}
                />
                {formErrors.capacity && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.capacity}</p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Start Time
                </label>
                <input
                  type="text"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 10:00 AM"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  End Time
                </label>
                <input
                  type="text"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 02:00 PM"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Event Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the objectives, targeted student audience, and agenda..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${
                    formErrors.description
                      ? 'border-rose-400'
                      : 'border-slate-200 focus:border-amber-500'
                  }`}
                ></textarea>
                {formErrors.description && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.description}</p>
                )}
              </div>
            </div>

            {/* Live Worker Thread Verification Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    ⚡ Multi-Threaded Schedule Verifier (worker_threads)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                    Thread Safety
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Runs an interval collision algorithm in an isolated OS thread to guarantee zero venue double-booking.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCheckConflict}
                disabled={checkingConflict}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {checkingConflict ? 'Checking in Thread...' : 'Check Venue Conflict'}
              </button>
            </div>

            {/* Thread Result Feedback */}
            {conflictResult && (
              <div
                className={`p-4 rounded-xl border text-xs ${
                  conflictResult.hasConflict
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    {conflictResult.hasConflict
                      ? '⚠️ Venue Conflict Detected'
                      : '✅ Venue Available & Verified'}
                  </span>
                  <span className="text-[11px] opacity-75">
                    Thread ID: {conflictResult.threadId} • Execution: {conflictResult.processingTimeMs || '<1'}ms
                  </span>
                </div>
                <p className="mt-1">
                  {conflictResult.hasConflict
                    ? conflictResult.conflictReason
                    : conflictResult.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() =>
                  setFormData({
                    title: '',
                    description: '',
                    societyName: user?.society || 'ACM & IEEE Student Chapter',
                    venue: venues[0]?.name || '',
                    date: '',
                    startTime: '10:00 AM',
                    endTime: '02:00 PM',
                    capacity: 100,
                    category: 'Technology & Research',
                  })
                }
              >
                Clear Form
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={submitting}>
                {submitting ? 'Submitting Proposal...' : 'Submit Event Proposal for Approval'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: My Society Proposals */}
      {activeTab === 'proposals' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Society Event Proposals</h2>
              <p className="text-sm text-slate-500 mt-1">
                Track status across the State Pattern lifecycle: Pending ➔ Approved/Rejected ➔ Published.
              </p>
            </div>
            <button
              onClick={refreshOrganizerData}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              🔄 Refresh List
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : myEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-base font-semibold">No event proposals found for your society.</p>
              <p className="text-xs mt-1">Switch to "Propose New Event" to submit your first proposal.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
                        {/* State Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            evt.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : evt.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : evt.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {evt.status === 'pending'
                            ? 'Pending Approval'
                            : evt.status === 'published'
                            ? 'Published & Live'
                            : evt.status === 'rejected'
                            ? 'Proposal Rejected'
                            : evt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        📍 {evt.venue} • 📅 {evt.date} ({evt.startTime} – {evt.endTime}) • 👥 Capacity: {evt.capacity}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-600 block">
                        Registered: {evt.registeredCount || 0} / {evt.capacity}
                      </span>
                      <span className="text-[11px] text-teal-600 font-medium">
                        {Math.max(0, evt.capacity - (evt.registeredCount || 0))} seats open
                      </span>
                    </div>
                  </div>

                  {/* Rejection Alert if state is Rejected */}
                  {evt.status === 'rejected' && evt.rejectionReason && (
                    <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      <strong>Admin Justification Reason:</strong> {evt.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
