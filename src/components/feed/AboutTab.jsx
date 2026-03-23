import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';


const AboutItem = ({ icon, label, value, fullWidth }) => (
    <div className={`about-item ${fullWidth ? 'w-100' : ''}`} style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
        <div className="about-icon-wrapper">
            <Icon icon={icon} style={{ fontSize: "20px" }} />
        </div>
        <div className="d-flex flex-column">
            <span className="about-label">{label}</span>
            <span className="about-value">{value || "N/A"}</span>
        </div>
    </div>
);


const AboutTab = ({ activeTab, profile, user }) => {

    return (
        <div>
            {activeTab === 'about' && (
                <div className="card w-100 p-20 border-0 shadow-sm mt-4">

                    {/* PERSONAL INFO */}
                    <div className="about-section">
                        <h6 className="about-section-title">Personal Information</h6>
                        <div className="about-grid">

                            <AboutItem
                                icon="mdi:account"
                                label="Name"
                                value={`${profile?.prefix || ""} ${user?.firstname || ""} ${user?.lastname || ""}`}
                            />

                            <AboutItem
                                icon="mdi:gender-male-female"
                                label="Gender"
                                value={profile?.gender}
                            />

                            <AboutItem
                                icon="mdi:cake-variant"
                                label="Age"
                                value={profile?.age}
                            />

                            <AboutItem
                                icon="mdi:calendar-range"
                                label="Date of Birth"
                                value={profile?.dob ? new Date(profile.dob).toLocaleDateString() : null}
                            />

                            <AboutItem
                                icon="mdi:human-male-female"
                                label="Marital Status"
                                value={profile?.marital_status}
                            />

                            <AboutItem
                                icon="mdi:water"
                                label="Blood Group"
                                value={profile?.bloodGroup}
                            />

                            <AboutItem
                                icon="mdi:calendar-heart"
                                label="Marriage Date"
                                value={profile?.marriageDate ? new Date(profile.marriageDate).toLocaleDateString() : null}
                            />

                        </div>
                    </div>

                    {/* CONTACT INFO */}
                    <div className="about-section">
                        <h6 className="about-section-title">Contact Details</h6>
                        <div className="about-grid">

                            <AboutItem
                                icon="mdi:phone"
                                label="Phone"
                                value={user?.phone || profile?.phone}
                            />

                            <AboutItem
                                icon="mdi:email"
                                label="Email"
                                value={profile?.email || user?.email}
                            />

                            <AboutItem
                                icon="mdi:whatsapp"
                                label="WhatsApp"
                                value={profile?.whatsappNo}
                            />

                        </div>
                    </div>

                    {/* LOCATION */}
                    <div className="about-section">
                        <h6 className="about-section-title">Location & Birth</h6>
                        <div className="about-grid">

                            <AboutItem
                                icon="mdi:map-marker-radius"
                                label="Birth Place"
                                value={profile?.birthPlace}
                            />

                            <AboutItem
                                icon="mdi:home-map-marker"
                                label="Address"
                                value={profile?.address}
                                fullWidth
                            />

                            <AboutItem icon="mdi:city" label="City" value={profile?.city} />
                            <AboutItem icon="mdi:map-marker" label="State" value={profile?.state} />
                            <AboutItem icon="mdi:earth" label="Country" value={profile?.country} />
                            <AboutItem icon="mdi:mailbox" label="Pincode" value={profile?.postalCode} />

                        </div>
                    </div>

                    {/* RELIGIOUS INFO */}
                    {(profile?.religion || profile?.church || profile?.parish) && (
                        <div className="about-section">
                            <h6 className="about-section-title">Religious Information</h6>
                            <div className="about-grid">
                                <AboutItem icon="mdi:religion-christian" label="Religion" value={profile?.religion} />
                                {
                                    profile?.church && (
                                        <AboutItem icon="mdi:church" label="Church" value={profile?.church} />
                                    )
                                }
                                {
                                    profile?.parish && (
                                        <AboutItem icon="mdi:map-marker-outline" label="Parish" value={profile?.parish} />
                                    )
                                }
                                {
                                    profile?.parishPriest && (
                                        <AboutItem icon="mdi:account-tie" label="Parish Priest" value={profile?.parishPriest} />
                                    )
                                }
                                {
                                    profile?.parishCoordinator && (
                                        <AboutItem icon="mdi:account-voice" label="Coordinator" value={profile?.parishCoordinator} />
                                    )
                                }
                                {
                                    profile?.parishContact && (
                                        <AboutItem icon="mdi:phone-outline" label="Parish Contact" value={profile?.parishContact} />
                                    )
                                }
                                {profile?.religionDetails && (
                                    <AboutItem
                                        icon="mdi:book-open-variant"
                                        label="Religious Details"
                                        value={profile?.religionDetails}
                                        fullWidth
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* DEATH DETAILS */}
                    {(profile?.dateOfDeath || profile?.deathPlace || profile?.burialPlace) && (
                        <div className="about-section">
                            <h6 className="about-section-title">Death & Burial Details</h6>
                            <div className="about-grid">
                                <AboutItem
                                    icon="mdi:calendar-remove"
                                    label="Date of Death"
                                    value={profile?.dateOfDeath ? new Date(profile.dateOfDeath).toLocaleDateString() : null}
                                />
                                <AboutItem icon="mdi:map-marker-remove" label="Death Place" value={profile?.deathPlace} />
                                <AboutItem icon="mdi:grave" label="Burial Place" value={profile?.burialPlace} />
                            </div>
                        </div>
                    )}

                    {/* EDUCATION */}
                    {profile?.education?.length > 0 && (
                        <div className="about-section">
                            <h6 className="about-section-title">Education</h6>
                            <div className="about-grid">

                                {profile?.education?.map((edu, index) =>
                                    edu?.institution ? (
                                        <AboutItem
                                            key={index}
                                            icon="mdi:school"
                                            label={edu.level || "Education"}
                                            value={`${edu.institution || ""} ${edu.year ? `(${edu.year})` : ""}`}
                                            fullWidth
                                        />
                                    ) : null
                                )}

                            </div>
                        </div>
                    )}

                    {/* EMPLOYMENT */}
                    {profile?.employmentHistory?.length > 0 && (
                        <div className="about-section">
                            <h6 className="about-section-title">Employment</h6>
                            <div className="about-grid">

                                {profile?.employmentHistory?.map((job, index) =>
                                    job?.company ? (
                                        <AboutItem
                                            key={index}
                                            icon="mdi:briefcase"
                                            label={`${job.company} (${job.fromYear || ""} - ${job.toYear || ""})`}
                                            value={job.designation || ""}
                                            fullWidth
                                        />
                                    ) : null
                                )}

                            </div>
                        </div>
                    )}

                    {/* FAMILY */}
                    <div className="about-section">
                        <h6 className="about-section-title">Family Details</h6>
                        <div className="about-grid">

                            <AboutItem
                                icon="mdi:account-multiple"
                                label="Brothers"
                                value={profile?.brothers?.length || 0}
                            />

                            <AboutItem
                                icon="mdi:account-multiple"
                                label="Sisters"
                                value={profile?.sisters?.length || 0}
                            />

                            <AboutItem
                                icon="mdi:human-male"
                                label="Sons"
                                value={profile?.sons?.length || 0}
                            />

                            <AboutItem
                                icon="mdi:human-female"
                                label="Daughters"
                                value={profile?.daughters?.length || 0}
                            />

                        </div>
                    </div>

                    {/* OTHER */}
                    <div className="about-section">
                        <h6 className="about-section-title">Other Information</h6>
                        <div className="about-grid">

                            <AboutItem
                                icon="mdi:food"
                                label="Food Preference"
                                value={profile?.foodPreference}
                            />

                            <AboutItem
                                icon="mdi:account-tie-outline"
                                label="Job Category"
                                value={profile?.jobCategory}
                            />

                            {profile?.lifeHistory && (
                                <AboutItem
                                    icon="mdi:book-open-page-variant"
                                    label="Life History"
                                    value={profile?.lifeHistory}
                                    fullWidth
                                />
                            )}

                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default AboutTab