import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useKnowledgeBankMutations, useKnowledgeBank } from "../../hooks/knowledge-bank/useKnowledgeBank";
import { useCategoriesByReligion } from "../../hooks/knowledge-bank/useRitualCategories";
import CreateRitualCategoryModal from "./CreateRitualCategoryModal";

export default function CreateKnowledgeBankForm({ knowledgeBankId, onSuccess }) {
  const isEdit = !!knowledgeBankId;

  const { createKnowledgeBank, updateKnowledgeBank, isCreating, isUpdating } = useKnowledgeBankMutations();
  const { data: knowledgeBankData, isLoading: isFetching } = useKnowledgeBank(knowledgeBankId);

  const [form, setForm] = useState({
    religion: "",
    title: "", // Ritual Name
    description: "",
    category: "", // RitualCategory (Name)
    pdfUrl: "", // Drive URL
    videoUrl: "" // YouTube URL
  });

  const [message, setMessage] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isCategoryOpen, setCategoryOpen] = useState(false);

  // Fetch categories based on selected religion
  const { data: categories = [], isLoading: isLoadingCategories, refetch: refetchCategories } = useCategoriesByReligion(form.religion);

  const religions = ["Hindu", "Muslim", "Sikh", "Christian", "Other"];

  useEffect(() => {
    if (isEdit && knowledgeBankData) {
      setForm({
        religion: knowledgeBankData.religion || "",
        title: knowledgeBankData.title || "",
        description: knowledgeBankData.description || "",
        category: knowledgeBankData.category || "",
        pdfUrl: knowledgeBankData.pdfUrl || "",
        videoUrl: knowledgeBankData.videoUrl || ""
      });
    }
  }, [isEdit, knowledgeBankData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.religion) return setMessage("Please select a religion.");
    if (!form.category) return setMessage("Please select a ritual category.");

    const payload = {
      religion: form.religion,
      title: form.title,
      description: form.description,
      category: form.category,
      pdfUrl: form.pdfUrl,
      videoUrl: form.videoUrl
    };

    try {
      setMessage("");
      if (isEdit) {
        await updateKnowledgeBank({ id: knowledgeBankId, payload });
        setMessage("Updated successfully!");
        if (onSuccess) onSuccess();
      } else {
        await createKnowledgeBank(payload);
        setMessage("Created successfully!");
        setForm({
          religion: "",
          title: "",
          description: "",
          category: "",
          pdfUrl: "",
          videoUrl: ""
        });
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || err.message || "Something went wrong");
    }
  };

  const handleCategoryCreated = () => {
    refetchCategories();
  };

  if (isEdit && isFetching) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-3 text-muted">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0 h-100">
      {message && (
        <div className={`alert ${message.toLowerCase().includes("success") ? "alert-success" : "alert-danger"} alert-dismissible fade show d-flex align-items-center border-0 shadow-sm py-2 mb-3`} role="alert">
          <Icon
            icon={message.toLowerCase().includes("success") ? "solar:check-circle-bold" : "solar:danger-bold"}
            className="me-2"
            width={18}
          />
          <small className="flex-grow-1">{message}</small>
          <button type="button" className="btn-close btn-close-sm" onClick={() => setMessage("")}></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="h-100 d-flex flex-column">
        <div className="row g-4 p-10 flex-grow-1 m-0">
          {/* Left Column - Basic & Content */}
          <div className="col-md-6 d-flex flex-column ps-0">
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary mb-1">
                Religion <span className="text-danger">*</span>
              </label>
              <select
                name="religion"
                className="form-select form-select-sm"
                value={form.religion}
                onChange={handleChange}
                required
              >
                <option value="">Select Religion</option>
                {religions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary mb-1 d-flex justify-content-between align-items-center">
                <span>Ritual Category <span className="text-danger">*</span></span>
                {form.religion && (
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none small fw-bold"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => setShowCategoryModal(true)}
                  >
                    + Create New
                  </button>
                )}
              </label>
              <div className="dropdown position-relative">
                <button
                  className="form-select form-select-sm text-start d-flex justify-content-between align-items-center bg-white"
                  type="button"
                  onClick={() => form.religion && setCategoryOpen(!isCategoryOpen)}
                  disabled={!form.religion}
                >
                  <span className={!form.category ? "text-muted" : ""}>
                    {form.category || (form.religion ? "Select Category" : "Select Religion First")}
                  </span>
                  {/* <Icon icon="solar:alt-arrow-down-linear" className="ms-2 small text-muted" /> */}
                </button>

                {/* Backdrop for closing dropdown */}
                {isCategoryOpen && (
                  <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ zIndex: 1050, cursor: 'default' }}
                    onClick={() => setCategoryOpen(false)}
                  ></div>
                )}

                <ul className={`dropdown-menu w-100 shadow-sm border-0 mt-1 ${isCategoryOpen ? 'show' : ''}`} style={{ maxHeight: '250px', overflowY: 'auto', zIndex: 1051 }}>
                  {categories.map((c) => (
                    <li key={c._id}>
                      <button
                        type="button"
                        className={`dropdown-item py-2 border-bottom border-light ${form.category === c.name ? 'bg-light' : ''}`}
                        onClick={() => {
                          handleChange({ target: { name: 'category', value: c.name } });
                          setCategoryOpen(false);
                        }}
                      >
                        <div className="text-dark" style={{ fontSize: '0.8rem' }}>{c.name}</div>
                        {c.description && (
                          <div className="small text-muted opacity-75  fst-italic" style={{ fontSize: '0.6rem' }}>
                            {c.description}
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {form.religion && categories.length === 0 && !isLoadingCategories && (
                <div className="form-text small text-warning">
                  No categories found. Please create one.
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary mb-1">
                Ritual Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter ritual name"
                required
              />
            </div>

            <div className="mb-0 flex-grow-1">
              <label className="form-label small fw-bold text-secondary mb-1">
                Description
              </label>
              <textarea
                className="form-control form-control-sm h-100"
                style={{ minHeight: '60px' }}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief description..."
              />
            </div>
          </div>

          {/* Right Column - Media Links */}
          <div className="col-md-6 d-flex flex-column pe-0">
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary mb-1">
                Drive URL (PDF)
              </label>
              <input
                type="url"
                className="form-control form-control-sm"
                name="pdfUrl"
                value={form.pdfUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
              />
              <div className="form-text small text-muted">
                Paste Google Drive link.
              </div>
            </div>

            <div className="mb-0">
              <label className="form-label small fw-bold text-secondary mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                className="form-control form-control-sm"
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
              />
              <div className="form-text small text-muted">
                Paste full YouTube video URL.
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-end mt-4 pt-3">
          <button
            type="submit"
            className="btn btn-primary px-5 rounded-pill fw-bold"
            disabled={isCreating || isUpdating}
          >
            {(isCreating || isUpdating) ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Saving...
              </>
            ) : (
              isEdit ? "Update Entry" : "Create Entry"
            )}
          </button>
        </div>
      </form>

      {/* Create Category Modal */}
      <CreateRitualCategoryModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        religion={form.religion} // Pass selected religion
        onSuccess={handleCategoryCreated}
      />
    </div>
  );
}

