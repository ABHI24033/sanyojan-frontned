import Input from "../../common/Input";
import SelectBox from "../../common/SelectBox";
import TextArea from "../../common/TextArea";

const Others = ({ form, handleChange, errors, handleFileSelect, handleFileRemove }) => {
  const isChristian = form.religion === 'Christian';

  // Handle file selection - store locally only
  const onFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    handleFileSelect && handleFileSelect(file);
    // Reset input
    e.target.value = '';
  };

  // Remove pending file
  const onRemovePending = (index) => {
    handleFileRemove && handleFileRemove(index, 'pending');
  };

  // Remove already uploaded file
  const onRemoveUploaded = (docId) => {
    handleFileRemove && handleFileRemove(docId, 'uploaded');
  };

  // Total count (uploaded + pending)
  const uploadedCount = form.lifeHistoryDocuments?.length || 0;
  const pendingCount = form.pendingUploadFiles?.length || 0;
  const totalCount = uploadedCount + pendingCount;

  return (
    <fieldset className="wizard-fieldset show">
      <h6 className="text-md text-neutral-500">Other's Details</h6>

      <div className="row gy-3">

        {/* FOOD PREFERENCE */}
        <SelectBox
          name="foodPreference"
          id="foodPreference"
          required={true}
          label="Food Preference"
          className="col-sm-4"
          value={form.foodPreference}
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

        {/* BLOOD GROUP */}
        <SelectBox
          name="bloodGroup"
          id="bloodGroup"
          required={true}
          label="Blood Group"
          className="col-sm-4"
          value={form.bloodGroup}
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

        {/* RELIGION DROPDOWN */}
        <SelectBox
          name="religion"
          id="religion"
          label="Religion"
          className="col-sm-4"
          value={form.religion}
          onChange={handleChange}
          error={errors.religion}
          options={[
            { label: "Christian", value: "Christian" },
            { label: "Hindu", value: "Hindu" },
            { label: "Muslim", value: "Muslim" },
            { label: "Sikh", value: "Sikh" },
            { label: "Other", value: "Other" },
          ]}
          required={true}
        />

        {/* ====================== CHURCH RELATED INFO (Conditional) ====================== */}
        {form.religion && (
          <>
            <div className="col-12 mt-4">
              <h6 className="text-md text-neutral-500 mb-2">
                {isChristian ? "Church Related Information" : "Religious Information"}
              </h6>
            </div>

            {isChristian ? (
              <>
                {/* PARISH */}
                <Input
                  name="parish"
                  id="parish"
                  label="Parish"
                  className="col-sm-6"
                  value={form.parish}
                  onChange={handleChange}
                  error={errors.parish}
                />

                {/* CHURCH */}
                <Input
                  name="church"
                  id="church"
                  label="Church"
                  className="col-sm-6"
                  value={form.church}
                  onChange={handleChange}
                  error={errors.church}
                />

                {/* PARISH PRIEST */}
                <Input
                  name="parishPriest"
                  id="parishPriest"
                  label="Parish Priest"
                  className="col-sm-4"
                  value={form.parishPriest}
                  onChange={handleChange}
                  error={errors.parishPriest}
                />

                {/* PARISH COORDINATOR */}
                <Input
                  name="parishCoordinator"
                  id="parishCoordinator"
                  label="Parish Coordinator"
                  className="col-sm-4"
                  value={form.parishCoordinator}
                  onChange={handleChange}
                  error={errors.parishCoordinator}
                />

                {/* PARISH CONTACT */}
                <Input
                  name="parishContact"
                  id="parishContact"
                  label="Parish Coordinator Contact No"
                  className="col-sm-4"
                  value={form.parishContact}
                  onChange={handleChange}
                  error={errors.parishContact}
                />
              </>
            ) : (
              /* NON-CHRISTIAN TEXTAREA */
              <div className="col-12">
                <TextArea
                  id="religionDetails"
                  name="religionDetails"
                  label="Religious Details"
                  placeholder="Add religious information like faith, community, place of worship, or contact number (optional)"
                  className="col-12"
                  value={form.religionDetails}
                  onChange={handleChange}
                />
              </div>
            )}
          </>
        )}


        {/* ====================== DEATH & BURIAL INFO ====================== */}
        <div className="col-12 mt-4">
          <h6 className="text-md text-neutral-500 mb-2">Death & Burial Details</h6>
        </div>

        {/* Date of Death */}
        <Input
          name="dateOfDeath"
          id="dateOfDeath"
          type="date"
          label="Date of Death"
          className="col-sm-6"
          value={form.dateOfDeath}
          onChange={handleChange}
          placeholder="If applicable"
          error={errors.dateOfDeath}
        />

        {/* Death Place (From Personal Info - moved here for grouping) */}
        <Input
          name="deathPlace"
          id="deathPlace"
          label="Death Place"
          className="col-sm-6"
          value={form.deathPlace}
          onChange={handleChange}
          placeholder="Place of death"
          error={errors.deathPlace}
        />

        {/* Burial Place */}
        <Input
          name="burialPlace"
          id="burialPlace"
          label="Burial Place"
          className="col-sm-6"
          value={form.burialPlace}
          onChange={handleChange}
          placeholder="Burial place"
          error={errors.burialPlace}
          required={!!form.dateOfDeath}
        />

        {/* LIFE HISTORY DOCUMENTS */}
        <div className="col-12 mt-4">
          <h6 className="text-md fw-semibold text-sm text-neutral-500 mb-10">
            Life History Documents (PDF Only, Max 3) 
            <small className="text-muted ms-2">({totalCount}/3)</small>
          </h6>
          
          {/* Upload Button - only show if less than 3 docs */}
          {totalCount < 3 && (
            <div className="mb-3">
              <input
                type="file"
                id="lifeHistoryDoc"
                accept=".pdf"
                onChange={onFileSelect}
                style={{ display: 'none' }}
              />
              <label htmlFor="lifeHistoryDoc" className="btn btn-outline-primary btn-sm">
                <i className="ri-upload-cloud-line me-1"></i>
                Select PDF
              </label>
              <small className="text-muted ms-2">Max 5MB, PDF only. Will upload on Submit.</small>
            </div>
          )}

          {/* Display pending files (to be uploaded on submit) */}
          {form.pendingUploadFiles && form.pendingUploadFiles.length > 0 && (
            <div className="list-group mb-2">
              <div className="list-group-item bg-light">
                <small className="text-muted fw-semibold">Pending Upload (will upload on Submit)</small>
              </div>
              {form.pendingUploadFiles.map((file, index) => (
                <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <i className="ri-file-pdf-line text-warning fs-4 me-2"></i>
                    <div>
                      <div className="fw-semibold">{file.name}</div>
                      <small className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB - Ready to upload</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemovePending(index)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    <i className="ri-close-line"></i> Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Display already uploaded documents */}
          {form.lifeHistoryDocuments && form.lifeHistoryDocuments.length > 0 && (
            <div className="list-group">
              <div className="list-group-item bg-light">
                <small className="text-muted fw-semibold">Uploaded Documents</small>
              </div>
              {form.lifeHistoryDocuments.map((doc, index) => (
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
                    >
                      <i className="ri-eye-line"></i>
                    </a>
                    <a 
                      href={doc.url} 
                      download={doc.name}
                      className="btn btn-sm btn-outline-success"
                    >
                      <i className="ri-download-line"></i>
                    </a>
                    <button
                      type="button"
                      onClick={() => onRemoveUploaded(doc._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalCount >= 3 && (
            <div className="alert alert-info mt-2">
              <small>Maximum of 3 documents reached. Remove a document to add a new one.</small>
            </div>
          )}
        </div>

        {/* LIFE HISTORY */}
        <div className="col-12 mt-4">
          <TextArea
            id="lifeHistory"
            name="lifeHistory"
            label="Life History"
            placeholder="Write life history in brief."
            className="col-12"
            value={form.lifeHistory}
            onChange={handleChange}
            error={errors.lifeHistory}
          />
        </div>

      </div>
    </fieldset>
  );
};

export default Others;
