import {
  getAvailableSeats,
  getSeatFillPercentage,
  getSeatLabel,
} from '../../utils/seatUtils';

/**
 * Visual progress meter illustrating real-time seating availability.
 * Automatically switches to red when seats are exhausted.
 *
 * @param {Object} props
 * @param {number} props.capacity - Total venue capacity.
 * @param {number} props.registeredCount - Current attendee registration count.
 * @param {string} [props.className] - Additional classes.
 */
export default function SeatMeter({ capacity = 0, registeredCount = 0, className = '' }) {
  const availableSeats = getAvailableSeats(capacity, registeredCount);
  const fillPercentage = getSeatFillPercentage(capacity, registeredCount);
  const isFull = availableSeats <= 0;
  const isNearlyFull = availableSeats > 0 && availableSeats <= 10;

  // Determine color scheme based on seating rules
  let barColor = 'bg-teal-500';
  let badgeColor = 'bg-teal-50 text-teal-800 border-teal-200';

  if (isFull) {
    barColor = 'bg-red-500';
    badgeColor = 'bg-red-50 text-red-800 border-red-200';
  } else if (isNearlyFull) {
    barColor = 'bg-amber-500';
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  const seatText = getSeatLabel({ capacity, registeredCount });

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label & Numbers */}
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-slate-600 flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-slate-400"
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
          Capacity: <strong className="text-slate-800">{registeredCount} / {capacity}</strong>
        </span>

        {/* Dynamic status pill */}
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeColor}`}
        >
          {seatText}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div
        role="progressbar"
        aria-valuenow={fillPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Seat availability: ${registeredCount} of ${capacity} seats occupied (${fillPercentage}%)`}
        className="w-full h-2 rounded-full bg-slate-200 overflow-hidden"
      >
        <div
          className={`h-full transition-all duration-500 rounded-full ${barColor}`}
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
    </div>
  );
}
