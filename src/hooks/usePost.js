import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { addComment, createPost, createPoll, deleteComment, deletePost, editPost, getAllPosts, toggleLike, votePoll } from "../api/post";
import { useState } from "react";

export const usePosts = () => {
  const queryClient = useQueryClient();

  // ---------------------------
  // Local States for Create Post
  // ---------------------------
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  // ---------------------------
  // Local States for Create Poll
  // ---------------------------
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState(24);


  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------------
  // Poll Option Handlers
  // ---------------------------
  const handlePollOptionChange = (index, value) => {
    setPollOptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions((prev) => [...prev, ""]);
    }
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const resetPollData = () => {
    setPollQuestion("");
    setPollOptions(["", ""]);
    setPollDuration(24);
  };

  // ---------------------------
  // Copy Post Link
  // ---------------------------
  const handleCopyPostLink = (postId) => {
    const postLink = `${window.location.origin}/post/${postId}`;
    console.log(postLink);

    navigator.clipboard.writeText(postLink)
      .then(() => setAlert({ type: "success", message: "Copied to clipboard!" }))
      .catch(() => setAlert({ type: "danger", message: "Failed to copy link." }));
  };

  // ---------------------------
  // Infinite Feed (4 posts per load)
  // ---------------------------
  const postsQuery = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = null }) => getAllPosts({ cursor: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage?.nextCursor ? lastPage.nextCursor : undefined,
    refetchOnWindowFocus: false,
  });

  const posts = postsQuery.data?.pages.flatMap((page) => page?.data || []) || [];

  // ---------------------------
  // Create new post
  // ---------------------------
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handlePost = (onClose) => {
    const postData = { text, files };

    createPostMutation.mutate(postData, {
      onSuccess: () => {
        setText("");
        setFiles([]);
        if (onClose) onClose();
      },
    });
  };

  // ---------------------------
  // Create new poll
  // ---------------------------
  const createPollMutation = useMutation({
    mutationFn: createPoll,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handlePollPost = (onClose) => {
    // Filter out empty options
    const validOptions = pollOptions.filter(opt => opt.trim());

    if (!pollQuestion.trim() || validOptions.length < 2) {
      setAlert({
        type: "danger",
        message: "Please provide a question and at least 2 options"
      });
      return;
    }

    const pollData = {
      question: pollQuestion,
      options: validOptions,
      duration: pollDuration,
    };

    createPollMutation.mutate(pollData, {
      onSuccess: () => {
        resetPollData();
        if (onClose) onClose();
      },
      onError: (err) => {
        setAlert({
          type: "danger",
          message: err?.message || "Failed to create poll"
        });
      }
    });
  };

  // ---------------------------
  // Like / Unlike post
  // ---------------------------
  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // ---------------------------
  // Add comment
  // ---------------------------
  const commentMutation = useMutation({
    mutationFn: ({ postId, text }) => addComment(postId, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      setCommentText("");
      setAlert({
        type: "success",
        message: "Comment added successfully!",
      });
    },
    onError: (err) => {
      setAlert({
        type: "danger",
        message: err?.message || "Something went wrong!.",
      });
    }
  });
  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;

    commentMutation.mutate({
      postId,
      text: commentText,
    });
  };

  // delete Comment Mutation
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const handleDeleteComment = (commentId) => {
    setSelectedCommentId(commentId);
    setShowConfirm(true);
  };
  const deleteCommentMutation = useMutation({
    mutationFn: ({ postId, commentId }) => deleteComment(postId, commentId),
    onSuccess: () => {
      setAlert({
        type: "success",
        message: "Comment deleted successfully!",
      });
      queryClient.invalidateQueries(["posts"]);
      setSelectedCommentId(null);
      setShowConfirm(false);

    },
    onError: (err) => {
      setAlert({
        type: "danger",
        message: err?.message || "Something went wrong!",
      });
    }
  })
  // Edit Post 
  const [editPostId, setEditPostId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [originalImages, setOriginalImages] = useState([]);

  const openEditModal = (post) => {
    setEditPostId(post._id);
    setText(post?.text);
    // Initialize files with existing image URLs
    setFiles(post?.images || []);
    setOriginalImages(post?.images || []);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditPostId(null);
    setText("");
    setFiles([]);
    setOriginalImages([]);
  };

  const editPostMutation = useMutation({
    mutationFn: ({ postId, data }) => editPost(postId, data),
    onSuccess: () => {
      setAlert({
        type: "success",
        message: "Post updated successfully!",
      });

      queryClient.invalidateQueries(["posts"]);
      closeEditModal();
    },

    onError: (err) => {
      setAlert({
        type: "danger",
        message: err?.message || "Failed to update post!",
      });
    },
  });

  const handleUpdatePost = () => {
    // Separate new files (File objects) from remaining existing images (strings)
    const newFiles = files.filter(file => file instanceof File);
    const remainingImages = files.filter(file => typeof file === 'string');

    // Calculate removed images: present in originalImages but not in remainingImages
    const removeImages = originalImages.filter(img => !remainingImages.includes(img));

    const updated = {
      text,
      files: newFiles,
      removeImages,
    };

    editPostMutation.mutate({
      postId: editPostId,
      data: updated,
    });
  };

  // ---------------------------
  // Vote on Poll
  // ---------------------------
  const votePollMutation = useMutation({
    mutationFn: ({ pollId, optionIndex }) => votePoll(pollId, optionIndex),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (err) => {
      setAlert({
        type: "danger",
        message: err?.message || "Failed to vote on poll"
      });
    }
  });

  const handleVote = (pollId, optionIndex) => {
    votePollMutation.mutate({ pollId, optionIndex });
  };


  return {
    postsQuery,
    posts,
    fetchNextPage: postsQuery.fetchNextPage,
    hasNextPage: postsQuery.hasNextPage,
    isFetchingNextPage: postsQuery.isFetchingNextPage,
    handleCopyPostLink,
    // deletePostMutation,

    // Post create state & functions
    text,
    setText,
    files,
    handleFileSelect,
    removeFile,
    handlePost,
    isPosting: createPostMutation.isPending,

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
    isPostingPoll: createPollMutation.isPending,

    // Mutations
    createPostMutation,
    createPollMutation,
    likeMutation,
    commentMutation,
    handleAddComment,
    handleCommentChange,
    commentText,
    isCommenting: commentMutation.isPending,
    deleteCommentMutation,
    handleDeleteComment,
    showConfirm,
    setShowConfirm,
    selectedCommentId,
    setAlert,
    alert,
    // Edit Post
    editModalOpen,
    openEditModal,
    closeEditModal,
    handleUpdatePost,
    editPostMutation,
    // Vote Poll
    votePollMutation,
    handleVote,
    isVoting: votePollMutation.isPending,
  };
};
