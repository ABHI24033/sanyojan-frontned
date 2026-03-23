import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import "./authStyle.css";
import AuthLayout from "./AuthLayout";
import { updateFirstPassword } from "../../api/auth";
import AlertBox from "../ui/Alert";
import { useAuth } from "../../context/AuthContext";

const SetNewPassword = () => {
    const navigate = useNavigate();
    const { refetch } = useAuth();
    const [formData, setFormData] = useState({
        password: "",
        confirm_password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [alert, setAlert] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user changes field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

        if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsPending(true);
        try {
            await updateFirstPassword(formData);
            setAlert({ type: "success", message: "Password updated successfully!" });

            // Refetch user context to update isFirstLogin flag
            await refetch();

            // Navigate to complete profile
            setTimeout(() => {
                navigate("/complete-profile");
            }, 1500);
        } catch (error) {
            setAlert({ type: "danger", message: error.message || "Failed to update password" });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <AuthLayout imageSrc="assets/images/auth/side_signin.png">
                <div className="mb-4">
                    <h4 className="mb-12">Set Your New Password</h4>
                    <p className="mb-32 text-secondary-light text-lg">
                        Since this is your first login, please set a secure password for your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Password */}
                    <div className="position-relative mb-20">
                        <div className="icon-field">
                            <span className="icon top-50 translate-middle-y">
                                <Icon icon="solar:lock-password-outline" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control h-56-px bg-neutral-50 radius-12"
                                name="password"
                                placeholder="New Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <span
                            className="toggle-password position-absolute end-0 top-50 translate-middle-y me-16 cursor-pointer text-secondary-light"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <Icon icon={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                        </span>
                        {errors.password && (
                            <small className="text-danger">{errors.password}</small>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="position-relative mb-20">
                        <div className="icon-field">
                            <span className="icon top-50 translate-middle-y">
                                <Icon icon="solar:lock-password-outline" />
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control h-56-px bg-neutral-50 radius-12"
                                name="confirm_password"
                                placeholder="Confirm Password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                            />
                        </div>
                        <span
                            className="toggle-password position-absolute end-0 top-50 translate-middle-y me-16 cursor-pointer text-secondary-light"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Icon icon={showConfirmPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                        </span>
                        {errors.confirm_password && (
                            <small className="text-danger">{errors.confirm_password}</small>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-16"
                        disabled={isPending}
                    >
                        {isPending ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </AuthLayout>
            <AlertBox alert={alert} setAlert={setAlert} />
        </>
    );
};

export default SetNewPassword;
