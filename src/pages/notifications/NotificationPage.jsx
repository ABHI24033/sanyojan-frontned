import React, { useEffect, useRef } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, deleteNotification, archiveNotification } from "../../api/notification";
import MasterLayout from "../../masterLayout/MasterLayout";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Archive, Trash } from "@phosphor-icons/react";

const NotificationPage = () => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
            // Also invalidate sidebar notifications if needed
            queryClient.invalidateQueries(["recentNotifications"]);
        },
    });

    const archiveMutation = useMutation({
        mutationFn: archiveNotification,
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
            queryClient.invalidateQueries(["recentNotifications"]);
        },
    });

    const handleDelete = (id) => {
        if (window.confirm("Delete this notification?")) {
            deleteMutation.mutate(id);
        }
    }

    const handleArchive = (id) => {
        archiveMutation.mutate(id);
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: ["notifications"],
        queryFn: ({ pageParam = null }) => getNotifications({ cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const observer = useRef();
    const lastElementRef = useRef();

    useEffect(() => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (lastElementRef.current) {
            observer.current.observe(lastElementRef.current);
        }
    }, [isLoading, hasNextPage, fetchNextPage]);

    // Flatten pages
    const notifications = data?.pages.flatMap((page) => page.data) || [];

    return (
        <MasterLayout>
            <div className="container py-2">
                <div className="row justify-content-center">
                    <div className="col-10">
                        <div className="card shadow-sm border-0 rounded-4">
                            <div className="card-header bg-white border-0 pt-4 m-4 pb-2 px-4">
                                <h4 className="fw-bold text-dark mb-0">Notifications</h4>
                            </div>
                            <div className="card-body p-0">
                                {isLoading && (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger m-3">
                                        Error loading notifications.
                                    </div>
                                )}

                                {!isLoading && notifications.length === 0 && (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bi bi-bell-slash fs-1 d-block mb-3"></i>
                                        <p>No notifications yet.</p>
                                    </div>
                                )}

                                <div className="list-group list-group-flush">
                                    {notifications.map((notif, index) => {
                                        const isLast = index === notifications.length - 1;

                                        // Determine link based on type
                                        let link = "#";
                                        if (notif.type === "post") {
                                            link = `/post/${notif.referenceId}`;
                                        } else if (notif.type === "poll") {
                                            link = `/poll/${notif.referenceId}`;
                                        } else if (notif.type === "event") {
                                            link = `/events/${notif.referenceId}`;
                                        } else if (notif.type === "notice") {
                                            link = `/notice/${notif.referenceId}`;
                                        }

                                        return (
                                            <div
                                                key={notif._id}
                                                ref={isLast ? lastElementRef : null}
                                                className="list-group-item list-group-item-action p-3 border-bottom"
                                            >
                                                <div className="d-flex align-items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        {notif.sender?.avatar || notif.sender?.profile?.profilePicture ? (
                                                            <img
                                                                src={notif.sender.avatar || notif.sender.profile?.profilePicture}
                                                                alt="Avatar"
                                                                className="rounded-circle"
                                                                width="40"
                                                                height="40"
                                                                style={{ objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="rounded-circle bg-light d-flex align-items-center justify-content-center text-secondary fw-bold"
                                                                style={{ width: "40px", height: "40px" }}
                                                            >
                                                                {notif.sender?.firstname?.[0] || "U"}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Link className="flex-grow-1" to={link}>
                                                        <p className="mb-1 text-dark">
                                                            {notif.message}
                                                        </p>
                                                        <small className="text-muted">
                                                            {notif.createdAt && !isNaN(new Date(notif.createdAt))
                                                                ? format(new Date(notif.createdAt), "MMM d, h:mm a")
                                                                : ""}
                                                        </small>
                                                    </Link>

                                                    {/* Actions */}
                                                    <div className="d-flex gap-2 align-self-center">
                                                        {/* <button
                                                            className="btn btn-sm btn-light text-secondary"
                                                            title="Archive"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleArchive(notif._id);
                                                            }}
                                                        >
                                                            <Archive size={18} weight="fill" />
                                                        </button> */}
                                                        <button
                                                            className="btn btn-sm btn-light text-danger"
                                                            title="Delete"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDelete(notif._id);
                                                            }}
                                                        >
                                                            <Trash size={18} weight="fill" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {isFetchingNextPage && (
                                    <div className="text-center py-3">
                                        <div className="spinner-border spinner-border-sm text-secondary" role="status">
                                            <span className="visually-hidden">Loading more...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default NotificationPage;
