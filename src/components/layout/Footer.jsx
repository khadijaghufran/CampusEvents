import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { ROUTES } from '../../constants/routes';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="brightness-110">
              <Logo isLink={false} className="text-white [&_span]:text-white [&_span.text-teal-600]:text-teal-400 [&_span.text-slate-500]:text-slate-400" />
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              CampusEvents digitizes the entire university event lifecycle: empowering student
              societies to propose events, enabling admin conflict-free venue approvals, offering
              students instant seat booking with real-time capacity management, digital attendance,
              and verifiable certificates.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-4">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Home Page
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CONTACT}
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Contact & Office Details
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.LOGIN}
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Lifecycle & Help */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-4">
              University Pillars
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Role-Based Access Control</li>
              <li>Venue Conflict Prevention</li>
              <li>Automated Seat Metering</li>
              <li>Digital Attendance & Feedback</li>
              <li>Verifiable Certificates</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} CampusEvents – University Event & Society Management System.</p>
          <div className="flex items-center space-x-6">
            <span>Student Affairs Office</span>
            <span>Academic Affairs</span>
            <span>Campus Services</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
