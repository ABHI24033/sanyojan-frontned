import React from "react";

const Input = ({
  label,
  name,
  id,
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  error = "",
  required = false,
  className,
  inputClassName,
  disable
}) => {
  return (
    <div className={`${className} mb-3`}>
      {label && (
        <label htmlFor={id || name} className="form-label d-flex align-items-center fw-semibold">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disable}
        className={`form-control ${error ? "is-invalid" : ""} ${inputClassName}`}
      />

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Input;
