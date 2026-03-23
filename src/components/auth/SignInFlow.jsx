import { useState, useMemo, useCallback, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import "./authStyle.css";
import AuthLayout from "./AuthLayout";
import { useSignInForm } from "../../hooks/useSignIn.jsx";
import { useOTPVerification } from "../../hooks/useOTPVerification";
import { signInUser } from "../../api/auth";
import AlertBox from "../ui/Alert";

const SignInFlow = () => {
  const [step, setStep] = useState(1);

  const handleToOTP = useCallback(() => setStep(2), []);

  // Step 1: Sign In Form
  const {
    formData,
    handleChange,
    handleSubmit,
    showPassword,
    toggleShowPassword,
    errors,
    alert: signInAlert,
    setAlert: setSignInAlert,
    handleVerifyOTP,
    isPending: isSignInPending,
  } = useSignInForm(handleToOTP);

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
      await handleVerifyOTP(otp);
    } catch (error) {
      setSignInAlert({ type: "danger", message: error.message || "Verification failed" });
    }
  };

  const handleResendClick = async () => {
    setOtp(Array(4).fill(""));
    setTimer(30);
    inputsRef.current[0]?.focus();
    // Resend OTP by calling signInUser again
    try {
      await signInUser({
        phone: formData.phone,
        password: formData.password
      });
      setSignInAlert({
        type: "success",
        message: "OTP resent successfully!"
      });
    } catch (err) {
      setSignInAlert({ type: "danger", message: err.message || "Resend failed" });
    }
  };

  return (
    <>
      <AuthLayout imageSrc="assets/images/auth/side_signin.png">
        {/* Step 1: Sign In Form */}
        {step === 1 && (
          <>
            <div className="mb-4">
              <h4 className="mb-12">Sign In to your Account</h4>
              <p className="mb-32 text-secondary-light text-lg">
                Welcome back! Please enter your details.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Phone */}
              <div className="icon-field mb-16">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mage:phone" />
                </span>
                <input
                  type="tel"
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="WhatsApp Number"
                  name="phone"
                  value={formData?.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <small className="text-danger">{errors.phone}</small>
                )}
              </div>

              {/* Password */}
              <div className="position-relative mb-20">
                <div className="icon-field">
                  <span className="icon top-50 translate-middle-y">
                    <Icon icon="solar:lock-password-outline" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData?.password}
                    onChange={handleChange}
                  />
                </div>
                <span
                  className="toggle-password position-absolute end-0 top-50 translate-middle-y me-16 cursor-pointer text-secondary-light"
                  onClick={toggleShowPassword}
                >
                  <Icon icon={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                </span>
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="d-flex justify-content-end gap-2 mb-3">
                <Link to="/forgot-password" className="text-primary-600 fw-medium">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-16"
                disabled={isSignInPending}
              >
                {isSignInPending ? "Signing in..." : "Sign In"}
              </button>

              <div className="mt-32 text-center text-sm">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-primary-600 fw-semibold">
                    Sign Up
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
              disabled={isSignInPending}
            >
              {isSignInPending ? "Verifying..." : "Verify OTP"}
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
      <AlertBox alert={signInAlert} setAlert={setSignInAlert} />
    </>
  );
};

export default SignInFlow;

