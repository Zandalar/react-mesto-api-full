import React from 'react';

function useValidator() {
  const [values, setValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [isValid, setIsValid] = React.useState(false);

  function handleChange(evt) {
    setValues({ ...values, [evt.target.name]: evt.target.value });
    setErrors({ ...errors, [evt.target.name]: evt.target.validationMessage });
    setIsValid(evt.target.closest('form').checkValidity());
  }

  function resetForm() {
    setValues({});
    setErrors({});
    setIsValid(false);
  }
  return {
    values, errors, isValid, handleChange, resetForm,
  };
}

export default useValidator;
