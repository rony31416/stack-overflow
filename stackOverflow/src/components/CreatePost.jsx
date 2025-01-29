import axios from "axios";
import React, { useState } from "react";

const CreatePost = ({ onClose }) => {
  const [description, setDescription] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:3002/posts",
        { content: description, codeSnippet, language },
        { withCredentials: true }
      );
  
      console.log("Post created:", response.data);
      setSuccess(true); // Show confirmation message
  
      if (response.data._id) {
        const postId = response.data._id;
  
        // Fetch current user info (you might have this in state already)
        const userResponse = await axios.get(`http://localhost:5001/api/users/${response.data.user}`, { withCredentials: true });
        console.log(userResponse.data.username)
        const creatorUsername = userResponse.data.username;
        const userId = userResponse.data._id;
  
        // Fetch all users except the creator
        const usersResponse = await axios.get("http://localhost:5001/api/users");
        const users = usersResponse.data.filter(user => user._id !== userId);
  
        console.log("Users to notify:", users);
  
        // Create notifications
        const notifications = users.map(user => ({
          userId: user._id,
          postId: postId,
          message: `${creatorUsername}'s new post about ${description}`,
          isRead: false,
        }));

        console.log(notifications)
  
        await Promise.all(notifications.map(notification =>
          axios.post("http://localhost:5002/notifications", notification, { withCredentials: true })
        ));
  
        console.log("Notifications sent successfully");
      }
  
      // Hide message and close modal after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg">
          Post created successfully!
        </div>
      )}
      <div className="bg-white p-5 rounded shadow-lg w-11/12 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
      
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-semibold mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter description here..."
              required
            />
          </div>

          <div className="relative">
            <label className="block text-lg font-semibold mb-1">
              Code Snippet
            </label>
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows="5"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter code snippet here..."
              required
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="absolute right-0 top-0 mt-1 mr-2 border border-gray-300 rounded-lg w-32"
            >
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="Cpp">C++</option>
              <option value="Ruby">Ruby</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Submit Post
          </button>
        </form>

        <button
          className="mt-4 text-red-500"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
