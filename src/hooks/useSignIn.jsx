import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { signInUser, verifySignInOtp } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export function useSignInForm(handleNext) {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({ phone: "", password: "" });
  const navigate = useNavigate();
  const { refetch: refetchAuth } = useAuth();
  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // mutation for send OTP
  const sendOTPMutation = useMutation({
    mutationFn: (payload) => signInUser(payload),
    onSuccess: (data) => {
      setAlert({
        type: "success",
        message: "OTP sent successfully!",
      });
      handleNext();
    },
    onError: (err) => {
      const errorMessage = err?.message || "Failed to send OTP, please retry.";
      const isNotRegistered = errorMessage.toLowerCase().includes("invalid phone") ||
        errorMessage.toLowerCase().includes("not found");

      setAlert({
        type: "danger",
        message: isNotRegistered ? (
          <>
            {errorMessage}{" "}
            <Link to="/sign-up" className="text-primary-600 fw-bold">
              Sign Up here
            </Link>
          </>
        ) : errorMessage,
      });
    },
  });

  // mutation for Verify OTP
  const verifyOTPMutation = useMutation({
    mutationFn: (payload) => verifySignInOtp(payload),
    onSuccess: async (data) => {
      console.log(data);

      // Access token is stored in HTTP-only cookies by the server
      // No need to store in localStorage for security (cookies are httpOnly)

      // Refetch auth data to get latest profile status
      // This will update the auth context with the latest profile status
      const { data: authData } = await refetchAuth();

      // Check profile status and redirect accordingly
      if (authData?.success && authData?.data) {
        const { hasProfile } = authData.data;
        navigate(hasProfile ? "/" : "/complete-profile");
      } else {
        navigate("/complete-profile");
      }

      setAlert({
        type: "success",
        message: data?.message || "OTP Verified successfully",
      });
    },
    onError: (err) => {
      console.log("verifyOTPMutation error", err);
      setAlert({
        type: "danger",
        message: err?.message || "Invalid OTP, please retry.",
      });
    },
  });
  // mutation for Re-send OTP

  // ✅ Validation
  const validate = () => {
    const newErrors = { phone: "", password: "" };

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((msg) => !msg);
    const errorMsg = Object.values(newErrors).find((msg) => msg) || null;
    return { isValid, errorMsg };
  };

  // ✅ Simulate Login (replace with API call)
  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    if (!validation.isValid) {
      setAlert({
        type: "danger",
        message: validation.errorMsg || "Please fix the highlighted errors.",
      });
      return;
    }
    sendOTPMutation.mutate({
      phone: formData?.phone,
      password: formData?.password
    });
  };

  const handleVerifyOTP = (otp) => {
    const enteredOtp = otp.join("");

    if (!enteredOtp) {
      setAlert({ type: "danger", message: "Please enter correct OTP." });
      return;
    }
    verifyOTPMutation.mutate({
      phone: formData.phone,
      otp: enteredOtp,
    });
  }

  const toggleShowPassword = () => setShowPassword((v) => !v);

  return {
    formData,
    showPassword,
    alert,
    setAlert,
    errors,
    handleChange,
    toggleShowPassword,
    handleSubmit,
    handleVerifyOTP,
    isPending: verifyOTPMutation.isPending || sendOTPMutation?.isPending,
  };
}
