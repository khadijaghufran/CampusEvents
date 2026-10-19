import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { ROLES, ROLE_LABELS } from '../../constants/roles';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardRoute = () => {
    if (!user) return ROUTES.HOME;
    if (user.role === ROLES.ADMIN) return ROUTES.ADMIN_DASHBOARD;
    if (user.role === ROLES.ORGANIZER) return ROUTES.ORGANIZER_DASHBOARD;
    return ROUTES.STUDENT_DASHBOARD;
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
      isActive
        ? 'text-teal-700 bg-teal-50 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block text-base font-medium px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'text-teal-700 bg-teal-50 font-semibold'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            <NavLink to={ROUTES.HOME} end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to={ROUTES.CONTACT} className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardRoute()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-colors"
                  title="Go to dashboard"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-sm font-medium text-slate-800">
                    {user?.name || 'Dashboard'}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    {ROLE_LABELS[user?.role] || user?.role}
                  </span>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  aria-label="Log out of account"
                >
                  Log out
                </Button>
              </div>
            ) : (
              <Link to={ROUTES.LOGIN}>
                <Button variant="primary" size="sm">
                  Log in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2">
          <NavLink
            to={ROUTES.HOME}
            end
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to={ROUTES.CONTACT}
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Contact
          </NavLink>

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg bg-teal-50 border border-teal-200"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-teal-700">{ROLE_LABELS[user?.role] || user?.role}</p>
                  </div>
                  <span className="text-xs font-semibold text-teal-800 underline">
                    Open Dashboard →
                  </span>
                </Link>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setMobileMenuOpen(false)}
                className="block"
              >
                <Button variant="primary" fullWidth>
                  Log in
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
