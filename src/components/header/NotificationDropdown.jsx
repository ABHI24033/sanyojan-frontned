import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { format } from "date-fns";
import { getNotifications } from "../../api/notification";

const NotificationDropdown = () => {
    // Fetch recent 5 notifications
    const { data, refetch } = useQuery({
        queryKey: ["recentNotifications"],
        queryFn: () => getNotifications({ limit: 5 }),
        enabled: false,
    });

    const notifications = data?.data || [];
    const unreadCount = notifications.length; // Simplified for now, assuming all fetch are 'relevant'

    return (
        <div className='dropdown'>
            <button
                className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                type='button'
                data-bs-toggle='dropdown'
                onClick={() => refetch()}
            >
                <Icon
                    icon='iconoir:bell'
                    className='text-primary-light text-xl'
                />
                {/* {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )} */}
            </button>
            <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
                <div className='m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                    <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                            Notifications
                        </h6>
                    </div>
                    {/* {unreadCount > 0 && (
                        <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
                            {unreadCount}
                        </span>
                    )} */}
                </div>
                <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
                    {notifications.length === 0 ? (
                        <div className="text-center py-4 text-secondary-light">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((n, index) => (
                            <Link
                                key={index}
                                to={
                                    n.type === 'post' ? `/post/${n.referenceId}` :
                                        n.type === 'poll' ? `/poll/${n.referenceId}` :
                                            n.type === 'event' ? `/events/${n.referenceId}` :
                                                n.type === 'notice' ? `/notice/${n.referenceId}` :
                                                    '#'
                                }
                                className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between hover-bg-neutral-50'
                            >
                                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                    <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                                        {n.sender?.profile?.profilePicture ? (
                                            <img
                                                src={n.sender.profile?.profilePicture}
                                                alt="profile"
                                                className="w-100 h-100 object-fit-cover rounded-circle"
                                            />
                                        ) : (
                                            <div className="fw-bold">{n.sender?.firstname?.[0] || "N"}</div>
                                        )}
                                    </span>
                                    <div>
                                        <h6 className='text-md fw-semibold mb-1'>
                                            {n.sender?.firstname} {n.sender?.lastname}
                                        </h6>
                                        <p className='mb-0 text-sm text-secondary-light text-w-200-px text-truncate'>
                                            {n.message}
                                        </p>
                                    </div>
                                </div>
                                <span className='text-sm text-secondary-light flex-shrink-0'>
                                    {n.createdAt ? format(new Date(n.createdAt), "h:mm a") : ""}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
                <div className='text-center py-12 px-16'>
                    <Link
                        to='/notifications'
                        className='text-primary-600 fw-semibold text-md'
                    >
                        See All Notification
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotificationDropdown;
