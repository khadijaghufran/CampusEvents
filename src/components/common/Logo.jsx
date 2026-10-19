import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

/**
 * University Brand Logo for CampusEvents
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional classes.
 * @param {boolean} [props.isLink=true] - Whether to render as home link.
 */
export default function Logo({ className = '', isLink = true }) {
  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Emblem */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-teal-500 shadow-md shadow-teal-700/20 ring-1 ring-white/20">
        {/* Academic Cap / Calendar Icon */}
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {/* Accent dot indicator */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-white rounded-full"></span>
      </div>

      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
          Campus<span className="text-teal-600">Events</span>
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
          University System
        </span>
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        aria-label="CampusEvents Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
