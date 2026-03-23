import React, { useEffect, useRef, useState } from "react";
import FeedCard from "./FeedCard";
import PostCard from "./PostCard";
import PollCard from "./PollCard";
import "./feed.css";
import "./profile.css"
import { useUserProfile } from "../../hooks/useUserProfile";
import { useLocation, useNavigate } from "react-router-dom";
import { usePosts } from "../../hooks/usePost";
import { Icon } from "@iconify/react/dist/iconify.js";
import AlertBox from "../ui/Alert";
import ProfileCard from "./ProfileCard";
import AboutTab from "./AboutTab";
import { useAuth } from "../../context/AuthContext";


export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('about');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");
    const { user: currentUser } = useAuth();
    const effectiveUserId = userId || currentUser?.id || currentUser?._id;
    const navigate = useNavigate();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useUserProfile(effectiveUserId);

    // Profile: use FIRST PAGE
    const profile = data?.pages?.[0]?.data?.profile;
    const user = data?.pages?.[0]?.data?.user;

    console.log("profile", profile);
    console.log("user", user);

    // Flatten infinite posts
    const posts =
        data?.pages?.flatMap((page) => page?.data?.posts || []) || [];

    const bottomRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1 }
        );

        if (bottomRef.current) observer.observe(bottomRef.current);

        return () => observer.disconnect();
    }, [hasNextPage]);


    const {
        text,
        setText,
        files,
        handleFileSelect,
        removeFile,
        handlePost,
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
        handlePollPost,
        isPostingPoll,

        likeMutation,
        handleAddComment,
        handleCommentChange,
        commentText,
        isCommenting,
        setAlert,
        alert,

        editModalOpen,
        openEditModal,
        closeEditModal,
        handleUpdatePost,
        editPostMutation,
        // Poll voting
        handleVote,
        isVoting,
    } = usePosts();
    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!effectiveUserId) {
        return (
            <div className="container py-5 text-center">
                <p className="text-muted mb-0">Unable to load profile. Please re-login.</p>
            </div>
        );
    }

    return (
        <div className="profile-page w-100 bg-light pb-5">

            <div className="container " style={{
                // height: "calc(100vh - 80px)",   // adjust based on header height
                overflow: "hidden",
            }}>
                <div className="row profile-layout" style={{
                    display: "flex",
                    height: "100%",
                    gap: "20px",
                    overflow: "hidden",
                }}>

                    {/* LEFT SIDEBAR */}
                    <div className="col-lg-4 " style={{
                        height: "100%",
                        overflowY: "auto",
                        paddingRight: "10px",
                    }}>
                        <div style={{
                            position: 'sticky',
                            top: '20px',
                            maxHeight: 'calc(100vh - 10px)',
                            overflowY: 'auto'
                        }}>
                            <ProfileCard
                                profile={profile}
                                user={user}
                                onViewProfile={() => console.log("View Profile")}
                                onEdit={() => navigate(`/profile/edit-profile?userId=${user?.id}`)}
                                onAdd={() => console.log("Add Relative")}
                            />
                        </div>
                    </div>

                    {/* MAIN FEED */}
                    <div className="col-lg-6 " style={{
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        paddingRight: "10px",
                    }}
                    >
                        <div className="profile-tabs-container d-flex gap-4 mb-3 flex-shrink-0">
                            <button
                                className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                                onClick={() => setActiveTab('about')}
                            >
                                About
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                                onClick={() => setActiveTab('posts')}
                            >
                                Posts
                            </button>
                        </div>

                        <div className="feed-scroll" style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>


                            {activeTab === 'posts' && (
                                <>
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

                                    {posts?.map(item => (
                                        <div key={item._id}>
                                            {item.isPoll ? (
                                                <PollCard
                                                    poll={item}
                                                    handleVote={handleVote}
                                                    isVoting={isVoting}
                                                />
                                            ) : (
                                                <PostCard
                                                    key={item._id}
                                                    post={item}
                                                    likeMutation={likeMutation}
                                                    handleAddComment={handleAddComment}
                                                    handleCommentChange={handleCommentChange}
                                                    commentText={commentText}
                                                    isCommenting={isCommenting}
                                                    setAlert={setAlert}
                                                    text={text}
                                                    setText={setText}
                                                    files={files}

                                                    editModalOpen={editModalOpen}
                                                    openEditModal={openEditModal}
                                                    closeEditModal={closeEditModal}
                                                    handleUpdatePost={handleUpdatePost}
                                                    editPostMutation={editPostMutation}
                                                />
                                            )}
                                        </div>
                                    ))}

                                    {/* Infinite Scroll Loader */}
                                    <div ref={bottomRef} className="text-center py-3" style={{ height: "40vh" }}>
                                        {isFetchingNextPage && <p>Loading more posts...</p>}
                                    </div>
                                </>
                            )}

                            {activeTab === 'about' && (
                                <AboutTab
                                    activeTab={activeTab}
                                    profile={profile}
                                    user={user}
                                />
                            )}
                        </div>
                    </div>
                </div>

            </div>
            <AlertBox alert={alert} setAlert={setAlert} />
        </div>
    );
}
