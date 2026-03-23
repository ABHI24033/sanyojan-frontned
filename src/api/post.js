import axiosInstance from "./axiosInstance";

export const createPost = async (form) => {
  const formData = new FormData();

  if (form.files && form.files.length > 0) {
    form.files.forEach((file) => {
      formData.append("images", file); // backend must use .array('images')
    });
  }

  // Attach all other fields (like text)
  Object.keys(form).forEach((key) => {
    if (
      key !== "file" &&
      form[key] !== null &&
      form[key] !== undefined &&
      form[key] !== ""
    ) {
      formData.append(key, form[key]);
    }
  });

  try {
    const res = await axiosInstance.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data;
  } catch (error) {
    console.error("Create Post Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create post");
  }
};

// Create Poll
export const createPoll = async (pollData) => {
  try {
    const res = await axiosInstance.post("/posts/poll", pollData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data.data;
  } catch (error) {
    console.error("Create Poll Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create poll");
  }
};

export const getAllPosts = async ({ cursor = null }) => {
  try {
    const { data } = await axiosInstance.get("/posts", {
      params: {
        cursor: cursor || null,
        limit: 4,   // Load 4 posts 
      },
    });

    return data;
  } catch (error) {
    console.error("Get posts error:", error);
    throw error;
  }
};


// Like/Unlike post
export const toggleLike = async (postId) => {
  try {
    const { data } = await axiosInstance.post(`/posts/${postId}/like`);
    return data.data;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};


// Add comment
export const addComment = async (postId, payload) => {
  try {
    const { data } = await axiosInstance.post(`/posts/${postId}/comment`, payload);
    return data.data;
  } catch (error) {
    console.error("Error during add comment:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};


//     getPostById,
export const getPostById = async (postId) => {
  try {
    const { data } = await axiosInstance.get(`/posts/${postId}`);
    return data.data;
  } catch (error) {
    console.error("Error during add comment:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
}
//     getPostComments,
export const getPostComments = async (postId) => {
  try {
    const { data } = await axiosInstance.get(`/posts/${postId}/comments`);
    return data.data;
  } catch (error) {
    console.error("Error during get comments:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
}
// delete Post
export const deletePost = async (postId) => {
  try {
    const res = await axiosInstance.delete(`/posts/${postId}`);
    return res.data;
  } catch (error) {
    console.error("Error during deleting Post:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
}
//Edit Post
export const editPost = async (postId, data) => {
  const formData = new FormData();

  // Append text
  if (data.text) formData.append("text", data.text);

  // Append new files
  if (data.files && data.files.length > 0) {
    data.files.forEach((file) => {
      formData.append("images", file);
    });
  }

  // Append removeImages
  if (data.removeImages && data.removeImages.length > 0) {
    data.removeImages.forEach((imgUrl) => {
      formData.append("removeImages", imgUrl);
    });
  }

  try {
    const res = await axiosInstance.put(`/posts/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error during editing Post:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};
// delete comment
export const deleteComment = async (postId, commentId) => {
  console.log(commentId);

  try {
    const res = await axiosInstance.delete(`/posts/${postId}/comment/${commentId}`);
    return res.data;
  } catch (error) {
    console.error("Error during editing Post:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};



// edit comment
export const editComment = async (postId, commentId, text) => {
  try {
    const res = await axiosInstance.put(`/posts/${postId}/comment/${commentId}`, { text });
    return res.data;
  } catch (error) {
    console.error("Error during editing comment:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const getPollById = async (pollId) => {
  try {
    const { data } = await axiosInstance.get(`/posts/poll/${pollId}`);
    return data.data;
  } catch (error) {
    console.error("Error during get poll:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
}

// Vote on Poll
export const votePoll = async (pollId, optionIndex) => {
  try {
    const res = await axiosInstance.post(`/posts/poll/${pollId}/vote`, { optionIndex });
    return res.data.data;
  } catch (error) {
    console.error("Vote Poll Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to vote on poll");
  }
};

