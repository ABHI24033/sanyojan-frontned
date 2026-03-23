import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MasterLayout from "../../masterLayout/MasterLayout";
import PostCard from "../../components/feed/PostCard";
import PollCard from "../../components/feed/PollCard";
import { getPostById, getPollById, toggleLike, addComment, deletePost, editPost, deleteComment } from "../../api/post";
import Breadcrumb from "../../components/common/Breadcrumb";
import AlertBox from "../../components/ui/Alert";
import { usePosts } from "../../hooks/usePost";
import { ArrowLeft } from "@phosphor-icons/react";
import { Icon } from "@iconify/react/dist/iconify.js";

const PostDetailsPage = () => {
    const { id: postId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Use the existing hook functionalities manually or build local state
    // Since usePosts is designed for the Feed, reusing parts of it or just using the API directly is cleaner here.
    // We'll use the API directly for this isolated page to avoid hook complexity with infinite scroll toggles.

    // State for alert and editing
    const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    // Comment state
    const [commentText, setCommentText] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);

    const location = useLocation();
    const isPollUrl = location.pathname.startsWith("/poll");

    // --- QUERIES ---
    const { data: post, isLoading, error } = useQuery({
        queryKey: ["postOrPoll", postId, isPollUrl ? "poll" : "post"],
        queryFn: () => isPollUrl ? getPollById(postId) : getPostById(postId),
        enabled: !!postId,
        staleTime: 0, // Always fetch fresh
    });

    // --- MUTATIONS ---

    // Like
    const likeMutation = useMutation({
        mutationFn: (id) => toggleLike(id),
        onSuccess: (data) => {
            queryClient.setQueryData(["post", postId], (oldPost) => {
                if (!oldPost) return oldPost;
                const isLiked = data.action === "liked";
                let newLikes = [...oldPost.likes];

                // Optimistic update helper (simplified as backend returns count mostly)
                // Check API response structure: toggleLike returns { success, action, likesCount } 
                // We probably need to refetch or update manually.
                // For accurate UI, let's invalidate or manual update if we had userId. 
                // For now invalidate is safest.
                return oldPost;
            });
            queryClient.invalidateQueries(["post", postId]);
        },
    });

    // Add Comment
    const handleAddComment = async (pid, text) => {
        if (!text.trim()) return;
        setIsCommenting(true);
        try {
            await addComment(pid, { text });
            setCommentText("");
            queryClient.invalidateQueries(["post", postId]);
        } catch (err) {
            console.error(err);
            setAlert({ show: true, message: "Failed to add comment", type: "error" });
        } finally {
            setIsCommenting(false);
        }
    };

    const handleCommentChange = (pid, text) => {
        setCommentText(text);
    };

    // Delete Post
    const deletePostMutation = useMutation({
        mutationFn: (id) => deletePost(id),
        onSuccess: () => {
            setAlert({ show: true, message: "Post deleted", type: "success" });
            setTimeout(() => navigate("/"), 1500);
        },
        onError: (err) => {
            setAlert({ show: true, message: err.message || "Failed to delete post", type: "error" });
        }
    });

    // Delete Comment
    const deleteCommentMutation = useMutation({
        mutationFn: ({ postId, commentId }) => deleteComment(postId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries(["post", postId]);
            setShowConfirm(false);
            setSelectedCommentId(null);
        },
        onError: (err) => {
            setAlert({ show: true, message: "Failed to delete comment", type: "error" });
        }
    });

    // Edit Post
    const editPostMutation = useMutation({
        mutationFn: (data) => editPost(postId, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["post", postId]);
            setEditModalOpen(false);
            setAlert({ show: true, message: "Post updated", type: "success" });
        },
        onError: () => {
            setAlert({ show: true, message: "Failed to update post", type: "error" });
        }
    });

    // Handlers for PostCard
    const openEditModal = () => setEditModalOpen(true);
    const closeEditModal = () => setEditModalOpen(false);
    const handleDeleteComment = (cid) => {
        setSelectedCommentId(cid);
        setShowConfirm(true);
    };

    // Just a wrapper to match PostCard expectations
    const handleUpdatePost = (text, removeImages, newFiles) => {
        editPostMutation.mutate({ text, removeImages, files: newFiles });
    };

    if (!postId) return <MasterLayout><div className="p-4 text-center">Invalid Post ID</div></MasterLayout>;
    if (isLoading) return <MasterLayout><div className="p-4 text-center">Loading...</div></MasterLayout>;
    if (error) return <MasterLayout><div className="p-4 text-center">Error: {error.message}</div></MasterLayout>;
    if (!post) return <MasterLayout><div className="p-4 text-center">Post not found</div></MasterLayout>;

    return (
        <MasterLayout>
            <div className="container py-4">
                <button className="btn btn-link d-flex align-items-center text-decoration-none ps-0 text-muted fw-medium inner-shadow-sm" onClick={() => navigate(-1)}>
                    <Icon icon="mdi:arrow-left" className="me-2" width="28" height="28" /> Back
                </button>
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        {post.isPoll ? (
                            <PollCard poll={post} />
                            // Note: PollCard internal logic might need hooks, 
                            // but usually it handles voting internally or via props.
                            // If PollCard expects specific props, we might need to shim them.
                        ) : (
                            <PostCard
                                post={post}
                                likeMutation={likeMutation}
                                handleAddComment={handleAddComment}
                                handleCommentChange={handleCommentChange}
                                commentText={commentText}
                                isCommenting={isCommenting}
                                setAlert={setAlert}
                                deletePostMutation={deletePostMutation}

                                // Edit props
                                editModalOpen={editModalOpen}
                                openEditModal={openEditModal}
                                closeEditModal={closeEditModal}
                                handleUpdatePost={handleUpdatePost}
                                isEditing={editPostMutation.isPending}
                                editPostMutation={editPostMutation} // Pass full mutation object if used

                                // Comment Deletion
                                deleteCommentMutation={deleteCommentMutation}
                                handleDeleteComment={handleDeleteComment}
                                showConfirm={showConfirm}
                                setShowConfirm={setShowConfirm}
                                selectedCommentId={selectedCommentId}

                                // Dummy props for Create Post input which isn't present effectively
                                text=""
                                setText={() => { }}
                                files={[]}
                                handleFileSelect={() => { }}
                                removeFile={() => { }}
                            />
                        )}
                    </div>
                </div>
            </div>
            <AlertBox alert={alert} setAlert={setAlert} />
        </MasterLayout>
    );
};

export default PostDetailsPage;
