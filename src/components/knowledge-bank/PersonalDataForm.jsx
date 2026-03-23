import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { usePersonalDataMutations } from "../../hooks/knowledge-bank/usePersonalData";

export default function PersonalDataForm({ onSuccess }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Research");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");

    const { createPersonalData, isCreating } = usePersonalDataMutations();
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!title || !category) {
            setError("Title and category are required");
            return;
        }

        if (!file && !videoUrl) {
            setError("Please provide a file or a video link");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("description", description);
        if (file) formData.append("file", file);
        if (videoUrl) formData.append("videoUrl", videoUrl);

        try {
            await createPersonalData(formData);
            setTitle("");
            setDescription("");
            setFile(null);
            setVideoUrl("");
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to save document");
        }
    };

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold d-flex align-items-center">
                    <Icon icon="solar:upload-minimalistic-linear" className="me-2 text-primary" width={24} />
                    Add to My Library
                </h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center py-2" role="alert">
                            <Icon icon="solar:danger-triangle-linear" className="me-2" />
                            <small>{error}</small>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label small fw-bold text-secondary">Document Title</label>
                        <input
                            type="text"
                            className="form-control form-control-sm rounded-3"
                            placeholder="Enter title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold text-secondary">Category</label>
                        <select
                            className="form-select form-select-sm rounded-3"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="Research">Research</option>
                            <option value="Personal">Personal</option>
                            <option value="Finance">Finance</option>
                            <option value="Health">Health</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold text-secondary">Description (Optional)</label>
                        <textarea
                            className="form-control form-control-sm rounded-3"
                            rows="2"
                            placeholder="Short description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold text-secondary">Upload PDF or Image</label>
                        <div className="input-group input-group-sm">
                            <input
                                type="file"
                                className="form-control rounded-3"
                                accept="application/pdf,image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="form-text x-small mt-1 text-muted">
                            Supported: PDF, JPG, PNG, WebP. Size limits apply.
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-secondary">Video URL (Optional)</label>
                        <input
                            type="url"
                            className="form-control form-control-sm rounded-3"
                            placeholder="https://youtube.com/..."
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-sm w-100 rounded-pill py-2 fw-bold"
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                        ) : (
                            "Save to Library"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
