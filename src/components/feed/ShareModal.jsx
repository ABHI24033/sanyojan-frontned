import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/AuthContext";

export default function ShareModal({
  show,
  onClose,
  text,
  setText,
  removeFile,
  handleFileSelect,
  files,
  onPost,
  isPosting,
  // Poll props
  pollQuestion,
  setPollQuestion,
  pollOptions,
  handlePollOptionChange,
  addPollOption,
  removePollOption,
  pollDuration,
  setPollDuration,
  onPollPost,
  isPostingPoll
}) {
  const { user } = useAuth();
  const [postType, setPostType] = useState("post"); // "post" or "poll"

  const handleSubmit = () => {
    if (postType === "post") {
      onPost(onClose);
    } else {
      onPollPost(onClose);
    }
  };

  const canSubmit = postType === "post"
    ? (text.trim() || files?.length > 0)
    : (pollQuestion.trim() && pollOptions.filter(opt => opt.trim()).length >= 2);

  const isSubmitting = postType === "post" ? isPosting : isPostingPoll;

  return (
    <div
      className={`${show ? "d-block" : "d-none"
        } position-fixed top-0 start-0 w-100 h-100`}
      style={{
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(3px)",
        zIndex: 1050,
      }}
    >
      <div
        className="modal-dialog mt-80 bg-white rounded-4 position-relative modal-dialog-centered"
        style={{ maxWidth: "800px", maxHeight: "90vh" }}
      >
        <div className="modal-content shadow-lg p-20 rounded-4 border-0" style={{ display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
          <div className="modal-header border-0 px-4 pt-3 position-relative">
            <h5 className="modal-title fw-bold fs-5">
              {postType === "post" ? "Create Post" : "Create Poll"}
            </h5>

            <button
              className="d-flex align-items-center justify-content-center position-absolute"
              style={{
                width: "36px",
                height: "36px",
                top: "0px",
                right: "0px",
                zIndex: 10,
              }}
              onClick={onClose}
            >
              <Icon icon="mdi:close" className="fs-3" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="px-4 mt-2 pb-3">
            <div className="d-flex border-bottom">
              <button
                className={`btn flex-grow-1 py-12 px-4 border-0 position-relative transition-all d-flex align-items-center justify-content-center gap-2 ${postType === "post" ? "text-primary-600 fw-bold" : "text-secondary-light fw-medium"
                  }`}
                onClick={() => setPostType("post")}
                style={{
                  background: postType === "post" ? "rgba(13, 110, 253, 0.05)" : "transparent",
                  borderRadius: "12px 12px 0 0",
                  fontSize: "16px",
                }}
              >
                <Icon icon="solar:pen-new-square-linear" className="fs-4" />
                Post
                {postType === "post" && (
                  <div
                    className="position-absolute bottom-0 start-0 w-100 bg-primary-600"
                    style={{ height: '3px', borderRadius: '3px 3px 0 0' }}
                  />
                )}
              </button>
              <button
                className={`btn flex-grow-1 py-12 px-4 border-0 position-relative transition-all d-flex align-items-center justify-content-center gap-2 ${postType === "poll" ? "text-primary-600 fw-bold" : "text-secondary-light fw-medium"
                  }`}
                onClick={() => setPostType("poll")}
                style={{
                  background: postType === "poll" ? "rgba(13, 110, 253, 0.05)" : "transparent",
                  borderRadius: "12px 12px 0 0",
                  fontSize: "16px",
                }}
              >
                <Icon icon="solar:chart-square-linear" className="fs-4" />
                Poll
                {postType === "poll" && (
                  <div
                    className="position-absolute bottom-0 start-0 w-100 bg-primary-600"
                    style={{ height: '3px', borderRadius: '3px 3px 0 0' }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body px-4 pb-4" style={{ overflowY: "auto", flex: 1 }}>
            {/* User Info */}
            <div className="d-flex align-items-center mb-3">
              <img
                src={user?.profilePicture || "https://i.pravatar.cc/50"}
                alt="user"
                className="rounded-circle me-2"
                width="45"
                height="45"
              />
              <div>
                <p className="mb-0 fw-semibold">
                  {user?.firstname + " " + user?.lastname}
                </p>
                <span className="badge bg-light text-dark border">
                  <Icon icon="mdi:earth" className="me-1" />
                  Public
                </span>
              </div>
            </div>

            {/* POST TYPE CONTENT */}
            {postType === "post" ? (
              <>
                {/* Textarea */}
                <textarea
                  className="form-control border-2 fs-5"
                  rows={4}
                  placeholder="What's on your mind?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{ resize: "none" }}
                />

                {/* Upload Section */}
                <div className="p-3 border rounded mt-3 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold">Add to your Post</span>

                    <div className="d-flex gap-3">
                      {/* Image Upload */}
                      <label className="text-success fs-4" style={{ cursor: "pointer" }}>
                        <Icon icon="mdi:image" className="fs-3 text-success" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>
                  </div>

                  {/* File Previews */}
                  {files?.length > 0 && (
                    <div className="mt-3 d-flex flex-wrap gap-3">
                      {files?.map((file, index) => (
                        <div
                          key={index}
                          className="position-relative rounded shadow-sm overflow-hidden"
                          style={{ width: "120px", height: "120px" }}
                        >
                          {/* Image preview from cloudinary */}
                          {typeof file === "string" && (
                            <img
                              src={file}
                              alt="cloud-img"
                              width="120"
                              height="120"
                              style={{ objectFit: "cover", borderRadius: "8px" }}
                            />
                          )}
                          {/* Image Preview */}
                          {file instanceof File && file.type.startsWith("image/") && (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              width="120"
                              height="120"
                              style={{ objectFit: "fill" }}
                            />
                          )}
                          {/* Remove Button */}
                          <button
                            className="position-absolute d-flex align-items-center justify-content-center"
                            style={{ width: "28px", height: "28px", top: "5px", right: "5px" }}
                            onClick={() => removeFile(index)}
                          >
                            <Icon icon="mdi:close" className="fs-5 text-danger" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* POLL CREATION UI */}
                {/* Poll Question */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Poll Question</label>
                  <input
                    type="text"
                    className="form-control border-2 fs-5"
                    placeholder="Ask a question..."
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                  />
                </div>

                {/* Poll Options */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Poll Options</label>
                  {pollOptions.map((option, index) => (
                    <div key={index} className="d-flex align-items-center gap-2 mb-2">
                      <div className="flex-grow-1">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => handlePollOptionChange(index, e.target.value)}
                        />
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removePollOption(index)}
                        disabled={pollOptions.length <= 2}
                        style={{ minWidth: "40px" }}
                      >
                        <Icon icon="mdi:close" />
                      </button>
                    </div>
                  ))}

                  {/* Add Option Button */}
                  {pollOptions.length < 5 && (
                    <button
                      className="btn btn-outline-primary btn-sm w-100 mt-2"
                      onClick={addPollOption}
                    >
                      <Icon icon="mdi:plus" className="me-1" />
                      Add Option
                    </button>
                  )}
                  <small className="text-muted d-block mt-2">
                    You can add up to 5 options. Minimum 2 required.
                  </small>
                </div>

                {/* Poll Duration */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Poll Duration</label>
                  <select
                    className="form-select"
                    value={pollDuration}
                    onChange={(e) => setPollDuration(Number(e.target.value))}
                  >
                    <option value={1}>1 Hour</option>
                    <option value={6}>6 Hours</option>
                    <option value={24}>1 Day</option>
                    <option value={72}>3 Days</option>
                    <option value={168}>1 Week</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 px-4 pb-4 pt-10">
            <button
              className="btn btn-primary w-100 py-2 fw-semibold"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
