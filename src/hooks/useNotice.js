import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNoticeApi } from "../api/notice";
import { useNavigate } from "react-router-dom";

export const useNotice = () => {
    const queryClient = useQueryClient();
    const today = new Date().toISOString().split("T")[0];
    const navigate = useNavigate();

    const [notice, setNotice] = useState({
        title: "",
        category: "",
        description: "",
        startDate: today,
        endDate: "",
        status: "Active",
    });

    const [pdf, setPdf] = useState(null);

    const [alert, setAlert] = useState({ type: "", message: "" });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNotice((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdf(file);
        } else {
            setAlert({ type: "danger", message: "Please select a valid PDF file" });
            e.target.value = null;
        }
    };

    const handleDescriptionChange = (value) => {
        setNotice((prev) => ({ ...prev, description: value }));
    };

    // -------------------------
    // VALIDATION
    // -------------------------
    const validate = () => {
        let newErrors = {};

        if (!notice.title.trim()) newErrors.title = "Title is required";
        if (!notice.description.trim()) newErrors.description = "Description is required";
        if (!notice.startDate) newErrors.startDate = "Start date is required";
        if (!notice.endDate) newErrors.endDate = "End date is required";

        // Check timeline logic
        if (notice.startDate && notice.endDate) {
            if (new Date(notice.startDate) > new Date(notice.endDate)) {
                newErrors.endDate = "End date cannot be earlier than start date";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Create Notice
    const createMutation = useMutation({
        mutationFn: createNoticeApi,
        onSuccess: () => {
            queryClient.invalidateQueries(["notices"]);
            setAlert({ type: "success", message: "Notice created successfully!" });
            setNotice({
                title: "",
                category: "",
                description: "",
                startDate: today,
                endDate: "",
                status: "Active",
            });
            setPdf(null);
            navigate("/admin-notices");
        },
        onError: () => {
            setAlert({ type: "danger", message: "Failed to create notice" });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        formData.append("title", notice.title);
        formData.append("category", notice.category);
        formData.append("description", notice.description);
        formData.append("startDate", notice.startDate);
        formData.append("endDate", notice.endDate);
        formData.append("status", notice.status);
        if (pdf) {
            formData.append("pdf", pdf);
        }

        createMutation.mutate(formData);
    };

    return {
        notice,
        pdf,
        setNotice,
        handleInputChange,
        handleFileChange,
        handleDescriptionChange,
        handleSubmit,
        alert,
        setAlert,
        errors,
        isSubmitting: createMutation.isPending,
    };
};
