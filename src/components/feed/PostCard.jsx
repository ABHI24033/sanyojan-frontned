import "../../components/feed/feed.css";
import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { timeAgo } from "../../helper/utils";
import ImageViewer from "./ImageViewer";
import { Link } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import ShareModal from "./ShareModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, editPost, editComment } from "../../api/post";
import CommentModal from "../modals/CommentModal";
import PostText from "./PostText";

export default function PostCard({
    post,
    likeMutation,
    handleAddComment,
    handleCommentChange,
    commentText,
    isCommenting,
    deleteCommentMutation,
    handleDeleteComment,
    showConfirm,
    setShowConfirm,
    selectedCommentId,
    setAlert,
    text,
    setText,
    files,
    handleFileSelect,
    removeFile,

    editModalOpen,
    openEditModal,
    closeEditModal,
    handleUpdatePost,
    editPostMutation,
}) {

    const [likes, setLikes] = useState(post.likesCount);
    const [liked, setLiked] = useState(post?.likedByMe);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const { user } = useAuth();

    const isOwner = user?.id === post?.author?._id;
    // delete post ==================================

    const [isViewerOpen, setViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const openViewer = (index) => {
        setViewerIndex(index);
        setViewerOpen(true);
    };
    const queryClient = useQueryClient();
    const deletePostMutation = useMutation({
        mutationFn: (postId) => deletePost(postId),
        onSuccess: (data) => {
            setAlert({
                type: "success",
                message: "Post deleted successfully!",
            });

            queryClient.invalidateQueries(["posts"]);
        },

        onError: (err) => {
            setAlert({
                type: "danger",
                message: err?.message || "Something went wrong!",
            });
        },
    });
    const editCommentMutation = useMutation({
        mutationFn: ({ postId, commentId, text }) => editComment(postId, commentId, text),
        onSuccess: () => {
            setAlert({
                type: "success",
                message: "Comment updated successfully!",
            });
            queryClient.invalidateQueries(["posts"]);
        },
        onError: (err) => {
            setAlert({
                type: "danger",
                message: err?.message || "Failed to update comment",
            });
        },
    });
    const [confirm, setConfirm] = useState(false);

    const handleDelete = () => {
        setConfirm(true);
    }
    // =======================================================

    const toggleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };

    const handleLike = (postId) => {
        toggleLike();

        likeMutation.mutate(postId, {
            onError: () => {
                toggleLike();
            },
        });
    };
    const handleCopyPostLink = (postId) => {
        const postLink = `${window.location.origin}/post/${postId}`;

        navigator.clipboard.writeText(postLink)
            .then(() => setAlert({ type: "success", message: "Copied to clipboard!" }))
            .catch(() => setAlert({ type: "danger", message: "Failed to copy link." }));
    };

    const handleShare = async () => {
        const postLink = `${window.location.origin}/post/${post._id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check out this post by ${post.author.firstname}`,
                    text: post.text ? (post.text.length > 100 ? post.text.substring(0, 100) + '...' : post.text) : 'Check out this post!',
                    url: postLink,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            handleCopyPostLink(post._id);
        }
    };

    const images = post?.images || [];
    const displayImages = images.slice(0, 4);
    const remaining = images.length - 4;


    return (
        <div className="card mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-0">
                {/* Post Header */}
                <div className="d-flex align-items-center p-3">
                    <div className="me-3">
                        <Link to={`/profile?userId=${post?.author?._id}`}>
                            <img
                                src={post?.author?.profilePicture || "assets/images/avatar/user.png"}
                                alt="profile"
                                className="rounded-circle object-fit-cover"
                                width="48"
                                height="48"
                            />
                        </Link>
                    </div>

                    <div className="flex-grow-1">
                        <h6 className="mb-0 fw-bold fs-6 text-capitalize">
                            <Link to={`/profile?userId=${post?.author?._id}`} className="text-dark text-decoration-none">
                                {post?.author?.firstname} {post?.author?.lastname}
                            </Link>
                        </h6>
                        <small className="text-muted" style={{ fontSize: "0.85rem" }}>{timeAgo(post?.createdAt)}</small>
                    </div>

                    <div className="dropdown">
                        <button
                            className="btn btn-light bg-transparent border-0 rounded-circle p-2"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <Icon icon="bi:three-dots-vertical" width={20} className="text-muted" />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm rounded-3">
                            <li><button className="dropdown-item py-2 px-3" onClick={() => handleCopyPostLink(post?._id)}><Icon icon="mdi:link-variant" className="me-2" />Copy link</button></li>
                            {
                                isOwner && <>
                                    <li><button className="dropdown-item py-2 px-3" onClick={() => openEditModal(post)}><Icon icon="mdi:pencil-outline" className="me-2" />Edit post</button></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item py-2 px-3 text-danger" onClick={handleDelete}><Icon icon="mdi:trash-can-outline" className="me-2" />Delete Post</button></li>
                                </>
                            }
                        </ul>
                    </div>
                </div>

                {/* Post Content */}
                <div className="px-3 pb-2">
                    {/* <p className="mb-3 text-break" style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>{post?.text}</p> */}
                    <PostText text={post?.text} maxLength={300} />
                    {images?.length > 0 && (
                        <div className="mb-3">
                            {/* -------- 1 IMAGE -------- */}
                            {images.length === 1 && (
                                <div className="w-100 d-flex justify-content-center bg-light rounded-3 overflow-hidden border border-light" style={{ minHeight: "200px" }}>
                                    <img
                                        src={images[0]}
                                        alt="post"
                                        className="img-fluid"
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            maxHeight: "700px",
                                            objectFit: "cover",
                                            cursor: "pointer",
                                            display: "block"
                                        }}
                                        onClick={() => openViewer(0)}
                                    />
                                </div>
                            )}

                            {/* -------- 2 IMAGES -------- */}
                            {images.length === 2 && (
                                <div className="row g-1">
                                    {images.map((img, i) => (
                                        <div className="col-6" key={i} onClick={() => openViewer(i)} style={{ cursor: "pointer" }}>
                                            <div className="bg-light rounded-2 d-flex align-items-center justify-content-center overflow-hidden border border-light" style={{ height: "300px" }}>
                                                <img
                                                    src={img}
                                                    alt={`post-${i}`}
                                                    className="img-fluid w-100 h-100"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* -------- 3 IMAGES -------- */}
                            {images.length === 3 && (
                                <div className="row g-1">
                                    <div className="col-6" onClick={() => openViewer(0)} style={{ cursor: "pointer" }}>
                                        <div className="bg-light rounded-start-2 d-flex align-items-center justify-content-center overflow-hidden border border-light" style={{ height: "400px" }}>
                                            <img
                                                src={images[0]}
                                                className="img-fluid w-100 h-100"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6 d-flex flex-column gap-1">
                                        {images.slice(1).map((img, i) => (
                                            <div key={i} onClick={() => openViewer(i + 1)} style={{ flex: 1, cursor: "pointer" }}>
                                                <div className={`bg-light d-flex align-items-center justify-content-center overflow-hidden border border-light ${i === 0 ? "rounded-top-end-2" : "rounded-bottom-end-2"}`} style={{ height: "198px" }}>
                                                    <img
                                                        src={img}
                                                        className="img-fluid w-100 h-100"
                                                        style={{ objectFit: "cover" }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 4+ images */}
                            {images.length >= 4 && (
                                <div className="image-grid gap-1">
                                    {displayImages.map((img, i) => (
                                        <div
                                            key={i}
                                            onClick={() => openViewer(i)}
                                            className="image-box position-relative rounded-2 overflow-hidden bg-light border border-light d-flex align-items-center justify-content-center"
                                            style={{ cursor: "pointer", height: "200px" }}
                                        >
                                            <img
                                                src={img}
                                                alt={`post-${i}`}
                                                className="img-fluid w-100 h-100"
                                                style={{ objectFit: "cover" }}
                                            />
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

                {/* Like, Comment, Share Stats */}
                <div className="px-3 py-2 d-flex align-items-center justify-content-between border-top border-light">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            onClick={() => handleLike(post?._id)}
                            className="btn btn-link text-decoration-none p-0 d-flex align-items-center text-secondary"
                        >
                            <Icon
                                icon={liked ? "mdi:heart" : "mdi:heart-outline"}
                                width={22}
                                className={liked ? "text-danger" : ""}
                            />
                            <span className={`ms-1 ${liked ? "text-danger" : ""}`}>{likes}</span>
                        </button>
                        <button onClick={() => setShowCommentModal(true)} className="btn btn-link text-decoration-none p-0 d-flex align-items-center text-secondary">
                            <Icon icon="mdi:comment-outline" width={20} />
                            <span className="ms-1">{post?.commentsCount}</span>
                        </button>
                        <button
                            className="btn btn-link text-decoration-none p-0 d-flex align-items-center text-secondary"
                            onClick={handleShare}
                        >
                            <Icon icon="mdi:share-outline" width={22} />
                        </button>
                    </div>
                </div>

                {/* Comment Input Area */}
                <div className="p-3 bg-light bg-opacity-25 border-top border-light">
                    <div className="d-flex align-items-center">
                        <img
                            src={user?.profilePicture || "assets/images/avatar/user.png"}
                            alt="avatar"
                            className="rounded-circle me-2 object-fit-cover border"
                            width="32"
                            height="32"
                        />
                        <div className="flex-grow-1 position-relative">
                            <input
                                className="form-control rounded-pill bg-white border px-3 py-2 fs-6"
                                name="commentText"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={handleCommentChange}
                                style={{ paddingRight: "40px" }}
                            />
                            <button
                                onClick={() => handleAddComment(post?._id)}
                                disabled={isCommenting || !commentText.trim()}
                                className="btn btn-link rounded-pill position-absolute end-0 top-50 translate-middle-y text-primary p-6 me-4"
                                style={{ opacity: commentText.trim() ? 1 : 0.5 }}
                            >
                                <Icon icon="mdi:send" width={25} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isViewerOpen && (
                <ImageViewer
                    images={post.images}
                    index={viewerIndex}
                    onClose={() => setViewerOpen(false)}
                    onNext={() => setViewerIndex((prev) => prev + 1)}
                    onPrev={() => setViewerIndex((prev) => prev - 1)}
                />
            )}

            <ConfirmModal
                show={confirm}
                title="Delete Post?"
                message="Are you sure want to delete this post?"
                onCancel={() => setConfirm(false)}
                onConfirm={() => deletePostMutation?.mutate(post?._id)}
                isPending={deletePostMutation?.isPending}
            />

            <ShareModal
                show={editModalOpen}
                onClose={closeEditModal}
                text={text}
                setText={setText}
                handleFileSelect={handleFileSelect}
                removeFile={removeFile}
                files={files}
                onPost={handleUpdatePost}
                isPosting={editPostMutation.isPending}
            />

            <CommentModal
                show={showCommentModal}
                post={post}
                handleAddComment={handleAddComment}
                handleCommentChange={handleCommentChange}
                isCommenting={isCommenting}
                commentText={commentText}
                onClose={() => setShowCommentModal(false)}
                comments={post?.comments}
                timeAgo={timeAgo}
                images={images}
                displayImages={displayImages}
                remaining={remaining}
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                handleDeleteComment={handleDeleteComment}
                deleteCommentMutation={deleteCommentMutation}
                selectedCommentId={selectedCommentId}
                editCommentMutation={editCommentMutation}
            />
        </div>
    );
}
