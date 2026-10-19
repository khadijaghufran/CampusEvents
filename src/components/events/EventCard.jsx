import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeatMeter from './SeatMeter';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { isRegistrationOpen, getAvailableSeats } from '../../utils/seatUtils';
import { formatDate, formatTimeSpan } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { eventService } from '../../api/eventService';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

/**
 * Event card displaying full event metadata, real-time seat availability, and registration actions.
 *
 * @param {Object} props
 * @param {Object} props.event - Event object.
 * @param {Function} [props.onRegistrationSuccess] - Callback to refresh event state.
 */
export default function EventCard({ event, onRegistrationSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [registering, setRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const availableSeats = getAvailableSeats(event.capacity, event.registeredCount);
  const registrationOpen = isRegistrationOpen(event);

  const handleRegisterClick = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    // If a logged-out user clicks "Register", redirect to /login and return to Home after login
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, {
        state: {
          from: ROUTES.HOME,
          eventId: event.id,
          message: `Please log in as a student to register for "${event.title}".`,
        },
      });
      return;
    }

    // Only students can register
    if (user.role !== ROLES.STUDENT) {
      setErrorMsg(
        `Registration is only permitted for students. You are currently logged in as ${user.role}.`
      );
      return;
    }

    // Call service to register
    setRegistering(true);
    try {
      const response = await eventService.registerForEvent(event.id, user.id);
      setSuccessMsg(response.message || 'Seat confirmed successfully!');
      if (onRegistrationSuccess) {
        onRegistrationSuccess(event.id);
      }
    } catch (err) {
      // Server error message (e.g. duplicate registration or capacity filled)
      setErrorMsg(
        err.message || 'Registration failed. Please try again or contact support.'
      );
    } finally {
      setRegistering(false);
    }
  };

  return (
    <article className="flex flex-col rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Event Header Banner */}
      <div className="p-6 pb-4 flex flex-col flex-grow">
        {/* Category & Society Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/80">
            {event.societyName}
          </span>
          {event.category && (
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
              {event.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 leading-snug tracking-tight mb-2">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Event Schedule & Location Details */}
        <div className="mt-auto space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
          {/* Venue (Seminar hall name) */}
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-medium text-slate-700">{event.venue}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-teal-600 flex-shrink-0"
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
            <span>{formatDate(event.date)}</span>
          </div>

          {/* Start - End Time */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-teal-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatTimeSpan(event.startTime, event.endTime)}</span>
          </div>

          {/* Available Seats count */}
          <div className="flex items-center gap-2 text-slate-500 pt-0.5">
            <svg
              className="w-4 h-4 text-teal-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              Available Seats:{' '}
              <strong className={availableSeats > 0 ? 'text-teal-700' : 'text-red-600'}>
                {availableSeats}
              </strong>
            </span>
          </div>
        </div>

        {/* Seat Meter Component */}
        <div className="pt-4">
          <SeatMeter
            capacity={event.capacity}
            registeredCount={event.registeredCount}
          />
        </div>

        {/* Feedback / Error Alerts */}
        {errorMsg && (
          <div className="mt-3">
            <Alert variant="error" onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          </div>
        )}
        {successMsg && (
          <div className="mt-3">
            <Alert variant="success" onClose={() => setSuccessMsg('')}>
              {successMsg}
            </Alert>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="px-6 pb-6 pt-2 bg-white">
        <Button
          variant={registrationOpen ? 'primary' : 'secondary'}
          fullWidth
          disabled={!registrationOpen || registering}
          loading={registering}
          onClick={handleRegisterClick}
          aria-label={
            registrationOpen
              ? `Register for ${event.title}`
              : `Registration closed for ${event.title}`
          }
        >
          {registrationOpen ? 'Register Now' : 'Registration Closed'}
        </Button>
      </div>
    </article>
  );
}
