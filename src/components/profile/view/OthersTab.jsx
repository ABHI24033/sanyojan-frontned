import React from "react";
import Input from "../../common/Input";
import SelectBox from "../../common/SelectBox";
import TextArea from "../../common/TextArea";

const OthersTab = ({ formData, errors, handleChange, handleSubmit, isPending }) => {
    const isChristian = formData.religion === "Christian";

    return (
        <div
            className='tab-pane fade'
            id='pills-others'
            role='tabpanel'
            aria-labelledby='pills-others-tab'
            tabIndex='0'
        >
            <form onSubmit={handleSubmit}>
                <div className="row gy-3">
                    <SelectBox
                        name="foodPreference"
                        id="foodPreference"
                        required={true}
                        label="Food Preference"
                        className="col-sm-4"
                        value={formData.foodPreference}
                        onChange={handleChange}
                        error={errors.foodPreference}
                        options={[
                            { label: "veg", value: "veg" },
                            { label: "non-veg", value: "non-veg" },
                            { label: "both", value: "both" },
                            { label: "vegan", value: "vegan" },
                            { label: "jain", value: "jain" }
                        ]}
                    />

                    <SelectBox
                        name="bloodGroup"
                        id="bloodGroup"
                        required={true}
                        label="Blood Group"
                        className="col-sm-4"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        error={errors.bloodGroup}
                        options={[
                            { label: "A+", value: "A+" },
                            { label: "A-", value: "A-" },
                            { label: "B+", value: "B+" },
                            { label: "B-", value: "B-" },
                            { label: "O+", value: "O+" },
                            { label: "O-", value: "O-" },
                            { label: "AB+", value: "AB+" },
                            { label: "AB-", value: "AB-" },
                            { label: "Unknown", value: "Unknown" },
                        ]}
                    />

                    <SelectBox
                        name="religion"
                        id="religion"
                        label="Religion"
                        className="col-sm-4"
                        value={formData.religion}
                        onChange={handleChange}
                        error={errors.religion}
                        options={[
                            { label: "Christian", value: "Christian" },
                            { label: "Hindu", value: "Hindu" },
                            { label: "Muslim", value: "Muslim" },
                            { label: "Sikh", value: "Sikh" },
                            { label: "Other", value: "Other" },
                        ]}
                    />

                    {formData.religion && (
                        <>
                            <div className="col-12 mt-4">
                                <h6 className="text-md text-neutral-500 mb-2">
                                    {isChristian ? "Church Related Information" : "Religious Information"}
                                </h6>
                            </div>

                            {isChristian ? (
                                <>
                                    <Input
                                        name="parish"
                                        id="parish"
                                        label="Parish"
                                        className="col-sm-6"
                                        value={formData.parish}
                                        onChange={handleChange}
                                        error={errors.parish}
                                    />

                                    <Input
                                        name="church"
                                        id="church"
                                        label="Church"
                                        className="col-sm-6"
                                        value={formData.church}
                                        onChange={handleChange}
                                        error={errors.church}
                                    />

                                    <Input
                                        name="parishPriest"
                                        id="parishPriest"
                                        label="Parish Priest"
                                        className="col-sm-4"
                                        value={formData.parishPriest}
                                        onChange={handleChange}
                                        error={errors.parishPriest}
                                    />

                                    <Input
                                        name="parishCoordinator"
                                        id="parishCoordinator"
                                        label="Parish Coordinator"
                                        className="col-sm-4"
                                        value={formData.parishCoordinator}
                                        onChange={handleChange}
                                        error={errors.parishCoordinator}
                                    />

                                    <Input
                                        name="parishContact"
                                        id="parishContact"
                                        label="Parish Coordinator Contact No"
                                        className="col-sm-4"
                                        value={formData.parishContact}
                                        onChange={handleChange}
                                        error={errors.parishContact}
                                    />
                                </>
                            ) : (
                                <div className="col-12">
                                    <TextArea
                                        id="religionDetails"
                                        name="religionDetails"
                                        label="Religious Details"
                                        placeholder="Add religious information like faith, community, place of worship, or contact number (optional)"
                                        className="col-12"
                                        value={formData.religionDetails}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <div className="col-12 mt-4">
                        <h6 className="text-md text-neutral-500 mb-2">Death & Burial Details</h6>
                    </div>

                    <Input
                        name="dateOfDeath"
                        id="dateOfDeath"
                        type="date"
                        label="Date of Death"
                        className="col-sm-6"
                        value={formData.dateOfDeath}
                        onChange={handleChange}
                        placeholder="If applicable"
                        error={errors.dateOfDeath}
                    />

                    <Input
                        name="deathPlace"
                        id="deathPlace"
                        label="Death Place"
                        className="col-sm-6"
                        value={formData.deathPlace}
                        onChange={handleChange}
                        placeholder="Place of death"
                        error={errors.deathPlace}
                    />

                    <Input
                        name="burialPlace"
                        id="burialPlace"
                        label="Burial Place"
                        className="col-sm-6"
                        value={formData.burialPlace}
                        onChange={handleChange}
                        placeholder="Burial place"
                    />

                    <div className="col-12 mt-4">
                        <TextArea
                            id="lifeHistory"
                            name="lifeHistory"
                            label="Life History"
                            placeholder="Write life history in brief."
                            className="col-12"
                            value={formData.lifeHistory}
                            onChange={handleChange}
                            error={errors.lifeHistory}
                        />
                    </div>

                    {formData.lifeHistoryDocuments && formData.lifeHistoryDocuments.length > 0 && (
                        <div className="col-12 mt-4">
                            <h6 className="text-md text-neutral-500 mb-2">Life History Documents</h6>
                            <div className="list-group">
                                {formData.lifeHistoryDocuments.map((doc, index) => (
                                    <div key={doc._id || index} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <i className="ri-file-pdf-line text-danger fs-4 me-2"></i>
                                            <div>
                                                <div className="fw-semibold">{doc.name}</div>
                                                <small className="text-muted">
                                                    Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <a 
                                                href={doc.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary"
                                                title="View"
                                            >
                                                <i className="ri-eye-line"></i>
                                            </a>
                                            <a 
                                                href={doc.url} 
                                                download={doc.name}
                                                className="btn btn-sm btn-outline-success"
                                                title="Download"
                                            >
                                                <i className="ri-download-line"></i>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className='d-flex align-items-center justify-content-end mt-40 gap-3'>
                    <button
                        type='submit'
                        className='btn btn-primary border border-primary-600 text-md radius-8'
                        disabled={isPending}
                    >
                        {isPending ? "Updating..." : "Update"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OthersTab;
