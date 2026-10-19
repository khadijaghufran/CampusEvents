/**
 * Accessible SVG loading spinner
 *
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size of spinner.
 * @param {string} [props.className] - Additional classes.
 * @param {string} [props.label='Loading...'] - Screen reader announcement.
 */
export default function Spinner({ size = 'md', className = '', label = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg
        className={`animate-spin text-current ${sizeClasses[size] || sizeClasses.md}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}
