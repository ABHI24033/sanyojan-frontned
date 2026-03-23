import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export const useEventReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoading: authLoading } = useAuth();

    // Pagination State
    const [page, setPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState(""); // "" for all
    const [filterCity, setFilterCity] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [memberFilters, setMemberFilters] = useState({}); // Advanced Filters
    const limit = 10;

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Reset page when city, status or advanced filters change
    useEffect(() => {
        setPage(1);
    }, [filterCity, filterStatus, memberFilters]);

    // Fetch Event Metadata
    const { data: event, isLoading: eventLoading } = useQuery({
        queryKey: ["event", id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/events/${id}`);
            return res.data.data;
        },
    });

    // Fetch Cities (Full List - Invitations & Acceptances)
    const { data: citiesData } = useQuery({
        queryKey: ["event-cities", id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/events/${id}/cities`);
            return res.data.data;
        }
    });

    // Fetch Guests (Native RSVP List - "As Before")
    const { data: guestData, isLoading: guestsLoading, isPlaceholderData } = useQuery({
        queryKey: ["event-guests", id, page, filterStatus, filterCity, debouncedSearch, memberFilters],
        queryFn: async () => {
            const res = await axiosInstance.get(`/events/${id}/guests`, {
                params: {
                    page,
                    limit,
                    status: filterStatus,
                    city: filterCity,
                    search: debouncedSearch,
                    ...memberFilters
                }
            });
            return res.data;
        },
        placeholderData: (previousData) => previousData,
    });

    const guests = guestData?.data || [];
    const pagination = guestData?.pagination || { total: 0, pages: 1 };
    const stats = guestData?.stats || {};
    const cities = citiesData || [];

    // Pagination calculations
    const totalPages = pagination.pages || 1;
    const totalGuestsCount = pagination.total || 0;
    const startEntry = (page - 1) * limit + 1;
    const endEntry = Math.min(page * limit, totalGuestsCount);

    return {
        id,
        navigate,
        authLoading,
        event,
        eventLoading,
        guests,
        guestsLoading,
        isPlaceholderData,
        pagination,
        stats,
        page,
        setPage,
        filterStatus,
        setFilterStatus,
        filterCity,
        setFilterCity,
        cities,
        searchQuery,
        setSearchQuery,
        memberFilters,
        setMemberFilters,
        totalPages,
        totalGuestsCount,
        startEntry,
        endEntry
    };
};

