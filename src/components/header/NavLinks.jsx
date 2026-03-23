import React from "react";

export const NavLinks = ({ mobile = false }) => (
  <nav>
    <ul
      className={`list-unstyled mb-0 ${
        mobile ? "d-block text-center" : "d-flex gap-4"
      }`}
    >
      <li>
        <a href="/" className="text-decoration-none text-dark fw-semibold">
          Home
        </a>
      </li>
      <li>
        <a href="/sign-up" className="text-decoration-none text-dark fw-semibold">
          Sign Up
        </a>
      </li>
      <li>
        <a href="/sign-in" className="text-decoration-none text-dark fw-semibold">
          Sign In
        </a>
      </li>
    </ul>
  </nav>
);
