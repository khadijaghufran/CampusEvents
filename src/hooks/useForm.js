import { useState, useCallback } from 'react';

/**
 * Custom form management hook providing controlled state, validation, and error tracking.
 *
 * @param {Object} initialValues - Initial field values.
 * @param {Function} validateFn - Validation function returning error object.
 * @returns {Object} Form control helpers and state.
 */
export function useForm(initialValues = {}, validateFn = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const nextVal = type === 'checkbox' ? checked : value;

      setValues((prev) => {
        const updated = {
          ...prev,
          [name]: nextVal,
        };

        if (validateFn) {
          const validationErrors = validateFn(updated) || {};
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validationErrors[name] || undefined,
          }));
        }

        return updated;
      });
    },
    [validateFn]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validateFn) {
        const validationErrors = validateFn(values);
        setErrors(validationErrors || {});
      }
    },
    [validateFn, values]
  );

  const setFieldValue = useCallback(
    (name, value) => {
      setValues((prev) => {
        const updated = { ...prev, [name]: value };
        if (validateFn) {
          const validationErrors = validateFn(updated) || {};
          setErrors(validationErrors);
        }
        return updated;
      });
    },
    [validateFn]
  );

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const validate = useCallback(() => {
    if (!validateFn) return true;
    const validationErrors = validateFn(values) || {};
    setErrors(validationErrors);
    // Mark all keys touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    return Object.keys(validationErrors).length === 0;
  }, [validateFn, values]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setErrors,
    resetForm,
    validate,
  };
}
