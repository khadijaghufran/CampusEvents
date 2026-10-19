import { Link, Outlet } from 'react-router-dom';
import Logo from '../common/Logo';
import { ROUTES } from '../../constants/routes';

/**
 * Centered authentication layout with campus aesthetic and easy home navigation.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 text-slate-900">
      {/* Top Header */}
      <header className="py-6 px-4 sm:px-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Logo />
        <Link
          to={ROUTES.HOME}
          className="text-xs sm:text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors flex items-center gap-1.5 focus:outline-none focus:underline"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </header>

      {/* Auth Card Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-200/60">
        © {new Date().getFullYear()} CampusEvents – University Event & Society Management System.
      </footer>
    </div>
  );
}
