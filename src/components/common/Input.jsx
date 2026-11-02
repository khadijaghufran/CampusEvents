import { forwardRef } from 'react';

/**
 * Accessible Input component supporting numeric restriction, accessibility attributes, and error styling.
 */
const Input = forwardRef(function Input(
  {
    id,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    onKeyDown,
    placeholder,
    disabled = false,
    required = false,
    numericOnly = false,
    min,
    max,
    step,
    error,
    helperText,
    endAdornment,
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

  const handleKeyDown = (e) => {
    // If field is numeric or numericOnly, prevent invalid characters (e, E, +, -) unless explicitly allowed
    if (type === 'number' || numericOnly) {
      if (['e', 'E'].includes(e.key)) {
        e.preventDefault();
      }
      if (min !== undefined && Number(min) >= 0 && e.key === '-') {
        e.preventDefault();
      }
      if (numericOnly) {
        const allowedControlKeys = [
          'Backspace',
          'Tab',
          'Enter',
          'Delete',
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'Home',
          'End',
        ];
        if (!allowedControlKeys.includes(e.key) && !e.ctrlKey && !e.metaKey && !/^\d$/.test(e.key)) {
          e.preventDefault();
        }
      }
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="relative">
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        step={step}
        inputMode={type === 'number' || numericOnly ? 'numeric' : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`w-full rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border transition-colors duration-200 outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 pr-10'
            : 'border-slate-300 hover:border-slate-400 focus:border-teal-500 focus:ring-teal-100'
        } ${endAdornment ? 'pr-10' : ''} ${className}`}
        {...rest}
      />
      {endAdornment && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {endAdornment}
        </div>
      )}
    </div>
  );
});

export default Input;
