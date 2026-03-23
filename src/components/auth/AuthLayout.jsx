import { Link } from "react-router-dom";

/**
 * Shared layout component for authentication pages
 * Handles the common structure: left image + right form area
 */
const AuthLayout = ({
  children,
  imageSrc = "assets/images/auth/Signup_Page.png",
  showLogo = true,
  logoLink = "/",
  logoSrc = "assets/images/auth/logo.png"
}) => {
  return (
    <section className="relative auth bg-base d-flex flex-wrap">
      {/* Left Side Image */}
      <div className="auth-left d-lg-block d-none vh-100">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img
            src={imageSrc}
            className="h-100 w-100"
            alt="Auth"
          />
        </div>
      </div>

      {/* Right Side Content */}
      <div className="relative auth-right py-32 px-24 d-flex flex-column justify-content-center align-items-center">
        <div className="max-w-464-px pt-32 mx-auto w-100">
          {showLogo && (
            <div className="mt-4">
              <Link to={logoLink} className="mb-20 max-w-290-px">
                <img src={logoSrc} className="h-50-px" alt="Logo" />
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;

