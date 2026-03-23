import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteNoticeApi,
    getUserNoticesApi,
    getAdminNoticesApi,
    updateNoticeApi,
    toggleNoticePinApi,
    getNoticeByIdApi
} from "../api/notice";

export const useNoticeList = (type = "admin") => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState(""); // only admin filter

    const queryClient = useQueryClient();
    const [alert, setAlert] = useState({ type: "", message: "" });

    const [editModal, setEditModal] = useState({
        show: false,
        data: null
    });

    const openEditModal = (notice) => {
        setEditModal({ show: true, data: notice });
    };

    const closeEditModal = () => {
        setEditModal({ show: false, data: null });
    };

    // Decide which API to call
    const fetchNotices = () => {
        if (type === "user") {
            return getUserNoticesApi({
                page,
                limit,
                search,
                startDate,
                endDate,
            });
        }

        return getAdminNoticesApi({
            page,
            limit,
            search,
            status,
            date
        });
    };

    // ============================
    // 🔹 GET NOTICES (User/Admin)
    // ============================
    const noticesQuery = useQuery({
        queryKey: ["notices", type, page, search, date, startDate, endDate, status],
        queryFn: fetchNotices,
        keepPreviousData: true,
    });

    // ============================
    // 🔹 DELETE Notice
    // ============================
    const deleteMutation = useMutation({
        mutationFn: (noticeId) => deleteNoticeApi(noticeId),
        onSuccess: () => {
            queryClient.invalidateQueries(["notices", type]);
            setAlert({ type: "success", message: "Notice deleted successfully" });
        },
        onError: (error) => {
            setAlert({
                type: "error",
                message: error.response?.data?.message || "Something went wrong"
            });
        }
    });

    // ============================
    // 🔹 EDIT / UPDATE Notice
    // ============================
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateNoticeApi(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["notices", type]);  // Refresh data
            setAlert({ type: "success", message: "Notice updated successfully" });
            closeEditModal();
        },
        onError: (error) => {
            console.log(error.response?.data);

            setAlert({
                type: "error",
                message: error.response?.data?.message || "Update failed"
            });
        }
    });

    // ============================
    // 🔹 PIN Notice
    // ============================
    const pinMutation = useMutation({
        mutationFn: (noticeId) => toggleNoticePinApi(noticeId),
        onSuccess: () => {
            queryClient.invalidateQueries(["notices", type]);
            setAlert({ type: "success", message: "Notice pinned successfully" });
        },
        onError: (error) => {
            setAlert({
                type: "error",
                message: error.response?.data?.message || "Something went wrong"
            });
        }
    });

    const useNoticeById = (noticeId) => {
        return useQuery({
            queryKey: ["notice", noticeId],
            queryFn: () => getNoticeByIdApi(noticeId),
            enabled: !!noticeId, // prevents running until an ID exists
        });
    };

    return {
        // Query
        noticesQuery,

        // Pagination
        page,
        setPage,

        // Filters
        limit,
        search,
        setSearch,
        date,
        setDate,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        status,
        setStatus,

        // CRUD
        deleteMutation,
        updateMutation,
        openEditModal,
        closeEditModal,
        editModal,
        pinMutation,

        // Alerts
        alert,
        setAlert
    };
};

