import React, { useState } from "react";
import "./modal.css";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";

export default function CommentModal({
    show,
    onClose,
    post,
    comments,
    timeAgo,
    commentText,
    handleCommentChange,
    handleAddComment,
    isCommenting,
    images,
    displayImages,
    remaining,
    deleteCommentMutation,
    handleDeleteComment,
    showConfirm,
    setShowConfirm,
    selectedCommentId,
    editCommentMutation,
}) {
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");

    const handleEditClick = (comment) => {
        setEditingCommentId(comment._id);
        setEditText(comment.text);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditText("");
    };

    const handleSaveEdit = (commentId) => {
        if (!editText.trim()) return;
        editCommentMutation.mutate({ postId: post._id, commentId, text: editText }, {
            onSuccess: () => {
                handleCancelEdit();
            }
        });
    };
    if (!show) return null;

    return (
        <div className="insta-modal-overlay">
            <div className="insta-modal-container">

                <div className="insta-close-btn">
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                {/* Left: Post Section */}
                <div className="insta-left">
                    {/* post header */}
                    <div className="d-flex align-items-center">
                        <div className="me-3">
                            <Link to={`/profile?userId=${post?.author?._id}`}>
                                <img
                                    src={post?.author?.profilePicture || "/assets/images/avatar/user.png"}
                                    alt="profile"
                                    className="rounded-circle"
                                    width="50"
                                    height="50"
                                />
                            </Link>
                        </div>

                        <div>
                            <h6 className="mb-0 fw-bold fs-6 text-capitalize">
                                <Link to={`/profile?userId=${post?.author?._id}`} className="text-dark text-decoration-none">
                                    {post?.author?.firstname} {post?.author?.lastname}
                                </Link>
                            </h6>
                            <small className="text-muted">{timeAgo(post?.createdAt)}</small>
                        </div>
                    </div>

                    <div className="mt-3">
                        <p className="mb-3">{post?.text}</p>

                        {images?.length > 0 && (
                            <div className="mt-3">

                                {/* -------- 1 IMAGE -------- */}
                                {images.length === 1 && (
                                    <div className="w-100">
                                        <img
                                            src={images[0]}
                                            alt="post-1"
                                            className="img-fluid rounded w-100"
                                            style={{ height: "auto", objectFit: "cover" }}
                                        />
                                    </div>
                                )}

                                {/* -------- 2 IMAGES -------- */}
                                {images.length === 2 && (
                                    <div className="row g-2">
                                        {images.map((img, i) => (
                                            <div className="col-6" key={i} onClick={() => openViewer(i)}>
                                                <img
                                                    src={img}
                                                    alt={`post-${i}`}
                                                    className="img-fluid rounded w-100"
                                                    style={{ height: "250px", objectFit: "cover" }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* -------- 3 IMAGES -------- */}
                                {images.length === 3 && (
                                    <div className="row g-2">
                                        {/* Left Big Image */}
                                        <div className="col-6" onClick={() => openViewer(0)}>
                                            <img
                                                src={images[0]}
                                                className="img-fluid rounded w-100"
                                                style={{ height: "350px", objectFit: "cover" }}
                                            />
                                        </div>

                                        {/* Right 2 Small Images */}
                                        <div className="col-6 d-flex flex-column gap-2">
                                            {images.slice(1).map((img, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => openViewer(i + 1)}
                                                    style={{ flex: 1 }}
                                                >
                                                    <img
                                                        src={img}
                                                        className="img-fluid rounded w-100"
                                                        style={{ height: "170px", objectFit: "cover" }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* 4+ images */}
                                {images.length >= 4 && (
                                    <div className="image-grid">
                                        {displayImages.map((img, i) => (
                                            <div
                                                key={i}
                                                onClick={() => openViewer(i)}
                                                className="image-box position-relative"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`post-${i}`}
                                                    className="img-fluid w-100 h-100"
                                                    style={{ objectFit: "cover" }}
                                                />

                                                {/* SHOW +MORE ONLY ON 4th IMAGE */}
                                                {i === 3 && remaining > 0 && (
                                                    <div className="overlay-more">
                                                        +{remaining} more
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Comments Section */}
                <div className="insta-right">

                    {/* Modal Header */}
                    <div className="insta-header">
                        <h5 className="fw-bold fs-4">Comments ({comments.length})</h5>
                    </div>

                    {/* Scrollable Comments */}
                    <div className="insta-comments-body">
                        {comments?.map((c) => (
                            <div key={c._id} className="insta-comment-box d-flex align-items-start">

                                {/* Avatar */}
                                <img
                                    src={c?.user?.profilePicture || "/assets/images/avatar/user.png"}
                                    className="insta-comment-avatar me-1"
                                    alt="profile"
                                />

                                {/* MAIN CONTENT */}
                                <div className="flex-grow-1">

                                    {/* Name + 3 dots */}
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="fw-semibold fs-6 mb-0">
                                                {c?.user?.firstname} {c?.user?.lastname}
                                            </h6>
                                            <small className="text-muted d-block">
                                                {timeAgo(c.createdAt)}
                                            </small>
                                        </div>

                                        {/* THREE DOTS */}
                                        <div className="dropdown">
                                            <button className="btn btn-sm px-1" data-bs-toggle="dropdown">
                                                <Icon icon="mdi:dots-vertical" width="20" />
                                            </button>
                                            <ul className="dropdown-menu p-10 dropdown-menu-end">
                                                <li className="">
                                                    <button
                                                        className="dropdown-item px-3 d-flex align-items-center rounded text-primary"
                                                        onClick={() => handleEditClick(c)}
                                                    >
                                                        <Icon icon="mdi:pencil-outline" width="20" className="me-2" />
                                                        Edit
                                                    </button>
                                                </li>
                                                <li className="">
                                                    <button
                                                        className="dropdown-item px-3 d-flex align-items-center rounded text-danger"
                                                        onClick={() => handleDeleteComment(c._id)}
                                                    >
                                                        <Icon icon="mdi:delete-outline" width="20" className="me-2" />
                                                        Delete
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Comment text or Edit Input */}
                                    {editingCommentId === c._id ? (
                                        <div className="mt-2">
                                            <textarea
                                                className="form-control mb-2"
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                autoFocus
                                                rows={3}
                                            />
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm py-2 btn-primary"
                                                    onClick={() => handleSaveEdit(c._id)}
                                                    disabled={editCommentMutation?.isPending}
                                                >
                                                    {editCommentMutation?.isPending ? "Saving..." : "Save"}
                                                </button>
                                                <button
                                                    className="btn btn-sm py-2 btn-secondary"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-secondary mb-0 mt-2">{c.text}</p>
                                    )}
                                </div>
                            </div>

                        ))}
                    </div>

                    {/* Comment Input Section */}
                    <div className="insta-input-section">
                        <input
                            type="text"
                            className="form-control insta-input"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={handleCommentChange}
                        />

                        <button
                            onClick={() => handleAddComment(post?._id)}
                            disabled={isCommenting}
                            className="btn btn-primary insta-post-btn"
                        >
                            {isCommenting ? "Posting..." : "Post"}
                        </button>
                    </div>
                </div>

            </div>

            <ConfirmModal
                show={showConfirm}
                title="Delete Comment ?"
                message="Are you sure want to delete?"
                onCancel={() => setShowConfirm(false)}
                onConfirm={() => deleteCommentMutation.mutate({ postId: post?._id, commentId: selectedCommentId })}
                isPending={deleteCommentMutation?.isPending}
            />
        </div>
    );
}
