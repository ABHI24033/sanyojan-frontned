import React from "react";

export default function SelectBox({
  label,
  required = false,
  name,
  id,
  options = [],
  value,
  defaultValue,
  onChange,
  error = "",
  className = "",
  selectClass,
}) {
  return (
    <div className={`mb-3 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="form-label fw-semibold">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      {/* Select Box */}
      <div className="position-relative">
        <select
          id={id}
          name={name}
          className={`form-control form-select ${error ? "is-invalid" : ""} `}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          required={required}
        >
          <option value="" disabled>
            {defaultValue || "Select"}
          </option>

          {options?.map((opt, index) => (
            <option key={index} value={opt.value}>
              {opt?.label}
            </option>
          ))}
        </select>

        {/* Error Message */}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
}
