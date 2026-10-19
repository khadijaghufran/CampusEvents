import { forwardRef } from 'react';

/**
 * Accessible Select component
 */
const Select = forwardRef(function Select(
  {
    id,
    name,
    value,
    onChange,
    onBlur,
    options = [],
    placeholder = 'Select an option',
    disabled = false,
    required = false,
    error,
    helperText,
    className = '',
    children,
    ...rest
  },
  ref
) {
  const describedBy = error
    ? `${id}-error`
    : helperText
    ? `${id}-helper`
    : undefined;

  return (
    <div className="relative">
      <select
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`w-full appearance-none rounded-lg px-3.5 py-2.5 pr-10 text-sm text-slate-900 bg-white border transition-colors duration-200 outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-300 hover:border-slate-400 focus:border-teal-500 focus:ring-teal-100'
        } ${className}`}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children ||
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
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
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
});

export default Select;
