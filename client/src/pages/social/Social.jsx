import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaHeart, FaShare, FaComment, FaEye  } from 'react-icons/fa'
import moment from 'moment'

import { likePost, sharePost } from '../../action/socialPost'

const Social = () => {
  const allPosts = useSelector((state) => state.socialPostsReducer?.data)
  // console.log(allPosts)
  const API = import.meta.env.VITE_API;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const baseURL = "http://localhost:5173";
  const user = useSelector((state) => state.currentUserReducer);

  const handleLike = async (id) => {
    if (!user){
      alert("Login to Like a Post")
      return navigate("/login")
    };
    try {
      await dispatch(likePost(id));
    } catch (error) {
      alert(error.message);
    }
  }

  const handleShare = async (post) => {
    const postURL = `${baseURL}${location.pathname}/${post._id}`;
    try {
      await dispatch(sharePost(post._id));
    } catch (err) {
      console.error("Error saving share:", err.message);
    }
    // Use Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${post.name}'s post!`,
          text: post.content,
          url: postURL,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(postURL);
        alert("Post link copied to clipboard!");
      } catch (error) {
        alert(error.message || "Failed to copy link to clipboard");
      }
    }
  };

  return (
    <div className='p-2 flex-auto'>
      <div className='flex justify-between mb-4'>
        <h2 className="text-2xl font-semibold">Public Posts</h2>
        <Link
          to={"/social/new"}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          New Post
        </Link>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-2">
        {allPosts?.map((post, index) => (
          <div key={index} className="border border-gray-300 rounded p-2 flex gap-4 sm:flex-row flex-col justify-between">
            <div className='flex flex-col justify-between gap-4'>
              <div>
                <Link to={`/users/${post.userId}`} className="font-bold text-lg underline">{post.name}</Link>
                <p className="text-gray-700">{post.content}</p>
              </div>
              <div className="text-gray-600">
                <div className='flex space-x-4 items-center flex-wrap'>
                  <Link
                    to={`/social/${post._id}`}
                    className="flex items-center gap-1 text-indigo-500 cursor-pointer text-nowrap"
                  >
                    <FaEye /> View
                  </Link>
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center gap-1 text-red-500 cursor-pointer text-nowrap"
                  >
                    <FaHeart /> {post.likes.length} Likes
                  </button>
                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1 text-blue-500 cursor-pointer text-nowrap"
                  >
                    <FaShare /> {post.sharedBy.length} Shares
                  </button>
                  <Link
                    to={`/social/${post._id}`}
                    className="flex items-center gap-1 text-gray-500 cursor-pointer text-nowrap"
                  >
                    <FaComment /> {post.comments.length} Comments
                  </Link>
                </div>
                <div className='mt-2'>
                  <p className="text-gray-600">
                    {moment(post.postedOn).fromNow()}
                  </p>
                </div>
              </div>
            </div>
            {post.media?.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {post.media.map((m, index) => {
                  const src = `${API}${m.url}`;
                  return m.type === 'image' ? (
                    <img
                      key={index}
                      src={src}
                      alt={`media-${index}`}
                      className="sm:h-32 h-28 object-contain"
                    />
                  ) : (
                    <video
                      key={index}
                      src={src}
                      controls
                      className="sm:h-32 h-28 object-contain"
                    />
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Social