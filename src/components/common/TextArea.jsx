import React from "react";

export default function TextArea({
  label,
  name,
  id,
  value,
  onChange,
  required = false,
  error = "",
  placeholder = "",
  className = "",    // extra class for external div
  rows = 3,
}) {
  return (
    <div className={`form-group ${className}`}>

      {/* Label */}
      {label && (
        <label htmlFor={id} className="form-label d-flex align-items-center fw-medium">
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control ${error ? "is-invalid" : ""}`}
        style={{ resize: "vertical" }}
        required={required}
      />

      {/* Error Message */}
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
}
