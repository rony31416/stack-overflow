// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Post = () => {
//   const [posts, setPosts] = useState([]);
//   const [content, setContent] = useState('');


//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:5000/api/posts', {
//           headers: { Authorization: token },
//         });
//         setPosts(response.data);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       }
//     };

//     fetchPosts();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         'http://localhost:5000/api/posts',
//         { content },
//         { headers: { Authorization: token } }
//       );
//       setPosts([response.data, ...posts]);
//       setContent('');
//     } catch (error) {
//       console.error('Error creating post:', error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-5">
//       <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
//       <form onSubmit={handleSubmit} className="mb-5">
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Write your post here..."
//           className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring focus:ring-indigo-300"
//           required
//         ></textarea>
//         <button
//           type="submit"
//           className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
//         >
//           Post
//         </button>
//       </form>

//       <h2 className="text-xl font-bold mb-4">Latest Posts</h2>
//       <ul className="space-y-4">
//         {posts.map((post) => (
//           <li key={post._id} className="bg-gray-100 p-4 rounded-md shadow-md">
//             <p className="text-gray-800">{post.content}</p>
//             <small className="text-gray-500">Posted by User {post.user.email}</small>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Post;
