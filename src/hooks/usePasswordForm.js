import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { setPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function usePasswordForm(phone) {
    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const navigate = useNavigate();
    const { refetch: refetchAuth } = useAuth();

    const validate = () => {
        const newErrors = {};

        // Password validation
        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        } else if (!/[A-Z]/.test(form.password)) {
            newErrors.password = "Must include at least one uppercase letter";
        } else if (!/[a-z]/.test(form.password)) {
            newErrors.password = "Must include at least one lowercase letter";
        } else if (!/[0-9]/.test(form.password)) {
            newErrors.password = "Must include at least one number";
        } else if (!/[!@#$%^&*]/.test(form.password)) {
            newErrors.password = "Must include at least one special character";
        }

        // Confirm password validation
        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const setPasswordMutation = useMutation({
        mutationFn: (payload) => setPassword(payload),
        onSuccess: async (data) => {
            console.log(data);
            // Refetch auth to update context with password status
            await refetchAuth();
            navigate("/complete-profile");
            setAlert({
                type: "success",
                message: data?.message || "Password saved!",
            });
        },
        onError: (err) => {
            setAlert({
                type: "danger",
                message: err.response?.data?.message || "Something went wrong!, please retry.",
            });
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setPasswordMutation.mutate({
                phone: phone,
                password: form?.password,
                confirm_password: form?.confirmPassword
            })
        }
    };

    return {
        form,
        errors,
        showPassword,
        showConfirm,
        setShowPassword,
        setShowConfirm,
        handleChange,
        handleSubmit,
        alert,
        setAlert,
        isPending:setPasswordMutation.isPending,
    };
}
