/**
 * Reusable form field wrapper managing label, error message, and accessibility attributes.
 *
 * @param {Object} props
 * @param {string} props.id - HTML element id.
 * @param {string} props.label - Human readable label.
 * @param {string} [props.error] - Error message to display.
 * @param {string} [props.helperText] - Supporting guidance text.
 * @param {boolean} [props.required=false] - Whether field is required.
 * @param {React.ReactNode} props.children - Input or Select element.
 * @param {string} [props.className] - Additional wrapper styles.
 */
export default function FormField({
  id,
  label,
  error,
  helperText,
  required = false,
  children,
  className = '',
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 select-none"
        >
          {label}
          {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
        </label>
      )}

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-red-600 flex items-center gap-1.5 mt-1"
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-slate-500 mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
