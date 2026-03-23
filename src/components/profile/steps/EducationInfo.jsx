import Input from "../../common/Input";
import SelectBox from "../../common/SelectBox";
import { Icon } from "@iconify/react";

const EducationInfo = ({ form, errors, handleChange, handleEducationChange, handleEmploymentChange, addEmploymentRow, removeEmploymentRow }) => {

  const showHistory = form.jobCategory === 'govt' || form.jobCategory === 'private' || form.jobCategory === 'homemaker' || form.jobCategory === 'retired';

  return (
    <fieldset className="wizard-fieldset show">

      {/* ====================== EDUCATION ====================== */}
      <div>
        <h6 className="text-md text-neutral-500 mb-3">Educational Details</h6>

        {/* Grid Header */}
        <div className="row fw-bold text-muted small mb-2 d-none d-md-flex">
          <div className="col-md-4">Education Level</div>
          <div className="col-md-3">Year of Passing</div>
          <div className="col-md-5">Institution</div>
        </div>

        {/* Dynamic Education Rows */}
        {form.education && form.education.map((edu, index) => (
          <div className="row gy-2 gx-3 mb-3 align-items-center" key={index}>
            {/* Level (Label) */}
            <div className="col-12 col-md-4">
              <span className="fw-medium text-dark">{edu.level}</span>
            </div>

            {/* Year of Passing */}
            <div className="col-12 col-md-3">
              <Input
                name={`year_${index}`}
                id={`year_${index}`}
                type="number"
                placeholder="Year"
                className="mb-0"
                value={edu.year}
                onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                error={errors.education ? errors.education : null}
              />
            </div>

            {/* Institution */}
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
        {(!form.education || form.education.length === 0) && (
          <p className="text-danger small">Error: Education state mismatch.</p>
        )}
      </div>

      {/* ====================== EMPLOYMENT ====================== */}
      <div className="mt-5">
        <h6 className="text-md text-neutral-500 mb-3">Occupation </h6>

        {/* Job Category Row */}
        <div className="row gy-3 mb-4">
          {/* Job Category */}
          <SelectBox
            name="jobCategory"
            id="jobCategory"
            label="Job Category"
            className="col-sm-6"
            value={form.jobCategory}
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

        {/* Employment History Grid Header (Conditional) */}
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

            {/* Dynamic Employment Rows */}
            {form.employmentHistory && form.employmentHistory.map((job, index) => (
              <div className="row gy-2 gx-2 mb-3 align-items-center justify-content-center" key={index}>

                {/* From Year */}
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

                {/* To Year */}
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

                {/* Company / Dept */}
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

                {/* Designation */}
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

                {/* Remove Button */}
                <div className="col-2 col-md-1 mb-12 text-center d-flex align-items-center">
                  <button type="button" className="btn text-danger p-0 d-flex align-items-center border border-danger rounded  p-8" onClick={() => removeEmploymentRow(index)}>
                    <Icon icon="mdi:delete-outline" width="20" />
                  </button>
                </div>
              </div>
            ))}
            {(!form.employmentHistory || form.employmentHistory.length === 0) && (
              <div className="text-center py-3 bg-light rounded text-muted small">
                No history added. Click "Add Row" to add entries.
              </div>
            )}
          </>
        )}

      </div>

    </fieldset>
  );
};

export default EducationInfo;
