import React, { useState } from "react";
import ShareModal from "./ShareModal";
import "./feed.css"
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function FeedCard({
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
  isPostingPoll
}) {
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAuth();

  const handleCloseModal = () => {
    setOpenModal(false);
    setText("");
    files.length = 0;
  };


  return (
    <div className="card mb-10 card-small d-flex align-item-center justify-content-center">
      <div className="share-box-inner d-flex justify-content-center  align-item-center pt-20 px-10">

        {/* profile picture */}
        <div className="d-flex align-item-center justify-content-center">
          <Link to={`/profile?userId=${user?.id}`}>
            <figure
              className="
        w-20 h-20 md:w-24 md:h-24 
        rounded-full overflow-hidden 
        border-4 border-white 
        shadow-xl ring-2 ring-primary/50 
        transition-transform duration-300 
        hover:scale-105 hover:ring-primary
      "
            >
              <img
                src={user?.profilePicture || "assets/images/avatar/user.png"}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
                width={50}
                height={50}
                style={{ borderRadius: "50%" }}
              />
            </figure>
          </Link>
        </div>


        {/* Share input box */}
        <div className="w-100">
          <form className="share-text-box">
            <textarea
              className="share-text-field"
              placeholder="Say Something"
              onClick={() => setOpenModal(true)}
              readOnly
            ></textarea>
          </form>
        </div>
      </div>

      {/* Modal */}
      <ShareModal
        show={openModal}
        onClose={handleCloseModal}
        text={text}
        setText={setText}
        handleFileSelect={handleFileSelect}
        removeFile={removeFile}
        files={files}
        onPost={handlePost}
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
        onPollPost={handlePollPost}
        isPostingPoll={isPostingPoll}
      />
    </div>
  );
}
