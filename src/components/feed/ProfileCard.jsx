import React from "react";
import { Icon } from "@iconify/react";

const ProfileCard = ({ profile, user, onEdit, onAdd, onViewProfile }) => {

    // Construct member object from props or fallback to empty
    const member = {
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        gender: profile?.gender || "male", // default or handle unknown
        profilePicture: profile?.profilePicture || user?.profilePicture || "",
        phone: user?.phone || "N/A",
        email: profile?.email || "N/A",
        dob: profile?.dob,
        age: profile?.age || "N/A",
        userId: user?._id,
        partners: profile?.partners || []
    };

    const getPlaceholderImage = (gender) => {
        if (gender === "male") {
            return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        } else if (gender === "female") {
            return "https://cdn-icons-png.flaticon.com/512/3135/3135789.png";
        } else {
            return "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
        }
    };

    const getProfileImage = (profilePicture, gender) => {
        if (profilePicture && profilePicture.trim() !== "") {
            return profilePicture;
        }
        return getPlaceholderImage(gender);
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="member-detail-card card shadow-sm h-100">
            <div className="card-body px-20 py-20 position-relative">
                <div className="position-absolute end-0 top-0 mt-20 me-20 d-flex flex-column align-items-center gap-1" style={{ zIndex: 10 }}>
                    <button
                        onClick={onEdit}
                        className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                        style={{
                            width: "44px",
                            height: "44px",
                            backgroundColor: "#e3f2fd",
                            border: "none",
                        }}
                    >
                        <Icon
                            icon="solar:pen-new-square-bold"
                            style={{ fontSize: "22px", color: "#2196f3" }}
                        />
                    </button>
                    <span className="text-xs fw-medium text-neutral-600">Edit Profile</span>
                </div>
                {/* Profile Picture */}
                <div className="text-center mb-20">
                    <div
                        className="profile-image-wrapper mx-auto"
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "4px solid #e5e7eb",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                    >
                        <img
                            src={getProfileImage(member.profilePicture, member.gender)}
                            alt={`${member.firstname} ${member.lastname}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>

                    <h5 className="mt-16 mb-4 fw-bold text-neutral-900">
                        {member.firstname} {member.lastname}
                    </h5>

                    <span
                        className="badge text-capitalize"
                        style={{
                            backgroundColor:
                                member.gender === "male"
                                    ? "#e3f2fd"
                                    : member.gender === "female"
                                        ? "#fce4ec"
                                        : "#f5f5f5",
                            color:
                                member.gender === "male"
                                    ? "#2196f3"
                                    : member.gender === "female"
                                        ? "#e91e63"
                                        : "#757575",
                            fontSize: "12px",
                            padding: "4px 12px",
                        }}
                    >
                        {member.gender}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-center gap-4 mb-20">
                    {/* <div className="d-flex flex-column align-items-center gap-1">
                        <button
                            onClick={onViewProfile}
                            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                            style={{
                                width: "44px",
                                height: "44px",
                                backgroundColor: "#f3f4f6",
                                border: "none",
                            }}
                        >
                            <Icon
                                icon="solar:user-id-bold"
                                style={{ fontSize: "22px", color: "#4b5563" }}
                            />
                        </button>
                        <span className="text-xs fw-medium text-neutral-600">Profile</span>
                    </div> */}


                    {/* <div className="d-flex flex-column align-items-center gap-1">
                        <button
                            onClick={onAdd}
                            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                            style={{
                                width: "44px",
                                height: "44px",
                                backgroundColor: "#e8f5e9",
                                border: "none",
                            }}
                        >
                            <Icon
                                icon="solar:user-plus-bold"
                                style={{ fontSize: "22px", color: "#4caf50" }}
                            />
                        </button>
                        <span className="text-xs fw-medium text-neutral-600">Add</span>
                    </div> */}
                </div>

                {/* Contact Details */}
                <div className="details-section">
                    <div className="detail-item mb-16 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Icon
                                icon="solar:phone-bold"
                                style={{ fontSize: "18px", color: "#6b7280", marginRight: "10px" }}
                            />
                            <span className="text-sm fw-medium text-neutral-600">Phone</span>
                        </div>
                        <div className="text-sm text-neutral-900 fw-semibold">
                            {member.phone}
                        </div>
                    </div>

                    <div className="detail-item mb-16 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Icon
                                icon="solar:letter-bold"
                                style={{ fontSize: "18px", color: "#6b7280", marginRight: "10px" }}
                            />
                            <span className="text-sm fw-medium text-neutral-600">Email</span>
                        </div>
                        <div className="text-sm text-neutral-900 fw-semibold text-end" style={{ wordBreak: "break-all", maxWidth: "200px" }}>
                            {member.email}
                        </div>
                    </div>

                    {/* <div className="detail-item mb-16 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Icon
                                icon="solar:calendar-bold"
                                style={{ fontSize: "18px", color: "#6b7280", marginRight: "10px" }}
                            />
                            <span className="text-sm fw-medium text-neutral-600">
                                Date of Birth
                            </span>
                        </div>
                        <div className="text-sm text-neutral-900 fw-semibold">
                            {formatDate(member.dob)}
                        </div>
                    </div> */}

                    <div className="detail-item mb-16 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Icon
                                icon="solar:user-id-bold"
                                style={{ fontSize: "18px", color: "#6b7280", marginRight: "10px" }}
                            />
                            <span className="text-sm fw-medium text-neutral-600">Age</span>
                        </div>
                        <div className="text-sm text-neutral-900 fw-semibold">
                            {member.age} years
                        </div>
                    </div>
                </div>

                {/* Timeline Section */}
                <div
                    className="mt-4 p-3 rounded-4"
                    style={{
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <h6 className="fw-bold fs-6 text-neutral-700 mb-3 d-flex align-items-center">
                        Life Timeline
                    </h6>

                    <div className="timeline">
                        {/* Birth Date */}
                        {profile?.dob && (
                            <div className="timeline-item">
                                <div className="timeline-marker" style={{ background: "#10b981" }}>
                                    <Icon icon="mdi:cake-variant" style={{ fontSize: "16px", color: "white" }} />
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-title">Birth</div>
                                    <div className="timeline-date">{formatDate(profile.dob)}</div>
                                    {profile.birthPlace && (
                                        <div className="timeline-location">
                                            <Icon icon="mdi:map-marker" className="me-1" style={{ fontSize: "12px" }} />
                                            {profile.birthPlace}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Marriage Date */}
                        {profile?.marriageDate && (
                            <div className="timeline-item">
                                <div className="timeline-marker" style={{ background: "#f59e0b" }}>
                                    <Icon icon="mdi:heart" style={{ fontSize: "16px", color: "white" }} />
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-title">Marriage</div>
                                    <div className="timeline-date">{formatDate(profile.marriageDate)}</div>
                                </div>
                            </div>
                        )}

                        {/* Death Date */}
                        {profile?.dateOfDeath && (
                            <div className="timeline-item">
                                <div className="timeline-marker" style={{ background: "#6b7280" }}>
                                    <Icon icon="mdi:cross" style={{ fontSize: "16px", color: "white" }} />
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-title">Passed Away</div>
                                    <div className="timeline-date">{formatDate(profile.dateOfDeath)}</div>
                                    {profile.deathPlace && (
                                        <div className="timeline-location">
                                            <Icon icon="mdi:map-marker" className="me-1" style={{ fontSize: "12px" }} />
                                            {profile.deathPlace}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* If no timeline events */}
                        {!profile?.dob && !profile?.marriageDate && !profile?.dateOfDeath && (
                            <div className="text-sm text-neutral-600">No timeline events available.</div>
                        )}
                    </div>
                </div>

                <div className="card shadow-sm mt-10 p-3 rounded-4" style={{ backgroundColor: "#f8f9fa", border: "1px solid #e9ecef" }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold fs-6 text-dark mb-0">📄 Life History</h6>
                    </div>

                    {profile?.lifeHistoryDocuments
                        && profile.lifeHistoryDocuments.length > 0 ? (
                        // <div className="d-flex flex-column gap-2">
                        //     {profile.lifeHistoryDocuments.map((doc, index) => (
                        //         <div
                        //             key={index}
                        //             className="d-flex flex-column justify-content-between align-items-center p-6 rounded-3 bg-light"
                        //         >
                        //             <div className="d-flex align-items-center gap-2">
                        //                 <i className="bi bi-file-earmark-pdf text-danger fs-5"></i>
                        //                 <span className="text-truncate" style={{ maxWidth: "180px" }}>
                        //                     {doc.name}
                        //                 </span>
                        //             </div>

                        //             <div className="d-flex gap-2">
                        //                 <a
                        //                     href={doc.url}
                        //                     target="_blank"
                        //                     rel="noopener noreferrer"
                        //                     className="btn btn-sm btn-outline-primary"
                        //                 >
                        //                     View
                        //                 </a>

                        //                 <a
                        //                     href={doc.url}
                        //                     download
                        //                     className="btn btn-sm btn-outline-success"
                        //                 >
                        //                     Download
                        //                 </a>
                        //             </div>
                        //         </div>
                        //     ))}
                        // </div>
<div className="life-history-card">
  {profile.lifeHistoryDocuments.map((doc, index) => (
    <div key={index} className="lh-card">
      
      {/* Top Section */}
      <div className="lh-header">
        {/* <div className="lh-icon">
          <i className="bi bi-file-earmark-pdf"></i>
          📄
        </div> */}

        <div className="lh-info">
          <p className="lh-title">{doc.name}</p>
          <span className="lh-sub">PDF Document</span>
        </div>
      </div>

      {/* Actions */}
      <div className="lh-actions">
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-primary"
        >
          View
        </a>

        <a
          href={doc.url}
          download
          className="btn btn-sm btn-outline-success"
        >
          Download
        </a>
      </div>

    </div>
  ))}
</div>
                    ) : (
                        <div className="text-center text-muted py-3">
                            No Life History uploaded
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
