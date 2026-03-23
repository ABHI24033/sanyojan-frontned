import React from "react";

const ProfileSidebar = ({ formData }) => {

    const getDefaultProfilePicture = () => {
        const gender = formData?.gender?.toLowerCase() || 'other';
        if (gender === 'male') {
            return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        } else if (gender === 'female') {
            return "https://cdn-icons-png.flaticon.com/512/3135/3135789.png";
        } else {
            return "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
        }
    };

    return (
        <div className='user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100'>
            <div className="w-100 h-120-px object-fit-cover"></div>
            <div className='pb-24 ms-16 mb-24 me-16 mt--100'>
                <div className='text-center border border-top-0 border-start-0 border-end-0'>
                    <img
                        src={formData?.profilePicture || getDefaultProfilePicture()}
                        alt='Profile Picture'
                        className='border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover'
                    />
                    <h6 className='mb-0 mt-16'>{formData?.firstname} {formData?.lastname}</h6>
                    <span className='text-secondary-light mb-16'>
                        {formData?.email}
                    </span>
                </div>
                <div className='mt-24'>
                    <h6 className='text-xl mb-16'>Personal Info</h6>
                    <ul>
                        <li className='d-flex align-items-center gap-1 mb-12'>
                            <span className='w-30 text-md fw-semibold text-primary-light'>Full Name</span>
                            <span className='w-70 text-secondary-light fw-medium'>: {formData?.firstname} {formData?.lastname}</span>
                        </li>
                        <li className='d-flex align-items-center gap-1 mb-12'>
                            <span className='w-30 text-md fw-semibold text-primary-light'>Email</span>
                            <span className='w-70 text-secondary-light fw-medium'>: {formData?.email}</span>
                        </li>
                        <li className='d-flex align-items-center gap-1 mb-12'>
                            <span className='w-30 text-md fw-semibold text-primary-light'>Phone Number</span>
                            <span className='w-70 text-secondary-light fw-medium'>: {formData?.phone}</span>
                        </li>
                        <li className='d-flex align-items-center gap-1 mb-12'>
                            <span className='w-30 text-md fw-semibold text-primary-light'>Gender</span>
                            <span className='w-70 text-secondary-light fw-medium'>: {formData?.gender}</span>
                        </li>
                        <li className='d-flex align-items-center gap-1 mb-12'>
                            <span className='w-30 text-md fw-semibold text-primary-light'>Date of Birth</span>
                            <span className='w-70 text-secondary-light fw-medium'>: {formData?.dob}</span>
                        </li>
                        {formData?.lifeHistory && (
                            <li className='d-flex align-items-center gap-1'>
                                <span className='w-30 text-md fw-semibold text-primary-light'>Bio</span>
                                <span className='w-70 text-secondary-light fw-medium'>: {formData?.lifeHistory}</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
