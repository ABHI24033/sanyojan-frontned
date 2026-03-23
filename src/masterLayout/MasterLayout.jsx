/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from '../components/header/NotificationDropdown';
import { useQuery } from "@tanstack/react-query";
import { getMyEvents } from "../api/event";

const MasterLayout = ({ children }) => {
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation(); // Hook to get the current route
  const { logout, user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Check if user has created any events for conditional sidebar visibility
  const { data: userEventsData } = useQuery({
    queryKey: ["userCreatedEventsCount"],
    queryFn: () => getMyEvents({ limit: 1 }),
    enabled: !!user,
  });

  const hasCreatedEvents = (userEventsData?.data || userEventsData)?.length > 0;

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };


  useEffect(() => {
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
        }
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          const href = link.getAttribute("href") || link.getAttribute("to");
          if (
            href === location.pathname ||
            (href === "/reports" && location.pathname.includes("/report"))
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
              ? "sidebar sidebar-open"
              : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type='button'
          className='sidebar-close-btn'
        >
          <Icon icon='radix-icons:cross-2' />
        </button>
        <div>
          <Link to='/' className='sidebar-logo'>
            <img
              src='/assets/images/auth/logo.png'
              alt='site logo'
              className='light-logo'
            />
            <img
              src='/assets/images/auth/logo.png'
              alt='site logo'
              className='dark-logo'
            />
            <img
              src='/assets/images/auth/logo-mobile.png'
              alt='site logo'
              className='logo-icon'
            />
          </Link>
        </div>
        <div className='sidebar-menu-area mb-4 pb-5'>
          <ul className='sidebar-menu' id='sidebar-menu'>

            {/* <li className='sidebar-menu-group-title'>Block 1</li> */}
            {!user?.isSuperAdmin && (
              <>
                <li className=''>
                  <NavLink
                    to='/'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon
                      icon='solar:graph-up-outline'
                      className='menu-icon'
                    />
                    <span>My Wall</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to='/received-invitations'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon
                      icon='solar:letter-unread-outline'
                      className='menu-icon'
                    />
                    <span>My Invitations</span>
                  </NavLink>
                </li>

                {/* {hasCreatedEvents && ( */}
                <li className='dropdown'>
                  <Link to='#'>
                    <Icon
                      icon='solar:calendar-bold-duotone'
                      className='menu-icon'
                    />
                    <span>Event Management</span>
                  </Link>
                  <ul className='sidebar-submenu'>
                    <li>
                      <NavLink
                        to='/create-event'
                        className={(navData) =>
                          navData.isActive ? "active-page" : ""
                        }
                      >
                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                        Create Event
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to='/invitations'
                        className={(navData) =>
                          navData.isActive ? "active-page" : ""
                        }
                      >
                        <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                        Event Details
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to='/sent-invitations'
                        className={(navData) =>
                          navData.isActive ? "active-page" : ""
                        }
                      >
                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                        Sent Invitations
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to='/reports'
                        className={(navData) =>
                          navData.isActive || location.pathname.includes("/report") ? "active-page" : ""
                        }
                      >
                        <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                        Reports
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to='/event-attendance'
                        className={(navData) =>
                          navData.isActive ? "active-page" : ""
                        }
                      >
                        <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                        Attendance in Event
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li>
                  <NavLink
                    to="/notice"
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon icon="solar:document-text-outline" className="menu-icon" />
                    <span>Notice Board</span>
                  </NavLink>
                </li>
              </>
            )}


            {user?.isAdmin && (
              <li className='dropdown' style={{ marginBottom: '-12px' }}>
                <Link to='#'>
                  <Icon
                    icon='icon-park-outline:setting-two'
                    className='menu-icon'
                  />
                  <span>Admin Notices</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                      to='/add-notice'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      Add Notice
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/admin-notices'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                      Manage Notices
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            {user?.isSuperAdmin && (
              <li className='dropdown' style={{ marginBottom: '-12px' }}>
                <Link to='#'>
                  <Icon
                    icon='solar:shield-user-bold-duotone'
                    className='menu-icon'
                  />
                  <span>Super Admin</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                      to='/admin/knowledge-bank'
                      className={(navData) => {
                        const isEdit = location.pathname.startsWith('/edit-knowledge-bank');
                        return (navData.isActive || isEdit) ? "active-page" : "";
                      }}
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      Manage Knowledge Bank
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/create-knowledge-bank'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                      Add Knowledge Bank
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/admin/settings'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                      System Settings
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/admin/user-ips'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                      User IPs
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}


            {!user?.isSuperAdmin && (
              <>
                <li>
                  <NavLink
                    to='/notifications'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <div className='position-relative d-inline-block'>
                      <Icon
                        icon='solar:bell-outline'
                        className='menu-icon'
                      />
                      {/* <span className='position-absolute translate-middle badge rounded-circle bg-warning text-dark' style={{ fontSize: '0.65rem', padding: '2px 5px', minWidth: '18px', height: '18px', lineHeight: '14px', top: '3px', right: '-8px' }}>
                    1
                  </span> */}
                    </div>
                    <span>Notifications</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to='/family-tree'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon
                      icon='solar:users-group-rounded-outline'
                      className='menu-icon'
                    />
                    <span>Family Tree</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to='/friends-relatives'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon
                      icon='solar:users-group-two-rounded-outline'
                      className='menu-icon'
                    />
                    <span>Friends and Relatives</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to='/knowledge-bank'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon
                      icon='solar:library-outline'
                      className='menu-icon'
                    />
                    <span>Community Rituals</span>
                  </NavLink>
                </li>

                {/* <li>
              <Link
                to='#'
                onClick={(e) => {
                  e.preventDefault();
                  if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
                    console.log('Delete profile');
                  }
                }}
                className='text-danger'
              >
                <Icon
                  icon='solar:trash-bin-trash-outline'
                  className='menu-icon'
                />
                <span>Delete My Profile</span>
              </Link>
            </li> */}

                <li>
                  <NavLink
                    to={`/profile?userId=${user?.id}`}
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon
                      icon='solar:user-linear'
                      className='menu-icon'
                    />
                    <span>View Profile</span>
                  </NavLink>
                </li>
                {(user?.isAdmin || user?.isSuperAdmin) && (
                  <li className='dropdown' style={{ marginBottom: '-12px' }}>
                    <Link to='#'>
                      <Icon
                        icon='solar:settings-linear'
                        className='menu-icon'
                      />
                      <span>Settings</span>
                    </Link>
                    <ul className='sidebar-submenu'>
                      {/* <li>
                    <NavLink
                      to='/settings/manage-admin'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                      Manage Admin
                    </NavLink>
                  </li> */}

                      <li>
                        <NavLink
                          to='/my-subscription'
                          className={(navData) => (navData.isActive ? "active-page" : "")}
                        >
                          <Icon
                            icon='solar:crown-linear'
                            className='menu-icon'
                          />
                          <span>Manage Subscription</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to='/settings/manage-subadmin'
                          className={(navData) =>
                            navData.isActive ? "active-page" : ""
                          }
                        >
                          {/* <i className=' text-primary-600 w-auto' />{" "} */}
                          <i className="ri-admin-line  mr-2"></i>{" "}
                          Manage SubAdmin
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to='/settings/manage-coordinator'
                          className={(navData) =>
                            navData.isActive ? "active-page" : ""
                          }
                        >
                          {/* <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "} */}
                          <i className="ri-user-star-line  mr-2"></i>{" "}
                          Manage Coordinator
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                )}

                <li>
                  <NavLink
                    to='/follow-us'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon
                      icon='solar:share-bold'
                      className='menu-icon'
                    />
                    <span>Follow Us</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to='/help'
                    className={(navData) => (navData.isActive ? "active-page" : "")}
                  >
                    <Icon
                      icon='solar:question-circle-outline'
                      className='menu-icon'
                    />
                    <span>Help</span>
                  </NavLink>
                </li>
              </>
            )}


            <li>
              <Link
                to='#'
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogoutModal(true);
                }}
                className='d-flex align-items-center text-danger'
              >
                <Icon icon='solar:logout-2-outline' className='menu-icon' />
                <span>Log Out</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="p-3 w-100 mt-4 bg-white text-start position-absolute bottom-0 start-0">
          <span className="text-secondary small" style={{ fontSize: '14px', opacity: 0.8 }}>Version 1.0.0</span>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className='navbar-header'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-4'>
                <button
                  type='button'
                  className='sidebar-toggle'
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon='iconoir:arrow-right'
                      className='icon text-2xl non-active'
                    />
                  ) : (
                    <Icon
                      icon='heroicons:bars-3-solid'
                      className='icon text-2xl non-active '
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type='button'
                  className='sidebar-mobile-toggle'
                >
                  <Icon icon='heroicons:bars-3-solid' className='icon' />
                </button>
                {/* <form className='navbar-search'>
                  <input type='text' name='search' placeholder='Search' />
                  <Icon icon='ion:search-outline' className='icon' />
                </form> */}
              </div>
            </div>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-3'>
                {/* Notification dropdown start */}
                <NotificationDropdown />
                <div className='dropdown'>
                  <button
                    className='d-flex justify-content-center align-items-center border rounded-circle'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="User"
                        className="w-40-px h-40-px object-fit-cover rounded-circle"
                      />
                    ) : (
                      <div
                        className="w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-primary text-white fw-bold"
                        style={{ fontSize: "14px" }}
                      >
                        {(
                          (user?.firstname?.[0] || "") +
                          (user?.lastname?.[0] || "")
                        ).toUpperCase()}
                      </div>
                    )}
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                          {user?.firstname + " " + user?.lastname}
                        </h6>
                        <span className='text-secondary-light fw-medium text-sm'>
                          {user?.isAdmin ? "Admin" : "User"}
                        </span>
                      </div>
                      <button type='button' className='hover-text-danger'>
                        <Icon
                          icon='radix-icons:cross-1'
                          className='icon text-xl'
                        />
                      </button>
                    </div>
                    <ul className='to-top-list'>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/profile'
                        >
                          <Icon
                            icon='solar:user-linear'
                            className='icon text-xl'
                          />{" "}
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3 w-100 border-0 bg-transparent text-start'
                          onClick={() => setShowLogoutModal(true)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Icon icon='lucide:power' className='icon text-xl' />{" "}
                          Log Out
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className='dashboard-main-body'>{children}</div>

        {/* Footer section */}
        <footer className='d-footer'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <p className='mb-0'>© {new Date().getFullYear()} Sanyojan. All Rights Reserved.</p>
            </div>
            <div className='col-auto'>
              <p className='mb-0'>
                {/* Made by <span className='text-primary-600'>Sanyojan</span> */}
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered size="sm">
        <Modal.Body className="p-24 text-center">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-16"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#fee2e2'
            }}
          >
            <Icon icon="solar:logout-2-bold" style={{ fontSize: '32px', color: '#ef4444' }} />
          </div>
          <h5 className="fw-bold text-neutral-900 mb-8">Log Out</h5>
          <p className="text-neutral-600 mb-24 text-sm">
            Are you sure you want to log out?
          </p>
          <div className="d-flex gap-12 justify-content-center">
            <button
              type="button"
              className="btn btn-light text-sm px-20 py-10 radius-8 flex-grow-1"
              onClick={() => setShowLogoutModal(false)}
            >
              No
            </button>
            <button
              type="button"
              className="btn btn-danger text-sm px-20 py-10 radius-8 flex-grow-1"
              onClick={handleLogout}
              style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
            >
              Yes, Log Out
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default MasterLayout;
