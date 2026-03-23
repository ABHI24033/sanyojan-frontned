import { useEffect, useRef } from "react";
import "../../components/feed/feed.css";
import { usePosts } from "../../hooks/usePost";
import AlertBox from "../ui/Alert";
import FeedCard from "./FeedCard";
import PostCard from "./PostCard";
import PollCard from "./PollCard";
import NotificationCard from "./NotificationCard";
import SubscriptionSection from "../subscription/SubscriptionSection";

export default function Feed() {

    const {
        postsQuery,
        posts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        deletePostMutation,
        // Post create state & functions
        text,
        setText,
        files,
        handleFileSelect,
        removeFile,
        handlePost,
        isPosting,
        // Poll create state & functions
        pollQuestion,
        setPollQuestion,
        pollOptions,
        handlePollOptionChange,
        addPollOption,
        removePollOption,
        pollDuration,
        setPollDuration,
        handlePollPost,
        isPostingPoll,

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
        alert,
        // edit
        editModalOpen,
        openEditModal,
        closeEditModal,
        handleUpdatePost,
        isEditing,
        editPostMutation,
        // Poll voting
        handleVote,
        isVoting,

    } = usePosts();

    const loaderRef = useRef(null);
    // Infinite scrolling using IntersectionObserver
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loaderRef, hasNextPage]);


    if (postsQuery.isLoading) return <p>Loading feed...</p>;

    return (
        <div className="py-4">
            <div className="row justify-content-center">

                {/* FEED AREA */}
                <div className="col-12 col-lg-6 feed-scroll">
                    <FeedCard
                        text={text}
                        setText={setText}
                        files={files}
                        handleFileSelect={handleFileSelect}
                        removeFile={removeFile}
                        handlePost={handlePost}
                        isPosting={isPosting}
                        // Poll props
                        pollQuestion={pollQuestion}
                        setPollQuestion={setPollQuestion}
                        pollOptions={pollOptions}
                        handlePollOptionChange={handlePollOptionChange}
                        addPollOption={addPollOption}
                        removePollOption={removePollOption}
                        pollDuration={pollDuration}
                        setPollDuration={setPollDuration}
                        handlePollPost={handlePollPost}
                        isPostingPoll={isPostingPoll}
                    />
                    {
                        posts?.length === 0 && (
                            postsQuery.error ? (
                                <p>{postsQuery.error.message || "Error loading posts."}</p>
                            ) : (
                                <div className="text-center py-4 mb-4 d-flex flex-column gap-4 align-items-center justify-content-center"
                                    style={{
                                        height: '60vh'
                                    }}>
                                    <div className="mb-3">
                                        <svg
                                            width="48"
                                            height="48"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#9ca3af"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    <h6 className="text-secondary fw-semibold mb-2">You're All Caught Up</h6>
                                    <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                        Share your family moments. Create posts, start polls, and add family members.
                                    </p>
                                    <div className="d-flex align-items-center justify-content-center gap-2 text-muted" style={{ fontSize: '0.85rem' }}>
                                        <i className="bi bi-shield-check"></i>
                                        <small>Only your family members can see your posts</small>
                                    </div>
                                </div>
                            )
                        )
                    }
                    {posts?.map((item) => (
                        <div key={item._id} className="mb-10">
                            {item.isPoll ? (
                                <PollCard
                                    poll={item}
                                    handleVote={handleVote}
                                    isVoting={isVoting}
                                />
                            ) : (
                                <PostCard
                                    post={item}
                                    likeMutation={likeMutation}
                                    handleAddComment={handleAddComment}
                                    handleCommentChange={handleCommentChange}
                                    commentText={commentText}
                                    isCommenting={isCommenting}
                                    setAlert={setAlert}
                                    deletePostMutation={deletePostMutation}
                                    // existing...
                                    editModalOpen={editModalOpen}
                                    openEditModal={openEditModal}
                                    closeEditModal={closeEditModal}
                                    handleUpdatePost={handleUpdatePost}
                                    isEditing={isEditing}
                                    editPostMutation={editPostMutation}
                                    text={text}
                                    setText={setText}
                                    files={files}
                                    handleFileSelect={handleFileSelect}
                                    removeFile={removeFile}
                                    deleteCommentMutation={deleteCommentMutation}
                                    handleDeleteComment={handleDeleteComment}
                                    showConfirm={showConfirm}
                                    setShowConfirm={setShowConfirm}
                                    selectedCommentId={selectedCommentId}
                                />
                            )}
                        </div>
                    ))}

                    {/* 🔥 Infinite Scroll Loader Element */}
                    <div ref={loaderRef} className="my-4 text-center pt-10" style={{ height: "10vh" }}>
                        {isFetchingNextPage && (
                            <div className="d-flex align-item-center mt-4 justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}

                        {!hasNextPage && (
                            <p></p>
                        )}
                    </div>

                </div>

                {/* SIDEBAR */}
                <div className="col-lg-4 d-none d-lg-block feed-scroll">
                    {/* <SubscriptionSection /> */}
                    <NotificationCard />
                </div>

            </div>
            <AlertBox alert={alert} setAlert={setAlert} />
        </div>
    );
}
