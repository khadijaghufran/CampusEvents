/**
 * Accessible Alert message banner
 *
 * @param {Object} props
 * @param {'success'|'error'|'warning'|'info'} [props.variant='info']
 * @param {string} [props.title] - Optional bold title.
 * @param {React.ReactNode} props.children - Alert body message.
 * @param {Function} [props.onClose] - Optional dismiss handler.
 * @param {string} [props.className] - Additional classes.
 */
export default function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) {
  const variantStyles = {
    success: {
      container: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      iconColor: 'text-emerald-600',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    error: {
      container: 'bg-red-50 border-red-300 text-red-900',
      iconColor: 'text-red-600',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    warning: {
      container: 'bg-amber-50 border-amber-300 text-amber-900',
      iconColor: 'text-amber-600',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      ),
    },
    info: {
      container: 'bg-teal-50 border-teal-300 text-teal-900',
      iconColor: 'text-teal-600',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
  };

  const current = variantStyles[variant] || variantStyles.info;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 p-4 rounded-xl border ${current.container} shadow-sm ${className}`}
    >
      <div className={`flex-shrink-0 mt-0.5 ${current.iconColor}`}>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {current.icon}
        </svg>
      </div>

      <div className="flex-1 text-sm leading-relaxed">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          aria-label="Dismiss alert"
        >
          <svg
            className="w-4 h-4 text-slate-500 hover:text-slate-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
