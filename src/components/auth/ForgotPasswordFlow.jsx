import { useState, useMemo, useCallback, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import "./authStyle.css";
import AuthLayout from "./AuthLayout";
import { useForgotPasswordForm } from "../../hooks/useForgotPassword";
import { useOTPVerification } from "../../hooks/useOTPVerification";
import { sendForgotOtp } from "../../api/auth";
import AlertBox from "../ui/Alert";

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1);

  const handleToOTP = useCallback(() => setStep(2), []);
  const handleToPassword = useCallback(() => setStep(3), []);

  // Step 1: Forgot Password Form
  const {
    formData,
    handleChange,
    handleSubmit,
    errors,
    alert: forgotPasswordAlert,
    setAlert: setForgotPasswordAlert,
    isSending,
    handleVerifyOTP,
    handleResetPassword,
    isReseting,
    isVerifying,
    showPassword,
    showConfirm,
    setShowPassword,
    setShowConfirm,
  } = useForgotPasswordForm(handleToOTP, handleToPassword);

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
      setForgotPasswordAlert({ type: "danger", message: error.message || "Verification failed" });
    }
  };

  const handleResendClick = async () => {
    setOtp(Array(4).fill(""));
    setTimer(30);
    inputsRef.current[0]?.focus();
    // Resend OTP by calling sendForgotOtp again
    try {
      await sendForgotOtp({ phone: formData.phone });
      setForgotPasswordAlert({
        type: "success",
        message: "OTP resent successfully!"
      });
    } catch (err) {
      setForgotPasswordAlert({ type: "danger", message: err.message || "Resend failed" });
    }
  };

  return (
    <>
      <AuthLayout imageSrc="assets/images/auth/side_signin.png">
        {/* Step 1: Forgot Password Form */}
        {step === 1 && (
          <>
            <div>
              <h4 className="mb-12">Forgot Password</h4>
              <p className="mb-32 text-secondary-light text-lg">
                Enter the WhatsApp number associated with your account.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="icon-field">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mage:phone" />
                </span>
                <input
                  type="tel"
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Enter WhatsApp Number"
                  name="phone"
                  id="phone"
                  onChange={handleChange}
                  value={formData?.phone}
                />
                {errors?.phone && (
                  <small className="text-danger">{errors?.phone}</small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Continue"}
              </button>

              <div className="text-center">
                <Link to="/sign-in" className="text-primary-600 fw-bold mt-24">
                  Back to Sign In
                </Link>
              </div>

              <div className="mt-120 text-center text-sm">
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
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
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

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <>
            <h4 className="mb-12">Set New Password</h4>
            <p className="mb-32 text-secondary-light text-lg">
              Enter your new password and confirm it below.
            </p>

            <form onSubmit={handleResetPassword}>
              <div className="icon-field mb-3">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mdi:lock-outline" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="New Password"
                  value={formData?.password}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  <Icon
                    icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                  />
                </span>
                {errors?.password && (
                  <p className="text-danger text-sm mt-1">{errors?.password}</p>
                )}
              </div>

              <div className="icon-field mb-3">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mdi:lock-check-outline" />
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Confirm Password"
                  value={formData?.confirmPassword}
                  onChange={handleChange}
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer"
                  onClick={() => setShowConfirm((p) => !p)}
                >
                  <Icon
                    icon={showConfirm ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                  />
                </span>
                {errors?.confirmPassword && (
                  <p className="text-danger text-sm mt-1">
                    {errors?.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                disabled={isReseting}
              >
                {isReseting ? "Saving" : "Save Password"}
              </button>

              <div className="text-center mt-24">
                <Link to="/sign-in" className="text-primary-600 fw-bold">
                  Back to Sign In
                </Link>
              </div>
            </form>
          </>
        )}
      </AuthLayout>
      <AlertBox alert={forgotPasswordAlert} setAlert={setForgotPasswordAlert} />
    </>
  );
};

export default ForgotPasswordFlow;

