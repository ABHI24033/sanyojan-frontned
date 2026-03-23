import React, { useState } from "react";

export const NotificationMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="position-relative">
      <button
        className="btn btn-light position-relative"
        onClick={() => setOpen(!open)}
      >
        <i className="bi bi-bell"></i>
        <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
          3
        </span>
      </button>

      {open && (
        <div className="dropdown-menu dropdown-menu-end show p-2 shadow-sm">
          <p className="fw-bold mb-2">Notifications</p>
          <div className="small text-muted">No new notifications</div>
        </div>
      )}
    </div>
  );
};
