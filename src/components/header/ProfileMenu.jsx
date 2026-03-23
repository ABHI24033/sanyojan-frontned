import React, { useState } from "react";

export const ProfileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="position-relative">
      <img
        src="/assets/images/avatar/user.png"
        alt="User"
        className="rounded-circle"
        width="35"
        height="35"
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="dropdown-menu dropdown-menu-start  show p-2 shadow-sm">
          <div className="mb-2 border-bottom pb-2">
            <strong>Madison Howard</strong>
            <p className="text-muted small mb-0">mailnam@mail.com</p>
          </div>
          <ul className="list-unstyled mb-0">
            <li>
              <a href="/profile" className="dropdown-item">
                Profile
              </a>
            </li>
            <li>
              <a href="/settings" className="dropdown-item">
                Settings
              </a>
            </li>
            <li>
              <a href="/logout" className="dropdown-item text-danger">
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
