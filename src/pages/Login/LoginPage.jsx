import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { validateLoginForm } from '../../utils/validators';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const initialValues = {
    role: ROLES.STUDENT,
    email: '',
    password: '',
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    validate,
  } = useForm(initialValues, validateLoginForm);

  // If already authenticated, redirect immediately to the respective role dashboard
  // Rendered after all hooks are called to adhere to the Rules of Hooks
  if (isAuthenticated && user?.role) {
    const defaultRoute =
      user.role === ROLES.ADMIN
        ? ROUTES.ADMIN_DASHBOARD
        : user.role === ROLES.ORGANIZER
        ? ROUTES.ORGANIZER_DASHBOARD
        : ROUTES.STUDENT_DASHBOARD;
    return <Navigate to={defaultRoute} replace />;
  }

  // Quick fill helper for review and rapid demonstration
  const handleQuickFill = (roleKey) => {
    setServerError('');
    if (roleKey === ROLES.STUDENT) {
      setFieldValue('role', ROLES.STUDENT);
      setFieldValue('email', 'student@campus.edu');
      setFieldValue('password', 'password123');
    } else if (roleKey === ROLES.ORGANIZER) {
      setFieldValue('role', ROLES.ORGANIZER);
      setFieldValue('email', 'organizer@campus.edu');
      setFieldValue('password', 'password123');
    } else if (roleKey === ROLES.ADMIN) {
      setFieldValue('role', ROLES.ADMIN);
      setFieldValue('email', 'admin@campus.edu');
      setFieldValue('password', 'password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const isValid = validate();
    if (!isValid) return;

    setSubmitting(true);
    try {
      const loggedInUser = await login({
        email: values.email,
        password: values.password,
        role: values.role,
      });

      // Determine redirect destination
      let redirectTarget;
      if (location.state?.from) {
        redirectTarget = location.state.from;
      } else {
        redirectTarget =
          loggedInUser.role === ROLES.ADMIN
            ? ROUTES.ADMIN_DASHBOARD
            : loggedInUser.role === ROLES.ORGANIZER
            ? ROUTES.ORGANIZER_DASHBOARD
            : ROUTES.STUDENT_DASHBOARD;
      }

      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setServerError(
        err.message || 'Authentication failed. Please verify your credentials and role.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Campus Portal Login
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Select your campus affiliation role to access services
          </p>
        </div>

        {location.state?.message && (
          <div className="mb-5">
            <Alert variant="info">{location.state.message}</Alert>
          </div>
        )}

        {serverError && (
          <div className="mb-5">
            <Alert variant="error" onClose={() => setServerError('')}>
              {serverError}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
              Choose Your Role <span className="text-red-500">*</span>
            </legend>

            <div
              className="grid grid-cols-3 gap-2"
              role="radiogroup"
              aria-label="Campus Portal Role"
            >
              {[
                { id: ROLES.STUDENT, label: ROLE_LABELS[ROLES.STUDENT] },
                { id: ROLES.ORGANIZER, label: 'Organizer' },
                { id: ROLES.ADMIN, label: 'Admin' },
              ].map((item) => {
                const isSelected = values.role === item.id;
                return (
                  <label
                    key={item.id}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 text-teal-900 font-bold ring-1 ring-teal-600 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={item.id}
                      checked={isSelected}
                      onChange={handleChange}
                      className="sr-only"
                      aria-checked={isSelected}
                    />
                    <span className="text-xs">{item.label}</span>
                  </label>
                );
              })}
            </div>
            {touched.role && errors.role && (
              <p className="text-xs text-red-600 mt-1">{errors.role}</p>
            )}
          </fieldset>

          <FormField
            id="email"
            label="Email Address"
            required
            error={touched.email ? errors.email : undefined}
          >
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. student@campus.edu"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              autoComplete="email"
              required
            />
          </FormField>

          <FormField
            id="password"
            label="Password"
            required
            error={touched.password ? errors.password : undefined}
            helperText="Must be at least 6 characters"
          >
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && errors.password}
              autoComplete="current-password"
              required
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-teal-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
            />
          </FormField>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
            >
              Sign in to Portal
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
            Quick Demo Autofill
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill(ROLES.STUDENT)}
              className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors border border-teal-200/60"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(ROLES.ORGANIZER)}
              className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors border border-amber-200/60"
            >
              Demo Organizer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(ROLES.ADMIN)}
              className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 transition-colors border border-purple-200/60"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Need assistance with your campus credentials?{' '}
          <Link to={ROUTES.CONTACT} className="text-teal-600 hover:underline font-medium">
            Contact Event Office
          </Link>
        </div>
      </div>
    </div>
  );
}
