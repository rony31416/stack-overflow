// src/components/PostDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const PostDetails = ({ post, copyToClipboard }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/${post.user}`);
        setUsername(response.data.username);
      } catch (error) {
        console.error("Failed to fetch username:", error);
      }
    };
    fetchUsername();
  }, [post.user]);

  return (
    <div className="p-4 border border-gray-300 rounded shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600 font-medium">{username}</span>
        <span className="text-gray-600">{`Language: ${post.language}`}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{post?.content}</h3>
      <div className="relative mt-2">
        <pre className="bg-black text-white p-2 rounded relative">
          {post.codeSnippet}
          <button
            onClick={() => copyToClipboard(post.codeSnippet)}
            className="absolute top-1 right-1 bg-blue-500 text-white px-2 py-1 rounded"
          >
            Copy
          </button>
        </pre>
      </div>
      <p className="text-gray-500">
        {new Date(post.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default PostDetails;
