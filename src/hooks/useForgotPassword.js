import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { sendForgotOtp, setNewPassword, verifyForgotOtp } from "../api/auth";

export function useForgotPasswordForm(handleNext, moveToSetPassword) {
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [errors, setErrors] = useState({
        phone: "",
        password: "",
        confirmPassword: "",
    }); // 🟢 FIXED: added password errors
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [otp,setOTP] = useState();

    const navigate = useNavigate();

    // ✅ Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Send OTP
    const sendOTPMutation = useMutation({
        mutationFn: (payload) => sendForgotOtp(payload),
        onSuccess: (data) => {
            console.log(data);
            setAlert({
                type: "success",
                message: data?.message || "OTP sent successfully",
            });
            handleNext?.(); // Move to OTP step
        },
        onError: (err) => {
            setAlert({
                type: "danger",
                message: err?.message || "Failed to send OTP",
            });
        },
    });

    // ✅ Verify OTP
    const verifyOTPMutation = useMutation({
        mutationFn: (payload) => verifyForgotOtp(payload),
        onSuccess: (data) => {
            setAlert({
                type: "success",
                message: data?.message || "OTP verified successfully",
            });
            moveToSetPassword?.(); // 🟢 FIXED: properly navigate to next step
        },
        onError: (err) => {
            setAlert({
                type: "danger",
                message: err?.message || "Invalid OTP, please retry.",
            });
        },
    });

    // ✅ Validation
    const validate = (requirePassword = false) => {
        const newErrors = {
            phone: "",
            password: "",
            confirmPassword: "",
        };

        // 🟢 FIXED: Added full validation for password & confirm password
        if (!formData.phone.trim())
            newErrors.phone = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(formData.phone))
            newErrors.phone = "Phone number must be 10 digits";

        // Password validation (required when resetting password)
        if (requirePassword || formData.password.trim()) {
            if (!formData.password.trim())
                newErrors.password = "Password is required";
            else if (formData.password.length < 8)
                newErrors.password = "Password must be at least 8 characters long";
            else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password))
                newErrors.password = "Password must contain at least one letter and one number";
            else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`])/.test(formData.password))
                newErrors.password = "Password must contain at least one special character";
        }

        // Confirm password validation (required when resetting password)
        if (requirePassword || formData.password.trim()) {
            if (!formData.confirmPassword.trim())
                newErrors.confirmPassword = "Please confirm your password";
            else if (formData.password !== formData.confirmPassword)
                newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        // Return valid only if all fields have no error
        const isValid = (
            !newErrors.phone &&
            !newErrors.password &&
            !newErrors.confirmPassword
        );
        const errorMsg = Object.values(newErrors).find((msg) => msg) || null;
        return { isValid, errorMsg };
    };

    // ✅ Send OTP handler
    const handleSubmit = (e) => {
        e.preventDefault();
        const validation = validate();
        if (!validation.isValid) {
            setAlert({ type: "danger", message: validation.errorMsg || "Please fix the errors." });
            return;
        }
        sendOTPMutation.mutate({ phone: formData.phone });
    };

    // ✅ Verify OTP handler
    const handleVerifyOTP = (otp) => {
        const enteredOtp = otp.join("");
        if (!enteredOtp) {
            setAlert({ type: "danger", message: "Enter valid OTP" });
            return;
        }
        setOTP(enteredOtp);
        verifyOTPMutation.mutate({ phone: formData.phone, otp: enteredOtp });
    };

    // ✅ Set new password
    const setNewPasswordMutation = useMutation({
        mutationFn: (payload) => setNewPassword(payload),
        onSuccess: (data) => {
            console.log(data);
            setAlert({
                type: "success",
                message: data?.message || "Password reset successful!",
            });
            navigate("/sign-in"); // 🟢 FIXED: navigate to login page after reset
        },
        onError: (err) => {
            setAlert({
                type: "danger",
                message:err?.message || "Something went wrong, please retry.",
            });
        },
    });

    // ✅ Reset password handler
    const handleResetPassword = (e) => {
        e.preventDefault(); // 🟢 FIXED: added missing `e`
        const validation = validate(true); // Require password validation for reset
        if (!validation.isValid) {
            setAlert({ type: "danger", message: validation.errorMsg || "Please fix the errors." });
            return;
        }

        setNewPasswordMutation.mutate({
            phone: formData.phone,
            otp:otp,
            password: formData.password,
            confirm_password: formData.confirmPassword,
        });
    };

    return {
        formData,
        alert,
        setAlert,
        errors,
        handleChange,
        handleSubmit,
        handleVerifyOTP,
        isSending: sendOTPMutation.isPending,
        isVerifying: verifyOTPMutation.isPending,
        handleResetPassword,
        isReseting: setNewPasswordMutation.isPending,
        showConfirm,
        showPassword,
        setShowConfirm,
        setShowPassword,
    };
}

