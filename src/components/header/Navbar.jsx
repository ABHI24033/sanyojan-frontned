import React, { useState } from "react";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { SearchBar } from "./SearchBar";
import { ProfileMenu } from "./ProfileMenu";
import { NotificationMenu } from "./NotificationMenu";
import "./Navbar.css"; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header-top sticky-top bg-white shadow-sm">
      <div className="container-fluid py-2 " style={{maxWidth:"90vw"}}>
        <div className="d-flex align-items-center justify-content-between">
          {/* Left Section - Nav Links (hidden on small screens) */}
          <div className="d-none d-lg-block">
            <NavLinks />
          </div>

          {/* Center - Brand Logo */}
          <Logo />

          {/* Right Section */}
          <div className="d-flex align-items-center gap-3">
            <SearchBar />

            <NotificationMenu />

            <ProfileMenu />

            {/* Mobile menu toggle */}
            <button
              className="btn btn-outline-secondary d-lg-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="d-lg-none mt-3">
            <NavLinks mobile />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
