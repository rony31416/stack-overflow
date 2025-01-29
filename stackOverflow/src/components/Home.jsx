import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CreatePost from "./CreatePost";
import NotificationIcon from "./NotificationIcon";
import PostDetails from "./PostDetails";

const Home = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  function getToken() {
    return localStorage.getItem("token"); // Retrieve token from localStorage
  }

  const clearToken = () => {
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setUserName(decoded.username);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3002/posts", {
          withCredentials: true,
        });
        const postsData = response.data;

        // Fetch code snippet content for each post and sort by date
        const detailedPosts = await Promise.all(
          postsData.map(async (post) => {
            const postDetail = await axios.get(
              `http://localhost:3002/posts/${post._id}`,
              { withCredentials: true }
            );
            return postDetail.data;
          })
        );
        const sortedPosts = detailedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    };
    fetchPosts();

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/signin");
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => alert("Code snippet copied to clipboard!"))
      .catch((err) => console.error("Error copying text: ", err));
  };

  return (
    <div className="p-5">
      <nav className="flex justify-between items-center bg-gray-400 p-3">
        <div>
          <img src="logo.jpeg" alt="Logo" className="h-10 w-18" />
        </div>
        
        <div className="flex items-center space-x-4 ml-auto">
          <NotificationIcon userId={userId} />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
          
          <div className="flex items-center space-x-2">
           
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14c2.5 0 4.5-1.5 4.5-3.5S14.5 7 12 7s-4.5 1.5-4.5 3.5S9.5 14 12 14zm0 0v2m0 0c-3.5 0-6.5 1.5-6.5 4.5V20h13v-1.5c0-3-3-4.5-6.5-4.5z"
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-semibold">{userName}</span>
            </div>
          </div>
        </div>
      </nav>

      {showWelcome && (
        <div className="mt-4 text-green-500 text-lg">Welcome! {userName}</div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Posts</h2>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleCreatePost}
          >
            Create Post
          </button>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <PostDetails
              key={post._id}
              post={post}
              copyToClipboard={copyToClipboard}
            />
          ))}
        </div>
      </div>

      {showCreatePost && <CreatePost onClose={handleCloseCreatePost} />}
    </div>
  );
};

export default Home;
