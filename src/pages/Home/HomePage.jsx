import { Link } from 'react-router-dom';
import EventCard from '../../components/events/EventCard';
import LifecycleSteps from '../../components/events/LifecycleSteps';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

export default function HomePage() {
  const { events, loading, error, refetch } = useEvents();
  const { isAuthenticated, role } = useAuth();

  const scrollToLifecycle = () => {
    const section = document.getElementById('lifecycle');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getDashboardPath = () => {
    if (role === ROLES.ADMIN) return ROUTES.ADMIN_DASHBOARD;
    if (role === ROLES.ORGANIZER) return ROUTES.ORGANIZER_DASHBOARD;
    return ROUTES.STUDENT_DASHBOARD;
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-slate-50 to-white pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-200/60">
        {/* Subtle decorative background blur shapes */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-200/40 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-teal-200 shadow-sm text-xs font-semibold text-teal-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            CampusEvents Official University System
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            University Event & Society Management System
          </h1>

          {/* One-Line Description */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Digitizing the campus event lifecycle from society proposals and admin approvals
            to real-time seat reservation, digital attendance, and verified certificates.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to={getDashboardPath()}>
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-teal-700/20">
                  Open My Dashboard →
                </Button>
              </Link>
            ) : (
              <Link to={ROUTES.LOGIN}>
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-teal-700/20">
                  Log in
                </Button>
              </Link>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={scrollToLifecycle}
              className="w-full sm:w-auto"
            >
              How it works
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
              Live Campus Calendar
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Events
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl">
              Browse approved and published society events. Reserve your seat early—allocations
              are strictly capped by venue capacity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Real-time seat tracking enabled</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
            <Spinner size="lg" className="text-teal-600" />
            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading verified campus events...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 bg-white rounded-2xl border border-red-200">
            <Alert variant="error" title="Unable to load events">
              {error}
            </Alert>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={refetch}>
                Retry Loading
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Published Events Right Now</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Check back shortly as upcoming society proposals get approved by administration.
            </p>
          </div>
        )}

        {/* Event Cards Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegistrationSuccess={() => refetch()}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Event Lifecycle Section */}
      <section
        id="lifecycle"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            End-To-End Architecture
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            The 7-Stage Event Lifecycle
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From initial society initiative to verified student certificates, every step is
            tracked seamlessly with automated venue safeguards and audit trails.
          </p>
        </div>

        {/* LifecycleSteps Component */}
        <LifecycleSteps />
      </section>

      {/* 4. Built for Three Roles Section */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
              Tailored Portals
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Built For Three Roles
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Each campus stakeholder receives dedicated tools optimized for their exact workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Role Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Student</h3>
              <p className="text-sm font-medium text-teal-700 mb-4">
                Register & get certificates
              </p>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Register for campus events with live seat status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>View participation history across all semesters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Submit post-event feedback and ratings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Download verified digital participation certificates</span>
                </li>
              </ul>
            </div>

            {/* Society Organizer Role Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Society Organizer</h3>
              <p className="text-sm font-medium text-amber-700 mb-4">
                Create events, pick venue, mark attendance
              </p>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Propose new society workshops, hackathons & talks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Select seminar halls with automated conflict check</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Monitor real-time attendee capacity and waitlists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Mark digital attendee attendance at venue entrance</span>
                </li>
              </ul>
            </div>

            {/* University Admin Role Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6"
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
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">University Admin</h3>
              <p className="text-sm font-medium text-slate-700 mb-4">
                Approve or reject with reason & manage venues
              </p>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-slate-800 font-bold">•</span>
                  <span>Review all pending event proposals across faculties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-800 font-bold">•</span>
                  <span>Approve or reject submissions with formal reasons</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-800 font-bold">•</span>
                  <span>Manage auditoriums, seminar halls, and campus spaces</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-800 font-bold">•</span>
                  <span>Inspect campus engagement metrics and analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Key Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            Enterprise Grade
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Key System Features
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Engineered to remove administrative friction and prevent venue clashes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Venue Conflict Prevention</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Automated timetable checking prevents double-booking of seminar halls and auditoriums.
              Proposals clashing on date or time are highlighted before approval.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Automatic Seat Control & Auto-Closure
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Real-time seat counter monitors registrations against venue fire safety limits.
              When available seats reach zero, registration automatically locks shut.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Digital Attendance</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Organizers verify registered attendees directly from their portal at the venue door,
              instantly marking attendance records in the database.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Feedback Ratings & Analytics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Standardized post-event evaluation forms capture attendee satisfaction scores and
              constructive commentary for society growth and administration review.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition-colors md:col-span-2 lg:col-span-2">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Participation History & Certificates</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Complete student co-curricular record logged across their university degree.
              System issues verifiable digital participation certificates automatically once
              attendance is confirmed by organizers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
