import "highlight.js/styles/monokai-sublime.css";
import { useNotice } from "../../hooks/useNotice";
import AlertBox from "../ui/Alert";

const CreateNoticeForm = () => {
  const {
    notice,
    errors,
    handleInputChange,
    handleFileChange,
    handleDescriptionChange,
    handleSubmit,
    alert,
    setAlert,
    isSubmitting,
  } = useNotice();

  return (
    <div className="row gy-4">
      <div className="col-lg-8">
        <div className="card mt-24">
          <div className="card-header border-bottom">
            <h6 className="text-xl mb-0">Create Notice</h6>
          </div>

          <div className="card-body p-24">
            <form className="d-flex flex-column gap-20" onSubmit={handleSubmit}>

              {/* Title */}
              <div>
                <label className="form-label fw-bold">Notice Title</label>
                <input
                  type="text"
                  name="title"
                  value={notice.title}
                  onChange={handleInputChange}
                  className="form-control border radius-8"
                  placeholder="Enter notice title"
                />
                {errors?.title && <p className="text-danger mt-1">{errors.title}</p>}
              </div>
              {/* Timeline */}
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={notice.startDate}
                    onChange={handleInputChange}
                    className="form-control border radius-8"
                  />
                  {errors?.startDate && <p className="text-danger mt-1">{errors.startDate}</p>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={notice.endDate}
                    onChange={handleInputChange}
                    className="form-control border radius-8"
                  />
                  {errors?.endDate && <p className="text-danger mt-1">{errors.endDate}</p>}
                </div>
              </div>

              {/* PDF Upload */}
              <div>
                <label className="form-label fw-bold">Attach PDF (Optional)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="form-control border radius-8"
                />
                <p className="text-muted small mt-1">Upload a PDF document to attach to this notice.</p>
              </div>

              {/* Description */}
              <div>
                <label className="form-label fw-bold">Description</label>

                <textarea
                  name="description"
                  value={notice.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  className="form-control border radius-8"
                  placeholder="Write notice details..."
                  rows={6}
                  style={{ resize: "vertical" }}
                />

                {errors?.description && (
                  <p className="text-danger mt-1">{errors.description}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary radius-8"
              >
                {isSubmitting ? "Submitting..." : "Create Notice"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <AlertBox alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default CreateNoticeForm;