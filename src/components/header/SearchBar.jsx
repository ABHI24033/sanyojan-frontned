import React from "react";

export const SearchBar = () => (
  <form className="d-none d-md-flex align-items-center border rounded px-2">
    <input
      type="text"
      className="form-control border-0"
      placeholder="Search..."
      style={{ width: "180px" }}
    />
    <button type="submit" className="btn btn-light p-1">
      <i className="bi bi-search"></i>
    </button>
  </form>
);
