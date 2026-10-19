import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 border border-teal-200">
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <span className="text-sm font-semibold tracking-wider text-teal-600 uppercase mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-base text-slate-600 max-w-md mb-8">
        The campus page or resource you are looking for does not exist or has been relocated.
      </p>

      <Link to={ROUTES.HOME}>
        <Button variant="primary" size="md">
          Return to Home Page
        </Button>
      </Link>
    </div>
  );
}
