import { useState, useMemo, useCallback, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useNavigate } from "react-router-dom";
import "./authStyle.css";
import AuthLayout from "./AuthLayout";
import { useSignUpForm } from "../../hooks/useSignUpForm.jsx";
import { useOTPVerification } from "../../hooks/useOTPVerification";
import AlertBox from "../ui/Alert";

const SignUpFlow = () => {
  const [step, setStep] = useState(1);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleToOTP = useCallback(() => setStep(2), []);
  const handleToPassword = useCallback(() => {
    // Password is already set during signup, navigate to home after OTP verification
    navigate("/");
  }, [navigate]);

  // Step 1: Sign Up Form
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    alert: signUpAlert,
    setAlert: setSignUpAlert,
    handleResend,
    isPending: isSignUpPending,
    handleVerifyOtp,
  } = useSignUpForm(handleToOTP, handleToPassword);

  // Step 2: OTP Verification
  const memoizedPhone = useMemo(() => formData.phone, [formData.phone]);
  const {
    otp,
    timer,
    inputsRef,
    handleChange: handleOtpChange,
    handleKeyDown,
    setOtp,
    setTimer,
  } = useOTPVerification(4, memoizedPhone);

  // State to show the OTP hint after 5 seconds
  const [showOtpHint, setShowOtpHint] = useState(false);

  // Effect to handle the 5-second timer
  useEffect(() => {
    let timeout;
    if (step === 2) {
      setShowOtpHint(false); // Reset when entering step 2
      timeout = setTimeout(() => {
        setShowOtpHint(true);
      }, 1000);
    } else {
      setShowOtpHint(false);
    }
    return () => clearTimeout(timeout);
  }, [step]);

  const verifyOTP = async () => {
    try {
      await handleVerifyOtp(otp);
    } catch (error) {
      setSignUpAlert({ type: "danger", message: error.message || "Verification failed" });
    }
  };

  const handleResendClick = async () => {
    setOtp(Array(4).fill(""));
    setTimer(30);
    inputsRef.current[0]?.focus();
    try {
      await handleResend();
    } catch (err) {
      setSignUpAlert({ type: "danger", message: err.message || "Resend failed" });
    }
  };

  return (
    <>
      <AuthLayout>
        {/* Step 1: Sign Up Form */}
        {step === 1 && (
          <>
            <div className="mt-4">
              <h4 className="mb-12">Create your Account Now</h4>
              <p className="text-secondary-light text-lg">
                Welcome! please enter your detail
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="d-flex gap-4">
                <div className="icon-field mb-16">
                  <span className="icon top-50 translate-middle-y">
                    <Icon icon="f7:person" />
                  </span>
                  <input
                    type="text"
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    placeholder="First Name"
                    name="firstname"
                    value={formData?.firstname}
                    onChange={handleChange}
                  />
                  {errors.firstname && (
                    <p className="text-danger text-sm mt-1">{errors.firstname}</p>
                  )}
                </div>

                <div className="icon-field mb-16">
                  <span className="icon top-50 translate-middle-y">
                    <Icon icon="f7:person" />
                  </span>
                  <input
                    type="text"
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    placeholder="Last Name"
                    name="lastname"
                    value={formData?.lastname}
                    onChange={handleChange}
                  />
                  {errors.lastname && (
                    <p className="text-danger text-sm mt-1">{errors.lastname}</p>
                  )}
                </div>
              </div>

              <div className="icon-field mb-16">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mdi:phone" />
                </span>
                <input
                  type="text"
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="WhatsApp Number"
                  name="phone"
                  value={formData?.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="text-danger text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="icon-field mb-16">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mdi:lock-outline" />
                </span>
                <input
                  type={showSignUpPassword ? "text" : "password"}
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Password"
                  name="password"
                  value={formData?.password}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer"
                  onClick={() => setShowSignUpPassword((p) => !p)}
                >
                  <Icon
                    icon={showSignUpPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                  />
                </span>
                {errors.password && (
                  <p className="text-danger text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="icon-field mb-16">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mdi:lock-check-outline" />
                </span>
                <input
                  type={showSignUpConfirmPassword ? "text" : "password"}
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData?.confirmPassword}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer"
                  onClick={() => setShowSignUpConfirmPassword((p) => !p)}
                >
                  <Icon
                    icon={showSignUpConfirmPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                  />
                </span>
                {errors.confirmPassword && (
                  <p className="text-danger text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-16"
                disabled={isSignUpPending}
              >
                {isSignUpPending ? "Creating..." : "Create Account"}
              </button>

              <div className="mt-32 text-center text-sm">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="text-primary-600 fw-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="text-center gap-5">
            <h4 className="fw-semibold mb-16">Enter OTP</h4>
            <p className="text-muted mb-32 text-lg">
              Please enter the 4-digit code sent to your phone.
            </p>

            {/* {showOtpHint && (
              <p className="text-muted fw-medium mb-32 text-md animate__animated animate__fadeIn">
                If you did not receive the OTP, please use <span className="text-primary fw-bold">1234</span> to verify.
              </p>
            )} */}

            <div className="d-flex justify-content-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="text-center otp-input fw-bold border border-2 rounded"
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    fontSize: "1.25rem",
                    borderColor: "#ced4da",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0d6efd")}
                  onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
                />
              ))}
            </div>

            <button
              onClick={verifyOTP}
              className="btn btn-primary w-100 py-10 fw-semibold mb-3"
              style={{ marginTop: "20px" }}
              disabled={isSignUpPending}
            >
              {isSignUpPending ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-muted">
              {timer > 0 ? (
                <span>Resend OTP in {timer}s</span>
              ) : (
                <button
                  onClick={handleResendClick}
                  className="btn p-0 fw-semibold text-primary text-decoration-none"
                  style={{ background: "none" }}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}
      </AuthLayout>
      <AlertBox alert={signUpAlert} setAlert={setSignUpAlert} />
    </>
  );
};

export default SignUpFlow;

