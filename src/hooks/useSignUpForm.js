import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendSignUpOtp, verifySignUpOtp, resendSignUpOtp } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function useSignUpForm(handleNext, handletoPassword) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();
  const { refetch: refetchAuth } = useAuth();

  // ✅ Validation
  const validate = () => {
    const nextErrors = {};
    if (!formData.firstname.trim()) nextErrors.firstname = "First name is required";
    if (!formData.lastname.trim()) nextErrors.lastname = "Last name is required";
    if (!formData.phone.trim()) nextErrors.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      nextErrors.phone = "Enter valid 10-digit phone number";
    if (!formData.password.trim()) nextErrors.password = "Password is required";
    else if (formData.password.length < 8)
      nextErrors.password = "Password must be at least 8 characters long";
    else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password))
      nextErrors.password = "Password must contain at least one letter and one number";
    else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`])/.test(formData.password))
      nextErrors.password = "Password must contain at least one special character";
    if (!formData.confirmPassword.trim()) nextErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      nextErrors.confirmPassword = "Passwords do not match";

    setErrors(nextErrors);
    const errorKeys = Object.keys(nextErrors);
    const errorMsg = errorKeys.length > 0 ? nextErrors[errorKeys[0]] : null;
    return { isValid: errorKeys.length === 0, errorMsg };
  };

  // ✅ Signup Mutation (to get OTP)
  const signupMutation = useMutation({
    mutationFn: (payload) => sendSignUpOtp(payload),
    onSuccess: (data) => {
      console.log(data);
      setAlert({
        type: "success",
        message: "OTP sent successfully to your phone!",
      });
      handleNext();
    },
    onError: (err) => {
      const errorMessage = err?.message || "Failed to send OTP. Please try again.";
      const isAlreadyRegistered = errorMessage.toLowerCase().includes("already exists");

      setAlert({
        type: "danger",
        message: isAlreadyRegistered ? (
          <>
            <p>{errorMessage}</p>
            <br />
            <Link to="/sign-in" className="text-primary-600 fw-bold">
              Go to login page
            </Link>
          </>
        ) : errorMessage,
      });
    },
  });

  // ✅ Submit Signup
  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    if (!validation.isValid) {
      setAlert({ type: "danger", message: validation.errorMsg || "Please fix errors above." });
      return;
    }
    signupMutation.mutate({
      firstname: formData.firstname.trim(),
      lastname: formData?.lastname.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
    });
  };
  // =================verify OTP======================== 
  const verifyOtpMutation = useMutation({
    mutationFn: (payload) => verifySignUpOtp(payload),
    onSuccess: async (data) => {
      console.log(data);
      // Refetch auth to update context with new accessToken
      await refetchAuth();
      setAlert({
        type: "success",
        message: "Account verified successfully!",
      });
      handletoPassword();
    },
    onError: (err) => {
      console.log(err);
      setAlert({
        type: "danger",
        message: err?.message || "Invalid OTP, please retry.",
      });
    },
  });

  // ✅ Submit OTP Verification
  const handleVerifyOtp = (otp) => {
    const enteredOtp = otp.join("");

    if (!enteredOtp) {
      setAlert({ type: "danger", message: "Please enter 4-digit OTP." });
      return;
    }
    verifyOtpMutation.mutate({
      phone: formData.phone,
      otp: enteredOtp,
    });
  };

  // ✅ Setters
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resendOtpMutation = useMutation({
    mutationFn: (payload) => resendSignUpOtp(payload),
    onSuccess: (data) => {
      console.log(data);
      setAlert({
        type: "success",
        message: "OTP sent successfully!",
      });
    },
    onError: (err) => {
      console.log(err);
      setAlert({
        type: "danger",
        message: err?.message || "Something went wrong!, please retry.",
      });
    },
  });

  const handleResend = () => {
    resendOtpMutation.mutate({
      phone: formData?.phone
    })
  };

  return {
    formData,
    errors,
    alert,
    setAlert,
    handleChange,
    handleSubmit,
    handleVerifyOtp,
    signupMutation,
    verifyOtpMutation,
    handleResend,
    isPending:
      signupMutation.isPending || verifyOtpMutation.isPending,
    isSuccess:
      signupMutation.isSuccess || verifyOtpMutation.isSuccess,
  };
}





