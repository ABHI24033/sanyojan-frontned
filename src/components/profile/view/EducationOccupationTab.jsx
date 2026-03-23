import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Input from "../../common/Input";
import SelectBox from "../../common/SelectBox";

const EducationOccupationTab = ({
    formData,
    errors,
    handleChange,
    handleEducationChange,
    handleEmploymentChange,
    addEmploymentRow,
    removeEmploymentRow,
    handleSubmit,
    isPending
}) => {
    const showHistory = formData.jobCategory !== "homemaker" && formData.jobCategory !== "retired" && formData.jobCategory !== "";

    return (
        <div
            className='tab-pane fade'
            id='pills-education-occupation'
            role='tabpanel'
            aria-labelledby='pills-education-occupation-tab'
            tabIndex='0'
        >
            <form onSubmit={handleSubmit}>
                <div className="row gy-3">
                    <div>
                        <h6 className="text-md text-neutral-500 mb-3">Educational Details</h6>

                        {/* Grid Header */}
                        <div className="row fw-bold text-muted small mb-2 d-none d-md-flex">
                            <div className="col-md-4">Education Level</div>
                            <div className="col-md-3">Year of Passing</div>
                            <div className="col-md-5">Institution</div>
                        </div>

                        {/* Dynamic Education Rows */}
                        {formData.education && formData.education.map((edu, index) => (
                            <div className="row gy-2 gx-3 mb-3 align-items-center" key={index}>
                                <div className="col-12 col-md-4">
                                    <span className="fw-medium text-dark">{edu.level}</span>
                                </div>
                                <div className="col-12 col-md-3">
                                    <Input
                                        name={`year_${index}`}
                                        id={`year_${index}`}
                                        type="number"
                                        placeholder="Year"
                                        className="mb-0"
                                        value={edu.year}
                                        onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                                    />
                                </div>
                                <div className="col-12 col-md-5">
                                    <Input
                                        name={`inst_${index}`}
                                        id={`inst_${index}`}
                                        placeholder="Institution Name"
                                        className="mb-0"
                                        value={edu.institution}
                                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5">
                        <h6 className="text-md text-neutral-500 mb-3">Occupation </h6>
                        <div className="row gy-3 mb-4">
                            <SelectBox
                                name="jobCategory"
                                id="jobCategory"
                                label="Job Category"
                                className="col-sm-6"
                                value={formData.jobCategory}
                                onChange={handleChange}
                                error={errors.jobCategory}
                                options={[
                                    { label: "Government", value: "govt" },
                                    { label: "Private Co.", value: "private" },
                                    { label: "Retired", value: "retired" },
                                    { label: "Home Maker", value: "homemaker" },
                                    { label: "Entrepreneur", value: "entrepreneur" },
                                ]}
                            />
                        </div>

                        {showHistory && (
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="text-sm text-neutral-500 mb-0 fw-bold">Employment History</h6>
                                    <button type="button" className="btn btn-sm btn-outline-primary py-2 d-flex align-items-center" onClick={addEmploymentRow}>
                                        <Icon icon="mdi:plus" className="me-1" /> Add Row
                                    </button>
                                </div>

                                <div className="row fw-bold text-muted small mb-2 d-none d-md-flex">
                                    <div className="col-md-2">From Year</div>
                                    <div className="col-md-2">To Year</div>
                                    <div className="col-md-4">Department / Company</div>
                                    <div className="col-md-3">Designation</div>
                                    <div className="col-md-1"></div>
                                </div>

                                {formData.employmentHistory && formData.employmentHistory.map((job, index) => (
                                    <div className="row gy-2 gx-2 mb-3 align-items-center justify-content-center" key={index}>
                                        <div className="col-6 col-md-2">
                                            <Input
                                                name={`job_from_${index}`}
                                                id={`job_from_${index}`}
                                                type="number"
                                                placeholder="From"
                                                className="mb-0"
                                                value={job.fromYear}
                                                onChange={(e) => handleEmploymentChange(index, "fromYear", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-6 col-md-2">
                                            <Input
                                                name={`job_to_${index}`}
                                                id={`job_to_${index}`}
                                                type="number"
                                                placeholder="To"
                                                className="mb-0"
                                                value={job.toYear}
                                                onChange={(e) => handleEmploymentChange(index, "toYear", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <Input
                                                name={`job_company_${index}`}
                                                id={`job_company_${index}`}
                                                placeholder="Company/Dept"
                                                className="mb-0"
                                                value={job.company}
                                                onChange={(e) => handleEmploymentChange(index, "company", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-10 col-md-3">
                                            <Input
                                                name={`job_designation_${index}`}
                                                id={`job_designation_${index}`}
                                                placeholder="Designation"
                                                className="mb-0"
                                                value={job.designation}
                                                onChange={(e) => handleEmploymentChange(index, "designation", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-2 col-md-1 mb-12 text-center d-flex align-items-center">
                                            <button type="button" className="btn text-danger p-0 d-flex align-items-center border border-danger rounded p-8" onClick={() => removeEmploymentRow(index)}>
                                                <Icon icon="mdi:delete-outline" width="20" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
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

export default EducationOccupationTab;
