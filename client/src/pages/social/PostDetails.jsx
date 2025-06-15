import React from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaHeart, FaShare, FaTrash, FaComment  } from 'react-icons/fa'
import moment from 'moment'

import { deletePost, likePost, sharePost } from '../../action/socialPost'
import Avatar from '../../components/avatar/Avatar'
import CommentBox from './CommentBox'

const PostDetails = () => {
  const allPosts = useSelector((state) => state.socialPostsReducer?.data)
  const user = useSelector((state) => state.currentUserReducer);
  const { id } = useParams();
  const post = allPosts?.find((post) => post._id === id);

  const API = import.meta.env.VITE_API;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const baseURL = "https://ak-codecrib.netlify.app";

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
    const postURL = `${baseURL}${location.pathname}`;
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

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePost(id))
      navigate("/social")
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <>
      {post && (
        <div className='p-2 flex-auto'>
          <p>{post.content}</p>
          {post.media?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
              {post.media.map((m, index) => {
                const src = `${API}${m.url}`;
                return m.type === 'image' ? (
                  <img
                    key={index}
                    src={src}
                    alt={`media-${index}`}
                    className="sm:h-72 h-52 w-full"
                  />
                ) : (
                  <video
                    key={index}
                    src={src}
                    controls
                    className="sm:h-72 h-52 w-full"
                  />
                );
              })}
            </div>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <button
              onClick={() => handleLike(post._id)}
              className="text-red-500 rounded flex gap-1 items-center cursor-pointer"
            >
              <FaHeart /> {post.likes.length} Likes
            </button>
            <button
              onClick={() => handleShare(post)}
              className="text-blue-500 rounded flex gap-1 items-center cursor-pointer"
            >
              <FaShare /> {post.sharedBy.length} Shares
            </button>
            <button
              className="text-gray-500 rounded flex gap-1 items-center cursor-pointer"
            >
              <FaComment /> {post.comments.length} Comments
            </button>
            {user?.result?._id === post?.userId && (
              <button
                onClick={() => handleDelete(post._id)}
                className="rounded flex gap-1 items-center cursor-pointer"
              >
                <FaTrash /> Delete
              </button>
            )}
          </div>
          <div className="flex items-center justify-end gap-4 mt-2">
            <Link to={`/users/${post.userId}`} className="flex gap-2 items-center text-blue-500">
              <Avatar character={post.name.charAt(0).toUpperCase()} px="px-3" py="py-2" />
              {post.name}
            </Link>
            <p className="text-gray-600">
              Posted {moment(post.postedOn).fromNow()}
            </p>
          </div>
          <CommentBox post={post} name={user?.result?.name} />
        </div>
      )}
    </>
  )
}

export default PostDetails