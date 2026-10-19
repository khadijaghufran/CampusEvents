import { forwardRef } from 'react';

/**
 * Accessible Textarea component
 */
const Textarea = forwardRef(function Textarea(
  {
    id,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    rows = 4,
    disabled = false,
    required = false,
    error,
    helperText,
    className = '',
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
    <textarea
      ref={ref}
      id={id}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      className={`w-full rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border transition-colors duration-200 outline-none focus:ring-2 focus:ring-offset-1 resize-y disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
        error
          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
          : 'border-slate-300 hover:border-slate-400 focus:border-teal-500 focus:ring-teal-100'
      } ${className}`}
      {...rest}
    />
  );
});

export default Textarea;
